<?php
namespace hypoman\links;
use hypoman\ThemePage;
use hypoman\database\Database;

/**
 * Link page class.
 * 
 * @author Tomas
 */
class LinkPage extends ThemePage {

  /**
   * @var array
   */
  public $linkCategories;

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('links', 'Länkar');
    $sql = "SELECT `id`,`title` FROM `linkcat` ORDER BY `title`";
    $pdo = Database::getConnection();
    try {
      $pst = $pdo->query($sql);
    } catch (\Exception $exception) {
      $this->linkCategories = array();
      return;
    }
    $categories = $pst->fetchAll(\PDO::FETCH_ASSOC);
    $sql = "SELECT `url`,`title`,`description` FROM `link` ".
      "WHERE `linkcat_id`=? ORDER BY `title`";
    $pst = $pdo->prepare($sql);
    $this->linkCategories = array();
    foreach ($categories as $category) {
      $pst->execute(array($category['id']));
      $category['links'] = $pst->fetchAll(\PDO::FETCH_ASSOC);
      $this->linkCategories[] = $category;
    }
  }
}
