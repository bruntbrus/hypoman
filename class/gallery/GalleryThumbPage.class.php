<?php
namespace hypoman\gallery;
use hypoman\ThemePage;

/**
 * Gallery thumb page class.
 * 
 * @author Tomas
 */
class GalleryThumbPage extends ThemePage {

  const THUMB_WIDTH   = 160;
  const THUMB_HEIGHT  = 120;
  const THUMB_QUALITY = 75;

  /**
   * @var string
   */
  public $category;

  /**
   * @var array
   */
  public $thumbs;

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Construct.
   */
  public function __construct() {
    parent::__construct('gallery_thumbs', 'Bilder');
    $category = _GET('category');
    if ($category != '' && strpos($category, '/') !== false) {
      $category = '';
    }
    if ($category != '' && !changedir(\hypoman\USER_DIR.DS.$category)) {
      $category = '';
    }
    $this->category = $category;
    $this->thumbs   = array();
    foreach (glob('*.{jpg,jpeg}') as $file) {
      $name = substr($file, 0, strrpos('.'));
      try {
        list($imageWidth, $imageHeight, $imageType) = getimagesize($file);
      } catch (\Exception $exception) {
        continue;
      }
      if ($imageType != IMAGETYPE_JPEG) {
        continue;
      }
      $thumb = "thumbs/$file";
      if (file_exists($thumb)) {
        list($thumbWidth, $thumbHeight) = getimagesize($thumb);
      } else {
        $image = imagecreatefromjpeg($file);
        if (!$image) {
          continue;
        }
        $thumbHeight = round($imageHeight * self::THUMB_WIDTH / $imageWidth);
        if ($thumbHeight <= self::THUMB_HEIGHT) {
          $thumbWidth = self::THUMB_WIDTH;
        } else {
          $thumbWidth  = round($imageWidth * self::THUMB_HEIGHT / $imageHeight);
          $thumbHeight = self::THUMB_HEIGHT;
        }
        $thumbImage = imagecreatetruecolor($thumbWidth, $thumbHeight);
        imagecopyresampled(
          $thumbImage, $image, 0, 0, 0, 0,
          $thumbWidth, $thumbHeight,
          $imageWidth, $imageHeight
        );
        imagejpeg($thumbImage, $thumb, self::THUMB_QUALITY);
      }
      $x = round((self::THUMB_WIDTH  - $thumbWidth)  / 2);
      $y = round((self::THUMB_HEIGHT - $thumbHeight) / 2);
      $style = "left: {$x}px; top: {$y}px;";
      $this->thumbs[] = array(
        'file'        => $file,
        'width'       => $thumbWidth,
        'height'      => $thumbHeight,
        'imageWidth'  => $imageWidth,
        'imageHeight' => $imageHeight,
        'style'       => $style
      );
    }
    changedir(-1);
  }
}
