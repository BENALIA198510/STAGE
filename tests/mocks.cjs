const crypto = require('crypto');

function createSheet(initialData = []) {
  const data = initialData;
  return {
    data,
    appendRow(row) { data.push([...row]); },
    getDataRange() { return { getValues: () => data.map(r => [...r]) }; },
    getRange(row, col, numRows = 1, numCols = 1) {
      return {
        getValues: () => data.slice(row - 1, row - 1 + numRows).map(r => r.slice(col - 1, col - 1 + numCols)),
        setValues: vals => {
          for (let i = 0; i < numRows; i++) {
            if (!data[row - 1 + i]) data[row - 1 + i] = [];
            for (let j = 0; j < numCols; j++) {
              data[row - 1 + i][col - 1 + j] = vals[i][j];
            }
          }
        },
        setValue: val => {
          if (!data[row - 1]) data[row - 1] = [];
          data[row - 1][col - 1] = val;
        },
        getValue: () => {
          return data[row - 1] ? data[row - 1][col - 1] : undefined;
        }
      };
    },
    deleteRow(r) { data.splice(r - 1, 1); }
  };
}

const sheets = {
  Login: createSheet([]),
  Data: createSheet([])
};

const SpreadsheetApp = {
  getActiveSpreadsheet() {
    return {
      getSheetByName(name) {
        return sheets[name];
      }
    };
  }
};

const driveFiles = {};
const DriveApp = {
  createFile(blob) {
    const id = 'file_' + (Object.keys(driveFiles).length + 1);
    const fileBlob = {
      name: '',
      setName(name) { this.name = name; return this; }
    };
    const file = {
      id,
      url: `https://drive.mock/${id}`,
      blob: fileBlob,
      getBlob() { return fileBlob; },
      setSharing() { return this; },
      setTrashed() { return this; },
      getUrl() { return this.url; }
    };
    driveFiles[id] = file;
    return file;
  },
  getFileById(id) { return driveFiles[id]; },
  Access: { ANYONE_WITH_LINK: 'any' },
  Permission: { VIEW: 'view' }
};

const docs = {};
const DocumentApp = {
  ParagraphHeading: { TITLE: 'TITLE' },
  create(name) {
    const id = 'doc_' + (Object.keys(docs).length + 1);
    const doc = {
      id,
      name,
      body: {
        contents: [],
        appendParagraph(text) { this.contents.push(text); return { setHeading() {} }; },
        appendTable() {
          const table = [];
          this.contents.push(table);
          return {
            appendTableRow() {
              const row = [];
              table.push(row);
              return {
                appendTableCell(val) { row.push(val); }
              };
            }
          };
        }
      },
      getBody() { return this.body; },
      saveAndClose() {},
      getId() { return this.id; }
    };
    docs[id] = doc;
    // create a corresponding Drive file for retrieval
    driveFiles[id] = {
      id,
      url: `https://drive.mock/${id}`,
      blob: { content: 'doc', setName(name) { this.name = name; return this; } },
      getBlob() { return this.blob; },
      setSharing() { return this; },
      setTrashed() { return this; }
    };
    return doc;
  }
};

const CacheService = {
  cache: {},
  getScriptCache() {
    return {
      get: key => CacheService.cache[key] || null,
      put: (key, val) => { CacheService.cache[key] = val; },
      remove: key => { delete CacheService.cache[key]; }
    };
  }
};

const Utilities = {
  computeDigest(alg, str) {
    return Array.from(crypto.createHash('sha256').update(str).digest());
  },
  DigestAlgorithm: { SHA_256: 'SHA-256' },
  formatDate(date, tz, pattern) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    if (pattern === 'yyyy-MM-dd') return `${yyyy}-${mm}-${dd}`;
    if (pattern === 'yyyy-MM-dd HH:mm') return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    return date.toISOString();
  }
};

const Session = { getScriptTimeZone() { return 'GMT'; } };

const MailApp = {
  sent: [],
  sendEmail(opts) { MailApp.sent.push(opts); }
};

function resetData() {
  sheets.Login.data.length = 0;
  sheets.Data.data.length = 0;
  sheets.Login.appendRow(['Email','Password','Type','OTP']);
  sheets.Data.appendRow(['specialite','groupe','nomPrenom','cin','dateStage','nombreHeures','commune','etablissement','nomEncadrant','pprEncadrant','email']);
  Object.keys(docs).forEach(k => delete docs[k]);
  Object.keys(driveFiles).forEach(k => delete driveFiles[k]);
  MailApp.sent.length = 0;
  CacheService.cache = {};
}

module.exports = {
  SpreadsheetApp,
  DriveApp,
  DocumentApp,
  CacheService,
  Utilities,
  Session,
  MailApp,
  resetData,
  sheets,
  docs,
  driveFiles
};
