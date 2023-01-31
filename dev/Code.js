function write(y, x, data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getRange(y, x);
  cell.setValue(data);
}

function writeMultiple( y, x,  yy, xx, data) {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange( y, x, yy, xx).setValues(data).setBackground('beige');
  SpreadsheetApp.flush();
}

function run() {
  console.log('booting...');
  writeMultiple(1, 2, 2, 2, [[1,2], [1,2]])
}