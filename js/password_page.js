/* global common */

window.main = new function() {
  const charMap = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    digit: '0123456789',
    symbol: '_.!?',
  }

  common.addEventListener(document, 'ready', function() {
    const form = document.getElementById('password')

    common.addEventListener(form, 'submit', onFormSubmit)
    common.addEventListener(form.generate, 'click', onGenerateClick)
  })

  function generatePassword(size, upper, digit, symbol) {
    let password = ''
    const map = [charMap.lower]

    if (upper) { map.push(charMap.upper) }
    if (digit) { map.push(charMap.digit) }
    if (symbol) { map.push(charMap.symbol) }

    for (let i = 0, string; i < size; i++) {
      string = map[Math.floor(Math.random() * map.length)]
      password += string.charAt(Math.floor(Math.random() * string.length))
    }

    return password
  }

  function onFormSubmit(event) {
    common.preventDefault(event)
  }

  function onGenerateClick() {
    const form = document.getElementById('password')
    const textArea = document.getElementById('textArea')
    const size = Math.min(parseInt(form.size.value), 20)

    if (isNaN(size)) {
      textArea.value = ''
      return
    }

    let upper = false
    let digit = false
    let symbol = false
    let option

    for (let i = 0; i < form.options.length; i++) {
      option = form.options[i]

      if (option.checked) {
        switch (option.value) {
          case 'upper': upper = true; break
          case 'digit': digit = true; break
          case 'symbol': symbol = true; break
        }
      }
    }

    const list = []

    for (let i = 0; i < 10; i++) {
      list.push(generatePassword(size, upper, digit, symbol))
    }

    textArea.value = list.join('\n')
  }
}()
