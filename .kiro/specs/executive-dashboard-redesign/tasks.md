# Kế hoạch triển khai: Executive Dashboard Redesign

## Tổng quan

Thiết kế lại trang Report Page thành Executive Dashboard dạng grid responsive. Triển khai theo thứ tự: utility functions thuần túy (dễ test) → component mới → refactor layout → integration. Mỗi bước xây dựng trên bước trước, không có code treo.

## Tasks

- [x] 1. Thiết lập cơ sở hạ tầng: test framework và utility functions
  - [x] 1.1 Cài đặt và cấu hình test framework
    - Cài đặt `vitest`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` vào devDependencies
    - Thêm script `"test": "vitest --run"` vào package.json
    - Tạo file `vitest.config.ts` với environment jsdom và setup file
    - Tạo file `src/test/setup.ts` import `@testing-library/jest-dom`
    - _Requirements: Tiền đề cho tất cả requirements_

  - [x] 1.2 Tạo utility function `formatCurrency` và `formatDateRange`
    - Tạo file `src/presentation/utils/formatters.ts`
    - `formatCurrency(amount: number): string` — format số thành tiền VNĐ (dấu chấm phân cách, hậu tố "đ")
    - `formatDateRange(from: Date, to: Date): string` — format 2 ngày thành chuỗi "dd/mm/yyyy — dd/mm/yyyy" locale vi-VN
    - _Requirements: 2.2, 3.2_

  - [x] 1.3 Tạo utility function `computeKpis` và `computeCategoryBreakdown`
    - Tạo file `src/presentation/utils/kpiCalculations.ts`
    - `computeKpis(summary: WeeklySummary): KpiValues` — tính tổng chi, số giao dịch, trung bình, top danh mục
    - `computeCategoryBreakdown(byCategory, total): BreakdownItem[]` — tính phần trăm từng danh mục
    - Xử lý edge case: transactions rỗng → average = "0đ", byCategory rỗng → topCategory = "—"
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.3_

  - [ ]* 1.4 Viết property test cho formatCurrency (Property 1)
    - **Property 1: Currency formatting preserves numeric value**
    - **Validates: Requirements 2.2**
    - Tạo file `src/presentation/utils/__tests__/formatters.property.test.ts`
    - Dùng fast-check generate số nguyên không âm, verify format rồi extract digits = giá trị gốc

  - [ ]* 1.5 Viết property test cho formatDateRange (Property 3)
    - **Property 3: Date range formatting produces valid vi-VN output**
    - **Validates: Requirements 3.2**
    - Trong cùng file test, verify output chứa 2 ngày dd/mm/yyyy với from ≤ to

  - [ ]* 1.6 Viết property test cho computeKpis (Property 2)
    - **Property 2: KPI computation correctness**
    - **Validates: Requirements 2.3, 2.4, 2.5**
    - Tạo file `src/presentation/utils/__tests__/kpiCalculations.property.test.ts`
    - Generate WeeklySummary ngẫu nhiên, verify transactionCount, average, topCategory

  - [ ]* 1.7 Viết property test cho computeCategoryBreakdown (Property 4)
    - **Property 4: Category breakdown percentages sum to 100**
    - **Validates: Requirements 4.3**
    - Trong cùng file test, verify tổng percentages ≈ 100 (±1) cho mọi input hợp lệ

- [x] 2. Checkpoint - Đảm bảo utility functions hoạt động đúng
  - Đảm bảo tất cả tests pass, hỏi user nếu có thắc mắc.

- [x] 3. Xây dựng các component mới
  - [x] 3.1 Tạo component KpiCard
    - Tạo file `src/presentation/components/KpiCard.tsx`
    - Nhận props: `label`, `value`, `icon`, `ariaLabel`
    - Render icon phía trên, value lớn font-mono tabular-nums, label nhỏ text-ink-dim
    - Styling: border-line bg-terminal, rounded-lg, hover subtle glow
    - Thêm `aria-label` cho accessibility
    - _Requirements: 2.1, 7.3_

  - [x] 3.2 Tạo component SummaryHeader
    - Tạo file `src/presentation/components/SummaryHeader.tsx`
    - Nhận props: `from`, `to`, `repository`, `token`
    - Render tiêu đề "Báo cáo chi tiêu" font-display cỡ lớn bold
    - Render date range từ `formatDateRange`
    - Đặt ExportButton bên phải (desktop) hoặc dưới tiêu đề (mobile)
    - Sử dụng semantic `<header>` element
    - _Requirements: 3.1, 3.2, 3.3, 7.2_

  - [x] 3.3 Tạo component BreakdownList
    - Tạo file `src/presentation/components/BreakdownList.tsx`
    - Nhận props: `items: BreakdownItem[]`
    - Render mỗi item: tên danh mục, progress bar (width = percentage%), giá trị tiền formatted
    - Sử dụng `formatCurrency` cho giá trị
    - _Requirements: 4.3_

  - [x] 3.4 Tạo component SkeletonDashboard
    - Tạo file `src/presentation/components/SkeletonDashboard.tsx`
    - Render placeholder pulse animation phù hợp grid layout: 4 KPI card placeholders + chart + table
    - Sử dụng Tailwind `animate-pulse` trên `bg-line/50`
    - _Requirements: 6.1_

  - [ ]* 3.5 Viết unit tests cho KpiCard và SummaryHeader
    - Tạo file `src/presentation/components/__tests__/KpiCard.test.tsx`
    - Test render đúng label, value, aria-label
    - Tạo file `src/presentation/components/__tests__/SummaryHeader.test.tsx`
    - Test render tiêu đề, date range, và ExportButton presence
    - _Requirements: 2.1, 3.1, 3.2, 3.3, 7.3_

- [x] 4. Refactor components hiện có
  - [x] 4.1 Nâng cấp CategoryDonutChart với BreakdownList
    - Refactor `src/presentation/components/CategoryDonutChart.tsx`
    - Thêm props `total: number` để tính percentage
    - Tích hợp `BreakdownList` bên cạnh chart (desktop) hoặc phía dưới (mobile)
    - Thêm tooltip hiển thị tên danh mục + giá trị + phần trăm
    - Xử lý empty state: hiển thị "Chưa có dữ liệu danh mục" khi byCategory rỗng
    - Sử dụng `computeCategoryBreakdown` để tính breakdown items
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 4.2 Nâng cấp TransactionTable với pagination và summary row
    - Refactor `src/presentation/components/TransactionTable.tsx`
    - Thêm state `showAll` với PAGE_SIZE = 10
    - Hiển thị tối đa 10 giao dịch ban đầu, nút "Xem thêm" khi có nhiều hơn
    - Thêm summary row cuối bảng hiển thị tổng số tiền
    - Giữ nguyên sort descending by spentAt
    - Sử dụng `formatCurrency` cho số tiền
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 4.3 Viết property test cho sort order (Property 5)
    - **Property 5: Transaction default sort order is descending by date**
    - **Validates: Requirements 5.2**
    - Tạo file `src/presentation/components/__tests__/TransactionTable.property.test.ts`
    - Generate danh sách transactions ngẫu nhiên, verify sort descending by spentAt

  - [ ]* 4.4 Viết property test cho pagination (Property 6)
    - **Property 6: Pagination shows at most PAGE_SIZE items initially**
    - **Validates: Requirements 5.3**
    - Trong cùng file test, verify hiển thị ≤ 10 items ban đầu

  - [ ]* 4.5 Viết property test cho summary row (Property 7)
    - **Property 7: Summary row total equals sum of displayed transaction amounts**
    - **Validates: Requirements 5.4**
    - Verify tổng summary row = sum(all transaction amounts)

- [x] 5. Checkpoint - Đảm bảo các component hoạt động riêng lẻ
  - Đảm bảo tất cả tests pass, hỏi user nếu có thắc mắc.

- [x] 6. Tích hợp DashboardPage và kết nối toàn bộ
  - [x] 6.1 Tạo DashboardPage thay thế ReportPage
    - Tạo file `src/presentation/pages/DashboardPage.tsx`
    - Sử dụng `useWeeklyReport` hook nhận state (loading/error/success)
    - Layout grid: `grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6`
    - Loading → render `SkeletonDashboard`
    - Error → render error card border-amber bg-terminal với message và gợi ý
    - Success → render: SummaryHeader (span 12), 4 KpiCard (mỗi card span 3), CategoryChart (span 5), TransactionTable (span 7)
    - Sử dụng `computeKpis` để tính giá trị cho KPI cards
    - Sử dụng semantic `<main>` và `<section>` elements
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 6.1, 6.2, 7.1, 7.2_

  - [x] 6.2 Cập nhật App.tsx để sử dụng DashboardPage
    - Thay thế import và render `ReportPage` bằng `DashboardPage`
    - Giữ nguyên props truyền vào (repository, token)
    - _Requirements: 1.1_

  - [ ]* 6.3 Viết unit test cho DashboardPage
    - Tạo file `src/presentation/pages/__tests__/DashboardPage.test.tsx`
    - Test loading state renders SkeletonDashboard
    - Test error state renders error card với message
    - Test success state renders tất cả widgets
    - Mock `useWeeklyReport` hook
    - _Requirements: 6.1, 6.2, 1.2_

- [x] 7. Checkpoint cuối cùng - Đảm bảo toàn bộ hệ thống hoạt động
  - Đảm bảo tất cả tests pass, build thành công (`tsc -b && vite build`), hỏi user nếu có thắc mắc.

## Notes

- Tasks có dấu `*` là optional và có thể bỏ qua để ra MVP nhanh hơn
- Mỗi task tham chiếu requirements cụ thể để đảm bảo traceability
- Checkpoints đảm bảo validate incremental — phát hiện lỗi sớm
- Property tests validate tính đúng đắn logic (formatters, calculations)
- Unit tests validate rendering layer (DOM structure, interaction)
- Không thay đổi domain layer hoặc API contract — chỉ refactor presentation layer

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4", "1.5", "1.6", "1.7", "3.1", "3.4"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.5"] },
    { "id": 4, "tasks": ["4.1", "4.2"] },
    { "id": 5, "tasks": ["4.3", "4.4", "4.5"] },
    { "id": 6, "tasks": ["6.1"] },
    { "id": 7, "tasks": ["6.2", "6.3"] }
  ]
}
```
