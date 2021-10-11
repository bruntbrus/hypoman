<?php
namespace hypoman\tools;
use hypoman\ThemePage;

/**
 * Calculator page class.
 * 
 * @author Tomas
 */
class CalculatorPage extends ThemePage {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('calculator', 'Calculator');
    $this->addScript('Calculator.js');
    $this->addScript();
  }
}
