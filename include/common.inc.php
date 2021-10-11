<?php
/**
 * Common include.
 * 
 * @author Tomas
 */
require_once 'config.inc.php';

/**
 * GET value.
 * 
 * @param string $name
 * @param mixed $default
 * @return mixed
 */
function _GET($name, $default = '') {
  $value = @$_GET[$name];
  return (isset($value) ? $value : $default);
}

/**
 * POST value.
 * 
 * @param string $name
 * @param mixed $default
 * @return mixed
 */
function _POST($name, $default = '') {
  $value = @$_POST[$name];
  return (isset($value) ? $value : $default);
}

/**
 * Get path info.
 * 
 * @return string
 */
function getPathInfo() {
  $pathInfo = @$_SERVER['PATH_INFO'];
  if (isset($pathInfo)) {
    $last = strlen($pathInfo) - 1;
    if ($last > 0 && $pathInfo[$last] == '/') {
      $pathInfo = substr($pathInfo, 0, $last);
    }
  } else {
    $pathInfo = '/';
  }
  return $pathInfo;
}

/**
 * Redirect.
 * 
 * @param mixed $location
 */
function redirect($location) {
  if ($location === -1) {
    $location = $_SERVER['HTTP_REFERER'];
  }
  header("Location: $location");
}

/**
 * Change directory.
 * 
 * @param string|int $dir
 * @return string|bool
 */
function changedir($dir) {
  static $history = array();
  $prev = getcwd();
  if ($dir === -1) {
    $dir = array_pop($history);
    if ($dir === null) {
      return false;
    }
  }
  if (!@chdir($dir)) {
    return false;
  }
  $history[] = $prev;
  return $prev;
}

/*
 * Class autoloader.
 */
spl_autoload_register(function($class) {
  list($first, $remainder) = explode('\\', $class, 2);
  if ($first == 'hypoman') {
    $path = str_replace('\\', DS, $remainder);
    require_once \hypoman\CLASS_DIR.DS.$path.\hypoman\CLASS_EXT;
    if (method_exists($class, 'init')) {
      call_user_func("$class::init");
    }
  }
});

/*
 * Output buffering.
 */
ob_start(function($output) {
  return preg_replace('/^\s+/m', '', $output);
});

/*
 * Begin session.
 */
session_start();