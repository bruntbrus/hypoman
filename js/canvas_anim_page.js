(function($) {
  // Properties
  const TIME = 5
  const FPS = 30
  const COUNT = 16
  let moveX = 5
  let moveY = -5
  let canvas
  let distance
  let angle
  let step
  let size
  let radius
  let position
  let x, y
  let x0, y0

  // On load
  $(function() {
    let context

    try {
      canvas = $('#canvas_anim_page canvas').get(0)
      context = canvas.getContext('2d')
    } catch (error) {
      return
    }

    context.strokeStyle = 'black'
    context.fillStyle = 'yellow'
    context.globalCompositeOperation = 'destination-over'
    distance = Math.round(TIME * FPS)
    angle = 2 * Math.PI / COUNT
    step = 2 * Math.PI / distance
    size = Math.min(canvas.width, canvas.height)
    radius = size / 8
    position = 0
    x = canvas.width / 4
    y = canvas.height / 4
    x0 = canvas.width / 2
    y0 = canvas.height / 2

    setInterval(update, 1000 / FPS)
  })

  // Update
  function update() {
    const context = canvas.getContext('2d')
    const rotation = position * step
    const offset = radius * Math.sin(rotation) / 2

    if (++position === distance) { position = 0 }

    context.save()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.translate(x, y)
    context.rotate(rotation)
    context.beginPath()
    context.moveTo(radius + offset, 0)

    for (let index = 1; index < COUNT; index++) {
      context.rotate(angle)

      if (index % 2) {
        context.lineTo(radius - offset, 0)
      } else {
        context.lineTo(radius + offset, 0)
      }
    }

    context.closePath()
    context.fill()
    context.stroke()
    context.restore()

    x += moveX
    y += moveY
    moveX -= 3 * (x - x0) / size
    moveY -= 3 * (y - y0) / size
  }
})(window.jQuery)
