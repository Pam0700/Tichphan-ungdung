/**
 * @fileoverview History.gs - Kiểm soát quyền riêng tư và lưu trữ lịch sử học tập.
 * Chỉ lưu khi người dùng chủ động bật tuỳ chọn đồng ý (consent = true).
 */

var HistoryService = (function() {

  /**
   * Kiểm tra tính hợp lệ và lưu bản ghi lịch sử học tập vào Google Sheets.
   * @param {Object} payload Dữ liệu gửi từ trình duyệt.
   * @return {Object} Phản hồi trạng thái lưu.
   */
  function saveRecord(payload) {
    if (!payload || typeof payload !== 'object') {
      return { ok: false, message: 'Dữ liệu lịch sử không hợp lệ.' };
    }

    // Tuân thủ quyền riêng tư: không lưu nếu người dùng chưa bật công tắc lưu lịch sử
    if (payload.consent !== true) {
      return {
        ok: false,
        skipped: true,
        message: 'Chế độ lưu lịch sử đang tắt. Không ghi dữ liệu lên máy chủ.'
      };
    }

    var expr = String(payload.expression || '').trim();
    if (!expr || expr.length > 120) {
      return { ok: false, message: 'Biểu thức trống hoặc vượt quá độ dài cho phép (120 ký tự).' };
    }

    // Chỉ chấp nhận các ký tự toán học an toàn
    if (!/^[0-9a-zA-Z_+\-*/^().\s,]+$/.test(expr)) {
      return { ok: false, message: 'Biểu thức chứa ký tự không hợp lệ.' };
    }

    var cleanRecord = {
      actionType: String(payload.actionType || 'CALCULATE').substring(0, 40),
      expression: expr,
      lowerBound: payload.lowerBound !== undefined && payload.lowerBound !== '' ? Number(payload.lowerBound) : '',
      upperBound: payload.upperBound !== undefined && payload.upperBound !== '' ? Number(payload.upperBound) : '',
      signedIntegral: payload.signedIntegral !== undefined && payload.signedIntegral !== null ? Number(payload.signedIntegral) : '',
      geometricArea: payload.geometricArea !== undefined && payload.geometricArea !== null ? Number(payload.geometricArea) : '',
      note: String(payload.note || '').substring(0, 250)
    };

    return DatabaseService.appendHistoryRow(cleanRecord);
  }

  /**
   * Lấy danh sách bản ghi lịch sử gần đây.
   * @param {number} limit Số lượng bản ghi tối đa.
   * @return {Object} Danh sách lịch sử.
   */
  function getRecentRecords(limit) {
    return DatabaseService.readRecentHistory(limit || 15);
  }

  return {
    saveRecord: saveRecord,
    getRecentRecords: getRecentRecords
  };
})();
