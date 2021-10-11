<?php
/**
 * Configuration.
 * 
 * @author Tomas
 */
namespace hypoman;

/*
 * Globals.
 */
if (!defined('DS')) {
  define('DS', DIRECTORY_SEPARATOR);
}
if (!defined('PS')) {
  define('PS', PATH_SEPARATOR);
}

/**
 * Namespace define.
 * 
 * @param string $name
 * @param mixed $value
 */
function nsdef($name, $value) {
  define(__NAMESPACE__."\\$name", $value);
}

/*
 * Directories.
 */
nsdef('ROOT_DIR',     dirname(__DIR__));
nsdef('CLASS_DIR',    ROOT_DIR.DS.'class');
nsdef('TEMPLATE_DIR', ROOT_DIR.DS.'template');
nsdef('USER_DIR',     ROOT_DIR.DS.'user');

/*
 * Base locations.
 */
nsdef('BASE',        preg_replace('|[^/]+$|', '', $_SERVER['SCRIPT_NAME']));
nsdef('IMAGE_BASE',  BASE.'images/');
nsdef('STYLE_BASE',  BASE.'css/');
nsdef('SCRIPT_BASE', BASE.'js/');

/*
 * File extensions.
 */
const CLASS_EXT    = '.class.php';
const INCLUDE_EXT  = '.inc.php';
const TEMPLATE_EXT = '.tpl.php';

/*
 * Libraries.
 */
nsdef('JQUERY_URL', SCRIPT_BASE.'jquery-1.6.1.min.js');

/*
 * Error reporting.
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);