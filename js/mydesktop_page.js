/*
 * Object:  main
 * Author:  Tomas Enarsson
 * About:   Main application for MyDesktop.
 * Depends: index.html, common.js, MyDesktop.js, MyFrame.js, PopupMenu.js
 */

/* global MyDesktop, MyFrame, PopupMenu, common */

window.main = new function() {
  /*
  window.onload = function() {
    main.init(document.getElementById('main-content'))
  }
  */

  // Properties
  this.desktop = null

  // Init
  this.init = function(parent) {
    common.compactElement(document.documentElement, true)

    const controls = document.getElementById('controls')
    const time = 0.2
    const fps = 25

    controls.transTime.value = time
    controls.transFPS.value = fps

    common.addEventListener(controls, 'click', this.onControlsClick)

    const width = 960
    const height = 640
    const desktop = new MyDesktop('main', width, height, time, fps)
    const roller = desktop.roller
    const menu = roller.createSection('menu', 'Menu')
    let item = common.createElement('div')
    let code = "void main.desktop.runApp('Settings');"

    item.innerHTML = '<a href="javascript:' + code + '">Settings</a>'
    menu.body.appendChild(item)

    item = common.createElement('div')
    code = "void main.desktop.runApp('HTMLViewer',null,{url:'about.html'});"
    item.innerHTML = '<a href="javascript:' + code + '">About</a>'
    menu.body.appendChild(item)

    const list = roller.getSection('list')

    roller.container.insertBefore(menu, list)

    desktop.addIcon('Edit', 'apps/Edit/icon.png', "this.runApp('Edit','apps/Edit/Edit.js');")
    desktop.addIcon('Calc', null, "this.runApp('Calc','apps/Calc/Calc.js');")
    desktop.addIcon('Dummy Number One', 'images/js.png', "alert('Dummy!');")
    desktop.addIcon('Dummy Number Two', 'images/js.png', "alert('!ymmuD');")

    if (!parent) { parent = document.body }

    parent.insertBefore(desktop.container, parent.firstChild)
    this.desktop = desktop

    const _this = this

    common.addEventListener(document.getElementById('frameNew'), 'click', function(event) {
      _this.newFrame()
      common.preventDefault(event)
    })

    common.addEventListener(document.getElementById('transChange'), 'click', function(event) {
      _this.changeTransition()
      common.preventDefault(event)
    })
  }

  // On controls click
  this.onControlsClick = function(event) {
    const target = common.getTarget(event)

    if (target.type !== 'checkbox') { return }

    const features = document.getElementById('controls').features
    let index

    if (target === features[0]) {
      for (index = 1; index < features.length; index++) {
        features[index].checked = target.checked
      }
    } else {
      if (target.checked) {
        let all = true

        for (index = 1; index < features.length; index++) {
          if (!features[index].checked) {
            all = false
            break
          }
        }

        if (all) {
          features[0].checked = true
        }
      } else {
        features[0].checked = false
      }
    }
  }

  // New frame
  this.newFrame = function() {
    const controls = document.getElementById('controls')
    let title = controls.frameTitle.value

    if (title == null || title.length === 0) {
      title = 'Frame'
    }

    const desktop = this.desktop
    const width = 400
    const height = 300
    const x = (desktop.clientWidth - width) / 2
    const y = (desktop.clientHeight - height) / 2
    const frame = new MyFrame('frame', title, null, x, y, width, height)
    const features = controls.features

    if (features[1].checked) { frame.addMenubar() }
    if (features[2].checked) { frame.addStatusbar() }
    if (features[3].checked) { frame.setResizable() }

    if (frame.menubar) {
      const menu = new PopupMenu('Menu')

      menu.addItem('First', 'Leave bed', true, 'Number one')
      menu.addItem('Second', 'Eat breakfast', true, 'Number two')
      menu.addSeparator()
      menu.addItem('Last', 'Go to work', true, 'Number three')

      frame.addMenu(menu)
    }

    if (frame.statusbar) { frame.setStatusText('Status') }

    if (features[4].checked) {
      const content = common.createElement('div', {
        class: 'content',
      })

      content.innerHTML = 'Content'
      frame.client.appendChild(content)
    }

    frame.resizeContents()
    frame.handler = this.frameHandler

    desktop.openFrame(frame)
  }

  // Frame handler
  this.frameHandler = {
    onAction: function(frame, action) {
      frame.setStatusText(action + '!')
    },
  }

  // Change transition
  this.changeTransition = function() {
    const desktop = this.desktop
    const roller = desktop.roller
    const controls = document.getElementById('controls')
    const time = parseFloat(controls.transTime.value)
    const fps = parseInt(controls.transFPS.value)

    if (isNaN(time) || time < 0) {
      controls.transTime.value = desktop.time
    } else {
      desktop.time = time
      roller.time = time
    }

    if (isNaN(fps) || fps < 0) {
      controls.transFPS.value = desktop.fps
    } else {
      desktop.fps = fps
      roller.fps = fps
    }
  }
}()
