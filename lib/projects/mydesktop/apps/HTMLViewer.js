/*
 * App:     HTMLViewer
 * Author:  Tomas Enarsson
 * About:   Simple viewer for HTML-files.
 * Depends: common.js, browser.js, MyFrame.js, MyDesktop.js
 */

/* global MyFrame, common */

// Construct
function HTMLViewer(desktop, url, width, height) {
  const x = (desktop.clientWidth - width) / 2
  const y = (desktop.clientHeight - height) / 2
  const frame = new MyFrame('HTMLViewer', url, null, x, y, width, height)

  frame.setResizable()

  const page = common.createElement('div', {
    style: 'margin: 1em;',
  })

  page.innerHTML = '<p>Loading content...</p>'

  common.load('text/html', url, 10000, this, function(request) {
    const status = request.status

    if (request.readyState !== 4) {
      page.innerHTML = '<p>Timeout: 10s</p>'
    } else if (status === 0 || status === 200 || status === 304) {
      const html = request.responseText
      const match = html.match(/<title>(.*)<\/title>/i)

      if (match && match.length > 1) {
        const title = match[1]

        frame.setTitle(title)
        desktop.setFrameButtonTitle(frame, title)
      }

      page.innerHTML = html
    } else {
      page.innerHTML = '<p>' + status + ' - ' + request.statusText + '</p>'
    }
  })

  this.frame = frame
  this.url = url

  frame.client.style.backgroundColor = 'white'
  frame.client.appendChild(page)

  desktop.openFrame(frame, this)
}

// Run
HTMLViewer.run = function(desktop, args) {
  const viewers = desktop.getRunners(this)

  if (viewers) {
    for (let index = 0; index < viewers.length; index++) {
      const viewer = viewers[index]

      if (viewer.url === args.url) {
        desktop.frameToFront(viewer.frame)
        return viewer
      }
    }
  }

  let url = null
  let width = 480
  let height = 400

  if (args) {
    if (args.url != null) { url = args.url }
    if (args.width != null) { width = args.width }
    if (args.height != null) { height = args.height }
  }

  return (url != null ? new this(desktop, url, width, height) : null)
}

// Destroy
HTMLViewer.prototype.destroy = function() {
  this.frame = null
}
