(function($) {
  let $form

  $(function() {
    $form = $('#editor_page form')
    $form.submit(onFormSubmit)
    $form.find('input[name=newButton]').click(onNewClick)
    $form.find('select[name=fontSelect]').change(onFontChange)
    $form.find('select[name=sizeSelect]').change(onSizeChange)
    $form.find('select[name=colorSelect]').change(onColorChange)

    const $textArea = $form.find('textarea')
    $textArea.keydown(onTextAreaKeyDown)
    $textArea.keyup(onTextAreaKeyUp)
    $textArea.keypress(onTextAreaKeyPress)
    $textArea.mousedown(onTextAreaMouseDown)

    updateStatus()
  })

  function setStatus(index, text) {
    const $statusbar = $('#editor_page .statusbar')
    const span = $statusbar.find('span').get(index)

    span.firstChild.nodeValue = text
  }

  function updateStatus() {
    const textArea = $form.find('textarea').get(0)

    if (textArea.selectionEnd != null) {
      const position = textArea.selectionEnd + 1
      setStatus(0, 'Position ' + position)
    }

    setStatus(1, textArea.value.length + ' tecken')
  }

  function onFormSubmit(event) {
    event.preventDefault()
  }

  function onNewClick() {
    const $textArea = $form.find('textarea')

    $textArea.val('')
    $textArea.focus()

    updateStatus()
  }

  function onFontChange() {
    const font = $(this).val()
    $form.find('textarea').css('font-family', font)
  }

  function onSizeChange() {
    const size = $(this).val()
    $form.find('textarea').css('font-size', size)
  }

  function onColorChange() {
    const color = $(this).val()
    $form.find('textarea').css('color', color)
  }

  function onTextAreaKeyDown(event) {}

  function onTextAreaKeyUp(event) {}

  function onTextAreaKeyPress(event) {
    setTimeout(updateStatus, 10)
  }

  function onTextAreaMouseDown() {
    setTimeout(updateStatus, 10)
  }
})(window.jQuery)
