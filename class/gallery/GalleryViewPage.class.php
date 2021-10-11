<?php
namespace hypoman\gallery;
use hypoman\ThemePage;

/**
 * Gallery view page class.
 * 
 * @author Tomas
 */
class GalleryViewPage extends Page {

  /**
   * @var string
   */
  private $category;

  /**
   * @var string
   */
  private $image;

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    // Get category and image
    $category = _GET('category');
    $image    = _GET('image');
    if ($category == '' || strpos($category, '/') !== false) {
      die('Felaktig kategori');
    }
    if ($image == '' || strpos($image, '/') !== false) {
      die('Felaktig bild');
    }
    parent::__construct('gallery_view', 'Bild', "$category / $image");
    $this->category = $category;
    $this->image    = $image;
  }

  /**
   * Content HTML.
   */
  public function content() {
    // Fit image to page
    $url = $this->category.'/'.$this->image;
    list($width, $height) = getimagesize($url);
    $maxWidth = self::CONTENT_WIDTH;
    if ($width > $maxWidth) {
      $height = round($height * $maxWidth / $width);
      $width  = $maxWidth;
    }
    echo '<img class="fullsize" alt="'.$this->image.'" src="'.$url.'" '.
      'width="'.$width.'" height="'.$height.'" />';
  }
}
