<?php
namespace hypoman\projects;
use hypoman\ThemePage;

/**
 * Canvas page class.
 * 
 * @author Tomas
 */
class CanvasPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('canvas', 'Canvas');
    $this->addScript();
  }
}
