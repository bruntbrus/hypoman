/*
 * Class:   MyFrame
 * Author:  Tomas Enarsson
 * About:   Element-based frame emulating a common window.
 * Depends: common.js, browser.js, PopupMenu.js
 */

/* global DragHandler, PopupMenu, browser, common */

// Construct
function MyFrame(name, title, iconURL, x, y, width, height) {
  if (x === null) { x = 0 }
  if (y === null) { y = 0 }

  if (width === null) {
    width = MyFrame.DEFAULT_WIDTH
  } else if (width < MyFrame.MIN_WIDTH) {
    width = MyFrame.MIN_WIDTH
  }

  if (height === null) {
    height = MyFrame.DEFAULT_HEIGHT
  } else if (height < MyFrame.MIN_HEIGTHT) {
    height = MyFrame.MIN_HEIGHT
  }

  const container = common.createElement('div', {
    class: 'myframe',
    style: 'left:' + x + 'px;' + 'top:' + y + 'px;' +
      'width:' + (width - 2) + 'px;' + 'height:' + (height - 2) + 'px;',
  })

  container.myFrame = this

  const head = common.createElement('div', {
    class: 'myframe-head',
  })

  const icon = common.createElement('img', {
    src: (iconURL !== null ? iconURL : 'images/frame.png'),
  })

  const controls = common.createElement('div', {
    class: 'myframe-controls',
  })

  controls.min = common.createElement('div', {
    class: 'minimize',
  })

  controls.max = null

  controls.close = common.createElement('div', {
    class: 'close',
  })

  const contents = common.createElement('div', {
    class: 'myframe-contents',
  })

  const client = common.createElement('div', {
    class: 'myframe-client',
  })

  const cover = common.createElement('div', {
    class: 'myframe-cover',
    style: 'display: none;',
  })

  if (browser.IE) {
    cover.style.zIndex = 100
    cover.style.backgroundImage = "url('images/transparent.png')"
  }

  common.addEventListener(container, 'mousemove', MyFrame.onMouseMove)
  common.addEventListener(container, 'mousedown', MyFrame.onMouseDown)
  common.addEventListener(controls, 'mousedown', MyFrame.onControlsMouseDown)

  this.container = container
  this.head = head
  this.controls = controls
  this.contents = contents
  this.client = client
  this.cover = cover
  this.resizer = null
  this.menubar = null
  this.statusbar = null
  this.name = name
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.minWidth = MyFrame.MIN_WIDTH
  this.minHeight = MyFrame.MIN_HEIGHT
  this.maxWidth = null
  this.maxHeight = null
  this.clientWidth = null
  this.clientHeight = null
  this.widthDiff = MyFrame.EDGE_SIZE * 2 + 4
  this.heightDiff = MyFrame.HEAD_HEIGHT + MyFrame.EDGE_SIZE + 4
  this.enabled = true
  this.locked = false
  this.resizable = false
  this.maximizable = false
  this.dir = ''
  this.state = 'normal'
  this.nextState = null
  this.prevState = null
  this.desktop = null
  this.handler = null

  this.resizeContents(false)

  controls.appendChild(controls.min)
  controls.appendChild(controls.close)
  head.appendChild(icon)
  head.appendChild(document.createTextNode(title))
  head.appendChild(controls)
  contents.appendChild(client)
  container.appendChild(head)
  container.appendChild(contents)
  container.appendChild(cover)
}

// Constants
MyFrame.DEFAULT_WIDTH = 320
MyFrame.DEFAULT_HEIGHT = 240
MyFrame.MIN_WIDTH = 160
MyFrame.MIN_HEIGHT = 120
MyFrame.HEAD_HEIGHT = 20
MyFrame.STATUSBAR_HEIGHT = 18
MyFrame.EDGE_SIZE = 4

// Drag handler
MyFrame.dragHandler = new DragHandler(
  function(frame) {
    this.x = frame.x
    this.y = frame.y

    frame.lock('move', 20)
    frame.state = 'drag'

    return false
  },
  function(frame, offsetX, offsetY) {
    const x = this.x + offsetX
    const y = this.y + offsetY

    frame.moveTo(x, y)

    return false
  },
  function(frame) {
    frame.unlock()
    frame.state = 'normal'

    return true
  },
)

