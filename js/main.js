/**
 * Main script.
 *
 * @author Tomas
 */
(function($) {
  /*
   * Document ready.
   */
  $(function() {
    const $logo = $('#page_header img.logo')

    $logo.mouseover(function() {
      $(this).fadeTo(200, 0.5)
    })

    $logo.mouseout(function() {
      $(this).fadeTo(200, 1)
    })

    $('input[type=button], input[type=submit], input[type=reset], button').each(function() {
      const $this = $(this)

      $this.addClass('up')
      $this.mousedown(onButtonMouseDown)
      $this.mouseup(onButtonMouseUp)
      $this.mouseout(onButtonMouseOut)
    })
  })

  /**
   * On button mouse down.
   *
   * @param event Event
   */
  function onButtonMouseDown(event) {
    const $this = $(this)

    if (event.which === 1 && !this.disabled) {
      $this.removeClass('up')
      $this.addClass('down')
    }
  }

  /**
   * On button mouse up.
   */
  function onButtonMouseUp() {
    const $this = $(this)

    $this.removeClass('down')
    $this.addClass('up')
  }

  /**
   * On button mouse out.
   */
  function onButtonMouseOut() {
    const $this = $(this)

    $this.removeClass('down')
    $this.addClass('up')
  }
})(window.jQuery)
