/*
 * Class:   PopupMenu
 * Author:  Tomas Enarsson
 * About:   Common popup menu widget.
 * Depends: browser.js, common.js
 */

/* global browser, common */

// Construct
function PopupMenu(title, x, y, minWidth, maxWidth) {
  if (x === null) { x = 0 }
  if (y === null) { y = 0 }

  let style = 'visibility:hidden;' + 'left:' + x + 'px;' + 'top:' + y + 'px;'

  if (minWidth !== null) { style += 'min-width:' + (minWidth - 4) + 'px;' }
  if (maxWidth !== null) { style += 'max-width:' + (maxWidth - 4) + 'px;' }

  const popup = common.createElement('div', {
    class: 'popup-menu',
    style: style,
  })

  popup.popupMenu = this

  common.addEventListener(popup, 'mouseover', PopupMenu.onMouseOver)
  common.addEventListener(popup, 'mouseout', PopupMenu.onMouseOut)
  common.addEventListener(popup, 'mousedown', PopupMenu.onMouseDown)

  this.popup = popup
  this.title = title
  this.x = x
  this.y = y
  this.marginTop = PopupMenu.DEFAULT_MARGIN
  this.marginRight = PopupMenu.DEFAULT_MARGIN
  this.marginBottom = PopupMenu.DEFAULT_MARGIN
  this.marginLeft = PopupMenu.DEFAULT_MARGIN
  this.pageX = null
  this.pageY = null
  this.mouseLeft = null
  this.mouseTop = null
  this.mouseRight = null
  this.mouseBottom = null
  this.head = null
  this.menubar = null
  this.onShow = null
  this.onHide = null
  this.onItemFocus = null
  this.onItemBlur = null
  this.onItemAction = null
}

// Constants
PopupMenu.DEFAULT_MARGIN = 10
PopupMenu.MENUBAR_HEIGHT = 18

// Destroy
PopupMenu.prototype.destroy = function() {
  this.popup.popupMenu = null
  this.popup = null
  this.menubar = null

  if (this.head) {
    this.head.popupMenu = null
    this.head = null
  }
}

// To string
PopupMenu.prototype.toString = function() {
  return ('PopupMenu: ' + this.title)
}

// Get width
PopupMenu.prototype.getWidth = function() {
  return (this.popup.clientWidth + 2)
}

// Get height
PopupMenu.prototype.getHeight = function() {
  return (this.popup.clientHeight + 2)
}

// Set mouse margin
PopupMenu.prototype.setMouseMargin = function(top, right, bottom, left) {
  this.marginTop = (top != null ? top : PopupMenu.DEFAULT_MARGIN)
  this.marginRight = (right != null ? right : PopupMenu.DEFAULT_MARGIN)
  this.marginBottom = (bottom != null ? bottom : PopupMenu.DEFAULT_MARGIN)
  this.marginLeft = (left != null ? left : PopupMenu.DEFAULT_MARGIN)
}

// Show
PopupMenu.prototype.show = function(visible) {
  const style = this.popup.style
  const menubar = this.menubar

  if (visible || visible == null) {
    if (this.isVisible() || this.popup.childNodes.length === 0) { return }
    if (menubar) {
      if (menubar.opened) {
        menubar.opened.show(false)
      }

      if (!common.hasClass(this.head, 'selected')) {
        common.addClass(this.head, 'selected')
      }

      menubar.opened = this
    }

    if (menubar) {
      this.alignToMenubar()
    }

    if (this.onShow) {
      this.onShow()
    }

    style.visibility = ''

    this.pageX = common.getElementX(this.popup)
    this.pageY = common.getElementY(this.popup)
    this.mouseLeft = -this.marginLeft
    this.mouseTop = -(menubar ? PopupMenu.MENUBAR_HEIGHT : this.marginTop)
    this.mouseRight = this.getWidth() + this.marginRight
    this.mouseBottom = this.getHeight() + this.marginBottom

    document.popupMenu = this
    common.addEventListener(document, 'mousemove', PopupMenu.onMouseMove)
  } else {
    if (!this.isVisible()) { return }

    common.removeEventListener(document, 'mousemove', PopupMenu.onMouseMove)
    document.popupMenu = null

    if (this.onHide) {
      this.onHide()
    }

    style.visibility = 'hidden'

    if (menubar) {
      common.removeClass(this.head, 'selected')

      if (menubar.opened === this) {
        menubar.opened = null
      }
    }
  }
}

// Visible?
PopupMenu.prototype.isVisible = function() {
  return (this.popup.style.visibility !== 'hidden')
}

// Toggle
PopupMenu.prototype.toggle = function() {
  this.show(!this.isVisible())
}

// Move to
PopupMenu.prototype.moveTo = function(x, y) {
  const style = this.popup.style

  if (x !== null && x !== this.x) {
    style.left = x + 'px'
    this.x = x
  }

  if (y !== null && y !== this.y) {
    style.top = y + 'px'
    this.y = y
  }
}

// Add item
PopupMenu.prototype.addItem = function(title, action, enabled, about) {
  if (enabled == null) { enabled = true }

  const item = common.createElement('div', {
    class: 'popup-menu-item' + (!enabled ? ' disabled' : ''),
  })

  item.innerHTML = title
  item.action = action
  item.about = (about || null)

  this.popup.appendChild(item)

  return item
}

// Add separator
PopupMenu.prototype.addSeparator = function() {
  const separator = common.createElement('div', {
    class: 'popup-menu-separator',
  })

  separator.name = null
  separator.about = null

  this.popup.appendChild(separator)

  return separator
}

