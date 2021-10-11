<? namespace hypoman; ?>
<div id="evalPane">
  <textarea id="textArea"   wrap="off">Text</textarea>
  <textarea id="codeArea"   wrap="off">Code</textarea>
  <textarea id="answerArea" wrap="off" readonly="readonly">Answer</textarea>
</div>
<div id="pagePane">
  <?
  $markup = _GET('type', 'strict');
  $target = _GET('target', "page.php?type=$markup");
  ?>
  <object id="page" type="text/html" data="<?= $target ?>"></object>
</div>