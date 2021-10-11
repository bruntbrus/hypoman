<? namespace hypoman; ?>
<!DOCTYPE HTML>
<html>
<head>

<? $page->includeTemplate('_head'); ?>
<script type="application/javascript">
var page = new Page(<?= json_encode(array(
  'name'  => $page->name,
  'title' => $page->title
)) ?>);
</script>

</head>
<body>

<div id="main">
  <div id="top_gradient"></div>
  <div id="page">
    <!-- header -->
    <div id="page_header">
      <img class="logo" alt="Logo" src="<?= Page::getImageURL('logo.png') ?>" />
      <div class="title"><?= $page->title ?></div>
      <div class="info">
        <? if ($user) { ?>
          <a title="Logga ut" href="<?= BASE ?>login?action=logout"><?= $user->name ?></a>
        <? } else { ?>
          <a href="<?= BASE ?>register">Registrera</a>
          <a href="<?= BASE ?>login">Logga in</a>
        <? }//if ?>
      </div>
    </div>
    <!-- /header -->
    <!-- main-body -->
    <div id="page_body" class="decobox">
      <!-- menu -->
      <div id="page_menu">
        <ul>
        <? $location = $page->getBaseLocation(); ?>
        <? foreach (Page::$categories as $name => $title) { ?>
          <?
          if ($name == 'start') {
            $href     = BASE;
            $selected = ($location == '');
          } else {
            $href     = BASE.$name;
            $selected = ($location == $name);
          }
          ?>
          <li class="<?= $selected ? 'selected' : '' ?>">
            <a href="<?= $href ?>"><img class="icon" alt="Ikon" src="<?= Page::getImageURL("$name.png") ?>" /><?= $title ?></a>
          </li>
        <? }//foreach ?>
        </ul>
      </div>
      <!-- /menu -->
      <!-- content -->
      <div id="<?= $page->name ?>_page" class="content">
        <? $page->includeTemplate($page->name); ?>
      </div>
      <!-- /content -->
      <div class="anchor"></div>
      <div class="border top"></div>
      <div class="border bottom"></div>
      <div class="border left"></div>
      <div class="border right"></div>
      <div class="border top_left"></div>
      <div class="border top_right"></div>
      <div class="border bottom_left"></div>
      <div class="border bottom_right"></div>
    </div>
    <!-- /main-body -->
    <!-- footer -->
    <div id="page_footer">
      <div class="author">
        <span><strong>Kod:</strong> <em><?= $page->author ?></em></span>
        <span><strong>Grafik:</strong> <em><?= $page->artist ?></em></span>
      </div>
      <div class="revised">
        <strong>Uppdaterad:</strong>&nbsp;<em><?= $page->revised ?></em>
      </div>
    </div>
    <!-- /footer -->
  </div>
  <div id="bottom_gradient"></div>
</div>

</body>
</html>