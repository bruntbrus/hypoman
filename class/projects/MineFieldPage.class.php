<?php
namespace hypoman\projects;
use hypoman\ThemePage;

/**
 * MineField page class.
 * 
 * @author Tomas
 */
class MineFieldPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('minefield', 'MineField');
    $this->addScript();
    $this->addScript('MineField.js');
  }
}
