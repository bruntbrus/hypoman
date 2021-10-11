(function(MineField, $) {
  // Constants
  const MAX_WIDTH = 100
  const MAX_HEIGHT = 100

  // Globals
  let $form
  let $board
  let $status
  let field

  // Document ready
  $(function() {
    $form = $('#minefield_page form')
    $board = $form.find('.board')
    $status = $form.find('.status span')
    $form.find('input[name=newField]').click(onNewClick)
  })

  // Create field
  function createField(width, height) {
    field = new MineField('minefield', width, height)
    const table = field.table

    $(table).mousedown(function(event) {
      if (!field.locked) {
        const target = event.target

        if (target.tagName === 'TD') {
          onCellSelect.call(target, event)
        }
      }
      event.preventDefault()
    })

    $board.append(table)

    const x = ($board.width() - field.getFullWidth()) / 2
    const y = ($board.height() - field.getFullHeight()) / 2

    if (x > 0) {
      table.style.left = x + 'px'
    }

    if (y > 0) {
      table.style.top = y + 'px'
    }
  }

  // Destroy field
  function destroyField() {
    $board.remove(field.table)
    field = null
  }

  // Get input value
  function getInputValue(input, max) {
    let value = parseInt(input.value)

    if (isNaN(value) || value < 0) {
      input.value = value = 0
    } else if (value > max) {
      input.value = value = max
    }

    return value
  }

  // Check completion
  function checkCompletion() {
    if (field.detonated()) {
      $status.eq(0).html('Boom! Du hamnar på akuten.')
      $status.eq(1).html('')
      $form.find('input[name=newField]').attr('disabled', 'disabled')

      setTimeout(function() {
        field.showAll()
        $form.find('input[name=newField]').attr('disabled', '')
      }, 1000)
    } else if (field.cleared()) {
      $status.eq(0).html('Bra jobbat! Fältet är säkrat.')
      $status.eq(1).html('100%')
    }
  }

  // On new click
  function onNewClick() {
    const width = getInputValue($form.find('input[name=fieldWidth]').get(0), MAX_WIDTH)
    const height = getInputValue($form.find('input[name=fieldHeight]').get(0), MAX_HEIGHT)
    const count = getInputValue($form.find('input[name=mineCound]').get(0), Math.floor(width * height / 2))

    if (width && height && count) {
      $status.eq(0).html('Skapar nytt fält...')
      $status.eq(1).html('0%')

      if (!field || width !== field.width || height !== field.height) {
        if (field) {
          destroyField()
        }

        setTimeout(function() {
          createField(width, height)
          field.setup(count)
          $status.eq(0).html('')
        }, 10)
      } else {
        setTimeout(function() {
          field.setup(count)
          $status.eq(0).html('')
        }, 10)
      }
    }
  }

  // On cell select
  function onCellSelect(event) {
    if (event.ctrlKey) {
      field.setFlagged(this, !field.isFlagged(this))
      checkCompletion()
    } else if (!field.isVisible(this)) {
      const cell = this

      $status.eq(0).html('Röjer...')

      setTimeout(function() {
        if (!field.selection) {
          field.placeMines(cell)
        }

        field.selectCell(cell)
        $status.eq(0).html('')
        $status.eq(1).html(Math.floor(field.getProgress() * 100) + '%')

        checkCompletion()
      }, 10)
    }
  }
})(window.MineField, window.jQuery)
