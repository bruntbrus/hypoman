<?php
namespace hypoman\downloads;
use hypoman\ThemePage;

/**
 * Download page class.
 * 
 * @author Tomas
 */
class DownloadPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('downloads', 'Filer');
  }
}
