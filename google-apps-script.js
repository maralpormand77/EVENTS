/**
 * =========================================================================
 * کد اسکریپت سرورلس Google Apps Script برای سیستم ثبت‌نام گروه انتخاب
 * =========================================================================
 * این کد به صورت کاملاً رایگان، نامحدود و بدون نیاز به هیچ سروری روی سرورهای ابری گوگل اجرا می‌شود
 * و تمام ثبت‌نام‌ها را مستقیماً در یک فایل Google Sheets ذخیره می‌کند.
 * 
 * نحوه راه‌اندازی (فقط ۲ دقیقه زمان می‌برد):
 * ۱. وارد اکانت گوگل خود شوید و به آدرس sheets.google.com بروید.
 * ۲. یک فایل اکسل جدید ایجاد کرده و نام آن را "ثبت نام رویدادهای گروه انتخاب" بگذارید.
 * ۳. از منوی بالا روی «Extensions» (یا افزونه‌ها) و سپس «Apps Script» کلیک کنید.
 * ۴. تمام کدهای موجود در پنجره را پاک کرده و کل این فایل را در آنجا Paste کنید.
 * ۵. دکمه Save (آیکون فلاپی) را بزنید.
 * ۶. از گوشه بالا سمت راست دکمه آبی «Deploy» -> «New deployment» را بزنید.
 * ۷. نوع را روی «Web app» بگذارید.
 * ۸. فیلد «Execute as» را روی «Me» بگذارید.
 * ۹. فیلد «Who has access» را حتماً روی «Anyone» (هر کسی) قرار دهید تا پرسنل بدون نیاز به لاگین بتوانند ثبت‌نام کنند.
 * ۱۰. دکمه «Deploy» را زده و دسترسی‌ها (Authorize access) را تایید کنید.
 * ۱۱. در پایان، لینکی تحت عنوان «Web app URL» به شما می‌دهد (به فرمت https://script.google.com/macros/s/.../exec).
 * ۱۲. این لینک را کپی کرده و در پنل ادمین (یا فایل assets/js/config.js) قرار دهید. تمام!
 * =========================================================================
 */

function setupHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    var headers = [
      "شناسه", 
      "رویداد", 
      "شماره پرسنلی", 
      "نام و نام خانوادگی", 
      "وضعیت حضور", 
      "متن وضعیت", 
      "تاریخ و ساعت", 
      "تایم‌استمپ", 
      "دستگاه / مرورگر"
    ];
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight("bold");
    range.setBackground("#004b93");
    range.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeaders(sheet);

    var rawData = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(rawData);
    var action = payload.action;

    if (action === "register" && payload.record) {
      var r = payload.record;
      var data = sheet.getDataRange().getValues();
      var foundRowIndex = -1;

      // جستجو برای ویرایش در صورت ثبت مجدد همان پرسنل در همان رویداد
      for (var i = 1; i < data.length; i++) {
        var rowEventId = String(data[i][1]);
        var rowPersonnel = String(data[i][2]);
        if (rowEventId === String(r.eventTitle || r.eventId) && rowPersonnel === String(r.personnelCode)) {
          foundRowIndex = i + 1; // شماره سطر در شیت ۱-based است
          break;
        }
      }

      var rowData = [
        r.id || Utilities.getUuid(),
        r.eventTitle || r.eventId,
        "'" + r.personnelCode, // با کوتیشن تا صفرهای اول حذف نشوند
        r.fullName,
        r.status === "attending" ? "مایل به شرکت" : "عدم حضور",
        r.statusText || "",
        r.jalaliDate || "",
        r.timestamp || new Date().toISOString(),
        r.userAgent || ""
      ];

      if (foundRowIndex > 0) {
        sheet.getRange(foundRowIndex, 1, 1, rowData.length).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "با موفقیت ثبت شد",
        record: r
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "delete" && payload.id) {
      var idToDelete = payload.id;
      var values = sheet.getDataRange().getValues();
      for (var j = 1; j < values.length; j++) {
        if (String(values[j][0]) === String(idToDelete)) {
          sheet.deleteRow(j + 1);
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "ignored" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeaders(sheet);

    var data = sheet.getDataRange().getValues();
    var records = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[2]) continue;

      var statusRaw = String(row[4]);
      var status = (statusRaw.includes("مایل") || statusRaw === "attending") ? "attending" : "declined";

      records.push({
        id: String(row[0]),
        eventId: getEventIdFromTitle(String(row[1])),
        eventTitle: String(row[1]),
        personnelCode: String(row[2]).replace(/^'/, ''),
        fullName: String(row[3]),
        status: status,
        statusText: String(row[5]) || (status === "attending" ? "مایل به شرکت در این برنامه هستم" : "تمایلی به حضور ندارم"),
        jalaliDate: String(row[6]),
        timestamp: String(row[7])
      });
    }

    return ContentService.createTextOutput(JSON.stringify(records))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getEventIdFromTitle(title) {
  if (title.indexOf("همدلی") !== -1) return "sobh-hamdeli";
  if (title.indexOf("کویر") !== -1 || title.indexOf("ورزنه") !== -1) return "kavir-varzaneh";
  if (title.indexOf("رفتینگ") !== -1 || title.indexOf("مارکده") !== -1) return "rafting-markadeh";
  return title;
}
