// Field Training Management System - Google Apps Script
// Improved modular design with caching and security enhancements
// Compatible with Google Workspace environment
function doGet(e) {
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


/**
 * Utility to access a sheet by name.
 */
function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

/**
 * Retrieve sheet data with optional caching.
 * @param {string} sheetName
 * @param {string} cacheKey
 * @param {number} [ttl=300] cache time in seconds
 */
function getSheetData(sheetName, cacheKey, ttl) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  cache.put(cacheKey, JSON.stringify(data), ttl || 300);
  return data;
}

/**
 * Hash password using SHA-256.
 * This should ideally use a salt stored with the user record.
 */
function hashPassword(password) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  return digest.map(byte => {
    const unsigned = byte < 0 ? byte + 256 : byte;
    return ('0' + unsigned.toString(16)).slice(-2);
  }).join('');
}

/**
 * Find a user row by email.
 * Returns row index (1-based) or -1 if not found.
 */
function findUserRow(email) {
  const data = getSheetData('Login', 'loginData', 60);
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) return i + 1; // sheet rows start at 1
  }
  return -1;
}

/**
 * Authenticate user credentials.
 */
function userLogin(email, password) {
  try {
    const row = findUserRow(email);
    if (row === -1) {
      return { success: false, message: 'البريد الإلكتروني غير موجود' };
    }
    const sheet = getSheet('Login');
    const rowData = sheet.getRange(row, 1, 1, 4).getValues()[0];
    const hashedInput = hashPassword(password);
    if (rowData[1] === hashedInput) {
      return { success: true, userType: rowData[2] };
    }
    return { success: false, message: 'كلمة المرور غير صحيحة' };
  } catch (err) {
    return { success: false, message: 'خطأ في الخادم: ' + err.message };
  }
}

/**
 * Register a new user after ensuring email uniqueness.
 */
function registerUser(email, password) {
  try {
    if (findUserRow(email) !== -1) {
      return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' };
    }
    const hashed = hashPassword(password);
    getSheet('Login').appendRow([email, hashed, 'User', '']);
    CacheService.getScriptCache().remove('loginData');
    return { success: true, message: 'تم التسجيل بنجاح' };
  } catch (err) {
    return { success: false, message: 'خطأ في التسجيل: ' + err.message };
  }
}

/**
 * Send OTP for password reset. OTP stored temporarily in sheet.
 */
