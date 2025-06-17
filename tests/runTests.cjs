const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const mocks = require('./mocks.cjs');

const code = fs.readFileSync('./gas/FieldTrainingManagement.gs', 'utf8');

const context = {
  console,
  ...mocks
};
vm.createContext(context);
vm.runInContext(code, context);

const {
  registerUser,
  userLogin,
  createRecord,
  updateRecord,
  deleteRecord,
  exportToPdf
} = context;

function testRegisterAndLogin() {
  mocks.resetData();
  let res = registerUser('a@test.com', 'pass');
  assert.strictEqual(res.success, true);
  res = userLogin('a@test.com', 'pass');
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.userType, 'User');
  res = registerUser('a@test.com', 'pass');
  assert.strictEqual(res.success, false); // duplicate
  res = userLogin('a@test.com', 'wrong');
  assert.strictEqual(res.success, false); // wrong password
}

function testRecordCrud() {
  mocks.resetData();
  registerUser('admin@test.com', 'pass');
  // make admin
  mocks.sheets.Login.data[1][2] = 'Admin';
  const record = {
    specialite: 'Spec',
    groupe: 'G1',
    nomPrenom: 'Name',
    cin: '1',
    dateStage: '2024-01-01',
    nombreHeures: 10,
    commune: 'Com',
    etablissement: 'Etab',
    nomEncadrant: 'Enc',
    pprEncadrant: 'PPR'
  };
  let res = createRecord(record, 'admin@test.com');
  assert.strictEqual(res.success, true);
  assert.strictEqual(mocks.sheets.Data.data.length, 2); // header + 1 record
  const updateObj = { ...record, rowIndex: 2, specialite: 'Spec2', nombreHeures: 15 };
  res = updateRecord(updateObj, 'admin@test.com');
  assert.strictEqual(res.success, true);
  assert.strictEqual(mocks.sheets.Data.data[1][0], 'Spec2');
  assert.strictEqual(mocks.sheets.Data.data[1][5], 15);
  res = deleteRecord(2, 'admin@test.com');
  assert.strictEqual(res.success, true);
  assert.strictEqual(mocks.sheets.Data.data.length, 1); // only header
}

function testExportPdf() {
  mocks.resetData();
  const url = exportToPdf([
    {
      specialite: 'Spec',
      groupe: 'G1',
      nomPrenom: 'Name',
      cin: '1',
      dateStage: '2024-01-01',
      nombreHeures: 10,
      commune: 'Com',
      etablissement: 'Etab',
      nomEncadrant: 'Enc',
      pprEncadrant: 'PPR'
    }
  ]);
  assert.ok(url.startsWith('https://drive.mock/'));
}

function run() {
  testRegisterAndLogin();
  testRecordCrud();
  testExportPdf();
  console.log('All tests passed.');
}

run();
