<?php
/**
 * Page generator.
 * 
 * @author Tomas
 */
namespace hypoman;

require_once '../common.inc.php';

$markup  = _GET('markup', 'html');
$version = _GET('version');
$layout  = _GET('layout');
$charset = _GET('charset', 'utf-8');
switch ($markup) {
  case 'html':
    if ($version == '') {
      $version = '4';
    }
    break;
  case 'xhtml':
    if ($version == '') {
      $version = '1.0';
    }
    break;
}
switch ("$markup-$version-$layout") {
  case 'html-4-':
    $doctype = '';
    $end     = '>';
    break;
  case 'html-4-strict':
    $doctype = 'HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"';
    $version = '4.01';
    $end     = '>';
    break;
  case 'html-4-transitional':
    $doctype = 'HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"';
    $version = '4.01';
    $end     = '>';
    break;
  case 'html-4-frameset':
    $doctype = 'HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd"';
    $version = '4.01';
    $end     = '>';
    break;
  case 'xhtml-1.0-strict':
    $doctype = 'HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"';
    $end     = ' />';
    break;
  case 'xhtml-1.0-transitional':
    $doctype = 'HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"';
    $end     = ' />';
    break;
  case 'xhtml-1.0-frameset':
    $doctype = 'HTML PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"';
    $end     = ' />';
    break;
  case 'xhtml-1.1-strict':
    $doctype = 'HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"';
    $end     = ' />';
    break;
  case 'html-5-':
    $doctype = 'HTML';
    $end     = ' />';
    break;
  default: die('Invalid page type');
}
if ($markup == 'xhtml') {
  echo '<?xml version="'.$version.'" encoding="'.$charset.'"?>'."\n";
}
if ($doctype != '') {
  echo "<!DOCTYPE $doctype>\n";
  $title = strtoupper($markup).' '.$version;
  if ($layout != '') {
    $title .= ' '.ucfirst($layout);
  }
} else {
  $title = 'None';
}
if ($markup == 'xhtml') {
  echo '<html xmlns="http://www.w3.org/1999/xhtml">'."\n";
} else {
  echo "<html>\n";
}
echo "<head>\n";
echo "<title>$title</title>\n";
echo '<meta http-equiv="Content-Type" content="text/html; charset='.$charset.'"'."$end\n";
echo "</head>\n";
if ($layout == 'frameset') {
  echo '<frameset cols="50%,50%">'."\n";
  $frame = '<frame src="page.php?markup='.$markup.'&layout=strict"'.$end;
  echo "$frame\n$frame\n";
  echo "</frameset>\n";
} else {
  echo "<body>\n<h2>$title</h2>\n</body>\n";
}
echo '</html>';