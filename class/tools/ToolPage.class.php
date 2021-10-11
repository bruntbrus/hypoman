<?php
namespace hypoman\tools;
use hypoman\ThemePage;

/**
 * Tool page class.
 * 
 * @author Tomas
 */
class ToolPage extends ThemePage {

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
    parent::__construct('tools', 'Verktyg');
    $this->links = $this->internalLinks(array(
      'calculator' => 'Calculator: Kalkylator med många funktioner.',
      'editor'     => 'Editor: Textredigering.',
      'packer'     => 'Packer: Komprimering av JavaScript.',
      'password'   => 'Password: Lösenordsgenerator.',
      'eval'       => 'Eval: Mycket användbar evaluator.'
    ));
  }
}
