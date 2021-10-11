<?php
namespace hypoman;

/**
 * Theme page class.
 * 
 * @author Tomas
 */
class ThemePage extends Page {

  const TEMPLATE      = '_main';
  const CONTENT_WIDTH = 990;

  /**
   * @var string
   */
  public $theme = 'default';

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   * 
   * @param string $name
   * @param string $title
   */
  public function __construct($name, $title) {
    parent::__construct($name, $title, self::TEMPLATE);
    $this->styles[]  = STYLE_BASE.'style.css';
    $this->scripts[] = JQUERY_URL;
    $this->scripts[] = SCRIPT_BASE.'Page.class.js';
    $this->scripts[] = SCRIPT_BASE.'main.js';
  }
}
