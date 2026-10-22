/**
 * @fileoverview Database.gs - Quản lý kết nối, khởi tạo và đọc/ghi an toàn vào Google Sheets.
 * Tích hợp cơ chế chống Formula Injection và tự động chuyển sang chế độ Fallback khi chưa gắn Sheet.
 */

var DatabaseService = (function() {
  var SCRIPT_PROP_KEY = 'INTEGRAL_LAB_SPREADSHEET_ID';
  var SHEET_EXAMPLES = 'Examples';
  var SHEET_HISTORY = 'LearningHistory';

  /**
   * Làm sạch chuỗi đầu vào để ngăn chặn lỗ hổng Formula Injection trên Google Sheets.
   * Các chuỗi bắt đầu bằng =, +, -, @, Tab hoặc xuống dòng sẽ được thêm dấu nháy đơn (') ở đầu.
   * Lưu ý: Với biểu thức toán học âm như "-x^2", việc thêm dấu nháy đơn giúp Google Sheets
   * lưu trữ nguyên vẹn chuỗi văn bản mà không báo lỗi #NAME? hay thực thi công thức.
   * @param {*} value Giá trị cần làm sạch.
   * @param {number=} maxLen Độ dài tối đa cho phép.
   * @return {string|number} Giá trị an toàn để ghi vào ô.
   */
  function sanitizeCell(value, maxLen) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      return isFinite(value) ? value : 0;
    }
    var str = String(value).trim();
    var limit = maxLen || 300;
    if (str.length > limit) {
      str = str.substring(0, limit);
    }
    if (/^[=+\-@\t\r\n]/.test(str)) {
      return "'" + str;
    }
    return str;
  }

  /**
   * Lấy đối tượng Spreadsheet hiện tại (ưu tiên ActiveSpreadsheet, sau đó đến ScriptProperties).
   * @return {Spreadsheet|null} Đối tượng Spreadsheet hoặc null nếu chưa cấu hình.
   */
  function getSpreadsheet() {
    try {
      var active = SpreadsheetApp.getActiveSpreadsheet();
      if (active) return active;

      var props = PropertiesService.getScriptProperties();
      var savedId = props.getProperty(SCRIPT_PROP_KEY);
      if (savedId) {
        return SpreadsheetApp.openById(savedId);
      }
    } catch (err) {
      Logger.log('Cảnh báo truy cập Google Sheets: ' + err.message);
    }
    return null;
  }

  /**
   * Khởi tạo tệp Google Sheets (nếu chưa có) cùng 2 trang tính Examples và LearningHistory.
   * @return {Object} Kết quả khởi tạo.
   */
  function initializeSheets() {
    try {
      var ss = getSpreadsheet();
      if (!ss) {
        ss = SpreadsheetApp.create('Integral_Lab_Database');
        PropertiesService.getScriptProperties().setProperty(SCRIPT_PROP_KEY, ss.getId());
      }

      // 1. Khởi tạo trang tính Examples
      var exSheet = ss.getSheetByName(SHEET_EXAMPLES);
      if (!exSheet) {
        exSheet = ss.insertSheet(SHEET_EXAMPLES);
        var exHeaders = [
          'id', 'title', 'category', 'difficulty', 'expr',
          'a', 'b', 'initialValue', 'unit', 'variable',
          'question', 'meaning', 'stepsJson'
        ];
        exSheet.getRange(1, 1, 1, exHeaders.length).setValues([exHeaders]);
        exSheet.getRange(1, 1, 1, exHeaders.length).setFontWeight('bold');
        exSheet.setFrozenRows(1);

        // Nạp dữ liệu mẫu ban đầu từ ExamplesService
        var defaults = ExamplesService.getBuiltInExamples();
        var rows = defaults.map(function(item) {
          return [
            sanitizeCell(item.id, 50),
            sanitizeCell(item.title, 150),
            sanitizeCell(item.category, 80),
            sanitizeCell(item.difficulty, 40),
            sanitizeCell(item.expr, 120),
            Number(item.a),
            Number(item.b),
            Number(item.initialValue || 0),
            sanitizeCell(item.unit, 50),
            sanitizeCell(item.variable || 'x', 10),
            sanitizeCell(item.question, 400),
            sanitizeCell(item.meaning, 500),
            sanitizeCell(JSON.stringify(item.steps || []), 1500)
          ];
        });
        if (rows.length > 0) {
          exSheet.getRange(2, 1, rows.length, exHeaders.length).setValues(rows);
        }
      }

      // 2. Khởi tạo trang tính LearningHistory
      var histSheet = ss.getSheetByName(SHEET_HISTORY);
      if (!histSheet) {
        histSheet = ss.insertSheet(SHEET_HISTORY);
        var histHeaders = [
          'timestamp', 'actionType', 'expression', 'lowerBound',
          'upperBound', 'signedIntegral', 'geometricArea', 'note'
        ];
        histSheet.getRange(1, 1, 1, histHeaders.length).setValues([histHeaders]);
        histSheet.getRange(1, 1, 1, histHeaders.length).setFontWeight('bold');
        histSheet.setFrozenRows(1);
      }

      return {
        ok: true,
        spreadsheetId: ss.getId(),
        spreadsheetUrl: ss.getUrl(),
        message: 'Đã khởi tạo thành công cơ sở dữ liệu Google Sheets cho Integral Lab.'
      };
    } catch (err) {
      return {
        ok: false,
        message: 'Không thể khởi tạo Google Sheets (kiểm tra quyền truy cập): ' + err.message
      };
    }
  }

  /**
   * Đọc danh sách bài toán từ trang tính Examples.
   * @return {Array<Object>|null} Danh sách bài toán hoặc null nếu chưa cấu hình.
   */
  function readExamplesFromSheet() {
    try {
      var ss = getSpreadsheet();
      if (!ss) return null;
      var sheet = ss.getSheetByName(SHEET_EXAMPLES);
      if (!sheet || sheet.getLastRow() < 2) return null;

      var data = sheet.getDataRange().getValues();
      var results = [];
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (!row[0]) continue;
        var steps = [];
        try {
          steps = row[12] ? JSON.parse(String(row[12]).replace(/^'/, '')) : [];
        } catch (e) {
          steps = [];
        }
        results.push({
          id: String(row[0]).replace(/^'/, ''),
          title: String(row[1]).replace(/^'/, ''),
          category: String(row[2]).replace(/^'/, ''),
          difficulty: String(row[3]).replace(/^'/, ''),
          expr: String(row[4]).replace(/^'/, ''),
          a: Number(row[5]),
          b: Number(row[6]),
          initialValue: Number(row[7] || 0),
          unit: String(row[8] || '').replace(/^'/, ''),
          variable: String(row[9] || 'x').replace(/^'/, ''),
          question: String(row[10] || '').replace(/^'/, ''),
          meaning: String(row[11] || '').replace(/^'/, ''),
          steps: steps
        });
      }
      return results.length > 0 ? results : null;
    } catch (err) {
      Logger.log('Lỗi đọc Examples từ Sheet: ' + err.message);
      return null;
    }
  }

  /**
   * Ghi một dòng lịch sử học tập mới vào trang tính LearningHistory.
   * @param {Object} record Đối tượng thông tin bản ghi đã được kiểm tra.
   * @return {Object} Trạng thái lưu.
   */
  function appendHistoryRow(record) {
    try {
      var ss = getSpreadsheet();
      if (!ss) {
        return {
          ok: false,
          fallback: true,
          message: 'Chưa liên kết Google Sheets. Lịch sử chỉ được lưu tạm trong phiên trình duyệt.'
        };
      }
      var sheet = ss.getSheetByName(SHEET_HISTORY);
      if (!sheet) {
        var initRes = initializeSheets();
        if (!initRes.ok) return initRes;
        sheet = ss.getSheetByName(SHEET_HISTORY);
      }

      var rowData = [
        new Date().toISOString(),
        sanitizeCell(record.actionType || 'CALCULATE', 40),
        sanitizeCell(record.expression || '', 120),
        record.lowerBound !== undefined && record.lowerBound !== '' ? Number(record.lowerBound) : '',
        record.upperBound !== undefined && record.upperBound !== '' ? Number(record.upperBound) : '',
        record.signedIntegral !== undefined && record.signedIntegral !== null ? Number(record.signedIntegral) : '',
        record.geometricArea !== undefined && record.geometricArea !== null ? Number(record.geometricArea) : '',
        sanitizeCell(record.note || '', 250)
      ];
      sheet.appendRow(rowData);
      return {
        ok: true,
        message: 'Đã lưu lịch sử học tập vào Google Sheets.'
      };
    } catch (err) {
      return {
        ok: false,
        message: 'Không thể ghi vào Google Sheets (vui lòng kiểm tra quyền): ' + err.message
      };
    }
  }

  /**
   * Đọc các bản ghi lịch sử gần nhất từ Google Sheets.
   * @param {number} limit Số bản ghi tối đa cần lấy.
   * @return {Object} Danh sách bản ghi.
   */
  function readRecentHistory(limit) {
    try {
      var ss = getSpreadsheet();
      if (!ss) {
        return { ok: false, records: [], message: 'Chưa cấu hình Google Sheets.' };
      }
      var sheet = ss.getSheetByName(SHEET_HISTORY);
      if (!sheet || sheet.getLastRow() < 2) {
        return { ok: true, records: [], message: 'Chưa có dữ liệu lịch sử.' };
      }
      var lastRow = sheet.getLastRow();
      var count = Math.min(limit || 15, lastRow - 1);
      var startRow = lastRow - count + 1;
      var data = sheet.getRange(startRow, 1, count, 8).getValues();
      var records = data.reverse().map(function(r) {
        return {
          timestamp: String(r[0]),
          actionType: String(r[1]).replace(/^'/, ''),
          expression: String(r[2]).replace(/^'/, ''),
          lowerBound: r[3],
          upperBound: r[4],
          signedIntegral: r[5],
          geometricArea: r[6],
          note: String(r[7] || '').replace(/^'/, '')
        };
      });
      return { ok: true, records: records };
    } catch (err) {
      return { ok: false, records: [], message: err.message };
    }
  }

  function upsertExampleRow(item) {
    try {
      if (!item || !item.title || !item.expr) {
        return { ok: false, message: 'Thiếu tiêu đề hoặc biểu thức hàm số.' };
      }
      var ss = getSpreadsheet();
      if (!ss) {
        return { ok: false, fallback: true, message: 'Chưa gắn Google Sheets. Đã lưu trong bộ nhớ phiên làm việc.' };
      }
      var sheet = ss.getSheetByName(SHEET_EXAMPLES);
      if (!sheet) {
        var initRes = initializeSheets();
        if (!initRes.ok) return initRes;
        sheet = ss.getSheetByName(SHEET_EXAMPLES);
      }
      var row = [
        sanitizeCell(item.id || ('custom-' + new Date().getTime()), 50),
        sanitizeCell(item.title, 150),
        sanitizeCell(item.category || 'Giải tích', 80),
        sanitizeCell(item.difficulty || 'Trung bình', 40),
        sanitizeCell(item.expr, 120),
        Number(item.a || 0),
        Number(item.b || 1),
        Number(item.initialValue || 0),
        sanitizeCell(item.unit || '', 50),
        sanitizeCell(item.variable || 'x', 10),
        sanitizeCell(item.question || '', 400),
        sanitizeCell(item.meaning || '', 500),
        sanitizeCell(JSON.stringify(item.steps || []), 1500)
      ];
      sheet.appendRow(row);
      return { ok: true, message: 'Đã lưu bài toán mới vào Google Sheets.' };
    } catch (err) {
      return { ok: false, message: 'Lỗi ghi bài toán vào Google Sheets: ' + err.message };
    }
  }

  return {
    sanitizeCell: sanitizeCell,
    upsertExampleRow: upsertExampleRow,
    initializeSheets: initializeSheets,
    readExamplesFromSheet: readExamplesFromSheet,
    appendHistoryRow: appendHistoryRow,
    readRecentHistory: readRecentHistory
  };
})();
