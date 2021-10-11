<? namespace hypoman; ?>
<title><?= Page::TITLE.': '.$page->title ?></title>
<meta http-equiv="Content-Type" content="text/html; charset=<?= $page->charset ?>" />
<meta name="author" content="<?= $page->author ?>" />
<meta name="revised" content="<?= $page->revised ?>" />
<meta name="keywords" content="<?= $page->keywords ?>" />
<meta name="description" content="<?= $page->description ?>" />
<link rel="icon" type="image/png" href="<?= $page->icon ?>" />
<? foreach ($page->styles as $href) { ?>
  <link rel="stylesheet" type="text/css" href="<?= $href ?>" />
<? }//foreach ?>
<? foreach ($page->scripts as $src) { ?>
  <script type="application/javascript" src="<?= $src ?>"></script>
<? }//foreach ?>