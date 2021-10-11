<?php
namespace hypoman\tools;
use hypoman\ThemePage;

/**
 * Password page class.
 * 
 * @author Tomas
 */
class PasswordPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('password', 'Password');
    $this->addScript();
  }
}