function forgotPasswordRequest(email) {
  try {
    const row = findUserRow(email);
    if (row === -1) {
      return { success: false, message: 'البريد الإلكتروني غير موجود' };
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    getSheet('Login').getRange(row, 4).setValue(otp);
    MailApp.sendEmail({
      to: email,
      subject: 'رمز إعادة تعيين كلمة المرور',
      body: 'رمز التأكيد الخاص بك هو: ' + otp + '\n\nهذا الرمز صالح لمرة واحدة فقط.'
    });
    return { success: true, message: 'تم إرسال رمز التأكيد إلى بريدك الإلكتروني' };
  } catch (err) {
    return { success: false, message: 'خطأ في إرسال الرمز: ' + err.message };
  }
}

/**
 * Verify OTP and reset password.
 */
function forgotPasswordVerify(email, otp, newPassword) {
  try {
    const row = findUserRow(email);
    if (row === -1) {
      return { success: false, message: 'البريد الإلكتروني غير موجود' };
    }
    const sheet = getSheet('Login');
    const rowData = sheet.getRange(row, 1, 1, 4).getValues()[0];
    if (rowData[3] !== otp) {
      return { success: false, message: 'رمز التأكيد غير صحيح أو منتهي الصلاحية' };
    }
    sheet.getRange(row, 2).setValue(hashPassword(newPassword));
    sheet.getRange(row, 4).setValue('');
    CacheService.getScriptCache().remove('loginData');
    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  } catch (err) {
    return { success: false, message: 'خطأ في تغيير كلمة المرور: ' + err.message };
  }
}

/**
 * Determine if the user has admin privileges.
 */
function isAdmin(email) {
  const row = findUserRow(email);
  if (row === -1) return false;
  try {
    const type = getSheet('Login').getRange(row, 3).getValue();
    return type === 'Admin';
  } catch (e) {
    return false;
  }
}

/**
 * Load dropdown options with caching to reduce sheet reads.
 */
function getDropdownOptions() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('dropdownOptions');
  if (cached) return JSON.parse(cached);

  const sheet = getSheet('Options');
  const data = sheet.getDataRange().getValues();
  const filterGroup1 = {};
  const filterGroup2 = {};

  for (let i = 1; i < data.length; i++) {
    const [sp, grp, nom, com, etab, enc] = data[i];
    if (sp) {
      if (!filterGroup1[sp]) filterGroup1[sp] = {};
      if (!filterGroup1[sp][grp]) filterGroup1[sp][grp] = [];
      if (nom && filterGroup1[sp][grp].indexOf(nom) === -1) {
        filterGroup1[sp][grp].push(nom);
      }
    }
    if (com) {
      if (!filterGroup2[com]) filterGroup2[com] = {};
      if (!filterGroup2[com][etab]) filterGroup2[com][etab] = [];
      if (enc && filterGroup2[com][etab].indexOf(enc) === -1) {
        filterGroup2[com][etab].push(enc);
      }
    }
  }

  const result = { filterGroup1, filterGroup2 };
  cache.put('dropdownOptions', JSON.stringify(result), 300);
  return result;
}

/**
 * Get filtered training data respecting user access.
 */
function getData(email, userType, s, g, nom, c, e, enc, from, to) {
  try {
    const data = getSheetData('Data', 'dataSheet', 60);
    const records = [];
    for (let i = 1; i < data.length; i++) {
      const [sp, grp, n, cin, d, hrs, com, etab, encadrant, ppr, owner] = data[i];
      if (userType === 'User' && owner !== email) continue;
      if (s && sp !== s) continue;
      if (g && grp !== g) continue;
      if (nom && n !== nom) continue;
      if (c && com !== c) continue;
      if (e && etab !== e) continue;
      if (enc && encadrant !== enc) continue;
      if (from || to) {
        const recDate = new Date(d);
        if (from && recDate < new Date(from)) continue;
        if (to && recDate > new Date(to)) continue;
      }
      records.push({
        specialite: sp,
        groupe: grp,
        nomPrenom: n,
        cin,
        dateStage: Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
        nombreHeures: hrs,
        commune: com,
        etablissement: etab,
        nomEncadrant: encadrant,
        pprEncadrant: ppr,
        recordOwner: owner,
        rowIndex: i + 1
      });
    }
    return records;
  } catch (err) {
    console.error('Error loading data:', err);
    return [];
  }
}

/**
 * Create a new record (admin only).
 */
function createRecord(obj, email) {
  try {
    if (!isAdmin(email)) {
      return { success: false, message: 'ليس لديك صلاحية لإضافة السجلات' };
    }
    getSheet('Data').appendRow([
      obj.specialite,
      obj.groupe,
      obj.nomPrenom,
      obj.cin,
      new Date(obj.dateStage),
      obj.nombreHeures,
      obj.commune,
      obj.etablissement,
      obj.nomEncadrant,
      obj.pprEncadrant,
      email
    ]);
    CacheService.getScriptCache().remove('dataSheet');
    return { success: true, message: 'تم إضافة السجل بنجاح' };
  } catch (err) {
    return { success: false, message: 'خطأ في إضافة السجل: ' + err.message };
  }
}

