$(document).foundation(); // Init foundation JS

var $protocolField = $('#protocolField'),
    $protocolToggle = $('#protocolToggle')

$protocolToggle.click(function() {
  switch ($protocolField.val()) {
  case 'http://':
    $protocolField.val('https://');
    $protocolToggle.text('https://');
    break;
  case 'https://':
    $protocolField.val('http://')
    $protocolToggle.text('http://');
  }
});

$('#url-input').focus();
