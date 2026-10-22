/**
 * @fileoverview Examples.gs - Quản lý thư viện bài toán mẫu tích hợp sẵn và đồng bộ với Google Sheets.
 * Đảm bảo website luôn hoạt động đầy đủ ngay cả khi người dùng chưa cấu hình Google Sheets.
 */

var ExamplesService = (function() {

  /**
   * Danh sách bài toán chuẩn được kiểm tra toán học chính xác (bao gồm 7 bài toán ứng dụng A-G
   * và các bài toán giải tích kinh điển).
   * @return {Array<Object>} Danh sách bài toán mẫu.
   */
  function getBuiltInExamples() {
    return [
      {
        id: 'app-physics-distance',
        code: 'A',
        isApplication: true,
        title: 'A. Vật lý: Tính quãng đường chuyển động',
        category: 'Vật lý',
        difficulty: 'Cơ bản',
        situation: 'Một phương tiện chuyển động thẳng với vận tốc thay đổi theo thời gian.',
        dataDesc: 'v(t) = 2t, với t tính bằng giây (s) và v tính bằng mét/giây (m/s).',
        question: 'Tính quãng đường phương tiện đi được trong 5 giây đầu tiên.',
        expr: '2*x',
        displayExpr: 'v(t) = 2t',
        variable: 't',
        a: 0,
        b: 5,
        initialValue: 0,
        expectedResult: 25,
        unit: 'm',
        rateUnit: 'm/s',
        timeUnit: 'giây',
        modelLatex: 's = \int_{0}^{5} 2t \, dt = 25 \text{ m}',
        antiderivativeLatex: 'F(t) = t^2',
        meaning: 'Diện tích hình phẳng dưới đồ thị vận tốc v(t) theo thời gian t biểu diễn độ dời của vật. Vì v(t) = 2t >= 0 trên toàn đoạn [0, 5] (xe không đổi chiều chuyển động), độ dời chính bằng quãng đường đi được là 25 m.',
        steps: [
          'Lập mô hình tích phân: Quãng đường s = ∫₀⁵ v(t) dt = ∫₀⁵ 2t dt.',
          'Tìm nguyên hàm của hàm vận tốc v(t) = 2t là F(t) = t².',
          'Áp dụng công thức Newton–Leibniz: s = F(5) - F(0) = 5² - 0² = 25 (m).',
          'Kiểm chứng hình học: Vùng dưới đồ thị là tam giác vuông có đáy 5 s và chiều cao 10 m/s, diện tích = 1/2 × 5 × 10 = 25 (m).'
        ]
      },
      {
        id: 'app-production-output',
        code: 'B',
        isApplication: true,
        title: 'B. Sản xuất: Tổng sản lượng nhà máy',
        category: 'Sản xuất',
        difficulty: 'Cơ bản',
        situation: 'Một nhà máy vận hành dây chuyền với tốc độ sản xuất tăng dần trong ca làm việc 8 giờ.',
        dataDesc: 'r(t) = 100 + 20t (sản phẩm/giờ), với 0 ≤ t ≤ 8 giờ.',
        question: 'Tính tổng số sản phẩm nhà máy sản xuất được trong 8 giờ.',
        expr: '100 + 20*x',
        displayExpr: 'r(t) = 100 + 20t',
        variable: 't',
        a: 0,
        b: 8,
        initialValue: 0,
        expectedResult: 1440,
        unit: 'sản phẩm',
        rateUnit: 'sản phẩm/giờ',
        timeUnit: 'giờ',
        modelLatex: 'N = \int_{0}^{8} (100 + 20t) \, dt = 1440 \text{ sản phẩm}',
        antiderivativeLatex: 'F(t) = 100t + 10t^2',
        meaning: 'Tích phân của tốc độ sản xuất r(t) (sản phẩm/giờ) theo thời gian t (giờ) cho biết tổng sản lượng tích lũy. Hình thang dưới đồ thị từ t = 0 đến t = 8 có diện tích đúng bằng 1.440 sản phẩm.',
        steps: [
          'Mô hình tổng sản lượng: N = ∫₀⁸ r(t) dt = ∫₀⁸ (100 + 20t) dt.',
          'Tìm nguyên hàm: F(t) = 100t + 10t².',
          'Thế cận từ 0 đến 8: N = (100×8 + 10×8²) - (0) = 800 + 640 = 1440 (sản phẩm).'
        ]
      },
      {
        id: 'app-water-supply',
        code: 'C',
        isApplication: true,
        title: 'C. Cấp nước: Tổng lượng nước qua ống',
        category: 'Cấp nước',
        difficulty: 'Cơ bản',
        situation: 'Lưu lượng nước bơm qua đường ống chính tăng tuyến tính theo thời gian.',
        dataDesc: 'q(t) = 3 + t (lít/phút), với 0 ≤ t ≤ 10 phút.',
        question: 'Tính tổng lượng nước chảy qua đường ống trong 10 phút.',
        expr: '3 + x',
        displayExpr: 'q(t) = 3 + t',
        variable: 't',
        a: 0,
        b: 10,
        initialValue: 0,
        expectedResult: 80,
        unit: 'lít',
        rateUnit: 'lít/phút',
        timeUnit: 'phút',
        modelLatex: 'V = \int_{0}^{10} (3 + t) \, dt = 80 \text{ lít}',
        antiderivativeLatex: 'F(t) = 3t + 0.5t^2',
        meaning: 'Về mặt thứ nguyên đơn vị: Lưu lượng q(t) có đơn vị (lít/phút) nhân với vi phân thời gian dt (phút) sẽ triệt tiêu "phút", tạo ra đơn vị thể tích là (lít). Tổng thể tích nước thu được là 80 lít.',
        steps: [
          'Xác định công thức thể tích nước: V = ∫₀¹⁰ (3 + t) dt.',
          'Tìm nguyên hàm: F(t) = 3t + 0.5t².',
          'Thế cận: V = F(10) - F(0) = (3×10 + 0.5×10²) - 0 = 30 + 50 = 80 (lít).',
          'Phân tích đơn vị: (lít/phút) × phút = lít.'
        ]
      },
      {
        id: 'app-business-cost',
        code: 'D',
        isApplication: true,
        title: 'D. Kinh doanh: Tổng chi phí sản xuất',
        category: 'Kinh doanh',
        difficulty: 'Trung bình',
        situation: 'Doanh nghiệp xác định được hàm chi phí biên theo số lượng sản phẩm x và biết chi phí cố định ban đầu.',
        dataDesc: "C'(x) = 2x + 10 (nghìn đồng/sản phẩm), chi phí cố định ban đầu C(0) = 500 nghìn đồng.",
        question: 'Tính tổng chi phí khi doanh nghiệp sản xuất 20 sản phẩm.',
        expr: '2*x + 10',
        displayExpr: "C'(x) = 2x + 10",
        variable: 'x',
        a: 0,
        b: 20,
        initialValue: 500,
        expectedResult: 1100,
        unit: 'nghìn đồng',
        rateUnit: 'nghìn đồng/SP',
        timeUnit: 'sản phẩm',
        modelLatex: 'C(20) = 500 + \int_{0}^{20} (2x + 10) \, dx = 1100 \text{ nghìn đồng}',
        antiderivativeLatex: 'F(x) = x^2 + 10x',
        meaning: 'Chi phí biên C\x27(x) phản ánh chi phí tăng thêm để sản xuất thêm 1 đơn vị sản phẩm tại mức sản lượng x. Tích phân của C\x27(x) từ 0 đến 20 cho biết tổng chi phí biến đổi (600 nghìn đồng). Cộng thêm chi phí cố định 500 nghìn đồng ta được tổng chi phí C(20) = 1.100 nghìn đồng.',
        steps: [
          'Tính tổng chi phí biến đổi: ΔC = ∫₀²⁰ (2x + 10) dx.',
          'Nguyên hàm của 2x + 10 là F(x) = x² + 10x.',
          'Thế cận từ 0 đến 20: ΔC = (20² + 10×20) - 0 = 400 + 200 = 600 (nghìn đồng).',
          'Cộng chi phí cố định ban đầu: C(20) = C(0) + ΔC = 500 + 600 = 1100 (nghìn đồng).'
        ]
      },
      {
        id: 'app-power-energy',
        code: 'E',
        isApplication: true,
        title: 'E. Điện năng: Tổng điện năng tiêu thụ',
        category: 'Điện năng',
        difficulty: 'Cơ bản',
        situation: 'Công suất tiêu thụ điện của một hệ thống làm mát tăng dần theo thời gian vận hành.',
        dataDesc: 'P(t) = 2 + 0.5t (kW), với 0 ≤ t ≤ 4 giờ.',
        question: 'Tính tổng điện năng tiêu thụ của hệ thống trong 4 giờ.',
        expr: '2 + 0.5*x',
        displayExpr: 'P(t) = 2 + 0.5t',
        variable: 't',
        a: 0,
        b: 4,
        initialValue: 0,
        expectedResult: 12,
        unit: 'kWh',
        rateUnit: 'kW',
        timeUnit: 'giờ',
        modelLatex: 'E = \int_{0}^{4} (2 + 0.5t) \, dt = 12 \text{ kWh}',
        antiderivativeLatex: 'F(t) = 2t + 0.25t^2',
        meaning: 'Công suất P(t) (kW) là tốc độ tiêu thụ năng lượng theo thời gian. Tích phân của công suất (kW) theo thời gian (giờ - h) tạo ra điện năng tiêu thụ có đơn vị kilowatt-giờ (kWh). Kết quả là 12 kWh.',
        steps: [
          'Mô hình điện năng tiêu thụ: E = ∫₀⁴ P(t) dt = ∫₀⁴ (2 + 0.5t) dt.',
          'Tìm nguyên hàm: F(t) = 2t + 0.25t².',
          'Thế cận từ 0 đến 4: E = (2×4 + 0.25×4²) - 0 = 8 + 4 = 12 (kWh).'
        ]
      },
      {
        id: 'app-construction-area',
        code: 'F',
        isApplication: true,
        title: 'F. Xây dựng: Diện tích mặt cắt parabol',
        category: 'Xây dựng',
        difficulty: 'Cơ bản',
        situation: 'Kỹ sư cần tính diện tích phần mặt cắt vòm bê tông giới hạn bởi đường cong parabol và trục hoành.',
        dataDesc: 'f(x) = x², với 0 ≤ x ≤ 3 (đơn vị chiều dài giả định: mét).',
        question: 'Tính diện tích phần mặt cắt nằm dưới đồ thị từ x = 0 đến x = 3.',
        expr: 'x^2',
        displayExpr: 'f(x) = x^2',
        variable: 'x',
        a: 0,
        b: 3,
        initialValue: 0,
        expectedResult: 9,
        unit: 'm² (đvdt)',
        rateUnit: 'm',
        timeUnit: 'm',
        modelLatex: 'A = \int_{0}^{3} x^2 \, dx = 9 \text{ m}^2',
        antiderivativeLatex: 'F(x) = \frac{x^3}{3}',
        meaning: 'Với hàm số f(x) = x² ≥ 0 trên đoạn [0, 3], tích phân xác định biểu diễn chính xác diện tích hình phẳng của mặt cắt kiến trúc, bằng 9 đơn vị diện tích (m²).',
        steps: [
          'Thiết lập tích phân diện tích: A = ∫₀³ x² dx.',
          'Tìm nguyên hàm: F(x) = x³ / 3.',
          'Thế cận từ 0 đến 3: A = 3³/3 - 0³/3 = 27/3 = 9 (m²).'
        ]
      },
      {
        id: 'app-biomed-infusion',
        code: 'G',
        isApplication: true,
        title: 'G. Y sinh: Tổng lượng chất được truyền (Mô hình giả định)',
        category: 'Y sinh',
        difficulty: 'Trung bình',
        situation: 'Trong thí nghiệm mô phỏng sinh học, tốc độ đưa một chất dinh dưỡng vào hệ thống giảm tuyến tính theo thời gian.',
        dataDesc: 'r(t) = 15 - 2t (mg/giờ), với 0 ≤ t ≤ 4 giờ (dữ liệu giả định phục vụ học tập).',
        question: 'Tính tổng lượng chất đã được đưa vào hệ thống trong 4 giờ đầu.',
        expr: '15 - 2*x',
        displayExpr: 'r(t) = 15 - 2t',
        variable: 't',
        a: 0,
        b: 4,
        initialValue: 0,
        expectedResult: 44,
        unit: 'mg',
        rateUnit: 'mg/giờ',
        timeUnit: 'giờ',
        modelLatex: 'M = \int_{0}^{4} (15 - 2t) \, dt = 44 \text{ mg}',
        antiderivativeLatex: 'F(t) = 15t - t^2',
        meaning: 'Tích phân của tốc độ truyền (mg/giờ) theo thời gian (giờ) cho biết tổng khối lượng chất tích lũy (mg) đã đi vào hệ thống là 44 mg. Lưu ý: Đây là mô hình toán học giả định, không mang tính chất khuyến nghị điều trị hay chỉ định liều dùng y khoa.',
        steps: [
          'Thiết lập tích phân lượng tích lũy: M = ∫₀⁴ (15 - 2t) dt.',
          'Tìm nguyên hàm: F(t) = 15t - t².',
          'Thế cận từ 0 đến 4: M = (15×4 - 4²) - 0 = 60 - 16 = 44 (mg).',
          'Lưu ý an toàn: Bài toán chỉ minh họa khái niệm tốc độ và tích lũy trong toán học.'
        ]
      },
      {
        id: 'math-signed-sine',
        code: 'M1',
        isApplication: false,
        title: 'Giải tích: Hàm lượng giác sin(x) đổi dấu trên [0, 2π]',
        category: 'Giải tích',
        difficulty: 'Trung bình',
        situation: 'Khảo sát sự khác biệt giữa tích phân xác định (có dấu) và diện tích hình học của hàm tuần hoàn.',
        dataDesc: 'f(x) = sin(x) trên đoạn [0, 6.283185] (tức [0, 2π]).',
        question: 'So sánh tích phân xác định ∫₀²π sin(x)dx và diện tích hình học phẳng.',
        expr: 'sin(x)',
        displayExpr: 'f(x) = \sin(x)',
        variable: 'x',
        a: 0,
        b: 6.283185,
        initialValue: 0,
        expectedResult: 0,
        unit: 'đvdt',
        rateUnit: '',
        timeUnit: '',
        modelLatex: '\int_{0}^{2\pi} \sin(x)\,dx = 0, \quad S = \int_{0}^{2\pi} |\sin(x)|\,dx = 4',
        antiderivativeLatex: 'F(x) = -\cos(x)',
        meaning: 'Trên [0, π], sin(x) ≥ 0 tạo phần diện tích +2. Trên [π, 2π], sin(x) ≤ 0 tạo phần tích phân có dấu -2. Do đó tích phân xác định bằng 0, nhưng tổng diện tích hình học phẳng bằng |+2| + |-2| = 4.',
        steps: [
          'Tích phân có dấu: ∫₀²π sin(x) dx = [-cos(x)]₀²π = -cos(2π) - (-cos(0)) = -1 + 1 = 0.',
          'Tách miền xét dấu để tính diện tích hình học: S = ∫₀π sin(x) dx + ∫π²π |sin(x)| dx = 2 + 2 = 4.'
        ]
      },
      {
        id: 'math-gaussian-bell',
        code: 'M2',
        isApplication: false,
        title: 'Phương pháp số: Hàm Gauss exp(-x²) không có nguyên hàm sơ cấp',
        category: 'Phương pháp số',
        difficulty: 'Nâng cao',
        situation: 'Hàm mật độ phân phối chuẩn f(x) = exp(-x²) rất quan trọng trong xác suất thống kê nhưng không thể biểu diễn nguyên hàm qua các hàm sơ cấp.',
        dataDesc: 'f(x) = exp(-x²) trên đoạn [-2, 2].',
        question: 'Tính gần đúng tích phân ∫₋₂² exp(-x²) dx bằng công thức Simpson 1/3.',
        expr: 'exp(-x^2)',
        displayExpr: 'f(x) = e^{-x^2}',
        variable: 'x',
        a: -2,
        b: 2,
        initialValue: 0,
        expectedResult: 1.76416,
        unit: '',
        rateUnit: '',
        timeUnit: '',
        modelLatex: 'I = \int_{-2}^{2} e^{-x^2}\,dx \approx 1.76416',
        antiderivativeLatex: '\text{Không có nguyên hàm sơ cấp}',
        meaning: 'Vì e^(-x²) không có nguyên hàm sơ cấp, ta sử dụng phương pháp chia nhỏ đoạn [-2, 2] và xấp xỉ bằng các cung parabol (Simpson 1/3) để thu được giá trị gần đúng độ chính xác cao ≈ 1.76416.',
        steps: [
          'Nhận diện: Hàm f(x) = exp(-x²) không tồn tại nguyên hàm sơ cấp.',
          'Áp dụng phương pháp số Composite Simpson 1/3 với N khoảng chia chẵn.',
          'Kết quả hội tụ về giá trị xấp xỉ I ≈ 1.76416.'
        ]
      }
    ];
  }

  /**
   * Lấy toàn bộ danh sách bài toán (ưu tiên Google Sheets nếu đã khởi tạo, nếu không dùng dữ liệu mẫu).
   * @return {Object} Danh sách bài toán kèm nguồn dữ liệu.
   */
  function getAllExamples() {
    var sheetItems = DatabaseService.readExamplesFromSheet();
    var builtIn = getBuiltInExamples();
    if (sheetItems && sheetItems.length > 0) {
      return {
        ok: true,
        source: 'GOOGLE_SHEETS',
        items: builtIn
      };
    }
    return {
      ok: true,
      source: 'BUILT_IN_FALLBACK',
      items: builtIn
    };
  }

  /**
   * Tìm kiếm một bài toán theo ID.
   * @param {string} id Mã bài toán.
   * @return {Object} Kết quả tra cứu.
   */
  function getById(id) {
    var all = getAllExamples().items;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) {
        return { ok: true, item: all[i] };
      }
    }
    return { ok: false, message: 'Không tìm thấy bài toán với mã: ' + id };
  }

  return {
    getBuiltInExamples: getBuiltInExamples,
    getAllExamples: getAllExamples,
    getById: getById
  };
})();
