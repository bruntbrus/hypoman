<?php
namespace hypoman\gallery;
use hypoman\ThemePage;
use hypoman\database\Database;

/**
 * Gallery page class.
 * 
 * @author Tomas
 */
class GalleryPage extends ThemePage {

  /**
   * @var array
   */
  public $dirs;

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('gallery', 'Galleri');
    $sql   = "SELECT `username` FROM `account`";
    $pdo   = Database::getConnection();
    $pst   = $pdo->query($sql);
    $names = $pst->fetchAll(\PDO::FETCH_NUM);
    $this->dirs = array();
    foreach ($names as $name) {
      $this->dirs[] = $name[0];
    }
    changedir(-1);
  }
}
