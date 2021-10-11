/*
 * Class:   DownRoller
 * Author:  Tomas Enarsson
 * About:   Rolling widget with collapsable sections.
 * Depends: common.js, Animation.js
 */

/* global common */

// Construct
function DownRoller(width, time, fps) {
  const container = common.createElement('div', {
    class: 'down-roller',
    style: (width != null ? 'width:' + width + 'px;' : ''),
  })

  container.downRoller = this
  this.container = container
  this.time = (time != null ? time : 0)
  this.fps = (fps != null ? fps : 0)
}

// Destroy
DownRoller.prototype.destroy = function() {
  common.forChild(this.container, null, 'DIV', true, function() {
    if (common.hasClass(this, 'section')) {
      this.animation.stop()
      // Clear references
      this.head = null
      this.view = null
      this.body = null
      this.roller = null
    }
  })

  this.container.downRoller = null
  this.container = null
}

// To string
DownRoller.prototype.toString = function() {
  return 'DownRoller'
}

// Create section
DownRoller.prototype.createSection = function(name, headHTML, bodyHTML) {
  const section = common.createElement('div', {
    class: 'section' + (name != null ? ' ' + name : ''),
  })

  const head = common.createElement('div', {
    class: 'head',
  })

  const view = common.createElement('div', {
    class: 'view',
    style: 'height: 0px;',
  })

  const body = common.createElement('div', {
    class: 'body',
  })

  if (headHTML !== null) { head.innerHTML = headHTML }
  if (bodyHTML !== null) { body.innerHTML = bodyHTML }

  common.addEventListener(head, 'mousedown', DownRoller.onSectionHeadMouseDown)

  section.name = name
  section.head = head
  section.view = view
  section.body = body
  section.animation = new Animation()

  view.appendChild(body)
  section.appendChild(head)
  section.appendChild(view)

  return section
}

// Get section
DownRoller.prototype.getSection = function(name) {
  return common.forChild(this.container, null, 'DIV', false, function() {
    return (this.name === name)
  })
}

// Is section expanded
DownRoller.prototype.isSectionExpanded = function(section) {
  return common.hasClass(section, 'expanded')
}

// Toggle section
DownRoller.prototype.toggleSection = function(section) {
  if (common.hasClass(section, 'expanded')) {
    common.removeClass(section, 'expanded')
    this.rollSection(section, true)
  } else {
    common.addClass(section, 'expanded')
    this.rollSection(section, false)
  }
}

// Update section
DownRoller.prototype.updateSection = function(section) {
  if (!common.hasClass(section, 'expanded')) { return }

  this.rollSection(section, false)
}

// Roll section
DownRoller.prototype.rollSection = function(section, collapse) {
  const anim = section.animation
  anim.reversed = collapse

  if (!anim.isRunning()) {
    anim.dh = section.body.scrollHeight
    anim.start(section, this.time, this.fps, DownRoller.onRollerUpdate)
  }
}

// On roller update
DownRoller.onRollerUpdate = function(section, point) {
  const height = Math.round(point * this.dh)
  common.setSize(section.view, null, height)

  if (this.endPoint()) { this.stop() }
}

// On section head mouse down
DownRoller.onSectionHeadMouseDown = function(event) {
  const section = this.parentNode

  section.parentNode.downRoller.toggleSection(section)
  common.stopPropagation(event)
  common.preventDefault(event)
}
