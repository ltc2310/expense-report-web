# Requirements Document

## Giới thiệu

Tính năng Báo cáo xu hướng (Trend Report) cho phép người dùng xem phân tích chi tiêu đa tháng (3–12 tháng) với biểu đồ xu hướng tổng quan, phân tích xu hướng theo từng danh mục, và xuất báo cáo Excel nhiều tab. Đây là trang frontend mới (`/trend`) trong ứng dụng webview hiện tại, tiêu thụ API backend `GET /api/report/trend` và `GET /api/report/trend/export`.

## Thuật ngữ

- **Trend_Dashboard**: Trang tổng quan báo cáo xu hướng đa tháng, hiển thị biểu đồ và bảng phân tích
- **Monthly_Breakdown**: Dữ liệu tổng hợp cho một tháng cụ thể gồm: tổng chi, tổng thu, số giao dịch, phân bổ theo danh mục, danh mục chi nhiều nhất
- **Category_Trend**: Xu hướng chi tiêu của một danh mục qua nhiều tháng gồm: mảng giá trị theo tháng, phần trăm thay đổi, hướng xu hướng (tăng/giảm/ổn định), trung bình tháng
- **Trend_Report**: Đối tượng dữ liệu hoàn chỉnh từ API chứa: userId, periodStart, periodEnd, monthsCount, overview, monthlyBreakdown[], categoryTrends[], topGrowingCategories[], topShrinkingCategories[], generatedAt
- **Trend_Direction**: Hướng xu hướng với 3 giá trị: "increasing" (tăng, changePercent > +10%), "decreasing" (giảm, changePercent < -10%), "stable" (ổn định, changePercent trong khoảng ±10%)
- **Month_Selector**: Bộ điều khiển cho phép người dùng chọn số tháng phân tích (3–12 tháng, mặc định 6)
- **Line_Chart**: Biểu đồ đường hiển thị tổng chi theo từng tháng
- **Stacked_Column_Chart**: Biểu đồ cột xếp chồng hiển thị phân bổ danh mục theo từng tháng
- **Trend_Repository**: Interface port để gọi API báo cáo xu hướng, tách biệt khỏi ReportRepository hiện tại
- **Overview_Section**: Khu vực hiển thị các KPI tổng quan của báo cáo xu hướng (tổng chi toàn kỳ, trung bình tháng, tháng chi nhiều nhất, tháng chi ít nhất)

## Requirements

### Requirement 1: Routing và điều hướng trang Trend

**User Story:** Là người dùng, tôi muốn truy cập trang báo cáo xu hướng qua đường dẫn `/trend`, để tôi có thể xem phân tích chi tiêu đa tháng.

#### Acceptance Criteria

1. WHEN URL path là "/trend" và query parameter "token" là chuỗi không rỗng (length ≥ 1), THE App SHALL render trang Trend_Dashboard thay vì DashboardPage hiện tại và truyền giá trị token cho Trend_Dashboard để xác thực API
2. IF URL path là "/trend" và query parameter "token" không tồn tại hoặc là chuỗi rỗng, THEN THE App SHALL hiển thị thông báo lỗi cho người dùng biết rằng trang cần được mở từ bot, và SHALL không render Trend_Dashboard
3. WHEN URL path là "/" hoặc bất kỳ path nào khác ngoài "/trend", THE App SHALL render DashboardPage với logic đọc token từ query params như hiện tại (backward compatible)
4. THE App SHALL thực hiện routing dựa trên window.location.pathname, không yêu cầu full-page reload khi truy cập trực tiếp qua URL

### Requirement 2: Domain entities cho Trend Report

**User Story:** Là lập trình viên, tôi muốn có các TypeScript interfaces rõ ràng cho dữ liệu Trend Report, để code frontend type-safe và dễ bảo trì.

#### Acceptance Criteria