// Resize handler
MyFrame.resizeHandler = new DragHandler(
  function(frame) {
    this.x = frame.x
    this.y = frame.y
    this.width = frame.width
    this.height = frame.height

    frame.lock(frame.dir + '-resize', 20)
    frame.state = 'resize'

    return false
  },
  function(frame, offsetX, offsetY) {
    const dir = frame.dir
    let x = null
    let y = null
    let width = null
    let height = null

    if (dir.indexOf('w') >= 0) {
      width = this.width - offsetX
      x = true
    } else if (dir.indexOf('e') >= 0) {
      width = this.width + offsetX
    }

    if (dir.indexOf('n') >= 0) {
      height = this.height - offsetY
      y = true
    } else if (dir.indexOf('s') >= 0) {
      height = this.height + offsetY
    }

    if (frame.resizeTo(width, height)) {
      if (x) { x = this.x + this.width - frame.width }
      if (y) { y = this.y + this.height - frame.height }

      frame.moveTo(x, y)
    }

    frame.resizeContents()
    return false
  },
  function(frame) {
    frame.unlock()
    frame.state = 'normal'

    return true
  },
)

// Destroy
MyFrame.prototype.destroy = function() {
  const menubar = this.menubar

  if (menubar) {
    PopupMenu.destroyMenubar(menubar)
    menubar.myFrame = null
    this.menubar = null
  }

  this.container.myFrame = null
  this.container = null
  this.head = null
  this.controls = null
  this.contents = null
  this.client = null
  this.resizer = null
  this.cover = null
  this.statusbar = null
  this.desktop = null
  this.handler = null
}

// To string
MyFrame.prototype.toString = function() {
  return ('MyFrame: ' + this.name)
}

// Set size constraint
MyFrame.prototype.setSizeConstraint = function(minw, minh, maxw, maxh) {
  this.minWidth = (minw >= MyFrame.MIN_WIDTH ? minw : MyFrame.MIN_WIDTH)
  this.minHeight = (minh >= MyFrame.MIN_HEIGHT ? minh : MyFrame.MIN_HEIGHT)
  this.maxWidth = (maxw >= this.minWidth ? maxw : null)
  this.maxHeight = (maxh >= this.minHeight ? maxh : null)

  this.setMaximizable()
}

// Add menubar
MyFrame.prototype.addMenubar = function(visible) {
  if (this.menubar) { return }

  const menubar = PopupMenu.createMenubar()

  menubar.myFrame = this
  this.menubar = menubar

  if (visible || visible == null) {
    this.heightDiff += PopupMenu.MENUBAR_HEIGHT
  } else {
    menubar.style.display = 'none'
  }

  this.contents.insertBefore(menubar, this.client)
}

// Add statusbar
MyFrame.prototype.addStatusbar = function(visible) {
  if (this.statusbar) { return }

  const statusbar = common.createElement('div', {
    class: 'myframe-statusbar',
  })

  statusbar.innerHTML = '&nbsp;'
  this.statusbar = statusbar

  if (visible || visible == null) {
    this.heightDiff += MyFrame.STATUSBAR_HEIGHT
  } else {
    statusbar.style.display = 'none'
  }

  this.contents.appendChild(statusbar)
}

// Set title
MyFrame.prototype.setTitle = function(title) {
  this.head.childNodes[1].nodeValue = (title != null ? title : '')
}

// Get title
MyFrame.prototype.getTitle = function() {
  return this.head.childNodes[1].nodeValue
}

// Set status text
MyFrame.prototype.setStatusText = function(text) {
  const statusbar = this.statusbar

  if (statusbar) {
    statusbar.firstChild.nodeValue = (text != null ? text : '')
  }
}

// Get status text
MyFrame.prototype.getStatusText = function() {
  const statusbar = this.statusbar
  return (statusbar ? statusbar.firstChild.nodeValue : null)
}

// Lock
MyFrame.prototype.lock = function(cursor, margin) {
  if (this.locked) { return }

  const style = this.cover.style

  if (margin) {
    margin++
    style.top = style.left = (-margin) + 'px'
    style.padding = margin + 'px'
  }

  style.cursor = (cursor != null ? cursor : '')
  style.display = ''

  this.container.style.cursor = ''
  this.head.style.cursor = ''
  this.locked = true
}

