<?php
namespace hypoman\tools;
use hypoman\ThemePage;

/**
 * Editor page class.
 * 
 * @author Tomas
 */
class EditorPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('editor', 'Editor');
    $this->addScript();
  }
}