1. THE Trend_Report interface SHALL định nghĩa các trường: userId (string), periodStart (string, format ISO 8601 date YYYY-MM-DD), periodEnd (string, format ISO 8601 date YYYY-MM-DD), monthsCount (number, giá trị từ 3 đến 12), overview (TrendOverview), monthlyBreakdown (MonthlyBreakdown[]), categoryTrends (CategoryTrend[]), topGrowingCategories (CategoryTrend[]), topShrinkingCategories (CategoryTrend[]), generatedAt (string, format ISO 8601 datetime)
2. THE TrendOverview interface SHALL định nghĩa các trường: totalSpent (number, >= 0), averageMonthlySpent (number, >= 0), highestMonth (string, format YYYY-MM), lowestMonth (string, format YYYY-MM), overallDirection (Trend_Direction), overallChangePercent (number), hasIncompleteData (boolean), monthsWithData (number, từ 1 đến 12)
3. THE Monthly_Breakdown interface SHALL định nghĩa các trường: month (string, format YYYY-MM), monthLabel (string, tên hiển thị của tháng), totalSpent (number, >= 0), totalIncome (number, >= 0), transactionCount (number, integer >= 0), byCategory (CategoryAmount[]), topCategory (string)
4. THE CategoryAmount interface SHALL định nghĩa các trường: category (string), amount (number, >= 0)
5. THE Category_Trend interface SHALL định nghĩa các trường: category (string), monthlyAmounts (number[], độ dài bằng monthsCount của Trend_Report chứa nó, mỗi phần tử >= 0), changePercent (number), direction (Trend_Direction), averageMonthly (number, >= 0)
6. THE Trend_Direction type SHALL chỉ chấp nhận 3 giá trị: "increasing" (changePercent > +10), "decreasing" (changePercent < -10), "stable" (changePercent trong khoảng -10 đến +10 inclusive)

### Requirement 3: Port interface cho Trend Repository

**User Story:** Là lập trình viên, tôi muốn có port interface riêng cho Trend Report API, để tuân thủ Clean Architecture và không ảnh hưởng ReportRepository hiện tại.

#### Acceptance Criteria

1. THE Trend_Repository interface SHALL định nghĩa method fetchTrendReport(token: string, months?: number, endMonth?: string) trả về Promise<Trend_Report>, trong đó months chấp nhận giá trị 3–12 và endMonth theo format YYYY-MM
2. THE Trend_Repository interface SHALL định nghĩa method exportTrendReport(token: string, months?: number, endMonth?: string) trả về Promise<void>, với cùng ràng buộc tham số như fetchTrendReport
3. THE Trend_Repository interface SHALL được đặt trong file TrendRepository.ts tại thư mục domain/ports, tách biệt khỏi file ReportRepository.ts hiện tại
4. THE Trend_Repository interface SHALL import và sử dụng type Trend_Report từ domain/entities làm return type cho fetchTrendReport

### Requirement 4: HTTP implementation của Trend Repository

**User Story:** Là lập trình viên, tôi muốn có implementation gọi API backend cho Trend Report, để ứng dụng có thể lấy dữ liệu thực từ server.

#### Acceptance Criteria

1. WHEN fetchTrendReport được gọi, THE HttpTrendRepository SHALL gửi GET request đến {baseUrl}/api/report/trend với query parameters được URL-encoded: token (bắt buộc), months (tuỳ chọn, chỉ gửi khi có giá trị), endMonth (tuỳ chọn, chỉ gửi khi có giá trị)
2. WHEN API trả về status 200, THE HttpTrendRepository SHALL parse response JSON thành đối tượng Trend_Report với tất cả trường giữ nguyên kiểu string (không chuyển đổi date)
3. IF API trả về status 401, THEN THE HttpTrendRepository SHALL throw Error với message "Token không hợp lệ hoặc đã hết hạn"
4. IF API trả về status 400, THEN THE HttpTrendRepository SHALL parse response body JSON lấy trường message để throw Error; nếu parse thất bại, SHALL throw Error với message mặc định "Yêu cầu không hợp lệ"
5. IF API trả về status khác 200, 400, 401, THEN THE HttpTrendRepository SHALL throw Error với message mặc định "Không thể tải báo cáo xu hướng. Vui lòng thử lại sau."
6. WHEN exportTrendReport được gọi, THE HttpTrendRepository SHALL gửi GET request đến {baseUrl}/api/report/trend/export với cùng query parameters (token, months, endMonth) được URL-encoded
7. WHEN export API trả về status 200, THE HttpTrendRepository SHALL đọc filename từ header Content-Disposition (pattern filename="..."); nếu header không tồn tại hoặc không khớp pattern, SHALL sử dụng filename mặc định "trend-report.xlsx"
8. WHEN export API trả về status 200, THE HttpTrendRepository SHALL tạo Blob từ response body, tạo object URL, và trigger download qua invisible anchor element, sau đó revoke object URL
9. IF export API trả về status khác 200, THEN THE HttpTrendRepository SHALL parse response body JSON lấy trường message để throw Error; nếu parse thất bại, SHALL throw Error với message "Không thể xuất báo cáo"

