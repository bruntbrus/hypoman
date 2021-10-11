/*
 * App:     Settings
 * Author:  Tomas Enarsson
 * About:   Settings for MyDesktop.
 * Depends: common.js, MyFrame.js, MyDesktop.js
 */

/* global MyFrame, common */

// Construct
function Settings(desktop, width, height) {
  const x = (desktop.clientWidth - width) / 2
  const y = (desktop.clientHeight - height) / 2
  const frame = new MyFrame('Settings', 'Settings', null, x, y, width, height)

  this.frame = frame

  const form = common.createElement('form')

  form.style.margin = '1em'
  form.innerHTML = "<input type='button' value='Setting 1'/>" +
    "<input type='button' value='Setting 2'/>" +
    "<input type='button' value='Setting 3'/>"
  frame.client.appendChild(form)

  desktop.openFrame(frame, this)
}

// Run
Settings.run = function(desktop, args) {
  const settings = desktop.getRunners(this)

  if (settings && settings.length > 0) {
    desktop.frameToFront(settings[0].frame)
    return settings[0]
  }

  let width = 320
  let height = 160

  if (args) {
    if (args.width) { width = args.width }
    if (args.height) { height = args.height }
  }

  return (new this(desktop, width, height))
}

// On destroy
Settings.prototype.onDestroy = function() {
  return false
}
