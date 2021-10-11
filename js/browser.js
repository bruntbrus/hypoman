/*
 * Object:  browser
 * Author:  Tomas Enarsson
 * About:   Stores information about the browser.
 * Depends: None
 */
window.browser = new function() {
  const navigator = window.navigator
  const userAgent = navigator.userAgent
  let index

  if ((index = userAgent.indexOf('MSIE')) >= 0) {
    // Internet Explorer
    this.name = 'Internet Explorer'
    this.vendor = 'Microsoft'
    this.engine = 'Trident'
    this.IE = true
    index += 5
  } else if ((index = userAgent.indexOf('Firefox')) >= 0) {
    // Firefox
    this.name = 'Firefox'
    this.vendor = 'Mozilla'
    this.engine = 'Gecko'
    this.firefox = true
    index += 8
  } else if ((index = userAgent.indexOf('Chrome')) >= 0) {
    // Chrome
    this.name = 'Chrome'
    this.vendor = 'Google'
    this.engine = 'WebKit'
    this.chrome = true
    index += 7
  } else if (userAgent.indexOf('Safari') >= 0) {
    // Safari
    this.name = 'Safari'
    this.vendor = 'Apple'
    this.engine = 'WebKit'
    this.safari = true
    index = userAgent.indexOf('Version') + 8
  } else if (userAgent.indexOf('Opera') >= 0) {
    // Opera
    this.name = 'Opera'
    this.vendor = null
    this.engine = 'Presto'
    this.opera = true
    index = userAgent.indexOf('Version') + 8
  } else if ((index = userAgent.indexOf('Konqueror')) >= 0) {
    // Konqueror
    this.name = 'Konqueror'
    this.vendor = null
    this.engine = 'KHTML'
    this.konqueror = true
    index += 10
  } else if ((index = userAgent.indexOf('Epiphany')) >= 0) {
    // Epiphany
    this.name = 'Epiphany'
    this.vendor = null
    this.engine = 'WebKit'
    this.epiphany = true
    index += 9
  } else if ((index = userAgent.indexOf('Netscape')) >= 0) {
    // Netscape
    this.name = 'Netscape'
    this.vendor = null
    this.engine = 'Gecko'
    this.netscape = true
    index += 9
  } else {
    // Other
    this.name = navigator.appName
    this.vendor = null
    this.engine = null
    this.unknown = true
    index = -1
  }

  if (index >= 0) {
    const matches = userAgent.substring(index).match(/^[\d.]+/)
    this.version = (matches.length ? matches[0] : navigator.appVersion)
  } else {
    this.version = navigator.appVersion
  }

  if (navigator.language) {
    this.language = navigator.language
  } else if (navigator.systemLanguage) {
    this.language = navigator.systemLanguage
  }

  this.platform = navigator.platform
}()
