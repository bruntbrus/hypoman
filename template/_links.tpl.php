<? namespace hypoman; ?>
<ul class="links">
<? foreach ($data['links'] as $link) { ?>
  <li><a href="<?= $link['url'] ?>"><?= $link['title'] ?></a> - <?= $link['description'] ?></li>
<? }//foreach ?>
</ul>