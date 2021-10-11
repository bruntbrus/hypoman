<? namespace hypoman; ?>
<? foreach ($page->linkCategories as $category) { ?>
<table class="link-table">
  <caption><?= $category['title'] ?></caption>
  <tbody>
  <? foreach ($category['links'] as $link) { ?>
    <tr>
      <th><a href="<?= $link['url'] ?>"><?= $link['title'] ?></a></th>
      <td><?= $link['description'] ?></td>
    </tr>
  <? }//foreach ?>
  </tbody>
</table>
<? }//foreach ?>
<? if (empty($page->linkCategories)) { ?>
  <p>Inga länkar...</p>
<? }//if ?>