/*
 * App:     Calc
 * Author:  Tomas Enarsson
 * About:   Text-based calculator with functions and constants.
 * Depends: common.js, MyFrame.js, MyDesktop.js, PopupMenu.js
 */

/* global MyFrame, PopupMenu, common */

// Construct
function Calculator(desktop) {
  const x = (desktop.clientWidth - Calculator.width) / 2
  const y = (desktop.clientHeight - Calculator.height) / 2

  const frame = new MyFrame('Calc', 'Calc', null, x, y, Calculator.width, Calculator.height)

  frame.addMenubar()
  frame.addStatusbar()
  frame.resizeContents()

  const menu = new PopupMenu('Menu')

  menu.addItem('Reset', 'reset', true, 'Clear everything')
  menu.addItem('Help', 'help', true, 'Help text')
  frame.addMenu(menu)

  const form = common.createElement('form', {
    style: 'margin: 4px;',
  })

  form.calc = this

  const width = frame.clientWidth - 24
  let style = 'width: ' + width + 'px; margin: 0px 0px 0px 2px;'

  const exp = common.createElement('input', {
    type: 'text',
    name: 'exp',
    title: 'Expression',
    style: style,
  })

  const answer = common.createElement('input', {
    type: 'text',
    name: 'answer',
    title: 'Answer',
    readonly: 'readonly',
    style: style,
  })

  const vars = common.createElement('textarea', {
    style: style + ' height: 90px; overflow: auto;',
    name: 'vars',
    title: 'Variables',
    readonly: 'readonly',
  })

  style = 'float: right; margin-bottom: 4px; white-space: nowrap;'

  let line = common.createElement('div', {
    style: style,
  })

  line.innerHTML = '&gt;'
  line.appendChild(exp)
  form.appendChild(line)

  line = common.createElement('div', {
    style: style,
  })

  line.innerHTML = '='
  line.appendChild(answer)
  form.appendChild(line)

  line = common.createElement('div', {
    style: style,
  })

  line.appendChild(vars)
  form.appendChild(line)

  common.addEventListener(exp, 'keypress', Calculator.onExpKeyPress)
  common.addEventListener(exp, 'focus', Calculator.onInputFocus)
  common.addEventListener(exp, 'blur', Calculator.onInputBlur)
  common.addEventListener(answer, 'focus', Calculator.onInputFocus)
  common.addEventListener(answer, 'blur', Calculator.onInputBlur)
  common.addEventListener(vars, 'focus', Calculator.onInputFocus)
  common.addEventListener(vars, 'blur', Calculator.onInputBlur)

  this.frame = frame
  this.form = form
  this.vars = {}
  this.answer = 0
  frame.client.style.overflow = 'hidden'
  frame.client.appendChild(form)

  desktop.openFrame(frame, this)
}

// Properties
Calculator.width = 240
Calculator.height = 220
Calculator.path = null

