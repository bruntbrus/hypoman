/* global common */

function TabbedView(id) {
  this.container = common.createElement('div', {
    id: id,
    class: 'tabbed-view',
  })

  this.tabs = {}
  this.selected = null
  this.container.tabbedView = this
}

TabbedView.prototype.addTab = function(name, title, content) {
  const tab = common.createElement('div', {
    class: 'tab',
  })

  const view = common.createElement('div', {
    class: 'view',
  })

  tab.name = name
  tab.innerHTML = '<span>' + title + '</span>'
  tab.appendChild(view)

  if (content) { view.appendChild(content) }

  this.container.appendChild(tab)
  this.tabs[name] = tab

  common.addEventListener(tab, 'mousedown', TabbedView.onTabMouseDown)

  return tab
}

TabbedView.prototype.removeTab = function(name) {
  const tab = this.tabs[name]

  if (tab !== null) {
    this.container.removeChild(tab)
    delete this.tabs[name]
  }

  return tab
}

TabbedView.prototype.getTab = function(name) {
  return this.tabs[name]
}

TabbedView.prototype.selectTab = function(tab) {
  if (typeof tab === 'string') { tab = this.tabs[tab] }

  if (this.selected) {
    if (this.selected === tab) { return }

    common.removeClass(this.selected, 'selected')
  }

  common.addClass(tab, 'selected')
  this.selected = tab
}

TabbedView.onTabMouseDown = function() {
  this.parentNode.tabbedView.selectTab(this)
}
