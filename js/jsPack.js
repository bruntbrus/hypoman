/*
 * Function: jsPack
 * Author:   Tomas Enarsson
 * About:    Pack javascript source code.
 * Depends:  None
 */

// Pack
function jsPack(source) {
  const lines = source.match(/\S.*/g)

  if (!lines) { return '' }

  const pattern = jsPack.packPattern
  const output = []
  let match = true
  let parant = 0
  let skip = null
  let prevItem = null
  let prevType = null
  let line, index, item, type, start

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    line = lines[lineIndex]

    if (skip) {
      index = line.indexOf(skip, pattern.lastIndex)

      if (index < 0) {
        pattern.lastIndex = 0
        continue
      }

      pattern.lastIndex = index + skip.length
      skip = null
    } else {
      pattern.lastIndex = 0
    }

    while ((match = pattern.exec(line)) != null) {
      item = match[0]

      if (item === '//') { break }

      if (item === '/*') {
        // Block comment
        lineIndex--
        skip = '*/'
        break
      }

      type = jsPack.getItemType(item)

      if (type === 'string') {
        // String
        start = pattern.lastIndex
        index = jsPack.findCharacter(line, start, item) + 1

        if (index > 0) {
          item = line.substring(start - 1, index)
          pattern.lastIndex = index
        } else {
          throw new Error('* String not closed *\n' + line)
        }
      } else if (type === 'symbol') {
        // Look for regexp
        if (item === '(') {
          if (parant) { parant++ }
        } else if (item === ')') {
          if (parant) { parant-- }
        } else if (
          item === '/' && (!prevItem || prevType === 'keyword' ||
          (prevType === 'symbol' && prevItem.search(/^[)\]]/)))
        ) {
          type = 'regexp'
          start = pattern.lastIndex
          index = jsPack.findCharacter(line, start, '/') + 1

          if (index > 0) {
            pattern.lastIndex = index
            index = jsPack.findNext(line, index, /\W/g)

            if (index >= 0) {
              item = line.substring(start - 1, index)
              pattern.lastIndex = index
            } else {
              item = line.substring(start - 1)
            }
          } else {
            throw new Error('* Regexp not closed *\n' + line)
          }
        }
      }

      if (prevItem) {
        if (prevType !== 'symbol' && type !== 'symbol') {
          if (prevType === 'keyword' || item === 'in') {
            output.push(' ')
          } else {
            prevItem = ';'
            prevType = 'symbol'
            output.push(prevItem)
          }
        }

        if (prevItem === 'for' && item === '(') {
          parant = 1
        } else if (!parant) {
          if (
            (prevItem === ';') ||
            (prevItem === '{' && item !== '}') ||
            (prevItem === '}' && type !== 'symbol' && item !== 'else' && item !== 'catch') ||
            (item === '}' && prevType !== 'symbol')
          ) {
            output.push('\n')
          }
        }
      }

      output.push(item)
      prevItem = item
      prevType = type
    }
  }

  return output.join('')
}

// Get item type
jsPack.getItemType = function(item) {
  let type

  if (item.search(/^[a-z_$]/i) === 0) {
    // Keyword or identifier
    if (jsPack.keywords.indexOf('|' + item + '|') >= 0) {
      type = 'keyword'
    } else {
      type = 'identifier'
    }
  } else if (!isNaN(item)) {
    // Number
    type = 'number'
  } else if (item === '"' || item === "'") {
    // String
    type = 'string'
  } else {
    // Symbol
    type = 'symbol'
  }

  return type
}

// Find character
jsPack.findCharacter = function(source, start, target) {
  let chr

  for (let index = start; index < source.length; index++) {
    chr = source.charAt(index)

    if (chr === target) { return index }
    if (chr === '\\') { index++ }
  }

  return -1
}

// Find next
jsPack.findNext = function(source, start, target) {
  target.lastIndex = start
  const match = target.exec(source)
  return (match != null ? match.index : -1)
}

// Encode
jsPack.encode = function(source) {
  const pattern = jsPack.itemPattern
  const items = source.match(pattern)

  if (!items) { return '' }

  const dict = []
  const counts = {}
  const codes = {}
  let index, item

  for (index = 0; index < items.length; index++) {
    item = items[index]

    if (counts[item]) {
      counts[item]++
    } else {
      counts[item] = 1
    }
  }

  for (item in counts) dict.push(item)

  dict.sort(function(a, b) { return (counts[b] - counts[a]) })

  for (index = 0; index < dict.length; index++) {
    codes[dict[index]] = jsPack.numberToCode(index)
  }

  const data = source.replace(/[\n'\\]/g, function(symbol) {
    if (symbol === "'") { return "\\'" }
    if (symbol === '\\') { return '\\\\' }
    return ''
  }).replace(pattern, function(item) {
    return codes[item]
  })

  return jsPack.makeUnpackCode(data, dict)
}

// Number to code
jsPack.numberToCode = function(number) {
  const radix = jsPack.codeTable.length
  let code = ''

  do {
    code = jsPack.codeTable.charAt(number % radix) + code
    number = Math.floor(number / radix)
  } while (number > 0)

  return code
}

// Make unpack code
jsPack.makeUnpackCode = function(data, dict) {
  return 'eval(function(e,d,w,i,n){' +
    'return e.replace(/[\\da-z]+/gi,function(c){' +
      'for(i=c.length-1,w=1,n=0;i>=0;i--){' +
        "n+=w*'" + jsPack.codeTable + "'.indexOf(c.charAt(i));" +
        'w*=' + jsPack.codeTable.length + ';' +
      '}' +
      'return d[n];' +
    '});' +
  '}(\n' +
  "'" + data + "',\n" +
  "'" + dict + "'.split(',')" +
  '));'
}

// Patterns
jsPack.packPattern = /\/\/|\/\*|[a-z_$]\w*|\d+(\.\d+)?|\S/gi
jsPack.itemPattern = /[\w$]+/gi

// Code table
jsPack.codeTable = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Keywords
jsPack.keywords =
  '|break|case|catch|const|continue|delete|do|else|export|for|function|if|import' +
  '|in|instanceOf|new|return|switch|this|throw|try|typeof|var|void|while|with|'
