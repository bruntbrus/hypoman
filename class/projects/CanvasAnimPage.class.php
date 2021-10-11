<?php
namespace hypoman\projects;
use hypoman\ThemePage;

/**
 * Canvas anim page.
 * 
 * @author Tomas
 */
class CanvasAnimPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('canvas_anim', 'CanvasAnim');
    $this->addScript();
  }
}
