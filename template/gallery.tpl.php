<? namespace hypoman; ?>
<ul class="links">
<? foreach ($page->dirs as $dir) { ?>
  <li><a href="<?= $page->location ?>/thumbs?category=<?= urlencode($dir) ?>"><?= $dir ?></a></li>
<? }//foreach ?>
</ul>