// Patterns
Calculator.pattern = /=|((["']).*?\2)|(\/.+\/\w{0,2})|((\.\s*)?[a-z_]\w*)/gi
Calculator.passPattern = /^["'./]|(ans)|(null)|(true)|(false)/
Calculator.invalidPattern = /[{}]|(toSource)/

// Description
Calculator.description = {
  exp: 'Write an expression',
  answer: 'Calculated answer',
  vars: 'User-defined variables',
}

// Init
Calculator.init = function(name, url) {
  this.path = url.substring(0, url.lastIndexOf('/') + 1)
}

// Run
Calculator.run = function(desktop, args) {
  return (new this(desktop))
}

// Destroy
Calculator.prototype.destroy = function() {
  this.frame = null
  this.form = null
  this.vars = null
}

// Standard
Calculator.standard = {
  pi: Math.PI,
  e: Math.E,
  ln2: Math.LN2,
  ln10: Math.LN10,
  sr2: Math.SQRT2,
  phi: 1.6180339887,
  c: 299792458,
  abs: Math.abs,
  acos: Math.acos,
  asin: Math.asin,
  atan: Math.atan,
  ceil: Math.ceil,
  cos: Math.cos,
  exp: Math.exp,
  floor: Math.floor,
  ln: Math.log,
  max: Math.max,
  min: Math.min,
  pow: Math.pow,
  rnd: Math.random,
  round: Math.round,
  sin: Math.sin,
  sqrt: Math.sqrt,
  tan: Math.tan,
  num: function(value) {
    return Number(value)
  },
  str: function(value) {
    return String(value)
  },
  bool: function(value) {
    return Boolean(value)
  },
  deg: function(angle) {
    return angle * 180 / Math.PI
  },
  rad: function(angle) {
    return angle * Math.PI / 180
  },
  log2: function(num) {
    return Math.log(num) / Math.LN2
  },
  log10: function(num) {
    return Math.log(num) / Math.LN10
  },
  log: function(base, num) {
    return Math.log(num) / Math.log(base)
  },
  mean: function() {
    if (!arguments.length) { return 0 }
    let sum = 0
    for (let i = 0; i < arguments.length; i++) {
      const num = Number(arguments[i])
      if (isNaN(num)) { return NaN }
      sum += num
    }
    return sum / arguments.length
  },
  fac: function(n) {
    if (isNaN(n)) { return NaN }
    if (n < 0) { return undefined }
    if (n < 2) { return 1 }
    if (n > 170) { return Infinity }
    n = Math.floor(n)
    for (let count = n - 1; count > 1; count--) n *= count
    return n
  },
  dist: function(a, b) {
    if (!b) { b = 0 }
    if (!(a instanceof Object)) { return Math.abs(a - b) }
    if (b && a.length !== b.length) { return undefined }
    let sum = 0
    for (const i in a) {
      const dx = (b ? a[i] - b[i] : a[i])
      sum += dx * dx
    }
    return Math.sqrt(sum)
  },
  rndint: function(from, to) {
    if (to === undefined) {
      to = from
      from = 0
    }
    if (from > to) {
      const temp = from
      from = to
      to = temp
    }
    return Math.floor(Math.random() * (to - from + 1) + from)
  },
}

// Reset
Calculator.prototype.reset = function() {
  const form = this.form
  form.exp.value = ''
  form.answer.value = ''
  form.vars.value = ''
  this.vars = {}
  this.answer = 0
}

// Format
Calculator.prototype.format = function(value) {
  if (value == null) { return null }
  switch (typeof value) {
    case 'boolean': break
    case 'number': break
    case 'string': value = "'" + value + "'"; break
    case 'function': value = 'function'; break
    case 'object':
      if (value instanceof Array) {
        value = '[' + value + ']'
      } else if (value instanceof RegExp === false) {
        value = 'object'
      }
      break
  }
  return value
}

// Validate
Calculator.validate = function(exp) {
  if (this.invalidPattern.test(exp)) {
    throw new Error('Invalid expression!')
  }
}

// Compute
Calculator.prototype.compute = function(exp) {
  try {
    Calculator.validate(exp)
    exp = this.transform(exp)
  } catch (error) {
    return error
  }

  let ans = this.answer

  try {
    // eslint-disable-next-line no-eval
    ans = this.format(eval(exp))
  } catch (error) {
    return 'Invalid expression!'
  }

  this.answer = ans
  return ans
}

// Transform
Calculator.prototype.transform = function(exp) {
  let constant = false

  return exp.replace(Calculator.pattern, function(str) {
    let replacement

    if (Calculator.passPattern.test(str)) {
      replacement = str
    } else if (str === '=') {
      if (constant) { throw new Error('Invalid assignment!') }
      replacement = str
    } else if (Calculator.standard[str] != null) {
      replacement = 'standard.' + str
      constant = true
    } else {
      replacement = 'vars.' + str
    }

    return replacement
  })
}

// Get var list
Calculator.prototype.getVarList = function() {
  const vars = this.vars
  let view = ''
  let newline = false

  for (const name in vars) {
    if (newline) {
      view += '\n'
    } else {
      newline = true
    }

    view += name + ' = ' + this.format(vars[name])
  }

  return view
}

// On destroy
Calculator.prototype.onDestroy = function(frame) {
  this.form.calc = null
  this.form = null
  this.vars = null
}

// On focus
Calculator.prototype.onFocus = function(frame) {
  this.form.exp.focus()
}

// On action
Calculator.prototype.onAction = function(frame, action) {
  switch (action) {
    case 'reset': this.reset(); break
    case 'help':
      frame.desktop.runApp('HTMLViewer', null, {
        url: this.constructor.path + 'help.html',
      })
      break
  }
}

// On form focus
Calculator.onInputFocus = function(event) {
  const calc = this.form.calc
  calc.frame.setStatusText(calc.constructor.description[this.name])
}

// On form blur
Calculator.onInputBlur = function(event) {
  this.form.calc.frame.setStatusText(null)
}

// On exp key press
Calculator.onExpKeyPress = function(event) {
  if (common.getKeyCode(event) !== 13) { return }

  const form = this.form

  form.answer.value = form.calc.compute(this.value)
  form.vars.value = form.calc.getVarList()

  common.preventDefault(event)
}
