/*
 * Class:   MyDesktop
 * Author:  Tomas Enarsson
 * About:   Virtual online desktop.
 * Depends: common.js, Animation.js, MyFrame.js, DownRoller.js, PopupMenu.js
 */

/* global MyFrame, DownRoller, common */

// Construct
function MyDesktop(name, width, height, time, fps) {
  const container = common.createElement('div', {
    class: 'mydesktop',
    style: 'width:' + width + 'px;' + 'height:' + height + 'px;',
  })

  container.myDesktop = this

  const panel = common.createElement('div', {
    class: 'mydesktop-panel',
  })

  const roller = new DownRoller(null, time, fps)
  roller.container.style.height = (height - 32) + 'px'

  const list = roller.createSection('list', 'Frames')
  common.addEventListener(list.body, 'mousedown', MyDesktop.onListBodyMouseDown)

  const status = common.createElement('div', {
    class: 'status',
  })

  status.appendChild(document.createTextNode(''))

  const clientw = width - 120

  const client = common.createElement('div', {
    class: 'mydesktop-client',
    style: 'width:' + clientw + 'px;',
  })

  this.container = container
  this.panel = panel
  this.roller = roller
  this.status = status
  this.client = client
  this.name = name
  this.width = width
  this.height = height
  this.clientWidth = clientw
  this.clientHeight = height
  this.frames = []
  this.frontFrame = null
  this.statusTimeout = null
  this.runQueues = {}
  this.runners = {}
  this.time = (time != null ? time : 0)
  this.fps = (fps != null ? fps : 0)

  roller.container.appendChild(list)
  panel.appendChild(roller.container)
  panel.appendChild(status)
  container.appendChild(panel)
  container.appendChild(client)
}

// Properties
MyDesktop.apps = {}
MyDesktop.animation = new Animation()

// Eval
MyDesktop.eval = function(code, name) {
  // eslint-disable-next-line no-eval
  const value = eval(code)

  // eslint-disable-next-line no-eval
  return (name !== null ? eval(name) : value)
}

// Load app
MyDesktop.loadApp = function(name, url, timeout, onLoad, onError) {
  this.apps[url] = 'loading'

  common.load('text/javascript', url, timeout, this, function(request) {
    this.apps[url] = null
    const status = request.status

    if (request.readyState !== 4) {
      if (onError) {
        onError.call(this, 'timeout')
      }
    } else if (status === 0 || status === 200 || status === 304) {
      let app

      try {
        app = this.eval(request.responseText, name)
      } catch (ex) {
        if (onError) {
          onError.call(this, ex.message)
        }

        return
      }

      this.initApp(app, name, url)

      if (onLoad) {
        onLoad.call(this, app)
      }
    } else {
      if (onError) {
        onError.call(this, status + ': ' + request.statusText)
      }
    }
  })
}

// Init app
MyDesktop.initApp = function(app, name, url) {
  app.name = name
  app.url = url

  if (app.init) {
    app.init(name, url)
  }

  this.apps[url] = app
}

// Run transition
MyDesktop.runTransition = function(frame, effect, end, onStop) {
  const anim = this.animation
  const desktop = frame.desktop

  if (end) {
    anim.origin = {
      x: frame.x,
      y: frame.y,
      width: frame.width,
      height: frame.height,
    }

    anim.dx = (end.x != null ? end.x - frame.x : null)
    anim.dy = (end.y != null ? end.y - frame.y : null)
    anim.dw = (end.width != null ? end.width - frame.width : null)
    anim.dh = (end.height != null ? end.height - frame.height : null)
  } else {
    anim.origin = null
  }

  anim.effect = effect
  anim.onStop = onStop
  frame.prevState = frame.state
  frame.state = 'transition'

  anim.start(frame, desktop.time, desktop.fps, MyDesktop.onAnimUpdate)
}

// On anim update
MyDesktop.onAnimUpdate = function(frame, point) {
  const origin = this.origin

  if (origin) {
    const x = (this.dx != null ? Math.round(origin.x + point * this.dx) : null)
    const y = (this.dy != null ? Math.round(origin.y + point * this.dy) : null)
    const width = (this.dw != null ? Math.round(origin.width + point * this.dw) : null)
    const height = (this.dh != null ? Math.round(origin.height + point * this.dh) : null)

    frame.moveTo(x, y)
    frame.resizeTo(width, height)
  }

  if (this.effect === 'fade in') {
    common.setOpacity(frame.container, point)
  } else if (this.effect === 'fade out') {
    common.setOpacity(frame.container, 1 - point)
  }

  if (this.endPoint()) {
    frame.state = frame.nextState
    frame.nextState = null

    this.stop()

    if (this.onStop) {
      this.onStop()
    }
  }
}

