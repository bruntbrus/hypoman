<?php
namespace hypoman\account;
use hypoman\ThemePage;

/**
 * Register page class.
 * 
 * @author Tomas
 */
class RegisterPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function  __construct() {
    parent::__construct('register', 'Registrera');
  }

  /**
   * On POST request.
   */
  protected function onPOST() {
    if (_POST('submit') != 'register') {
      throw new \Exception('Registrering ej tillåten');
    }
    $username = _POST('username');
    $password = _POST('password');
    $repeatpw = _POST('repeatpw');
    if ($username == '' || $password == '' || $repeatpw == '') {
      throw new \Exception('Nödvändig information saknas');
    }
    if ($password != $repeatpw) {
      throw new \Exception('Lösenorden är olika');
    }
    if (User::getUserByName($username)) {
      throw new \Exception('Namnet är redan taget');
    }
    $email = _POST('email');
    $user  = new User(null, $username, sha1($password), $email);
    $user->persist();
    User::login($user);
    redirect(\hypoman\BASE);
    exit;
  }
}
