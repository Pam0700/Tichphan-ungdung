/**
 * @fileoverview Code.gs - Điểm vào chính và bộ điều phối Backend của Integral Lab.
 * Website học tích phân trực quan bằng Google Apps Script HTML Service.
 */

/**
 * Phục vụ giao diện chính của ứng dụng khi người dùng truy cập URL Web App.
 * @param {Object} e Tham số sự kiện truy vấn từ Google Apps Script.
 * @return {HtmlOutput} Trang HTML đã kết xuất.
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Integral Lab – Phòng thí nghiệm tích phân')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Nhúng nội dung của một tệp HTML khác (Styles, Scripts, Graph) vào Index.html.
 * Sử dụng cú pháp <?!= include('TenTep'); ?> trong tệp giao diện.
 * @param {string} filename Tên tệp HTML cần nhúng (không cần đuôi .html).
 * @return {string} Nội dung HTML thô của tệp.
 */
function include(filename) {
  var allowedFiles = ['Styles', 'Scripts', 'Graph'];
  if (allowedFiles.indexOf(filename) === -1) {
    throw new Error('Tệp nhúng không nằm trong danh sách cho phép: ' + filename);
  }
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * API trả về danh sách toàn bộ thư viện bài toán (kết hợp Google Sheets nếu có và dữ liệu mẫu).
 * @return {Object} Đối tượng chứa trạng thái và danh sách bài toán.
 */
function getExamples() {
  return ExamplesService.getAllExamples();
}

/**
 * API lấy thông tin chi tiết của một bài toán theo mã định danh (ID).
 * @param {string} id Mã bài toán cần tra cứu.
 * @return {Object} Đối tượng chứa chi tiết bài toán hoặc thông báo lỗi.
 */
function getExampleById(id) {
  return ExamplesService.getById(id);
}

/**
 * API lưu lịch sử học tập/tính toán vào Google Sheets khi người dùng bật tuỳ chọn lưu.
 * @param {Object} data Dữ liệu phiên học tập từ phía trình duyệt gửi lên.
 * @return {Object} Kết quả lưu lịch sử.
 */
function saveLearningHistory(data) {
  return HistoryService.saveRecord(data);
}

/**
 * API đọc danh sách lịch sử học tập gần đây từ Google Sheets.
 * @return {Object} Danh sách các bản ghi lịch sử gần nhất.
 */
function getLearningHistory() {
  return HistoryService.getRecentRecords(15);
}

/**
 * Hàm khởi tạo cấu trúc cơ sở dữ liệu Google Sheets (Examples và LearningHistory).
 * Quản trị viên chạy hàm này từ trình biên tập Apps Script hoặc gọi từ giao diện.
 * @return {Object} Thông báo trạng thái khởi tạo.
 */
function setupDatabase() {
  return DatabaseService.initializeSheets();
}

/**
 * API phục vụ Dashboard Quản lý: Thêm mới hoặc cập nhật bài toán vào Google Sheets.
 * @param {Object} item Thông tin bài toán từ Dashboard.
 * @return {Object} Kết quả lưu bài toán.
 */
function saveCustomExample(item) {
  return DatabaseService.upsertExampleRow(item);
}
