<?php
namespace hypoman;

/**
 * Start page class.
 * 
 * @author Tomas
 */
class StartPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('start', 'Start');
    $this->keywords    = 'Projekt, Verktyg, JavaScript';
    $this->description = 'Diverse kodprojekt och experminent.';
  }
}
