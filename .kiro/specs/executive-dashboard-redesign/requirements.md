# Requirements Document

## Giới thiệu

Thiết kế lại trang Report Page thành một Executive Dashboard chuyên nghiệp, phù hợp cho giám đốc/quản lý cấp cao xem xét chi tiêu hàng tuần. Dashboard mới sẽ có layout dạng grid responsive, thẻ KPI nổi bật, trực quan hoá dữ liệu nâng cao, phân cấp thị giác rõ ràng — tất cả giữ nguyên dark theme hiện có (void/terminal/jade).

## Thuật ngữ

- **Dashboard**: Trang tổng quan hiển thị dữ liệu chi tiêu dưới dạng các widget và biểu đồ
- **KPI_Card**: Thẻ hiển thị một chỉ số quan trọng (Key Performance Indicator) với giá trị nổi bật và nhãn mô tả
- **Summary_Header**: Khu vực phía trên cùng của Dashboard chứa tiêu đề, khoảng thời gian báo cáo và nút hành động
- **Category_Chart**: Biểu đồ trực quan hoá phân bổ chi tiêu theo danh mục
- **Transaction_Table**: Bảng hiển thị chi tiết từng giao dịch với khả năng sắp xếp và lọc
- **Grid_Layout**: Hệ thống bố cục dạng lưới responsive sử dụng CSS Grid/Tailwind grid
- **WeeklySummary**: Đối tượng dữ liệu chứa tổng chi tiêu, phân loại theo danh mục, danh sách giao dịch và khoảng thời gian

## Requirements

### Requirement 1: Bố cục Dashboard dạng Grid Responsive

**User Story:** Là giám đốc, tôi muốn xem báo cáo chi tiêu được trình bày dạng dashboard grid chuyên nghiệp, để tôi có thể nắm bắt thông tin tổng quan nhanh chóng trên mọi kích thước màn hình.

#### Acceptance Criteria

1. THE Dashboard SHALL hiển thị nội dung trong bố cục grid responsive với chiều rộng tối đa là toàn màn hình (full-width với max-width constraint phù hợp cho màn hình lớn)
2. WHILE viewport có chiều rộng từ 1024px trở lên, THE Grid_Layout SHALL hiển thị dạng multi-column grid (tối thiểu 2 cột cho KPI cards, biểu đồ và bảng)
3. WHILE viewport có chiều rộng dưới 1024px, THE Grid_Layout SHALL chuyển sang bố cục single-column xếp chồng (stacked layout)
4. THE Dashboard SHALL giữ nguyên hệ màu dark theme hiện tại (void, terminal, line, ink, jade, amber) và font families (Space Grotesk, Inter, JetBrains Mono)

### Requirement 2: Thẻ KPI nổi bật

**User Story:** Là giám đốc, tôi muốn thấy các chỉ số quan trọng nhất (tổng chi, số giao dịch, chi tiêu trung bình, danh mục chi nhiều nhất) ở vị trí nổi bật, để tôi nắm bắt tình hình tài chính trong vài giây đầu tiên.

#### Acceptance Criteria

1. THE Dashboard SHALL hiển thị tối thiểu 4 KPI_Card bao gồm: tổng chi tiêu, số lượng giao dịch, chi tiêu trung bình mỗi giao dịch, và danh mục chi nhiều nhất
2. WHEN dữ liệu WeeklySummary được tải thành công, THE KPI_Card "Tổng chi tiêu" SHALL hiển thị giá trị total được format theo định dạng tiền tệ Việt Nam (dấu chấm phân cách hàng nghìn, hậu tố "đ")
3. WHEN dữ liệu WeeklySummary được tải thành công, THE KPI_Card "Số giao dịch" SHALL hiển thị tổng số phần tử trong mảng transactions
4. WHEN dữ liệu WeeklySummary được tải thành công, THE KPI_Card "Chi tiêu trung bình" SHALL hiển thị giá trị total chia cho số lượng transactions, format theo tiền tệ Việt Nam
5. WHEN dữ liệu WeeklySummary được tải thành công, THE KPI_Card "Danh mục chi nhiều nhất" SHALL hiển thị tên danh mục có giá trị total cao nhất trong mảng byCategory

### Requirement 3: Summary Header chuyên nghiệp