/** Update record (admin only). */
function updateRecord(obj, email) {
  try {
    if (!isAdmin(email)) {
      return { success: false, message: 'ليس لديك صلاحية لتعديل السجلات' };
    }
    const row = obj.rowIndex;
    getSheet('Data').getRange(row, 1, 1, 11).setValues([[
      obj.specialite,
      obj.groupe,
      obj.nomPrenom,
      obj.cin,
      new Date(obj.dateStage),
      obj.nombreHeures,
      obj.commune,
      obj.etablissement,
      obj.nomEncadrant,
      obj.pprEncadrant,
      email
    ]]);
    CacheService.getScriptCache().remove('dataSheet');
    return { success: true, message: 'تم تحديث السجل بنجاح' };
  } catch (err) {
    return { success: false, message: 'خطأ في تحديث السجل: ' + err.message };
  }
}

/** Delete record (admin only). */
function deleteRecord(rowIndex, email) {
  try {
    if (!isAdmin(email)) {
      return { success: false, message: 'ليس لديك صلاحية لحذف السجلات' };
    }
    getSheet('Data').deleteRow(rowIndex);
    CacheService.getScriptCache().remove('dataSheet');
    return { success: true, message: 'تم حذف السجل بنجاح' };
  } catch (err) {
    return { success: false, message: 'خطأ في حذف السجل: ' + err.message };
  }
}

/**
 * Export provided records to a PDF file on Drive.
 * Consider mocking DriveApp and DocumentApp for testing.
 */
function exportToPdf(records) {
  try {
    const doc = DocumentApp.create('تصدير البيانات - ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'));
    const body = doc.getBody();
    body.appendParagraph('نظام إدارة التدريب الميداني').setHeading(DocumentApp.ParagraphHeading.TITLE);
    body.appendParagraph('تاريخ التصدير: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm'));
    body.appendParagraph('');
    if (records.length === 0) {
      body.appendParagraph('لا توجد بيانات للتصدير');
    } else {
      const table = body.appendTable();
      const headers = ['التخصص', 'المجموعة', 'الاسم', 'ر.ب.و', 'التاريخ', 'الساعات', 'الجماعة', 'المؤسسة', 'المشرف', 'ر. تأجير'];
      const headerRow = table.appendTableRow();
      headers.forEach(h => headerRow.appendTableCell(h));
      records.forEach(rec => {
        const r = table.appendTableRow();
        r.appendTableCell(rec.specialite);
        r.appendTableCell(rec.groupe);
        r.appendTableCell(rec.nomPrenom);
        r.appendTableCell(rec.cin);
        r.appendTableCell(rec.dateStage);
        r.appendTableCell(String(rec.nombreHeures));
        r.appendTableCell(rec.commune);
        r.appendTableCell(rec.etablissement);
        r.appendTableCell(rec.nomEncadrant);
        r.appendTableCell(rec.pprEncadrant);
      });
    }
    doc.saveAndClose();
    const blob = DriveApp.getFileById(doc.getId()).getBlob().setName('DataExport_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd') + '.pdf');
    const file = DriveApp.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    DriveApp.getFileById(doc.getId()).setTrashed(true); // clean up
    return file.getUrl();
  } catch (err) {
    console.error('Error creating PDF:', err);
    return null;
  }
}
/**
 * Validate date input when editing the Data sheet.
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "Data") return;
  const range = e.range;
  if (range.getColumn() === 5) {
    const value = range.getValue();
    if (value && !(value instanceof Date)) {
      try {
        const parsed = new Date(value);
        if (isNaN(parsed.getTime())) {
          range.setValue("");
          SpreadsheetApp.getUi().alert("تاريخ غير صالح، تم مسح القيمة");
        } else {
          range.setValue(parsed);
        }
      } catch (err) {
        range.setValue("");
        SpreadsheetApp.getUi().alert("تاريخ غير صالح، تم مسح القيمة");
      }
    }
  }
}


/**
 * Example of how to mock sheet data in tests:
 *
 * function getSheet(name) {
 *   return isTesting ? MockSheet.getSheetByName(name) : SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
 * }
 */
