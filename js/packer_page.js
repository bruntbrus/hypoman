/* global common, jsPack */

window.main = new function() {
  let source, packed, encoded

  // Document ready
  common.addEventListener(document, 'ready', function() {
    const inForm = document.getElementById('input')
    const outForm = document.getElementById('output')

    inForm.input.onkeyup = function() {
      const length = inForm.input.value.length

      inForm.charCount.value = length

      if (length > 0) {
        inForm.pack.disabled = false
      } else {
        inForm.pack.disabled = true
      }
    }

    inForm.pack.onclick = function() {
      source = inForm.input.value
      encoded = null
      outForm.encode.checked = false

      try {
        packed = jsPack(source)
      } catch (ex) {
        packed = null
        outputError(ex)
        return
      }

      setOutput(source, packed)
    }

    inForm.clear.onclick = function() {
      inForm.input.value = ''
      inForm.charCount.value = '0'
      inForm.input.focus()
    }

    outForm.encode.onclick = function() {
      if (this.checked) {
        if (!encoded) {
          try {
            encoded = jsPack.encode(outForm.output.value)
          } catch (ex) {
            outputError(ex)
            return
          }
        }

        setOutput(source, encoded)
      } else {
        setOutput(source, packed)
      }
    }

    outForm.clear.onclick = function() {
      outForm.output.value = ''
      outForm.charCount.value = ''
      outForm.ratio.value = ''
      outForm.encode.checked = false

      checkEnabled(outForm.encode, false)

      source = null
      packed = null
      encoded = null

      outForm.output.focus()
    }
  })

  // Set output
  function setOutput(input, output) {
    const form = document.getElementById('output')
    form.output.value = output

    if (input.length && output.length) {
      const ratio = Math.round(1000 * output.length / input.length) / 10

      form.charCount.value = output.length
      form.ratio.value = ratio + '%'

      checkEnabled(form.encode)
    } else if (!input.length) {
      outputError('* No input! *')
    } else {
      outputError('* No output! *')
    }
  }

  // Output error
  function outputError(error) {
    const form = document.getElementById('output')

    form.output.value = error
    form.charCount.value = ''
    form.ratio.value = ''

    checkEnabled(form.encode, false)
  }

  // Check enabled
  function checkEnabled(check, enabled) {
    if (enabled === null) { enabled = true }

    check.disabled = !enabled
    check.parentNode.className = (enabled ? '' : 'disabled')
  }
}()
