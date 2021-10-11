/*
 * App:     Edit
 * Author:  Tomas Enarsson
 * About:   Simple text editor for MyDesktop.
 * Depends: common.js, MyFrame.js, MyDesktop.js, PopupMenu.js
 */

/* global MyFrame, PopupMenu, common */

// Construct
function Edit(desktop, width, height) {
  const x = (desktop.clientWidth - width) / 2
  const y = (desktop.clientHeight - height) / 2
  const frame = new MyFrame('Edit', 'Edit', Edit.path + 'icon.png', x, y, width, height)

  frame.addMenubar()
  frame.addStatusbar()
  frame.resizeContents()
  frame.setResizable()

  const menuFile = new PopupMenu('File')

  menuFile.addItem('New', 'FileNew', true, 'Empty text area')
  menuFile.addItem('Open', 'FileOpen', true, 'Open sesame')
  menuFile.addItem('Save', 'FileSave', true, 'Save yourself')
  menuFile.addSeparator()
  menuFile.addItem('Exit', 'FileExit', true, 'Let me out')

  const menuHelp = new PopupMenu('Help')

  menuHelp.addItem('About', 'HelpAbout', true, 'Who cares?')
  frame.addMenu(menuFile)
  frame.addMenu(menuHelp)

  const textArea = common.createElement('textarea', {
    style: 'display: block; overflow: auto; ' +
      'margin: 0px; padding: 2px; border-style: none;',
  })

  frame.client.style.overflow = 'hidden'
  frame.client.appendChild(textArea)
  this.onResize(frame)

  desktop.openFrame(frame, this)
}

// Messages
Edit.messages = {
  FileNew: '',
  FileOpen: 'Do you have a can opener?',
  FileSave: 'Please save me, oh great hero.',
  FileExit: "You can run but you can't hide!",
  HelpAbout: 'Let me tell you the story of my life...',
}

// Init
Edit.init = function(name, url) {
  this.path = url.substring(0, url.lastIndexOf('/') + 1)
}

// Run
Edit.run = function(desktop, args) {
  let width = 480
  let height = 320

  if (args) {
    if (args.width) { width = args.width }
    if (args.height) { height = args.height }
  }

  return (new this(desktop, width, height))
}

// On destroy
Edit.prototype.onDestroy = function(frame) {
  return true
}

// On focus
Edit.prototype.onFocus = function(frame) {
  frame.client.firstChild.focus()
}

// On resize
Edit.prototype.onResize = function(frame) {
  const style = frame.client.firstChild.style

  style.width = (frame.clientWidth - 4) + 'px'
  style.height = (frame.clientHeight - 4) + 'px'
}

// On action
Edit.prototype.onAction = function(frame, action) {
  const area = frame.client.firstChild
  area.value = this.constructor.messages[action]
}