### Requirement 5: Hook useTrendReport

**User Story:** Là lập trình viên, tôi muốn có React hook quản lý state cho Trend Report, để trang Trend_Dashboard có thể dễ dàng load và hiển thị dữ liệu.

#### Acceptance Criteria

1. WHEN hook được mount với token không null và months hợp lệ (3–12), THE useTrendReport SHALL gọi fetchTrendReport(token, months) qua TrendReportRepository port và trả về state { status: "loading" } ngay lập tức
2. WHEN fetchTrendReport trả về thành công, THE useTrendReport SHALL chuyển state sang { status: "success", data: TrendReport }
3. IF fetchTrendReport throw error, THEN THE useTrendReport SHALL chuyển state sang { status: "error", message: error.message } với message là thuộc tính message của Error object
4. IF token là null, THEN THE useTrendReport SHALL chuyển state sang { status: "error", message: thông báo chỉ ra thiếu token } mà không gọi API
5. WHEN tham số months thay đổi trong khoảng 3–12, THE useTrendReport SHALL hủy request đang pending (nếu có) bằng cancelled flag và gọi lại fetchTrendReport với giá trị months mới
6. IF months nằm ngoài khoảng 3–12, THEN THE useTrendReport SHALL sử dụng giá trị mặc định 6 thay vì giá trị được truyền vào
7. WHEN component unmount hoặc dependencies thay đổi trong khi request đang pending, THE useTrendReport SHALL bỏ qua response trả về sau đó (không cập nhật state) bằng cleanup pattern với cancelled flag

### Requirement 6: Trang Trend Dashboard - Layout và Header

**User Story:** Là người dùng, tôi muốn trang báo cáo xu hướng có layout chuyên nghiệp nhất quán với trang Dashboard hiện tại, để trải nghiệm đồng nhất trên toàn ứng dụng.

#### Acceptance Criteria

1. THE Trend_Dashboard SHALL sử dụng cùng hệ màu dark theme (void, terminal, line, ink, ink-dim, jade, amber) và font families (Space Grotesk cho display, Inter cho body, JetBrains Mono cho mono) được định nghĩa trong Tailwind config của dự án
2. THE Trend_Dashboard SHALL hiển thị header với cấu trúc: tiêu đề "Báo cáo xu hướng chi tiêu" (font-display, text-3xl, bold, text-ink), khoảng thời gian periodStart — periodEnd theo format dd/mm/yyyy (text-sm, text-ink-dim), và nút xuất Excel; header sử dụng layout flex-col trên mobile và flex-row căn justify-between trên viewport >= 1024px
3. THE Trend_Dashboard SHALL hiển thị Month_Selector cho phép chọn số tháng phân tích trong khoảng 3–12 với giá trị mặc định là 6
4. WHEN người dùng thay đổi giá trị Month_Selector, THE Trend_Dashboard SHALL cập nhật periodStart, periodEnd hiển thị trên header và tải lại dữ liệu xu hướng tương ứng với khoảng thời gian mới
5. WHILE viewport có chiều rộng từ 1024px trở lên, THE Trend_Dashboard SHALL hiển thị bố cục grid 12 cột (grid-cols-12) với gap 24px, bọc trong container max-w-7xl căn giữa với padding px-4 py-10
6. WHILE viewport có chiều rộng dưới 1024px, THE Trend_Dashboard SHALL chuyển sang bố cục single-column (grid-cols-1) xếp chồng với gap 16px

### Requirement 7: Overview KPI Cards

**User Story:** Là người dùng, tôi muốn thấy các chỉ số tổng quan của kỳ báo cáo xu hướng, để tôi nắm bắt nhanh hiệu suất chi tiêu qua nhiều tháng.

#### Acceptance Criteria