// Set item title
PopupMenu.prototype.setItemTitle = function(item, title) {
  item.firstChild.nodeValue = (title != null ? title : '')
}

// Get item title
PopupMenu.prototype.getItemTitle = function(item) {
  return item.firstChild.nodeValue
}

// Set item enabled
PopupMenu.prototype.setItemEnabled = function(item, enabled) {
  if (common.hasClass(item, 'popup-menu-separator')) {
    return false
  }

  if (enabled || enabled == null) {
    common.removeClass(item, 'disabled')
  } else {
    common.addClass(item, 'disabled')
  }

  return true
}

// Is item enabled
PopupMenu.prototype.isItemEnabled = function(item) {
  if (common.hasClass(item, 'popup-menu-separator')) {
    return false
  }

  return !common.hasClass(item, 'disabled')
}

// Create menubar
PopupMenu.createMenubar = function() {
  const menubar = common.createElement('div', {
    class: 'popup-menubar',
  })

  if (browser.IE) {
    menubar.style.zIndex = 10
  }

  common.addEventListener(menubar, 'mouseover', PopupMenu.onMenubarMouseOver)
  common.addEventListener(menubar, 'mouseout', PopupMenu.onMenubarMouseOut)
  common.addEventListener(menubar, 'mousedown', PopupMenu.onMenubarMouseDown)

  menubar.opened = null
  return menubar
}

// Destroy menubar
PopupMenu.destroyMenubar = function(menubar) {
  common.forChild(menubar, null, 'DIV', true, function() {
    if (common.hasClass(this, 'popup-menu')) {
      this.popupMenu.destroy()
    }

    this.popupMenu = null
  })

  menubar.opened = null
}

// Add to menubar
PopupMenu.prototype.addToMenubar = function(menubar, right) {
  const head = common.createElement('div', {
    class: 'popup-menubar-item ' + (right ? 'right' : 'left'),
  })

  head.innerHTML = this.title
  head.popupMenu = this

  this.head = head
  this.menubar = menubar

  menubar.appendChild(head)
  menubar.appendChild(this.popup)
}

// Remove from menubar
PopupMenu.prototype.removeFromMenubar = function() {
  const menubar = this.menubar
  menubar.removeChild(this.popup)
  menubar.removeChild(this.head)

  this.head.popupMenu = null
  this.head = null
  this.menubar = null
}

// Align to menubar
PopupMenu.prototype.alignToMenubar = function() {
  const head = this.head
  let x = head.offsetLeft

  if (common.hasClass(head, 'right')) {
    x += head.clientWidth - this.getWidth()
  }

  this.moveTo(x, PopupMenu.MENUBAR_HEIGHT - 1)
}

// On mouse move
PopupMenu.onMouseMove = function(event) {
  const clientX = event.clientX
  const clientY = event.clientY
  const menu = this.popupMenu
  const x = clientX + common.getPageScrollX() - menu.pageX
  const y = clientY + common.getPageScrollY() - menu.pageY

  if (
    x < menu.mouseLeft ||
    y < menu.mouseTop ||
    x > menu.mouseRight ||
    y > menu.mouseBottom
  ) {
    menu.show(false)
  }
}

// On mouse over
PopupMenu.onMouseOver = function(event) {
  const target = common.getTarget(event)
  const menu = this.popupMenu

  if (target !== this && menu && menu.isItemEnabled(target)) {
    if (menu.onItemFocus) {
      menu.onItemFocus(target)
    }

    if (!common.hasClass(target, 'selected')) {
      common.addClass(target, 'selected')
    }
  }

  common.stopPropagation(event)
  common.preventDefault(event)
}

// On mouse out
PopupMenu.onMouseOut = function(event) {
  const target = common.getTarget(event)
  const menu = this.popupMenu

  if (target !== this && menu && menu.isItemEnabled(target)) {
    common.removeClass(target, 'selected')

    if (menu.onItemBlur && menu.isVisible()) {
      menu.onItemBlur(target)
    }
  }

  common.stopPropagation(event)
  common.preventDefault(event)
}

// On mouse down
PopupMenu.onMouseDown = function(event) {
  const target = common.getTarget(event)
  const menu = this.popupMenu

  if (target !== this && menu && menu.isItemEnabled(target)) {
    menu.show(false)
    common.removeClass(target, 'selected')

    if (menu.onItemBlur) { menu.onItemBlur(target) }
    if (menu.onItemAction) { menu.onItemAction(target) }
  }

  common.stopPropagation(event)
  common.preventDefault(event)
}

// On menubar mouse over
PopupMenu.onMenubarMouseOver = function(event) {
  const target = common.getTarget(event)
  const menu = target.popupMenu

  if (target !== this && menu) {
    if (this.opened) {
      menu.show(true)
    } else {
      if (!common.hasClass(target, 'selected')) {
        common.addClass(target, 'selected')
      }
    }
  }

  common.stopPropagation(event)
  common.preventDefault(event)
}

// On menubar mouse out
PopupMenu.onMenubarMouseOut = function(event) {
  const target = common.getTarget(event)

  if (target !== this && !this.opened) {
    common.removeClass(target, 'selected')
  }

  common.stopPropagation(event)
  common.preventDefault(event)
}

// On menubar mouse down
PopupMenu.onMenubarMouseDown = function(event) {
  const target = common.getTarget(event)
  const menu = target.popupMenu

  if (target !== this && menu) {
    menu.show(!this.opened)
  }

  common.stopPropagation(event)
  common.preventDefault(event)
}
