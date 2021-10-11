/**
 * Calculator class.
 *
 * @author Tomas
 */
function Calculator() {
  this.memory = {}
}

/*
 * Patterns.
 */
Calculator.pattern = /=+|(\.\s*)?[a-z_]\w*|".*?"|'.*?'|\/.+\/\w*/gi
Calculator.passPattern = /^undefined|null|true|false|NaN|Infinity|["'./].*$/
Calculator.invalidPattern = /toSource|[{}]/

/*
 * Library.
 */
Calculator.library = {
  // Constants
  e: Math.E,
  pi: Math.PI,
  ln2: Math.LN2,
  ln10: Math.LN10,
  sr2: Math.SQRT2,
  sr3: Math.sqrt(3),
  c: 299792458,
  g: 9.80665,
  phi: 1.6180339887,
  // Absolute
  abs: function(x) {
    if (typeof x === 'number') { return Math.abs(x) }

    return Math.sqrt(Calculator.library.abs2(x))
  },
  abs2: function(x) {
    let value

    if (typeof x === 'number') {
      value = Math.abs(x)
      return (value * value)
    }

    let sum = 0

    for (let i = 0; i < x.length; i++) {
      value = x[i]
      sum += value * value
    }

    return sum
  },
  // Arc cosine
  acos: function(x) {
    return Math.acos(x)
  },
  // Arc sine
  asin: function(x) {
    return Math.asin(x)
  },
  // Arc tangent
  atan: function(x) {
    return Math.atan(x)
  },
  // Ceiling
  ceil: function(x) {
    return Math.ceil(x)
  },
  // Value to boolean
  bool: function(value) {
    return Boolean(value)
  },
  // Cosine
  cos: function(a) {
    return Math.cos(a)
  },
  cos2: function(a) {
    const value = Math.cos(a)
    return (value * value)
  },
  cross: function(u, v) {
    return (u[0] * v[1] + u[1] * v[2] + u[2] * v[0] - u[0] * v[2] - u[1] * v[0] - u[2] * v[1])
  },
  // Radians to degrees
  deg: function(angle) {
    return (angle * 180 / Math.PI)
  },
  dot: function(u, v) {
    let sum = 0

    for (let i = 0; i < u.length; i++) {
      sum += u[i] * v[i]
    }

    return sum
  },
  // Exponential
  exp: function(x) {
    return Math.exp(x)
  },
  // Factorial
  fac: function(n) {
    if (isNaN(n)) { return NaN }
    if (n < 0) { return undefined }
    if (n < 2) { return 1 }
    if (n > 170) { return Infinity }

    n = Math.floor(n)

    for (let count = n - 1; count > 1; count--) { n *= count }

    return n
  },
  // Floor
  floor: function(x) {
    return Math.floor(x)
  },
  // Natural logarithm
  ln: function(x) {
    return Math.log(x)
  },
  // Custom base logarithm
  log: function(base, num) {
    return (Math.log(num) / Math.log(base))
  },
  // 2-logarithm
  log2: function(num) {
    return (Math.log(num) / Math.LN2)
  },
  // 10-logarithm
  log10: function(num) {
    return (Math.log(num) / Math.LN10)
  },
  // Maximum
  max: function() {
    return Math.max.apply(Math, arguments)
  },
  // Mean value
  mean: function() {
    if (!arguments.length) { return 0 }

    let sum = 0

    for (let i = 0; i < arguments.length; i++) {
      const num = Number(arguments[i])

      if (isNaN(num)) { return NaN }

      sum += num
    }

    return (sum / arguments.length)
  },
  // Minimum
  min: function() {
    return Math.min.apply(Math, arguments)
  },
  // Value to number
  num: function(value) {
    return Number(value)
  },
  // Power
  pow: function(x, y) {
    Math.pow(x, y)
  },
  // Cubic root
  qbrt: function(num) {
    return Math.pow(num, 1 / 3)
  },
  // Degrees to radians
  rad: function(angle) {
    return (angle * Math.PI / 180)
  },
  // Random
  rnd: function() {
    return Math.random()
  },
  // Random integer
  rndint: function(from, to) {
    if (to == null) {
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
  // Round
  round: function(x, dec) {
    if (!dec) { return Math.round(x) }

    const factor = Math.pow(10, dec)
    x = Math.round(factor * x) / factor

    return x
  },
  // Sine
  sin: function(a) {
    return Math.sin(a)
  },
  sin2: function(a) {
    const value = Math.sin(a)
    return (value * value)
  },
  // Square root
  sqrt: function(x) {
    return Math.sqrt(x)
  },
  // Value to string
  str: function(value) {
    return String(value)
  },
  // Tangent
  tan: function(a) {
    return Math.tan(a)
  },
}

// Validate
Calculator.validate = function(exp) {
  if (Calculator.invalidPattern.test(exp)) {
    throw new Error('invalid expression')
  }
}

// Transform
Calculator.transform = function(exp) {
  let constant = false

  return exp.replace(Calculator.pattern, function(match) {
    if (match.charAt(0) === '=') {
      if (match.length === 1 && constant) {
        throw new Error('invalid assignment')
      }

      return match
    }

    if (Calculator.passPattern.test(match)) {
      constant = true
      return match
    }

    if (match in Calculator.library) {
      constant = true
      return ('l.' + match)
    }

    constant = false
    return ('m.' + match)
  })
}

// Compute
Calculator.prototype.compute = function(exp) {
  Calculator.validate(exp)
  exp = Calculator.transform(exp)

  const m = this.memory

  // eslint-disable-next-line no-eval
  m.answer = eval(exp)

  return m.answer
}

// Get memory list
Calculator.prototype.getMemoryList = function(format) {
  if (!format) {
    format = function(value) { return String(value) }
  }

  const memory = this.memory
  const list = []

  for (const name in memory) {
    if (name !== 'answer') {
      list.push(name + ' = ' + format(memory[name]))
    }
  }

  return list
}

// Clear memory
Calculator.prototype.clearMemory = function() {
  this.memory = {}
}