**User Story:** Là giám đốc, tôi muốn thấy header rõ ràng với tiêu đề, khoảng thời gian và hành động xuất báo cáo, để tôi biết mình đang xem dữ liệu của khoảng thời gian nào.

#### Acceptance Criteria

1. THE Summary_Header SHALL hiển thị tiêu đề "Báo cáo chi tiêu" với font display, cỡ lớn và trọng số bold
2. WHEN dữ liệu WeeklySummary được tải thành công, THE Summary_Header SHALL hiển thị khoảng thời gian báo cáo (from — to) được format theo locale vi-VN
3. THE Summary_Header SHALL chứa nút ExportButton ở vị trí bên phải (trên desktop) hoặc phía dưới tiêu đề (trên mobile)

### Requirement 4: Biểu đồ phân bổ danh mục nâng cao

**User Story:** Là giám đốc, tôi muốn xem biểu đồ phân bổ chi tiêu theo danh mục kèm phần trăm và giá trị cụ thể, để tôi hiểu cơ cấu chi tiêu một cách trực quan.

#### Acceptance Criteria

1. THE Category_Chart SHALL hiển thị biểu đồ doughnut với legend ở bên phải (trên desktop) hoặc phía dưới (trên mobile)
2. WHEN người dùng hover vào một segment của biểu đồ, THE Category_Chart SHALL hiển thị tooltip chứa tên danh mục, giá trị tiền, và phần trăm so với tổng
3. THE Category_Chart SHALL hiển thị danh sách phân bổ (breakdown list) bên cạnh biểu đồ với mỗi danh mục có: tên, giá trị tiền, và thanh progress bar thể hiện tỷ lệ phần trăm
4. WHEN mảng byCategory rỗng, THE Category_Chart SHALL hiển thị trạng thái empty state với thông báo "Chưa có dữ liệu danh mục"

### Requirement 5: Bảng giao dịch chuyên nghiệp

**User Story:** Là giám đốc, tôi muốn xem bảng giao dịch chi tiết với khả năng sắp xếp và giao diện rõ ràng, để tôi có thể đi sâu vào từng khoản chi khi cần.

#### Acceptance Criteria

1. THE Transaction_Table SHALL hiển thị các cột: ngày chi, danh mục, ghi chú, và số tiền với typography rõ ràng và spacing phù hợp
2. THE Transaction_Table SHALL sắp xếp mặc định theo ngày chi (mới nhất lên trên)
3. WHEN danh sách transactions có nhiều hơn 10 mục, THE Transaction_Table SHALL hiển thị tối đa 10 giao dịch ban đầu kèm nút "Xem thêm" để mở rộng
4. THE Transaction_Table SHALL hiển thị hàng tổng cộng (summary row) ở cuối bảng với tổng số tiền
5. WHEN danh sách transactions rỗng, THE Transaction_Table SHALL hiển thị trạng thái empty state phù hợp

### Requirement 6: Trạng thái Loading và Error chuyên nghiệp

**User Story:** Là giám đốc, tôi muốn thấy trạng thái loading và error được thiết kế đẹp mắt và rõ ràng, để trải nghiệm sử dụng mượt mà ngay cả khi đang chờ dữ liệu.

#### Acceptance Criteria

1. WHILE dữ liệu đang được tải, THE Dashboard SHALL hiển thị skeleton loading placeholders tại vị trí của KPI cards, biểu đồ và bảng
2. IF việc tải dữ liệu thất bại, THEN THE Dashboard SHALL hiển thị thông báo lỗi trong một card có viền amber với nội dung lỗi và gợi ý hành động (ví dụ: kiểm tra đường link)

### Requirement 7: Accessibility cơ bản

**User Story:** Là người dùng, tôi muốn dashboard tuân thủ các nguyên tắc accessibility cơ bản, để mọi người đều có thể sử dụng trang một cách hiệu quả.

#### Acceptance Criteria

1. THE Dashboard SHALL đảm bảo tỷ lệ tương phản tối thiểu 4.5:1 cho text content trên nền dark theme
2. THE Dashboard SHALL sử dụng semantic HTML elements (main, header, section, table) cho cấu trúc trang
3. THE KPI_Card SHALL có aria-label mô tả nội dung của thẻ để screen reader có thể đọc được