1. WHEN dữ liệu Trend_Report được tải thành công, THE Trend_Dashboard SHALL hiển thị KPI card "Tổng chi toàn kỳ" với giá trị overview.totalSpent format tiền tệ Việt Nam (sử dụng formatCurrency, ví dụ 1500000 → "1.500.000đ")
2. WHEN dữ liệu Trend_Report được tải thành công, THE Trend_Dashboard SHALL hiển thị KPI card "Trung bình tháng" với giá trị overview.averageMonthly format tiền tệ Việt Nam (sử dụng formatCurrency)
3. WHEN dữ liệu Trend_Report được tải thành công, THE Trend_Dashboard SHALL hiển thị KPI card "Tháng chi nhiều nhất" với giá trị là monthLabel của phần tử monthlyBreakdown có totalSpent cao nhất; nếu nhiều tháng có cùng totalSpent cao nhất, SHALL chọn tháng xuất hiện sớm nhất theo thứ tự chronological
4. WHEN dữ liệu Trend_Report được tải thành công, THE Trend_Dashboard SHALL hiển thị KPI card "Tháng chi ít nhất" với giá trị là monthLabel của phần tử monthlyBreakdown có totalSpent thấp nhất; nếu nhiều tháng có cùng totalSpent thấp nhất, SHALL chọn tháng xuất hiện sớm nhất theo thứ tự chronological
5. THE mỗi KPI_Card SHALL tái sử dụng component KpiCard hiện tại, truyền props: label (tên chỉ số), value (giá trị đã format), và ariaLabel theo format "{label}: {value}"
6. WHEN monthlyBreakdown rỗng (mảng có length bằng 0), THE Trend_Dashboard SHALL hiển thị 4 KPI cards với giá trị mặc định: "0đ" cho Tổng chi toàn kỳ và Trung bình tháng, "—" cho Tháng chi nhiều nhất và Tháng chi ít nhất
7. THE Trend_Dashboard SHALL hiển thị 4 KPI cards trong layout grid responsive: 4 cột trên viewport từ 1024px trở lên, 2 cột trên viewport dưới 1024px

### Requirement 8: Biểu đồ đường xu hướng tổng chi theo tháng

**User Story:** Là người dùng, tôi muốn xem biểu đồ đường thể hiện tổng chi theo từng tháng, để tôi nhận biết xu hướng chi tiêu tăng hay giảm qua thời gian.

#### Acceptance Criteria