// Destroy
MyDesktop.prototype.destroy = function() {
  const desktop = this

  common.forChild(this.client, null, 'DIV', true, function() {
    if (common.hasClass(this, 'myframe')) {
      desktop.closeFrame(this.myFrame, true)
    }
  })

  if (this.statusTimeout) {
    clearTimeout(this.statusTimeout)
  }

  this.roller.destroy()
  this.container.myDesktop = null
  this.container = null
  this.panel = null
  this.roller = null
  this.status = null
  this.client = null
  this.frames = null
  this.frontFrame = null
  this.runQueues = null
  this.runners = null
  this.dragHandler = null
  this.resizeHandler = null
  this.animation = null
}

// To string
MyDesktop.prototype.toString = function() {
  return ('MyDesktop: ' + this.name)
}

// Set status
MyDesktop.prototype.setStatusText = function(text, expire) {
  if (this.statusTimeout) {
    clearTimeout(this.statusTimeout)
    this.statusTimeout = null
  }

  if (text == null || text === '') {
    this.status.firstChild.nodeValue = ''
    return
  }

  this.status.firstChild.nodeValue = text

  if (expire) {
    const desktop = this

    this.statusTimeout = setTimeout(function() {
      desktop.status.firstChild.nodeValue = ''
      desktop.statusTimeout = null
    }, expire)
  }
}

// Validate frame
MyDesktop.prototype.validateFrame = function(frame) {
  if (frame.desktop == null) {
    throw new Error('Frame has not been opened yet')
  }
  if (frame.desktop !== this) {
    throw new Error('Frame belongs to another desktop')
  }
}

// Set frame index
MyDesktop.prototype.setFrameIndex = function(frame, index) {
  frame.index = index
  frame.container.style.zIndex = index + 1
}

// Rebuild index
MyDesktop.prototype.rebuildIndex = function(start) {
  const frames = this.frames

  for (let index = start; index < frames.length; index++) {
    this.setFrameIndex(frames[index], index)
  }
}

// Open frame
MyDesktop.prototype.openFrame = function(frame, handler) {
  if (handler !== null) {
    frame.handler = handler
  }

  if (frame.desktop === null) {
    const button = common.createElement('div', {
      class: 'button',
    })

    button.myFrame = frame

    frame.desktop = this
    frame.normalX = frame.x
    frame.normalY = frame.y
    frame.normalWidth = frame.width
    frame.normalHeight = frame.height
    frame.button = button
    frame.nextState = frame.state

    this.setFrameButtonTitle(frame, frame.getTitle())

    frame.setMaximizable()

    common.addEventListener(frame.container, 'mousedown', MyDesktop.onFrameMouseDown)

    if (frame.notify('onOpen') === false) {
      frame.prevState = frame.state
      frame.state = 'closed'

      frame.show(false)
      this.client.appendChild(frame.container)

      return frame
    }

    this.frames.push(frame)
    this.frameToFront(frame, false)

    common.setOpacity(frame.container, 0)
    this.client.appendChild(frame.container)
  } else {
    this.validateFrame(frame)

    if (frame.state !== 'closed') {
      this.frameToFront(frame)
      return frame
    }

    if (frame.notify('onOpen') === false) {
      return frame
    }

    frame.nextState = frame.prevState
    frame.prevState = frame.state
    frame.state = 'pending'

    this.frameToFront(frame, false)
  }

  const list = this.roller.getSection('list')

  list.body.insertBefore(frame.button, list.body.firstChild)
  this.roller.updateSection(list)

  MyDesktop.runTransition(frame, 'fade in', null, function() {
    frame.notify('onFocus')
  })

  return frame
}

// Close frame
MyDesktop.prototype.closeFrame = function(frame, destroy) {
  this.validateFrame(frame)

  if (frame.state === 'closed' || frame.notify('onClose') === false) {
    return
  }

  frame.notify('onBlur')

  const list = this.roller.getSection('list')
  list.body.removeChild(frame.button)

  this.roller.updateSection(list)
  frame.nextState = 'closed'

  MyDesktop.runTransition(frame, 'fade out', null, function() {
    const desktop = frame.desktop

    frame.show(false)

    if (frame.notify('onDestroy') !== false || destroy) {
      desktop.client.removeChild(frame.container)
      desktop.frames.splice(frame.index, 1)
      desktop.rebuildIndex(frame.index)

      frame.button.myFrame = null
      frame.button = null

      desktop.killRunner(frame.handler)

      frame.destroy()
    }

    if (frame === desktop.frontFrame) {
      desktop.frontFrame = null
      desktop.frameToFront(null)
    }
  })
}

