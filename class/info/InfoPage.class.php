<?php
namespace hypoman\info;
use hypoman\ThemePage;

/**
 * Info page class.
 * 
 * @author Tomas
 */
class InfoPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('info', 'Info');
    $this->addScript('browser.js');
    $this->addScript();
  }
}
