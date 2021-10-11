<? namespace hypoman; ?>
<form class="input" action="">
  <div class="title">Input</div>
  <textarea class="focus" name="input" cols="80" rows="15" wrap="off"></textarea>
  <div class="panel">
    <div class="left">
      <label>Length:
        <input type="text" name="charCount" value="0" size="6" readonly="readonly" />
      </label>
      <label>
        <input type="radio" name="types" value="JS" checked="checked" />
        JavaScript
      </label>
    </div>
    <div class="right">
      <button name="pack" disabled="disabled">Pack!</button>
      <button name="clear">Clear</button>
    </div>
  </div>
</form>
<form class="output" action="">
  <div class="title">Output</div>
  <textarea name="output" cols="80" rows="15" wrap="off" readonly="readonly"></textarea>
  <div class="panel">
    <div class="left">
      <label>Length:
        <input type="text" name="charCount" size="6" readonly="readonly" />
      </label>
      <label>Ratio:
        <input type="text" name="ratio" value="" size="6" readonly="readonly" />
      </label>
    </div>
    <div class="right">
      <label class="disabled">
        <input type="checkbox" name="encode" disabled="disabled" />Encode
      </label>
      <button name="clear">Clear</button>
    </div>
  </div>
</form>