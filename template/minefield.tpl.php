<? namespace hypoman; ?>
<form action="">
  <div class="panel control">
    <span>
      Storlek:
      <input type="text" name="fieldWidth" value="30" size="2" maxlength="2" />
      X
      <input type="text" name="fieldHeight" value="20" size="2" maxlength="2" />
    </span>
    <span>
      Antal minor:
      <input type="text" name="mineCount" value="100" size="3" maxlength="3" />
    </span>
    <input type="button" name="newField" value="Nytt fält" />
  </div>
  <div class="board"></div>
  <div class="panel status">
    <span></span>
    <span></span>
  </div>
</form>