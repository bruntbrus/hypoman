(function(Calculator, $) {
  let $form
  let calculator
  // var slideAnim = new Animation();

  $(function() {
    $form = $('#calculator_page form')
    $form.submit(onFormSubmit)
    $form.find('textarea[name=expression]').keydown(onExpressionKeyDown)
    $form.find('input[name=compute]').click(onComputeClick)
    $form.find('input[name=clear]').click(onClearClick)
    $form.find('input[name=erase]').click(onEraseClick)
    $form.find('input[name=help]').click(onHelpClick)

    calculator = new Calculator()
  })

  // Value format
  function valueFormat(value) {
    if (value === undefined) {
      return 'undefined'
    }

    if (value === null) {
      return 'null'
    }

    switch (typeof value) {
      case 'boolean': value = String(value); break
      case 'number': value = String(value); break
      case 'string': value = "'" + value + "'"; break
      case 'function': value = 'function'; break
      case 'object':
        if (value instanceof Array) {
          value = '[' + value + ']'
        } else if (value instanceof RegExp) {
          value = String(value)
        } else {
          value = 'object'
        }
        break
    }

    return value
  }

  // Error format
  function errorFormat(error) {
    return error.message
  }

  function compute() {
    const expression = $form.find('textarea[name=expression]').val()
    let answer

    try {
      answer = calculator.compute(expression)
    } catch (error) {
      $form.find('textarea[name=answer]').val(errorFormat(error))
      return
    }

    $form.find('textarea[name=memory]').val(calculator.getMemoryList(valueFormat).join('\n'))
    $form.find('textarea[name=answer]').val(valueFormat(answer))
  }

  function onFormSubmit(event) {
    compute()
    event.preventDefault()
  }

  function onExpressionKeyDown(event) {
    if (event.shiftKey && event.keyCode === 13) {
      compute()
      event.preventDefault()
    }
  }

  function onComputeClick() {
    compute()
  }

  function onClearClick() {
    $form.find('textarea[name=expression]').val('')
    $form.find('textarea[name=answer]').val('')
  }

  function onEraseClick() {
    calculator.clearMemory()
    $form.find('textarea[name=memory]').val('')
  }

  function onHelpClick() {
    const $help = $('#calculator_page div.help')

    if ($help.css('visibility') === 'hidden') {
      $help.css('visibility', 'visible')
    } else {
      $help.css('visibility', 'hidden')
    }

    /*
    slideAnim.reversed = !slideAnim.reversed

    if (!slideAnim.isRunning()) {
      slideAnim.start(help, 0.4, 30, onSlideAnimUpdate)
    }
    */
  }

  /*
  function onSlideAnimUpdate(target, point) {
    target.style.left = -Math.round(point * target.offsetWidth) + 'px'

    if (!target.style.visibility) { target.style.visibility = 'visible' }

    if (this.endPoint()) {
      if (!this.reversed) { target.style.visibility = '' }
      this.stop()
    }
  }
  */
})(window.Calculator, window.jQuery)