// Set frame button title
MyDesktop.prototype.setFrameButtonTitle = function(frame, title) {
  const button = frame.button

  if (title.length <= 15) {
    button.innerHTML = title
  } else {
    button.title = title
    button.innerHTML = title.substring(0, 12) + '...'
  }
}

// Get last visible frame
MyDesktop.prototype.getLastVisibleFrame = function() {
  const element = common.forChild(this.client, null, 'DIV', true, function() {
    return (common.hasClass(this, 'myframe') && this.myFrame.isVisible())
  })

  return (element ? element.myFrame : null)
}

// Frame to front
MyDesktop.prototype.frameToFront = function(frame, notify) {
  if (frame) {
    if (frame.state === 'closed') {
      this.openFrame(frame)
      return
    }

    this.validateFrame(frame)
  } else {
    frame = this.getLastVisibleFrame()
  }

  const front = this.frontFrame

  if (frame === front) { return }

  if (!frame) {
    if (front) {
      common.removeClass(front.button, 'selected')
      this.frontFrame = null
    }

    return
  }

  if (front) {
    if (front.state !== 'minimized') {
      front.notify('onBlur')
      front.setEnabled(false)
    }

    common.removeClass(front.button, 'selected')
  }

  const frames = this.frames

  if (frame.index !== null) {
    frames.splice(frame.index, 1)
    frames.push(frame)

    this.rebuildIndex(frame.index)
  } else {
    this.setFrameIndex(frame, frames.length - 1)
  }

  common.addClass(frame.button, 'selected')
  this.frontFrame = frame

  frame.setEnabled()
  frame.show()

  if (frame.state === 'minimized') {
    this.changeFrameState(frame, frame.prevState)
  } else if (notify || notify == null) {
    frame.notify('onFocus')
  }
}

// Begin frame state
MyDesktop.prototype.beginFrameState = function(frame) {
  this.validateFrame(frame)
  frame.notify('onStateBegin')

  switch (frame.state) {
    case 'normal':
      frame.controls.style.display = ''
      frame.contents.style.display = ''

      if (frame.resizable) {
        frame.resizer.style.display = ''
      }

      if (frame.prevState === 'maximized') {
        frame.resizeContents()
      }

      break

    case 'minimized':
      frame.show(false)
      this.frameToFront(null)
      common.addClass(frame.button, 'minimized')

      break

    case 'maximized':
      frame.controls.style.display = ''
      frame.contents.style.display = ''

      if (frame.prevState === 'normal') {
        frame.resizeContents()
      }

      break

    default:
      return
  }

  if (frame.prevState === 'minimized') {
    frame.notify('onFocus')
  }
}

// End frame state
MyDesktop.prototype.endFrameState = function(frame) {
  this.validateFrame(frame)

  if (frame.nextState === 'minimized') {
    frame.notify('onBlur')
  }

  frame.notify('onStateEnd')

  switch (frame.state) {
    case 'normal':
      frame.normalX = frame.x
      frame.normalY = frame.y
      frame.normalWidth = frame.width
      frame.normalHeight = frame.height
      frame.contents.style.display = 'none'

      if (frame.resizable) {
        frame.resizer.style.display = 'none'
      }

      frame.controls.style.display = 'none'
      break

    case 'minimized':
      frame.show()
      common.removeClass(frame.button, 'minimized')
      break

    case 'maximized':
      frame.contents.style.display = 'none'
      frame.controls.style.display = 'none'
      break

    default:
      return
  }

  frame.prevState = frame.state
}

// Change frame state
MyDesktop.prototype.changeFrameState = function(frame, nextState) {
  this.validateFrame(frame)

  const state = frame.state
  const anim = MyDesktop.animation

  if (
    state === nextState ||
    state === 'closed' ||
    anim.isRunning() ||
    (nextState === 'maximized' && !frame.maximizable)
  ) return

  frame.nextState = nextState
  this.endFrameState(frame)

  let effect = (state === 'minimized' ? 'fade in' : null)
  const dest = {}

  switch (nextState) {
    case 'normal':
      dest.width = frame.normalWidth
      dest.height = frame.normalHeight
      dest.x = frame.normalX
      dest.y = frame.normalY
      break

    case 'minimized':
      effect = 'fade out'
      dest.width = MyFrame.MIN_WIDTH
      dest.height = MyFrame.MIN_HEIGHT
      dest.x = frame.x + (frame.width - dest.width) / 2
      dest.y = frame.y + (frame.height - dest.height) / 2
      break

    case 'maximized':
      dest.width = this.clientWidth
      dest.height = this.clientHeight
      dest.x = 0
      dest.y = 0
      break

    default:
      return
  }

  MyDesktop.runTransition(frame, effect, dest, function() {
    frame.desktop.beginFrameState(frame)
  })
}

