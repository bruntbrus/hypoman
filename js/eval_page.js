/**
 * Eval page script.
 *
 * @author Tomas
 */
window.main = new function(common, $) {
  /*
 * Private.
 */
  let $evalPane
  let $textArea
  let $codeArea
  let $answerArea
  let $pagePane
  let $page
  let pageDocument
  let pageWindow
  let pageEval
  let pageError
  let pageScript
  let latestAnswer
  let latestError
  let customData = {}
  let codeHistory = []
  let codePosition = 0
  let tracking = false
  let prevStyle = ''

  // Toolkit and doctypes
  const toolkit = ['code', 'text', 'answer', 'error']
  const doctypes = ['none', 'strict', 'trans', 'frameset', 'xstrict', 'xtrans', 'xframeset', 'xstrict11', 'html5']

  // Constants
  const TOOL_INDEX = toolkit.length
  const PAGE_POLLING = 500
  const AREA_MARGIN = 5
  const AREA_DIFF = 6
  const AREA_MIN_HEIGHT = 16
  const MAX_LENGTH = 80
  const HISTORY_LENGTH = 20
  const GET_TIMEOUT = 30000
  const INDENT = '  '

  /*
   * Document ready.
   */
  $(function() {
    $evalPane = $('#evalPane')
    $textArea = $('#textArea')
    $codeArea = $('#codeArea')
    $answerArea = $('#answerArea')
    $pagePane = $('#pagePane')
    $page = $('#page')
    $textArea.attr('title', 'text')
    $codeArea.attr('title', 'eval (Shift+Enter)')
    $answerArea.attr('title', 'answer')
    $evalPane.click(onEvalPaneClick)
    $evalPane.mousemove(onEvalPaneMouseMove)
    $evalPane.mouseout(onEvalPaneMouseOut)
    $codeArea.keydown(onCodeAreaKeyDown)

    const argList = []
    let tool

    for (let i = 0; i < toolkit.length; i++) {
      tool = toolkit[i]

      if (typeof tool === 'function') {
        tool = getFunctionName(tool)
      }

      argList.push(tool)
    }

    pageScript = 'document.pageEval = function(' + argList.join(',') + ') { ' +
      'try { return eval(code); } catch (error) { return error; } ' +
      '}; ' +
      'document.pageError = function(message) { throw new Error(message); };'

    onResize()
    $(window).resize(onResize)
    pageSetup()
  })

  // On resize
  function onResize() {
    const height = $evalPane.height() - AREA_MARGIN
    const diff = AREA_MARGIN + AREA_DIFF
    const topHeight = Math.round(height / 2)
    const minHeight = AREA_MIN_HEIGHT + diff
    let textHeight
    let codeHeight
    let answerHeight

    if (!$textArea.css('display')) {
      textHeight = Math.round(topHeight / 2)

      if (textHeight < minHeight) {
        textHeight = minHeight
      }
    } else {
      textHeight = 0
    }

    codeHeight = topHeight - textHeight

    if (codeHeight < minHeight) {
      codeHeight = minHeight
    }

    answerHeight = height - topHeight

    if (answerHeight < minHeight) {
      answerHeight = minHeight
    }
    if (textHeight) {
      $textArea.height(textHeight - diff)
    }

    $codeArea.height(codeHeight - diff)
    $answerArea.height(answerHeight - diff)
  }

  // On eval pane click
  function onEvalPaneClick(event) {
    if (event.target !== this) {
      return
    }

    const $this = $(this)

    switch ($this.css('cursor')) {
      case 'w-resize':
        $evalPane.setClass($evalPane.getClass() ? '' : 'collapsed')
        $pagePane.css('left', $evalPane.width() + 'px')
        break
      case 'e-resize':
        $evalPane.setClass($evalPane.getClass() ? '' : 'expanded')
        $pagePane.css('left', $evalPane.width() + 'px')
        break
      case 'n-resize':
        $textArea.css('display', $textArea.css('display') ? '' : 'none')
        onResize()
        break
    }
  }

  // On eval pane mouse move
  function onEvalPaneMouseMove(event) {
    if (event.target !== this) {
      return
    }

    const $this = $(this)
    const x = event.clientX
    const y = event.clientY

    if (x < AREA_MARGIN) {
      $this.css('cursor', 'w-resize')
      $this.attr('title', ($evalPane.getClass() ? 'Restore' : 'Collapse'))
    } else if (x > $this.width() - AREA_MARGIN) {
      $this.css('cursor', 'e-resize')
      $this.attr('title', ($evalPane.getClass() ? 'Restore' : 'Expand'))
    } else if (y < AREA_MARGIN) {
      $this.css('cursor', 'n-resize')
      $this.attr('title', ($textArea.css('display') ? 'Show' : 'Hide') + ' text')
    } else {
      $this.css('cursor', '')
      $this.attr('title', '')
    }
  }

  // On eval pane mouse out
  function onEvalPaneMouseOut(event) {
    if (event.target !== this) {
      return
    }

    const $this = $(this)
    $this.css('cursor', '')
    $this.attr('title', '')
  }

  // On code area key down
  function onCodeAreaKeyDown(event) {
    const key = event.keyCode

    if (event.shiftKey && key === 13) {
      runEval()
      event.preventDefault()
    } else if (event.ctrlKey && key === 38) {
      historyForward()
      event.preventDefault()
    } else if (event.ctrlKey && key === 40) {
      historyBack()
      event.preventDefault()
    }
  }

  // On page mouse over
  function onPageMouseOver(event) {
    const $target = $(event.target)
    prevStyle = $target.css('outline')
    $target.css('outline', '1px solid red')
  }

  // On page mouse out
  function onPageMouseOut(event) {
    const $target = $(event.target)
    $target.css('outline', prevStyle)
  }

  // On page click
  function onPageClick(event) {
    setAnswer(event.target)
  }

  // Page setup
  function pageSetup(onReady) {
    $codeArea.attr('disabled', true)
    $answerArea.value('Page setup...')

    const page = $page.get(0)
    let $pageHead
    let script

    try {
      pageDocument = (page.contentDocument ? page.contentDocument : page.object)
      $pageHead = $(pageDocument).find('head')
      $pageHead.append('<script type="text/javascript">' + pageScript + '</script>')
    } catch (error) {
      setError(error)
      return
    }

    let interval = setInterval(function() {
      if (!pageDocument.pageEval || !pageDocument.pageError) {
        return
      }

      clearInterval(interval)
      interval = false

      pageEval = pageDocument.pageEval
      pageError = pageDocument.pageError
      pageWindow = pageEval('window')
      pageDocument.pageEval = null
      pageDocument.pageError = null

      $pageHead.remove(script)
      $answerArea.value($answerArea.attr('defaultValue'))
      $codeArea.attr('disabled', false)
      $codeArea.focus()

      if (onReady) {
        onReady()
      }
    }, PAGE_POLLING)
  }

  // Run eval
  function runEval() {
    $textArea.attr('readonly', true)
    $codeArea.attr('readonly', true)

    toolkit[0] = $codeArea.value()
    toolkit[1] = $textArea.value()
    toolkit[2] = latestAnswer
    toolkit[3] = latestError

    let result

    try {
      result = pageEval.apply(customData, toolkit)
    } catch (error) {
      pageSetup(runEval)
      return
    }

    if (result != null && result instanceof pageWindow.Error) {
      setError(result)
    } else {
      setAnswer(result)
    }

    historyRecord()

    $textArea.attr('readonly', false)
    $codeArea.attr('readonly', false)
  }

  // Set answer
  function setAnswer(answer) {
    latestAnswer = answer
    $answerArea.value(answer === null ? 'null' : String(answer))
  }

  // Set error
  function setError(error) {
    latestError = error
    $answerArea.value('Error: ' + error.message)
  }

  // History record
  function historyRecord() {
    if (codeHistory.length === HISTORY_LENGTH) {
      codeHistory.shift()
    }

    codeHistory.push($codeArea.value())
    codePosition = codeHistory.length
  }

  // History back
  function historyBack() {
    if (codePosition <= 0) {
      return
    }

    let prev = codeHistory[codePosition - 1]

    if ($codeArea.value() === prev && codePosition > 1) {
      prev = codeHistory[--codePosition - 1]
    }

    $codeArea.value(prev)
  }

  // History forward
  function historyForward() {
    if (codePosition > codeHistory.length) {
      return
    }

    let next = codeHistory[codePosition - 1]

    if ($codeArea.value() === next && codePosition < codeHistory.length) {
      next = codeHistory[++codePosition - 1]
    }

    $codeArea.value(next)
  }

  // Get object type
  function getObjectType(object) {
    const matches = String(object).match(/\w+(?=\])/)

    if (matches && matches.length) {
      return matches[0]
    }

    return null
  }

  // Get function name
  function getFunctionName(func) {
    const matches = String(func).match(/\w+(?=\()/)

    if (matches && matches.length) {
      return matches[0]
    }

    return '(anonymous)'
  }

  // Get function params
  /*
  function getFunctionParams(func) {
    const matches = String(func).match(/\((.*)\)/)

    if (matches && matches.length > 1) {
      return matches[1].split(',')
    }

    return []
  }
  */

  // Case insensitive
  function caseInsensitive(a, b) {
    a = a.toLowerCase()
    b = b.toLowerCase()

    if (a.localeCompare) {
      return a.localeCompare(b)
    }

    return (a - b)
  }

  // Make tag
  function makeTag(element, filter) {
    const list = []
    let attributes = element.attributes
    let attribute
    let name
    let value

    for (let index = 0; index < attributes.length; index++) {
      attribute = attributes[index]
      name = attribute.name
      value = attribute.value

      if (filter && name.search(filter) < 0) {
        continue
      }

      if (value != null && value !== '' && value !== 'null') {
        list.push(name + '=' + quote(value))
      }
    }

    attributes = (list.length ? ' ' + list.join(' ') : '')

    return ('<' + element.tagName + attributes + '>')
  }

  // Get non-empty node
  function getNonEmptyNode(node, first) {
    if (!first) {
      node = node.nextSibling
    }

    for (; node; node = node.nextSibling) {
      if (node.childNodes.length > 0) {
        break
      }
    }

    return node
  }

  // Quote
  function quote(value) {
    value = value.replace(/\n/g, '\\n').replace(/\r/g, '')
    value = value.replace(/\t/g, '\\t').replace(/"/g, '\\"')

    return ('"' + value + '"')
  }

  // Add tool
  function addTool(name, value, params, info, tool) {
    if (value == null) {
      value = 'void'
    }

    params = (params != null ? params.split(',') : [])

    const caller = function() {
      try {
        return tool.apply(name, arguments)
      } catch (error) {
        pageError(error.message)
      }
    }

    caller.toString = function() {
      return (value + ' ' + name + '(' + params + ')\n' + INDENT + info)
    }

    toolkit.push(caller)
  }

  // Tool: help
  addTool('help', 'String', null, 'Help content.',
    function() {
      const help = [
        'keys\n' +
        INDENT + 'eval: Shift+Enter\n' +
        INDENT + 'prev: Ctrl+Down\n' +
        INDENT + 'next: Ctrl+Up',
        'this\n' + INDENT + 'Custom data.',
        'text\n' + INDENT + 'String from text box.',
        'answer\n' + INDENT + 'Latest evaluation result.',
        'error\n' + INDENT + 'Latest error.',
      ]

      for (let index = TOOL_INDEX; index < toolkit.length; index++) {
        help.push(toolkit[index].toString())
      }

      return help.join('\n\n')
    })

  // Tool: doctype
  addTool('doctype', 'String', '[String name]', 'Change or get doctype.',
    function(name) {
      if (name == null) {
        const doctype = pageDocument.doctype
        return (doctype ? doctype.publicId : 'Unknown')
      }

      for (let index = 0; index < doctypes.length; index++) {
        if (name === doctypes[index]) {
          pageWindow.location.href = 'page.php?type=' + name
          return ('Doctype: ' + name)
        }
      }

      return ('Available: ' + doctypes.join(', '))
    })

  // Tool: param
  addTool('param', 'String', '[String name]', 'Get parameter value from URL.',
    function(name) {
      const params = common.getParams(pageWindow)
      return (name == null ? params : params[name])
    })

  // Tool: clear
  addTool('clear', 'String', null, 'Clear everything.',
    function() {
      customData = {}
      codeHistory = []
      codePosition = 0
      $textArea.value('')
      $codeArea.value('')

      return ''
    })

  // Tool: elemid
  addTool('elemid', 'Element', 'String id', 'Get element by id.',
    function(id) {
      return $(pageDocument).find('#' + id)
    })

  // Tool: elemname
  addTool('elemname', 'Elements', 'String name,[Element root]', 'Get elements by name.',
    function(name, root) {
      if (root == null) {
        root = pageDocument
      }

      return $(root).find('[name=' + name + ']')
    })

  // Tool: elemtag
  addTool('elemtag', 'Elements', 'String name,[Element root]', 'Get elements by tag name.',
    function(name, root) {
      if (root == null) {
        root = pageDocument
      }

      return $(root).find(name)
    })

  // Tool: elemclass
  addTool('elemclass', 'Elements', 'String className,[Element root]', 'Get elements by class name.',
    function(className, root) {
      if (root == null) {
        root = pageDocument
      }

      return $(root).find('.' + className)
    })

  // Tool: inspect
  addTool('inspect', 'String', "[Object object],[String|RegExp filter],['own'|'inherited']", 'Inspect object.',
    function(object, filter, origin) {
      if (!object) {
        object = pageWindow
      }

      let type = typeof object
      let list = []
      const ownFuncs = []
      const ownProps = []
      const inheritedFuncs = []
      const inheritedProps = []
      let value
      let name
      let property
      let ownProperty
      let item
      let length
      let more

      if (type === 'object') {
        if (object instanceof pageWindow.Array) {
          type = 'array'
          value = String(object)
        } else if (object instanceof pageWindow.Error) {
          type = 'error'
          value = object.name
        } else {
          value = getObjectType(object)
        }
      } else if (type === 'function') {
        value = getFunctionName(object)
      } else {
        value = String(object)
      }

      list.push(type + ': ' + value)

      for (name in object) {
        property = object[name]
        type = typeof property

        try {
          value = String(property)
        } catch (error) {
          continue
        }

        if (filter && type.search(filter) < 0) {
          continue
        }

        ownProperty = hasOwnProperty(object, name)

        if (ownProperty) {
          if (origin === 'inherited') {
            continue
          }
        } else {
          if (origin === 'own') {
            continue
          }
        }

        if (type === 'function') {
          length = property.length
          item = '  ' + name + '(' + (length || '') + ')'

          if (ownProperty) {
            ownFuncs.push(item)
          } else {
            inheritedFuncs.push(item)
          }

          continue
        }

        if (type === 'object') {
          if (property && property instanceof pageWindow.Array === false) {
            value = getObjectType(property)
          }
        } else if (type === 'string') {
          more = false

          if (value.length > MAX_LENGTH) {
            value = value.substring(0, MAX_LENGTH)
            more = true
          }

          value = quote(value)

          if (more) {
            value += ' +'
          }
        }

        if (!isNaN(name)) {
          name = '[' + name + ']'
        }

        item = '  ' + name + ' = ' + value

        if (ownProperty) {
          ownProps.push(item)
        } else {
          inheritedProps.push(item)
        }
      }

      if (ownFuncs.length) {
        ownFuncs.sort(caseInsensitive)

        list = list.concat(
          ['', 'Functions:', '----------'], ownFuncs,
        )
      }

      if (ownProps.length) {
        ownProps.sort(caseInsensitive)

        list = list.concat(
          ['', 'Properties:', '-----------'], ownProps,
        )
      }

      if (inheritedFuncs.length) {
        inheritedFuncs.sort(caseInsensitive)

        list = list.concat(
          ['', 'Inherited functions:', '--------------------'], inheritedFuncs,
        )
      }

      if (inheritedProps.length) {
        inheritedProps.sort(caseInsensitive)

        list = list.concat(
          ['', 'Inherited properties:', '---------------------'], inheritedProps,
        )
      }

      return list.join('\n')
    })

  // Tool: create
  addTool('create', 'Element', 'String tagName,[Object attributes],[String html]', 'Create new element.',
    function(tagName, attributes, html) {
      let tag = '<' + tagName
      let name
      let element

      for (name in attributes) {
        tag += ' ' + name + "='" + attributes[name] + "'"
      }

      tag += '>'

      try {
        element = pageDocument.createElement(tag)
      } catch (error) {
        element = pageDocument.createElement(tagName)

        for (name in attributes) {
          element.setAttribute(name, attributes[name])
        }
      }

      if (html != null) {
        element.innerHTML = html
      }

      return element
    })

  // Tool: textnode
  addTool('textnode', 'Node', '[String text]', 'Create new text node.',
    function(text) {
      return pageDocument.createTextNode(text != null ? text : '')
    })

  // Tool: comment
  addTool('comment', 'Node', '[String text]', 'Create new comment node',
    function(text) {
      return pageDocument.createComment(text != null ? text : '')
    })

  // Tool: table
  addTool('table', 'Element', '[String caption],[Array head],[Array foot],[Array body]', 'Create new table element.',
    function(caption, head, foot, body) {
      const table = pageDocument.createElement('table')
      let row
      let record
      let rowIndex
      let columnIndex

      if (caption != null) {
        table.createCaption().innerHTML = caption
      }

      if (body) {
        for (rowIndex = 0; rowIndex < body.length; rowIndex++) {
          record = body[rowIndex]
          row = table.insertRow(rowIndex)

          for (columnIndex = 0; columnIndex < record.length; columnIndex++) {
            row.insertCell(columnIndex).innerHTML = record[columnIndex]
          }
        }
      }

      if (head) {
        row = table.createTHead().insertRow(0)

        for (columnIndex = 0; columnIndex < head.length; columnIndex++) {
          row.insertCell(columnIndex).innerHTML = head[columnIndex]
        }
      }

      if (foot) {
        row = table.createTFoot().insertRow(0)

        for (columnIndex = 0; columnIndex < foot.length; columnIndex++) {
          row.insertCell(columnIndex).innerHTML = foot[columnIndex]
        }
      }

      return table
    })

  // Tool: image
  addTool('image', 'Element', 'String url,[String width],[String height]', 'Create new image element.',
    function(url, width, height) {
      const image = pageDocument.createElement('img')

      if (width !== null) {
        image.width = width
      }

      if (height !== null) {
        image.height = height
      }

      image.src = url
      return image
    })

  // Tool: attr
  addTool('attr', 'String', '[Element element],[String|RegExp filter]', 'Element attributes.',
    function(element, filter) {
      if (!element) {
        element = pageDocument.body
      }

      const list = []
      const attributes = element.attributes
      let attribute
      let name
      let value

      for (let index = 0; index < attributes.length; index++) {
        attribute = attributes[index]
        name = attribute.name
        value = attribute.value

        if (filter && name.search(filter) < 0) {
          continue
        }

        if (value === null) {
          value = 'null'
        } else if (typeof value === 'string' && value !== 'null') {
          value = quote(value)
        }

        list.push(name + ' = ' + value)
      }

      return list.sort(caseInsensitive).join('\n')
    })

  // Tool: children
  addTool('children', 'String', '[Element element],[Boolean all]', 'Element children.',
    function(element, all) {
      if (!element) {
        element = pageDocument.body
      }

      const list = []
      let child

      for (child = element.firstChild; child; child = child.nextSibling) {
        if (child.nodeType === 1) {
          list.push(makeTag(child))
        } else if (all) {
          list.push(child.nodeName + ' ' + quote(child.nodeValue))
        }
      }

      return list.join('\n')
    })

  // Tool: tree
  addTool('tree', 'String', '[Element element],[Number depth],[Boolean all]', 'Scan node tree.',
    function(element, depth, all) {
      if (!element) {
        element = pageDocument.documentElement
      }

      return (function(element, level) {
        const tree = []
        let branch
        let indent
        let child
        let subtree
        let index
        let value
        let more

        if (level === 0) {
          tree.push(makeTag(element))
        }

        if (depth != null && level >= depth) {
          return tree
        }

        branch = String.fromCharCode(0x251C, 0x2500) + ' '
        indent = String.fromCharCode(0x2502) + '  '

        for (child = element.firstChild; child; child = child.nextSibling) {
          if (!all) {
            child = getNonEmptyNode(child, true)
            if (!child) { break }
          }

          if (child === element.lastChild || (!all && !getNonEmptyNode(child, false))) {
            branch = String.fromCharCode(0x2514, 0x2500) + ' '
            indent = '   '
          }

          if (child.nodeType === 1) {
            tree.push(branch + makeTag(child))
            // eslint-disable-next-line no-caller
            subtree = arguments.callee(child, level + 1)

            for (index = 0; index < subtree.length; index++) {
              tree.push(indent + subtree[index])
            }
          } else if (all || child.childNodes.length > 0) {
            value = child.nodeValue
            more = false

            if (value.length > MAX_LENGTH) {
              value = value.substring(0, MAX_LENGTH)
              more = true
            }

            value = quote(value)
            value = branch + child.nodeName + ' ' + value

            if (more) {
              value += ' +'
            }

            tree.push(value)
          }
        }

        return tree
      })(element, 0).join('\n')
    })

  // Tool: compact
  addTool('compact', 'String', '[Element element],[Boolean recursive]', 'Remove redundant nodes.',
    function(element, recursive) {
      if (!element) {
        element = pageDocument.documentElement
      }

      const removed = common.compactElement(element, recursive)
      return (removed ? 'Redundant nodes removed: ' + removed : 'No nodes removed')
    })

  // Tool: tracking
  addTool('tracking', 'String', '[Boolean enable]', 'Element tracking on/off.',
    function(enable) {
      if (enable || enable == null) {
        if (!tracking) {
          $(pageDocument).mouseover(onPageMouseOver)
          $(pageDocument).mouseout(onPageMouseOut)
          $(pageDocument).click(onPageClick)
          tracking = true
        }

        return 'Tracking enabled'
      }
      if (tracking) {
        common.removeEventListener(pageDocument, 'mouseover', onPageMouseOver)
        common.removeEventListener(pageDocument, 'mouseout', onPageMouseOut)
        common.removeEventListener(pageDocument, 'click', onPageClick)
        tracking = false
      }
      return 'Tracking disabled'
    })

  // Tool: CSS
  addTool('css', 'stylesheet', '[string text]', 'Add new stylesheet.',
    function(text) {
      const style = pageDocument.createElement('style')
      style.type = 'text/css'
      if (text == null) {
        text = ''
      }
      if (style.styleSheet) {
        style.styleSheet.cssText = text
      } else {
        style.appendChild(pageDocument.createTextNode(text))
      }
      pageDocument.getElementsByTagName('head')[0].appendChild(style)
      const styleSheets = pageDocument.styleSheets
      return styleSheets[styleSheets.length - 1]
    })

  // Tool: load
  addTool('load', 'element|stylesheet', 'string url', 'Load script or stylesheet.',
    function(url) {
      const pageHead = pageDocument.getElementsByTagName('head')[0]
      const href = pageWindow.location.href
      const base = href.substring(0, href.lastIndexOf('/') + 1)
      let object
      let index
      let script
      let scripts
      let link
      let links

      url = url.replace(base, '')

      switch (url.substring(url.lastIndexOf('.') + 1)) {
        case 'js':
          scripts = pageHead.getElementsByTagName('script')

          for (index = 0; index < scripts.length; index++) {
            script = scripts[index]

            if (script.src.replace(base, '') === url) {
              return script
            }
          }

          script = pageDocument.createElement('script')
          script.type = 'text/javascript'
          script.src = url

          pageHead.appendChild(script)
          object = script

          break
        case 'css':
          links = pageHead.getElementsByTagName('link')

          for (index = 0; index < links.length; index++) {
            link = links[index]

            if (link.href.replace(base, '') === url) {
              return link
            }
          }

          link = pageDocument.createElement('link')
          link.rel = 'stylesheet'
          link.type = 'text/css'
          link.href = url

          pageHead.appendChild(link)
          object = pageDocument.styleSheets[pageDocument.styleSheets.length - 1]

          break
        default: object = null
      }

      return object
    })

  // Tool: get
  addTool('get', 'XMLHttpRequest', 'string url,function onReady', 'Asynchronous GET request.',
    function(url, onReady) {
      let request

      if (pageWindow.XMLHttpRequest) {
        request = new pageWindow.XMLHttpRequest()
      } else {
        request = new pageWindow.ActiveXObject('Microsoft.XMLHTTP')
      }

      request.open('GET', url, true)

      const requestTimeout = setTimeout(function() {
        request.abort()
        onReady.call(request)
      }, GET_TIMEOUT)

      request.onreadystatechange = function() {
        if (request.readyState !== 4) {
          return
        }

        clearTimeout(requestTimeout)
        onReady.call(request)
      }

      request.send()
      return request
    })
}(window.common, window.jQuery)