// Unlock
MyFrame.prototype.unlock = function() {
  if (!this.locked) { return }

  const style = this.cover.style
  style.display = 'none'
  style.cursor = ''

  if (style.padding) {
    style.top = style.left = style.padding = ''
  }

  this.dir = ''
  this.locked = false
}

// Set enabled
MyFrame.prototype.setEnabled = function(enabled) {
  if (enabled || enabled == null) {
    if (this.enabled) { return }

    this.unlock()
    common.removeClass(this.container, 'disabled')
    this.enabled = true
  } else {
    if (!this.enabled) { return }

    this.lock()
    common.addClass(this.container, 'disabled')
    this.enabled = false
  }
}

// Show
MyFrame.prototype.show = function(visible, notify) {
  const style = this.container.style

  if (visible || visible === null) {
    if (style.visibility === 'hidden') {
      style.visibility = ''

      if (notify || notify === null) {
        this.notify('onShow')
      }
    }
  } else {
    if (style.visibility !== 'hidden') {
      style.visibility = 'hidden'

      if (notify || notify === null) {
        this.notify('onHide')
      }
    }
  }
}

// Is visible
MyFrame.prototype.isVisible = function() {
  return (this.container.style.visibility !== 'hidden')
}

// Notify
MyFrame.prototype.notify = function(event) {
  const handler = this.handler

  if (handler) {
    const method = handler[event]

    if (method) {
      arguments[0] = this
      return method.apply(handler, arguments)
    }
  }

  return null
}

// Show bar
MyFrame.prototype.showBar = function(bar, height, visible) {
  const style = bar.style

  if (visible || visible == null) {
    if (style.display !== 'none') { return }

    style.display = ''
    this.heightDiff += height
  } else {
    if (style.display === 'none') { return }

    style.display = 'none'
    this.heightDiff -= height
  }
}

// Show menubar
MyFrame.prototype.showMenubar = function(visible) {
  this.showBar(this.menubar, PopupMenu.MENUBAR_HEIGHT, visible)
}

// Show statusbar
MyFrame.prototype.showStatusbar = function(visible) {
  this.showBar(this.statusbar, MyFrame.STATUSBAR_HEIGHT, visible)
}

// Set maximizable
MyFrame.prototype.setMaximizable = function() {
  const desktop = this.desktop
  const controls = this.controls

  if (
    desktop &&
    this.resizable &&
    (this.maxWidth === null || this.maxWidth >= desktop.clientWidth) &&
    (this.maxHeight === null || this.maxHeight >= desktop.clientHeight)
  ) {
    if (this.maximizable) { return }

    if (controls.max) {
      controls.max.style.display = ''
    } else {
      controls.max = common.createElement('div', {
        class: 'maximize',
      })

      controls.insertBefore(controls.max, controls.close)
    }

    this.maximizable = true
  } else {
    if (!this.maximizable) { return }

    controls.max.style.display = 'none'
    this.maximizable = false
  }
}

// Set resizable
MyFrame.prototype.setResizable = function(resizable) {
  let resizer = this.resizer

  if (resizable || resizable == null) {
    if (this.resizable) { return }

    if (resizer) {
      resizer.style.display = ''
    } else {
      resizer = common.createElement('div', {
        class: 'myframe-resizer',
      })

      this.container.insertBefore(resizer, this.contents)
      this.resizer = resizer
    }

    this.resizable = true
  } else {
    if (!this.resizable) { return }

    resizer.style.display = 'none'
    this.resizable = false
  }

  this.setMaximizable()
}

// Move to
MyFrame.prototype.moveTo = function(x, y) {
  const style = this.container.style
  let moved = false

  if (x !== null && x !== this.x) {
    style.left = x + 'px'
    this.x = x
    moved = true
  }

  if (y !== null && y !== this.y) {
    style.top = y + 'px'
    this.y = y
    moved = true
  }

  return moved
}

// Resize to
MyFrame.prototype.resizeTo = function(width, height) {
  const style = this.container.style
  let resized = false

  if (width !== null && width !== this.width) {
    const minw = this.minWidth
    const maxw = this.maxWidth

    if (width < minw) {
      width = minw
    } else if (maxw > 0 && width > maxw) {
      width = maxw
    }

    if (width !== this.width) {
      style.width = (width - 2) + 'px'
      this.width = width
      resized = true
    }
  }

  if (height !== null && height !== this.height) {
    const minh = this.minHeight
    const maxh = this.maxHeight

    if (height < minh) {
      height = minh
    } else if (maxh > 0 && height > maxh) {
      height = maxh
    }

    if (height !== this.height) {
      style.height = (height - 2) + 'px'
      this.height = height
      resized = true
    }
  }

  return resized
}