// Add icon
MyDesktop.prototype.addIcon = function(title, source, action) {
  const icon = common.createElement('div', {
    class: 'mydesktop-icon',
  })

  icon.action = action

  const image = common.createElement('img', {
    src: (source != null ? source : 'images/icon.png'),
    alt: 'Icon',
  })

  common.addEventListener(icon, 'click', MyDesktop.onIconClick)
  icon.appendChild(image)

  const textbox = common.createElement('div')

  textbox.innerHTML = title
  icon.appendChild(textbox)
  this.client.appendChild(icon)
}

// Run app
MyDesktop.prototype.runApp = function(name, url, args) {
  if (!url) {
    url = 'apps/' + name + '.js'
  }

  const app = MyDesktop.apps[url]

  if (!app) {
    this.setStatusText(name + ': loading...')
    this.runQueues[url] = [args]

    const desktop = this

    MyDesktop.loadApp(name, url, 10000, function() {
      desktop.setStatusText(name + ': ready', 10000)

      const runQueue = desktop.runQueues[url]

      for (let index = 0; index < runQueue.length; index++) {
        desktop.runApp(name, url, runQueue[index])
      }

      desktop.runQueues[url] = null
    }, function(error) {
      desktop.setStatusText(name + ': ' + error, 10000)
    })

    return null
  }

  if (app === 'loading') {
    this.runQueues[url].push(args)
    return null
  }

  let runner = null

  try {
    runner = app.run(this, args)
  } catch (ex) {
    alert(ex)
  }

  if (runner) {
    const runners = this.runners[url]

    if (runners) {
      for (let i = 0; i < runners.length; i++) {
        if (runner === runners[i]) {
          return runner
        }
      }

      runners.push(runner)
    } else {
      this.runners[url] = [runner]
    }
  }

  return runner
}

// Get runners
MyDesktop.prototype.getRunners = function(app) {
  return this.runners[app.url]
}

// Kill runner
MyDesktop.prototype.killRunner = function(runner) {
  const url = runner.constructor.url
  const runners = this.runners[url]

  if (runners) {
    for (let i = 0; i < runners.length; i++) {
      if (runner === runners[i]) {
        runners.splice(i, 1)

        if (runner.onKill) {
          runner.onKill()
        }
      }
    }
  }
}

// Run command
MyDesktop.prototype.runCommand = function(command) {
  let value = null

  try {
    value = MyDesktop.eval.call(this, command)
  } catch (ex) {
    alert(ex)
  }

  return value
}

// On list body mouse down
MyDesktop.onListBodyMouseDown = function(event) {
  const target = common.getTarget(event)
  const frame = target.myFrame

  if (!frame) { return }

  const desktop = frame.desktop

  if (frame.state === 'minimized') {
    desktop.frameToFront(frame, false)
  } else if (frame === desktop.frontFrame) {
    desktop.changeFrameState(frame, 'minimized')
  } else {
    desktop.frameToFront(frame)
  }

  common.stopPropagation(event)
  common.preventDefault(event)
}

// On icon click
MyDesktop.onIconClick = function(event) {
  const target = common.getTarget(event)

  if (target.nodeName === 'IMG') {
    const desktop = this.parentNode.parentNode.myDesktop

    if (this.action != null) {
      desktop.runCommand(this.action)
    }
  }

  common.stopPropagation(event)
  common.preventDefault(event)
}

// On frame mouse down
MyDesktop.onFrameMouseDown = function(event) {
  const frame = this.myFrame
  const desktop = frame.desktop

  if (desktop && frame.state !== 'minimized') {
    desktop.frameToFront(frame)
  }
}

// On frame minimize
MyDesktop.prototype.onFrameMinimize = function(frame) {
  if (frame.state !== 'minimized') {
    this.changeFrameState(frame, 'minimized')
  } else {
    this.changeFrameState(frame, frame.prevState)
  }
}

// On frame maximize
MyDesktop.prototype.onFrameMaximize = function(frame) {
  if (frame.state !== 'maximized') {
    this.changeFrameState(frame, 'maximized')
  } else {
    this.changeFrameState(frame, 'normal')
  }
}

// On frame close
MyDesktop.prototype.onFrameClose = function(frame) {
  this.closeFrame(frame)
}
