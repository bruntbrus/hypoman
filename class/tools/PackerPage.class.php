<?php
namespace hypoman\tools;
use hypoman\ThemePage;

/**
 * Packer page class.
 * 
 * @author Tomas
 */
class PackerPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('packer', 'Packer');
    $this->addScript('jsPack.js');
    $this->addScript();
  }
}
