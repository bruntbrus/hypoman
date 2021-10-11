<? namespace hypoman; ?>
<form class="standard" action="register" method="post">
  <input type="text" name="username" placeholder="Användarnamn" maxlength="20" required="required" />
  <input type="password" name="password" placeholder="Lösenord" maxlength="20" required="required" />
  <input type="password" name="repeatpw" placeholder="Upprepa lösenord" maxlength="20" required="required" />
  <input type="email" name="email" placeholder="E-post" maxlength="40" />
  <button type="submit" name="submit" value="register">Registrera</button>
</form>