<? namespace hypoman; ?>
<? foreach ($page->thumbs as $thumb) { ?>
  <div class="thumb">
    <a href="view?category=<?= $page->category ?>&image=<?= urlencode($thumb['file']) ?>">
      <div>
        <img alt="thumb" src="<?= urlencode($thumb['file']) ?>" width="<?= $thumb['width'] ?>" height="<?= $thumb['height'] ?>" style="<?= $thumb['style'] ?>" />
      </div>
    </a>
    <?= $thumb['name'] ?><br />
    <?= $thumb['imageWidth'] ?> x <?= $thumb['imageHeight'] ?>
  </div>
<? }//foreach ?>
<? if (empty($page->thumbs)) { ?>
  <h2>Inga bilder!</h2>
<? }//if ?>