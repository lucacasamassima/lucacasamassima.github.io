// Select color input
// Select size input
var colorPicker = $('#colorPicker');
var inputWidth = $('#input_width');
var inputHeight = $('#input_height');

// default values
colorPicker.val('#00b5e9');
inputWidth.val(20);
inputHeight.val(20);
makeGrid(inputWidth.val(), inputHeight.val());

// When size is submitted by the user, call makeGrid()
var submit = $('#sizePicker input:last');
submit.click(function (event) {
  event.preventDefault();
  $('#pixel_canvas').empty();
  makeGrid(inputWidth.val(), inputHeight.val());
});

// function to make a grid
function makeGrid(width, height) {
  for (var r = 0; r < height; r++) {
    $('#pixel_canvas').append('<tr></tr>');
  }
  for (var c = 0; c < width; c++) {
    $('tr').append('<td></td>');
  }
}

// td click event
$('#pixel_canvas').on('click', 'td', function () {
  $(this).css('background-color', colorPicker.val());
});
