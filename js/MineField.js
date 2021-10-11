/* global common */

// Construct
function MineField(id, width, height) {
  const table = common.createElement('table', {
    id: id,
    class: 'minefield',
  })

  let row, x, y

  for (y = 0; y < height; y++) {
    row = table.insertRow(y)

    for (x = 0; x < width; x++) {
      row.insertCell(x).data = {}
    }
  }

  this.table = table
  this.width = width
  this.height = height
  this.mineCount = 0
  this.progress = 0
  this.security = 0
  this.locked = true
  this.selection = null

  common.setSize(table, this.getFullWidth(), this.getFullHeight())
}

// Constants
MineField.CELL_WIDTH = 16
MineField.CELL_HEIGHT = 16

// Get full width
MineField.prototype.getFullWidth = function() {
  return ((MineField.CELL_WIDTH + 1) * this.width + 1)
}

// Get full height
MineField.prototype.getFullHeight = function() {
  return ((MineField.CELL_HEIGHT + 1) * this.height + 1)
}

// Get cell
MineField.prototype.getCell = function(x, y) {
  if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
    return this.table.rows[y].cells[x]
  }

  return null
}

// Get cells
MineField.prototype.getCells = function(cell, cells) {
  if (!cells) {
    cells = []
  }

  const rows = this.table.rows
  const x = cell.cellIndex
  const y = cell.parentNode.rowIndex
  let cells1, cells2, cells3

  if (y >= 1) {
    cells1 = rows[y - 1].cells
  }

  // eslint-disable-next-line prefer-const
  cells2 = rows[y].cells

  if (y + 1 < this.height) {
    cells3 = rows[y + 1].cells
  }

  if (cells1) {
    if (x >= 1) {
      cells.push(cells1[x - 1])
    }

    cells.push(cells1[x])

    if (x + 1 < this.width) {
      cells.push(cells1[x + 1])
    }
  }

  if (x >= 1) {
    cells.push(cells2[x - 1])
  }

  if (x + 1 < this.width) {
    cells.push(cells2[x + 1])
  }

  if (cells3) {
    if (x >= 1) {
      cells.push(cells3[x - 1])
    }

    cells.push(cells3[x])

    if (x + 1 < this.width) {
      cells.push(cells3[x + 1])
    }
  }

  return cells
}

// Get content
MineField.prototype.getContent = function(cell) {
  return cell.data.content
}

// Is empty
MineField.prototype.isEmpty = function(cell) {
  return !cell.data.content
}

// Is number
MineField.prototype.isNumber = function(cell) {
  return (cell.data.content > 0)
}

// Is mine
MineField.prototype.isMine = function(cell) {
  return (cell.data.content < 0)
}

// Is visible
MineField.prototype.isVisible = function(cell) {
  return cell.data.visible
}

// Is flagged
MineField.prototype.isFlagged = function(cell) {
  return cell.data.flagged
}

// Set visible
MineField.prototype.setVisible = function(cell, visible) {
  const data = cell.data

  if (visible || visible == null) {
    if (data.visible) return

    if (data.content < 0) {
      cell.innerHTML = 'X'
      common.addClass(cell, 'mine')
    } else if (data.content > 0) {
      cell.innerHTML = data.content
      this.progress++
    } else {
      cell.innerHTML = ''
      this.progress++
    }

    common.addClass(cell, 'visible')
    data.visible = true
  } else {
    if (!data.visible) return

    if (data.content >= 0) {
      this.progress--
    }

    cell.innerHTML = ''
    common.removeClass(cell, 'visible')

    data.visible = false
  }
}

// Set flagged
MineField.prototype.setFlagged = function(cell, flagged) {
  const data = cell.data

  if (data.visible) return

  if (flagged || flagged == null) {
    if (data.flagged) return

    common.addClass(cell, 'flagged')
    cell.innerHTML = '!'

    if (data.content < 0) {
      this.security++
    }

    data.flagged = true
  } else {
    if (!data.flagged) return

    common.removeClass(cell, 'flagged')
    cell.innerHTML = ''

    if (data.content < 0) {
      this.security--
    }

    data.flagged = false
  }
}

// Setup
MineField.prototype.setup = function(mineCount) {
  const rows = this.table.rows
  const length = this.width * this.height
  let x, y, cell, cells, data

  for (y = 0; y < this.height; y++) {
    cells = rows[y].cells

    for (x = 0; x < this.width; x++) {
      cell = cells[x]
      data = cell.data
      cell.className = ''
      cell.innerHTML = ''
      data.content = 0
      data.visible = false
      data.flagged = false
    }
  }

  if (mineCount >= length) {
    mineCount = length - 1
  }

  this.mineCount = mineCount
  this.progress = 0
  this.security = 0
  this.locked = false
  this.selection = null
}

// Place mines
MineField.prototype.placeMines = function(cell) {
  const rows = this.table.rows
  const length = this.width * this.height - 1
  const slots = new Array(length)
  const clear = cell.cellIndex + cell.parentNode.rowIndex * this.width
  let x, y, cells, data

  for (let i = 0; i < length; i++) {
    if (i < clear) {
      slots[i] = i
    } else {
      slots[i] = i + 1
    }
  }

  for (let count = this.mineCount; count > 0; count--) {
    let i = slots.splice(Math.floor(Math.random() * slots.length), 1)[0]
    x = i % this.width
    y = Math.floor(i / this.width)
    cell = rows[y].cells[x]
    cell.data.content = -1
    cells = this.getCells(cell)

    for (i = 0; i < cells.length; i++) {
      data = cells[i].data

      if (data.content >= 0) {
        data.content++
      }
    }
  }
}

// Select cell
MineField.prototype.selectCell = function(cell) {
  let data = cell.data

  if (data.visible || data.flagged) return false

  this.selection = cell

  if (data.content) {
    this.setVisible(cell, true)
    return true
  }

  const cells = [cell]

  while (cells.length) {
    cell = cells.pop()
    data = cell.data

    if (!data.visible && !data.flagged) {
      this.setVisible(cell, true)

      if (!data.content) {
        this.getCells(cell, cells)
      }
    }
  }

  return true
}

// Show all
MineField.prototype.showAll = function() {
  const rows = this.table.rows
  let x, y, cells

  for (y = 0; y < this.height; y++) {
    cells = rows[y].cells

    for (x = 0; x < this.width; x++) {
      this.setVisible(cells[x], true)
    }
  }
}

// Get progress
MineField.prototype.getProgress = function() {
  return (this.progress / (this.width * this.height))
}

// Cleared
MineField.prototype.cleared = function() {
  if (this.progress + this.security === this.width * this.height) {
    this.locked = true
    return true
  }

  return false
}

// Detonated
MineField.prototype.detonated = function() {
  const cell = this.selection

  if (cell && cell.data.content < 0) {
    this.locked = true
    return true
  }

  return false
}
