<?php
namespace hypoman\tools;
use hypoman\Page;

/**
 * Eval page class.
 *
 * @author Tomas
 */
class EvalPage extends Page {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('eval', 'eval');
    $this->addStyle();
    $this->addScript();
  }
}
