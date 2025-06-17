// StageFlow Google Apps Script version

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('StageFlow')
    .addItem('Show Dashboard', 'showDashboard')
    .addItem('Add Student', 'showStudentForm')
    .addItem('Manage Students', 'showStudents')
    .addToUi();
}

function showDashboard() {
  var html = HtmlService.createHtmlOutputFromFile('dashboard')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showSidebar(html);
}

function showStudentForm() {
  var html = HtmlService.createHtmlOutputFromFile('studentForm')
    .setWidth(600)
    .setHeight(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function showStudents() {
  var html = HtmlService.createHtmlOutputFromFile('students')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showSidebar(html);
}

function getStudents() {
  var sheet = getStudentsSheet();
  var data = sheet.getDataRange().getValues();
  return data.slice(1); // Skip header row
}

function addStudent(student) {
  var sheet = getStudentsSheet();
  sheet.appendRow([student.name, student.email, student.status]);
}

function getStudentsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Students');
  if (!sheet) {
    sheet = ss.insertSheet('Students');
    sheet.appendRow(['Name', 'Email', 'Status']);
  }
  return sheet;
}
