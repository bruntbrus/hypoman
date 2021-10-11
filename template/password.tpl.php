<? namespace hypoman; ?>
<form action="">
  <div class="input">
    <label>Storlek: <input type="text" name="size" value="10" size="2" maxlength="2" /></label>
    <p>
      <label><input type="checkbox" name="options" value="upper" checked="checked" />Versaler</label>
      <label><input type="checkbox" name="options" value="digit" checked="checked" />Siffror</label>
      <label><input type="checkbox" name="options" value="symbol" checked="checked" />Symboler</label>
    </p>
    <input type="button" name="generate" value="Generera" />
  </div>
  <div class="output">
    <textarea id="textArea" rows="10" cols="20" readonly="readonly"></textarea>
  </div>
</form>