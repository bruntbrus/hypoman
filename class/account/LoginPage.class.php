<?php
namespace hypoman\account;
use hypoman\ThemePage;

/**
 * Login page class.
 * 
 * @author Tomas
 */
class LoginPage extends ThemePage {

  /**
   * @var string
   */
  public $error = '';

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function  __construct() {
    parent::__construct('login', 'Logga in');
  }

  /**
   * On GET request.
   */
  protected function onGET() {
    if (_GET('action') == 'logout') {
      User::logout();
      redirect('.');
      exit;
    }
  }

  /**
   * On POST request.
   */
  protected function onPOST() {
    $action = _POST('action');
    if ($action == '' || $action == 'login') {
      $username = _POST('username');
      $password = _POST('password');
      $user     = User::getUserByName($username);
      if ($user && User::login($user, $password)) {
        redirect(\hypoman\BASE);
        exit;
      }
      $this->error = 'Felaktigt användarnamn eller lösenord!';
    } else if ($action == 'logout') {
      User::logout();
    }
  }
}
