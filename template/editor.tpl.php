<? namespace hypoman; ?>
<form action="">
  <div class="toolbar">
    <div class="buttons">
      <input type="button" name="newButton" value="Nytt" />
    </div>
    <div class="options">
      <select name="fontSelect">
        <option selected="selected">monospace</option>
        <option>sans-serif</option>
        <option>serif</option>
      </select>
      <select name="sizeSelect">
        <option>8pt</option>
        <option>9pt</option>
        <option selected="selected">10pt</option>
        <option>11pt</option>
        <option>12pt</option>
        <option>14pt</option>
        <option>16pt</option>
        <option>20pt</option>
        <option>24pt</option>
        <option>32pt</option>
      </select>
      <select name="colorSelect">
        <option selected="selected">white</option>
        <option>red</option>
        <option>green</option>
        <option>blue</option>
        <option>yellow</option>
        <option>gray</option>
      </select>
    </div>
  </div>
  <textarea class="focus" name="textArea" rows="" cols="" wrap="off"></textarea>
  <div class="statusbar">
    <span>&nbsp;</span>
    <span>&nbsp;</span>
  </div>
</form>