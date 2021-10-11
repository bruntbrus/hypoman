<? namespace hypoman; ?>
<form id="controls" action="">
  <fieldset class="frame">
    <legend>Frame</legend>
    <div class="line">
      <input type="text" id="frameTitle" name="frameTitle" value="Frame" />
      <input type="button" id="frameNew" value="New" />
    </div>
    <ul>
      <li>Features:</li>
      <li><label><input type="checkbox" name="features" />All</label></li>
      <li><label><input type="checkbox" name="features" />Menubar</label></li>
      <li><label><input type="checkbox" name="features" />Statusbar</label></li>
      <li><label><input type="checkbox" name="features" />Resizable</label></li>
      <li><label><input type="checkbox" name="features" />Content</label></li>
    </ul>
  </fieldset>
  <fieldset class="transition">
    <legend>Transition</legend>
    <div class="line">
      <label>Time:<input type="text" name="transTime" /></label>
    </div>
    <div class="line">
      <label>FPS:<input type="text" id="transFPS" name="transFPS" /></label>
    </div>
    <input type="button" id="transChange" value="Change" />
  </fieldset>
</form>