// Resize contents
MyFrame.prototype.resizeContents = function(notify) {
  const style = this.client.style
  let width = this.width
  let height = this.height
  const minw = this.minWidth
  const minh = this.minHeight
  let resized = false

  if (width < minw) { width = minw }

  const clientw = width - this.widthDiff

  if (clientw !== this.clientWidth) {
    style.width = clientw + 'px'
    this.clientWidth = clientw
    resized = true
  }

  if (height < minh) { height = minh }

  const clienth = height - this.heightDiff

  if (clienth !== this.clientHeight) {
    style.height = clienth + 'px'
    this.clientHeight = clienth
    resized = true
  }

  if (resized && (notify || notify === null)) {
    this.notify('onResize')
  }

  return resized
}

// Resize client to
MyFrame.prototype.resizeClientTo = function(width, height) {
  if (width != null) { width += this.widthDiff }
  if (height != null) { height += this.heightDiff }
  if (this.resizeTo(width, height)) { this.resizeContents() }
}

// Add menu
MyFrame.prototype.addMenu = function(menu) {
  menu.onItemFocus = MyFrame.onMenuItemFocus
  menu.onItemBlur = MyFrame.onMenuItemBlur
  menu.onItemAction = MyFrame.onMenuItemAction
  menu.addToMenubar(this.menubar)
}

// On mouse move
MyFrame.onMouseMove = function(event) {
  const frame = this.myFrame

  if (frame.locked || !frame.resizable || frame.state !== 'normal') { return }

  const clientX = event.clientX
  const clientY = event.clientY
  const x = clientX + common.getPageScrollX() - common.getElementX(this)
  const y = clientY + common.getPageScrollY() - common.getElementY(this)
  const x2 = this.clientWidth - x
  const y2 = this.clientHeight - y
  let dir = ''

  if (y < 5) {
    dir = 'n'
  } else if (y2 < 5) {
    dir = 's'
  }

  if (x < 5) {
    dir += 'w'
  } else if (x2 < 5) {
    dir += 'e'
  }

  let cursor = dir

  if (dir) { cursor += '-resize' }

  this.style.cursor = cursor
  frame.head.style.cursor = cursor
  frame.dir = dir
}

// On mouse down
MyFrame.onMouseDown = function(event) {
  const target = common.getTarget(event)
  const frame = this.myFrame

  if (target === frame.cover) { return }

  const clientX = event.clientX
  const clientY = event.clientY

  if (frame.dir) {
    MyFrame.resizeHandler.start(frame, clientX, clientY)
  } else if (target === frame.head && frame.state === 'normal') {
    MyFrame.dragHandler.start(frame, clientX, clientY)
  } else return

  common.stopPropagation(event)
  common.preventDefault(event)
}

// On controls mouse down
MyFrame.onControlsMouseDown = function(event) {
  const target = common.getTarget(event)

  if (target === this) { return }

  const frame = this.parentNode.parentNode.myFrame
  const desktop = frame.desktop

  switch (target.className) {
    case 'minimize':
      if (desktop && desktop.onFrameMinimize) {
        desktop.onFrameMinimize(frame)
      }

      break

    case 'maximize':
      if (desktop && desktop.onFrameMaximize) {
        desktop.onFrameMaximize(frame)
      }

      break

    case 'close':
      if (desktop && desktop.onFrameClose) {
        desktop.onFrameClose(frame)
      } else {
        const parent = frame.container.parentNode

        if (parent) {
          parent.removeChild(frame.container)
        }

        frame.destroy()
      }

      break
  }

  common.stopPropagation(event)
  common.preventDefault(event)
}

// On menu item focus
MyFrame.onMenuItemFocus = function(item) {
  this.menubar.myFrame.setStatusText(item.about)
}

// On menu item blur
MyFrame.onMenuItemBlur = function(item) {
  this.menubar.myFrame.setStatusText(null)
}

// On menu item action
MyFrame.onMenuItemAction = function(item) {
  const frame = this.menubar.myFrame
  frame.notify('onAction', item.action)
}
