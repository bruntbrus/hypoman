<? namespace hypoman; ?>
<form class="standard" action="login" method="post">
  <input type="text" name="username" placeholder="Användarnamn" maxlength="20" required="required" />
  <input type="password" name="password" placeholder="Lösenord" maxlength="20" required="required" />
  <button type="submit" name="submit" value="login">Logga in</button>
</form>
<? if ($page->error != '') { ?>
  <p class="error"><?= $page->error ?></p>
<? }//if ?>