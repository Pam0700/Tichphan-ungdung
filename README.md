# INTEGRAL LAB – PHÒNG THÍ NGHIỆM TÍCH PHÂN (GOOGLE APPS SCRIPT)

Website học tích phân trực quan thông qua đồ thị tương tác, công thức toán học, 7 mô hình ứng dụng thực tế và hệ thống bài tập luyện tập 3 cấp độ.

## 1. Kiến trúc hệ thống và Danh sách 8 tệp mã nguồn

Dự án tuân thủ kiến trúc tách lớp của **Google Apps Script HTML Service**:

| STT | Tên tệp trên Apps Script | Loại tệp | Vai trò & Chức năng chính |
| :--- | :--- | :--- | :--- |
| 1 | `Code.gs` | Mã nguồn (`.gs`) | Điểm vào `doGet(e)`, hàm `include(filename)` ghép giao diện và các hàm API điều phối (`getExamples`, `getExampleById`, `saveLearningHistory`, `setupDatabase`). |
| 2 | `Database.gs` | Mã nguồn (`.gs`) | Kết nối Google Sheets, khởi tạo 2 trang tính `Examples` và `LearningHistory`, lọc chống lỗ hổng Formula Injection (`sanitizeCell`) và xử lý lỗi khi chưa cấp quyền. |
| 3 | `Examples.gs` | Mã nguồn (`.gs`) | Quản lý kho bài toán mẫu tích hợp sẵn (7 ứng dụng thực tế A–G + bài toán giải tích/phương pháp số) và đồng bộ với Google Sheets. |
| 4 | `History.gs` | Mã nguồn (`.gs`) | Kiểm tra quyền riêng tư (`consent === true`), xác thực biểu thức đầu vào và lưu lịch sử học tập vào trang tính `LearningHistory`. |
| 5 | `Index.html` | HTML (`.html`) | Khung giao diện chính gồm 5 trang: Trang chủ, Máy tính tích phân, Ứng dụng thực tế, Thư viện bài toán, Bài tập luyện tập. |
| 6 | `Styles.html` | HTML (`.html`) | Toàn bộ định kiểu CSS3 tối giản, hiện đại, tương thích responsive trên máy tính, máy tính bảng và điện thoại. |
| 7 | `Graph.html` | HTML (`.html`) | Module vẽ đồ thị tương tác bằng `Plotly.js`, tô màu phân biệt vùng tích phân dương ($f(x) \ge 0$) và vùng âm ($f(x) < 0$), tải ảnh PNG. |
| 8 | `Scripts.html` | HTML (`.html`) | Bộ phân tích biểu thức an toàn bằng `Math.js` (không dùng `eval`), tính tích phân số Composite Simpson 1/3, giải thích từng bước và kết nối `google.script.run`. |

## 2. Hướng dẫn triển khai từng bước trên Google Apps Script

1. **Bước 1 – Tạo dự án Google Apps Script**:
   - Truy cập [script.google.com](https://script.google.com) và nhấn **Dự án mới (New project)**, hoặc mở một tệp Google Sheets trên [sheets.google.com](https://sheets.google.com) rồi chọn **Tiện ích mở rộng (Extensions) → Apps Script**.
   - Đặt tên dự án là `Integral Lab – Phòng thí nghiệm tích phân`.
2. **Bước 2 – Tạo 8 tệp mã nguồn**:
   - Tạo 4 tệp Tập lệnh (`.gs`): `Code.gs`, `Database.gs`, `Examples.gs`, `History.gs` (lưu ý trên giao diện Apps Script chỉ gõ tên không kèm đuôi `.gs`).
   - Tạo 4 tệp HTML (`.html`): Nhấn dấu `+` → chọn **HTML** và lần lượt tạo `Index`, `Styles`, `Graph`, `Scripts`.
   - Sao chép nội dung tương ứng của từng tệp từ bộ mã nguồn vào trình biên tập và nhấn `Ctrl + S` để lưu.
3. **Bước 3 – Tạo hoặc liên kết Google Sheets**:
   - Nếu bạn mở Apps Script từ một tệp Google Sheets (Container-bound script), hệ thống sẽ tự động nhận diện bảng tính đó qua `SpreadsheetApp.getActiveSpreadsheet()`.
   - Nếu bạn tạo dự án độc lập (Standalone script), hàm `setupDatabase()` sẽ tự động khởi tạo một tệp Google Sheets mới tên là `Integral_Lab_Database` và lưu ID vào `ScriptProperties`.
4. **Bước 4 – Cấp quyền cần thiết**:
   - Trên thanh công cụ trình biên tập, chọn tệp `Code.gs`, chọn hàm `setupDatabase` trong danh sách thả xuống và nhấn **Chạy (Run)**.
   - Khi hộp thoại yêu cầu cấp quyền xuất hiện, chọn **Xem lại quyền (Review permissions)** → chọn tài khoản Google → nhấn **Nâng cao (Advanced)** → **Đi tới Integral Lab (Go to Integral Lab)** → **Cho phép (Allow)**.
5. **Bước 5 – Chạy hàm `setupDatabase()`**:
   - Sau khi cấp quyền, hàm `setupDatabase()` sẽ tự động tạo 2 trang tính `Examples` (chứa thư viện bài toán) và `LearningHistory` (chứa lịch sử học tập) kèm dòng tiêu đề cột in đậm.
   - Ngay cả khi bạn bỏ qua bước này, website vẫn hoạt động hoàn chỉnh nhờ bộ thư viện bài toán mẫu tích hợp sẵn trong `Examples.gs` và `Scripts.html`.
6. **Bước 6 – Triển khai dưới dạng Web App**:
   - Nhấn nút **Triển khai (Deploy)** ở góc phải trên cùng → chọn **Tạo bản triển khai mới (New deployment)**.
   - Nhấn biểu tượng bánh răng cạnh mục *Chọn loại (Select type)* → chọn **Ứng dụng web (Web app)**.
7. **Bước 7 – Cấu hình quyền truy cập phù hợp**:
   - **Mô tả**: `Phiên bản MVP 1.0 - Integral Lab`.
   - **Thực thi dưới dạng (Execute as)**: Chọn **Tôi (Me)** để ứng dụng sử dụng quyền ghi Google Sheets của bạn mà không bắt người học đăng nhập mật khẩu.
   - **Ai có quyền truy cập (Who has access)**: Chọn **Bất kỳ ai (Anyone)** nếu muốn chia sẻ công khai cho học sinh/sinh viên, hoặc **Bất kỳ ai có tài khoản Google**.
   - Nhấn **Triển khai (Deploy)**.
8. **Bước 8 – Mở URL để kiểm tra**:
   - Sao chép đường dẫn **URL ứng dụng web (Web app URL)** có đuôi `/exec` và mở trên trình duyệt máy tính hoặc điện thoại để kiểm tra toàn bộ 5 trang.
9. **Bước 9 – Cập nhật và triển khai phiên bản mới**:
   - Mỗi khi chỉnh sửa mã nguồn trong các tệp `.gs` hoặc `.html`, hãy nhấn `Ctrl + S` để lưu.
   - Vào **Triển khai (Deploy) → Quản lý các bản triển khai (Manage deployments)** → nhấn biểu tượng cây bút (Chỉnh sửa) → ở mục **Phiên bản (Version)** chọn **Phiên bản mới (New version)** → nhấn **Triển khai (Deploy)** để cập nhật lên URL `/exec` hiện tại.
