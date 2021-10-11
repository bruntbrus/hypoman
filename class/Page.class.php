<?php
namespace hypoman;
use hypoman\account\User;

/**
 * Page class.
 * 
 * @author Tomas
 */
class Page {

  const TITLE   = 'HyPoMaN';
  const AUTHOR  = 'Tomas Enarsson';
  const ARTIST  = 'Daniel Ottosson';
  const CHARSET = 'utf-8';

  /**
   * @var array
   */
  public static $categories = array(
    'start'     => 'Start',
    'projects'  => 'Projekt',
    'tools'     => 'Verktyg',
    'gallery'   => 'Galleri',
    'info'      => 'Info',
    'downloads' => 'Filer',
    'links'     => 'Länkar'
  );

  /**
   * @var string
   */
  public $name;

  /**
   * @var string
   */
  public $title;

  /**
   * @var string
   */
  public $template;

  /**
   * @var string
   */
  public $author;

  /**
   * @var string
   */
  public $artist;

  /**
   * @var string
   */
  public $charset;

  /**
   * @var string
   */
  public $keywords;

  /**
   * @var string
   */
  public $description;

  /**
   * @var string
   */
  public $icon;

  /**
   * @var string
   */
  public $revised;

  /**
   * @var array
   */
  public $styles;

  /**
   * @var array
   */
  public $scripts;

  /**
   * @var string
   */
  public $location;

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Get template file.
   * 
   * @param string $template
   * @return string
   */
  public static function getTemplateFile($template) {
    return TEMPLATE_DIR.DS.$template.TEMPLATE_EXT;
  }

  /**
   * Get image URL.
   * 
   * @param string $name
   * @return string
   */
  public static function getImageURL($name) {
    return IMAGE_BASE.$name;
  }

  /**
   * Construct.
   * 
   * @param string $name
   * @param string $title
   * @param string $template
   */
  public function __construct($name, $title, $template = '_blank') {
    $this->name        = $name;
    $this->title       = $title;
    $this->template    = $template;
    $this->author      = self::AUTHOR;
    $this->artist      = self::ARTIST;
    $this->charset     = self::CHARSET;
    $this->keywords    = '';
    $this->description = '';
    $this->icon        = IMAGE_BASE.'favicon.png';
    $this->revised     = date('Y-m-d', filemtime(self::getTemplateFile($template)));
    $this->styles      = array();
    $this->scripts     = array();
    $this->location    = substr(getPathInfo(), 1);
  }

  /**
   * Add style.
   * 
   * @param string $style
   */
  public function addStyle($style = '') {
    if ($style == '') {
      $style = $this->name.'_page.css';
    }
    $this->styles[] = STYLE_BASE.$style;
  }

  /**
   * Add script.
   * 
   * @param string $script
   */
  public function addScript($script = '') {
    if ($script == '') {
      $script = $this->name.'_page.js';
    }
    $this->scripts[] = SCRIPT_BASE.$script;
  }

  /**
   * Handle request.
   */
  public function handleRequest() {
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($method) {
      case 'GET':  $this->onGET();  break;
      case 'POST': $this->onPOST(); break;
      default: throw new \Exception("Felaktig metod: $method");
    }
  }

  /**
   * On GET request.
   */
  protected function onGET() {}

  /**
   * On POST request.
   */
  protected function onPOST() {}

  /**
   * Get base location.
   * 
   * @return string
   */
  public function getBaseLocation() {
    if (preg_match('|^\w*|', $this->location, $matches)) {
      $location = $matches[0];
    } else {
      $location = '';
    }
    return $location;
  }

  /**
   * Internal links.
   * 
   * @param array $list
   * @return array
   */
  public function internalLinks(array $list) {
    $links = array();
    foreach ($list as $name => $data) {
      list($title, $description) = explode(': ', $data);
      $links[] = array(
        'url'         => $this->location.'/'.$name,
        'title'       => $title,
        'description' => $description
      );
    }
    return $links;
  }

  /**
   * Include template.
   * 
   * @param string $template
   * @param array $data
   */
  public function includeTemplate($template, array $data = array()) {
    $require = function($page, $user) use($template, $data) {
      require Page::getTemplateFile($template);
    };
    $require($this, User::getActiveUser());
  }

  /**
   * Publish.
   * 
   * @param array $data
   */
  public function publish(array $data = array()) {
    $this->includeTemplate($this->template, $data);
  }
}
