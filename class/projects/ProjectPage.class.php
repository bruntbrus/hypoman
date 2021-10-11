<?php
namespace hypoman\projects;
use hypoman\ThemePage;

/**
 * Project page class.
 * 
 * @author Tomas
 */
class ProjectPage extends ThemePage {

  /**
   * @var array
   */
  public $links;

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('projects', 'Projekt');
    $this->links = $this->internalLinks(array(
      'mydesktop'   => 'MyDesktop: Virtuellt skrivbord.',
      'minefield'   => 'MineField: Klassisk minröj.',
      'canvas'      => 'Canvas: Diverse finesser i Canvas.',
      'canvas_anim' => 'CanvasAnim: Animering i Canvas.'
    ));
  }
}
