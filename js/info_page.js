/**
 * Info page script.
 *
 * @author Tomas
 */
(function(browser, $) {
  /*
   * Extend page.
   *
   * Page.prototype.something = function() {};
   */

  /*
   * Document ready.
   */
  $(function() {
    const info = []

    if (browser.vendor) {
      info.push(browser.vendor)
    }

    if (browser.name) {
      info.push(browser.name)
    }

    if (browser.version) {
      info.push(browser.version)
    }

    if (browser.engine) {
      info.push('(' + browser.engine + ')')
    }

    $('#info_page tr.browser_info td').html(info.join(' '))
  })
})(window.browser, window.jQuery)
