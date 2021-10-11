(function($) {
  const drawings = {
    Gradient: function(context, name) {
      const gradient = context.createLinearGradient(0, 0, this.width, this.height)

      gradient.addColorStop(0, '#fff')
      gradient.addColorStop(1, '#44f')

      context.fillStyle = gradient
      context.fillRect(0, 0, this.width, this.height)
      drawText(context, name)
    },
    Rectangle: function(context, name) {
      const length = 10
      const width = 2 * this.width / (3 * length + 1)
      const height = this.height / 2
      const step = (this.width + width) / (length + 1)
      const y = -height / 2

      context.translate(-width, this.height / 2)

      for (let index = 1; index <= length; index++) {
        const red = Math.floor(191 * index / length + 64)
        context.fillStyle = 'rgb(' + red + ', 0, 0)'
        context.fillRect(index * step, y, width, height)
      }

      drawText(context, name)
    },
    Arc: function(context, name) {
      const length = 7
      const angle = 2 * Math.PI
      const radius = Math.min(this.width, this.height) / 3

      context.translate(this.width / 2, this.height / 2)

      for (let index = length; index > 0; index--) {
        const scale = index / length
        context.beginPath()
        context.arc(0, 0, scale * radius, 0, angle, true)
        context.closePath()

        const blue = Math.floor(scale * 191 + 64)
        context.fillStyle = 'rgb(0, 0, ' + blue + ')'
        context.fill()
      }

      drawText(context, name)
    },
    Line: function(context, name) {
      const radius = Math.min(this.width, this.height) / 3
      const count = 16
      const angle = 2 * Math.PI / count

      context.translate(this.width / 2, this.height / 2)
      context.beginPath()
      context.moveTo(radius, 0)

      for (let index = 1; index < count; index++) {
        context.rotate(angle)
        context.lineTo(radius / (index % 2 + 1), 0)
      }

      context.closePath()
      context.fillStyle = 'yellow'
      context.strokeStyle = 'black'
      context.fill()
      context.stroke()
      drawText(context, name)
    },
    ImageData: function(context, name) {
      const imageData = context.getImageData(0, 0, this.width, this.height)

      if (!imageData) { return }

      const data = imageData.data
      const repeat = 2
      const smooth = 6
      const shift = Math.PI / 2
      const xf = 2 * Math.PI * repeat / this.width
      const yf = 2 * Math.PI * repeat / this.height
      let x = 0
      let y = 0

      for (let index = 0; index < data.length; index += 4) {
        let level = (Math.cos(xf * x + shift) * Math.sin(yf * y) + 1) / 2
        level = Math.round(level * smooth) / smooth

        data[index + 0] = 0
        data[index + 1] = Math.floor(level * 127 + 128)
        data[index + 2] = 0
        data[index + 3] = 255

        if (++x === this.width) { x = 0; y++ }
      }

      context.putImageData(imageData, 0, 0)
      drawText(context, name)
    },
    Image: function(context, name) {
      const canvas = this
      const image = new Image()

      image.onload = function() {
        image.onload = null

        const x = (canvas.width - image.width) / 2
        const y = (canvas.height - image.height) / 2

        context.drawImage(image, x, y)
        drawText(context, name)
      }

      image.src = '../images/C64.jpg'
    },
  }

  $(function() {
    const $page = $('#canvas_page')

    for (const name in drawings) {
      let canvas
      let context

      try {
        canvas = $('<canvas width="240" height="160"></canvas>').get(0)
        context = canvas.getContext('2d')
      } catch (ex) {
        $page.html('<p>Canvas not supported</p>')
        return
      }

      context.save()
      drawings[name].call(canvas, context, name)
      $page.append(canvas)
    }
  })

  function drawText(context, text) {
    context.restore()
    context.font = 'bold 32px sans-serif'
    context.textBaseline = 'top'
    context.strokeStyle = 'black'
    context.fillStyle = 'white'
    context.shadowOffsetX = 3
    context.shadowOffsetY = 3
    context.shadowBlur = 3
    context.shadowColor = 'rgba(0, 0, 0, 0.5)'
    context.fillText(text, 10, 10)
    context.strokeText(text, 10, 10)
  }
})(window.jQuery)
