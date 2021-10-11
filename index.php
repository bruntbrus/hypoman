<?php
/**
 * Index.
 * 
 * @author Tomas
 */
namespace hypoman;

require_once 'include/common.inc.php';

/*
 * Select page from path info.
 */
$pathInfo = getPathInfo();
switch ($pathInfo) {
  case '/':
  case '/start':
    $class = 'StartPage';
    break;
  case '/downloads':
    $class = 'downloads\\DownloadPage';
    break;
  case '/gallery':
    $class = 'gallery\\GalleryPage';
    break;
  case '/gallery/thumbs':
    $class = 'gallery\\GalleryThumbPage';
    break;
  case '/gallery/view':
    $class = 'gallery\\GalleryViewPage';
    break;
  case '/info':
    $class = 'info\\InfoPage';
    break;
  case '/links':
    $class = 'links\\LinkPage';
    break;
  case '/register':
    $class = 'account\\RegisterPage';
    break;
  case '/login':
    $class = 'account\\LoginPage';
    break;
  case '/projects':
    $class = 'projects\\ProjectPage';
    break;
  case '/projects/canvas':
    $class = 'projects\\CanvasPage';
    break;
  case '/projects/canvas_anim':
    $class = 'projects\\CanvasAnimPage';
    break;
  case '/projects/minefield':
    $class = 'projects\\MineFieldPage';
    break;
  case '/projects/mydesktop':
    $class = 'projects\\MyDesktopPage';
    break;
  case '/tools':
    $class = 'tools\\ToolPage';
    break;
  case '/tools/calculator':
    $class = 'tools\\CalculatorPage';
    break;
  case '/tools/editor':
    $class = 'tools\\EditorPage';
    break;
  case '/tools/eval':
    $class = 'tools\\EvalPage';
    break;
  case '/tools/packer':
    $class = 'tools\\PackerPage';
    break;
  case '/tools/password':
    $class = 'tools\\PasswordPage';
    break;
  default: throw new \Exception('Sidan kunde inte hittas: '.$pathInfo);
}

/*
 * Display page.
 */
$class = __NAMESPACE__."\\$class";
$page  = new $class();
$page->handleRequest();
$page->publish();
