<?php
namespace hypoman\projects;
use hypoman\Page;

/**
 * MyDesktop page class.
 *
 * @author Tomas
 */
class MyDesktopPage extends Page {

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('mydesktop', 'MyDesktop');
    $this->addStyle('DownRoller.css');
    $this->addStyle('PopupMenu.css');
    $this->addStyle('MyFrame.css');
    $this->addStyle('MyDesktop.css');
    //$this->addScript('Animation.js');
    //$this->addScript('DragHandler.js');
    $this->addScript('DownRoller.js');
    $this->addScript('PopupMenu.js');
    $this->addScript('MyFrame.js');
    $this->addScript('MyDesktop.js');
  }
}