1. WHEN dữ liệu Trend_Report được tải thành công, THE Line_Chart SHALL hiển thị biểu đồ đường với trục X là monthLabel và trục Y là totalSpent, trong đó trục Y bắt đầu từ 0 và tick labels hiển thị giá trị format tiền tệ Việt Nam (sử dụng formatCurrency)
2. THE Line_Chart SHALL sử dụng màu jade (#4ADE80) cho đường biểu đồ và điểm dữ liệu, với đường nét liền (solid line) và điểm dữ liệu dạng hình tròn
3. WHEN người dùng hover vào một điểm dữ liệu, THE Line_Chart SHALL hiển thị tooltip với monthLabel và giá trị totalSpent format tiền tệ Việt Nam
4. THE Line_Chart SHALL hiển thị tiêu đề "Xu hướng chi tiêu theo tháng" phía trên biểu đồ, sử dụng class "font-display text-sm font-semibold text-ink"
5. WHEN monthlyBreakdown rỗng (không có dữ liệu), THE Line_Chart SHALL hiển thị empty state với thông báo "Chưa có dữ liệu xu hướng"
6. THE Line_Chart SHALL sử dụng container styling nhất quán với CategoryDonutChart (rounded-lg border border-line bg-terminal p-5) và màu trục/grid phù hợp dark theme (text ink-dim cho labels, border-line cho grid lines)

### Requirement 9: Biểu đồ cột xếp chồng phân bổ danh mục theo tháng

**User Story:** Là người dùng, tôi muốn xem biểu đồ cột xếp chồng thể hiện phân bổ chi tiêu theo danh mục qua từng tháng, để tôi hiểu cơ cấu chi tiêu thay đổi thế nào theo thời gian.

#### Acceptance Criteria

1. WHEN dữ liệu Trend_Report được tải thành công, THE Stacked_Column_Chart SHALL hiển thị biểu đồ cột xếp chồng với trục X là monthLabel, trục Y là giá trị tuyệt đối (VND) với scale tự động, và mỗi segment trong cột là một danh mục từ byCategory của tháng tương ứng
2. THE Stacked_Column_Chart SHALL gán màu cho mỗi danh mục bằng cách sử dụng cùng PALETTE array như CategoryDonutChart, với thứ tự index dựa trên danh sách tất cả danh mục duy nhất (union across all months) sắp xếp theo tổng chi giảm dần; nếu số danh mục vượt quá 12, màu SHALL lặp lại từ đầu PALETTE (modulo index)
3. WHEN người dùng hover vào một segment, THE Stacked_Column_Chart SHALL hiển thị tooltip với tên danh mục, giá trị tiền format tiền tệ Việt Nam (dùng formatCurrency), và phần trăm so với tổng tháng đó làm tròn đến số nguyên gần nhất
4. THE Stacked_Column_Chart SHALL hiển thị tiêu đề "Phân bổ danh mục theo tháng" phía trên biểu đồ
5. IF monthlyBreakdown là mảng rỗng hoặc tất cả tháng có byCategory rỗng, THEN THE Stacked_Column_Chart SHALL hiển thị empty state với thông báo "Chưa có dữ liệu danh mục" thay vì biểu đồ

### Requirement 10: Bảng xu hướng danh mục

**User Story:** Là người dùng, tôi muốn xem bảng liệt kê xu hướng chi tiêu từng danh mục (tăng/giảm/ổn định), để tôi biết danh mục nào cần chú ý.

#### Acceptance Criteria

1. WHEN dữ liệu Trend_Report được tải thành công, THE Trend_Dashboard SHALL hiển thị bảng "Xu hướng theo danh mục" với các cột: tên danh mục, trung bình tháng (format tiền tệ Việt Nam), phần trăm thay đổi (hiển thị dấu +/- và 1 chữ số thập phân, ví dụ "+12.3%"), hướng xu hướng — các danh mục được sắp xếp theo giá trị tuyệt đối của changePercent giảm dần
2. WHEN direction là "increasing", THE bảng SHALL hiển thị indicator màu amber với mũi tên lên và text "Tăng"
3. WHEN direction là "decreasing", THE bảng SHALL hiển thị indicator màu jade với mũi tên xuống và text "Giảm"
4. WHEN direction là "stable", THE bảng SHALL hiển thị indicator màu ink-dim với dấu ngang và text "Ổn định"
5. WHEN dữ liệu Trend_Report được tải thành công, THE bảng SHALL hiển thị section "Tăng mạnh nhất" với tối đa 5 mục từ topGrowingCategories và section "Giảm mạnh nhất" với tối đa 5 mục từ topShrinkingCategories
6. IF categoryTrends là mảng rỗng, THEN THE Trend_Dashboard SHALL hiển thị empty state với thông báo "Chưa có dữ liệu xu hướng danh mục" thay vì bảng

### Requirement 11: Xuất báo cáo Excel nhiều tab

**User Story:** Là người dùng, tôi muốn xuất báo cáo xu hướng thành file Excel nhiều tab, để tôi có thể lưu trữ và chia sẻ dữ liệu phân tích ngoại tuyến.

#### Acceptance Criteria

1. WHEN người dùng nhấn nút "Xuất file Excel", THE Trend_Dashboard SHALL gọi exportTrendReport từ Trend_Repository với token, months, và endMonth hiện tại
2. WHILE export đang được xử lý, THE nút xuất SHALL hiển thị text "⏳ Đang tải…", áp dụng opacity-50 và cursor-not-allowed, và bị vô hiệu hoá (disabled) để ngăn nhấn lại
3. WHEN export thành công và response có Content-Disposition header, THE browser SHALL tải xuống file Excel với filename trích xuất từ header đó; IF Content-Disposition header không tồn tại, THEN THE browser SHALL sử dụng filename mặc định "trend-report.xlsx"
4. IF export thất bại, THEN THE Trend_Dashboard SHALL hiển thị message lỗi từ Error object (error.message) bằng text màu amber, font-mono, text-xs, đặt bên dưới nút xuất
5. WHEN người dùng nhấn nút xuất lại sau lỗi, THE Trend_Dashboard SHALL xoá thông báo lỗi trước đó trước khi bắt đầu request mới
6. THE nút xuất Excel SHALL tái sử dụng pattern styling từ ExportButton hiện tại (border-jade, bg-jade/10, font-mono, rounded-lg, hover:bg-jade/20, active:scale-95)

### Requirement 12: Trạng thái Loading và Error

**User Story:** Là người dùng, tôi muốn thấy trạng thái loading và error rõ ràng khi trang đang tải hoặc gặp lỗi, để trải nghiệm sử dụng mượt mà.

#### Acceptance Criteria

1. WHILE dữ liệu Trend_Report đang được tải, THE Trend_Dashboard SHALL hiển thị skeleton loading placeholders bao gồm: 1 header placeholder, 1 Month_Selector placeholder, 4 KPI card placeholders, 2 chart placeholders (Line_Chart và Stacked_Column_Chart), và 1 bảng placeholder — sử dụng class "animate-pulse rounded-lg bg-line/50"
2. IF việc tải dữ liệu thất bại với lỗi token (message chứa "Token không hợp lệ hoặc đã hết hạn"), THEN THE Trend_Dashboard SHALL hiển thị thông báo "Token không hợp lệ hoặc đã hết hạn" trong card viền amber (border-amber, bg-terminal, text-center) thay thế toàn bộ nội dung dashboard
3. IF việc tải dữ liệu thất bại với lỗi khác (message không khớp lỗi token), THEN THE Trend_Dashboard SHALL hiển thị message lỗi từ server trong card viền amber kèm gợi ý "Vui lòng kiểm tra lại đường link báo cáo" bên dưới, thay thế toàn bộ nội dung dashboard
4. WHEN Trend_Report được tải thành công và có trường hasIncompleteData bằng true, THE Trend_Dashboard SHALL hiển thị banner cảnh báo "Dữ liệu chưa đầy đủ cho toàn bộ kỳ báo cáo" phía trên Overview_Section (trước KPI cards) với styling viền amber
5. IF token không tồn tại (null hoặc rỗng), THEN THE Trend_Dashboard SHALL hiển thị thông báo lỗi yêu cầu mở trang từ bot trong card viền amber thay thế toàn bộ nội dung dashboard

### Requirement 13: Accessibility

**User Story:** Là người dùng, tôi muốn trang báo cáo xu hướng tuân thủ các nguyên tắc accessibility cơ bản, để mọi người đều có thể sử dụng trang hiệu quả.

#### Acceptance Criteria

1. THE Trend_Dashboard SHALL sử dụng semantic HTML elements cho cấu trúc trang: main làm landmark chính, section cho mỗi nhóm nội dung (KPI, biểu đồ, bảng), và table với thead/tbody cho bảng xu hướng danh mục
2. THE Line_Chart SHALL có aria-label bao gồm tiêu đề biểu đồ và khoảng thời gian; THE Stacked_Column_Chart SHALL có aria-label tương tự bao gồm tiêu đề và khoảng thời gian
3. THE KPI_Card SHALL có aria-label theo format "{label}: {value}" (tái sử dụng pattern ariaLabel prop của component KpiCard hiện tại) để screen reader đọc được
4. THE Trend_Dashboard SHALL đảm bảo tỷ lệ tương phản tối thiểu 4.5:1 cho text kích thước dưới 18px và tối thiểu 3:1 cho text kích thước từ 18px trở lên trên nền dark theme
5. THE Month_Selector SHALL có label liên kết qua thuộc tính htmlFor/id, hỗ trợ focus bằng phím Tab, và cho phép thay đổi giá trị bằng keyboard
6. THE Trend_Dashboard SHALL hiển thị visible focus indicator (outline hoặc ring có tỷ lệ tương phản tối thiểu 3:1 so với nền) trên tất cả interactive elements khi nhận focus bằng keyboard
7. THE Line_Chart và Stacked_Column_Chart SHALL cung cấp nội dung thay thế cho screen reader dưới dạng visually-hidden data table hoặc aria-describedby trỏ đến mô tả tóm tắt dữ liệu

### Requirement 14: Tính toán xu hướng phía client (utility)

**User Story:** Là lập trình viên, tôi muốn có utility function để xác định tháng chi nhiều nhất và ít nhất từ dữ liệu Trend_Report, để logic hiển thị KPI tách biệt khỏi component.

#### Acceptance Criteria

1. THE computeTrendKpis function SHALL nhận Trend_Report và trả về object TrendKpiValues chứa: totalFormatted (string, overview.totalSpent qua formatCurrency), averageMonthlyFormatted (string, overview.averageMonthly qua formatCurrency), highestMonth (string, monthLabel), lowestMonth (string, monthLabel)
2. WHEN monthlyBreakdown rỗng (length === 0), THE computeTrendKpis SHALL trả về giá trị mặc định: "0đ" cho totalFormatted và averageMonthlyFormatted, "—" cho highestMonth và lowestMonth
3. WHEN monthlyBreakdown không rỗng, THE computeTrendKpis SHALL trả về highestMonth là monthLabel của phần tử có totalSpent lớn nhất; nếu nhiều phần tử cùng giá trị lớn nhất, SHALL chọn phần tử xuất hiện đầu tiên trong mảng
4. WHEN monthlyBreakdown không rỗng, THE computeTrendKpis SHALL trả về lowestMonth là monthLabel của phần tử có totalSpent nhỏ nhất; nếu nhiều phần tử cùng giá trị nhỏ nhất, SHALL chọn phần tử xuất hiện đầu tiên trong mảng
