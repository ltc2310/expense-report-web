# Implementation Plan: Trend Report (Báo cáo Xu hướng)

## Overview

Thêm trang `/trend` vào ứng dụng expense-report-web, cho phép phân tích chi tiêu đa tháng (3–12 tháng) với biểu đồ xu hướng, phân bổ danh mục, và xuất Excel. Triển khai theo Clean Architecture: domain → ports → infrastructure → hooks → utils → components → page → routing.

## Tasks

- [x] 1. Domain entities và port interfaces
  - [x] 1.1 Create domain entities file `src/domain/entities/TrendReport.ts`
    - Define TrendDirection type ("increasing" | "decreasing" | "stable")
    - Define CategoryAmount, MonthlyBreakdown, CategoryTrend, TrendOverview, TrendReport interfaces
    - All types as specified in the design document data models section
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 1.2 Create port interface file `src/domain/ports/TrendRepository.ts`
    - Define TrendRepository interface with fetchTrendReport and exportTrendReport methods
    - Import TrendReport from domain entities
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 2. Infrastructure layer
  - [x] 2.1 Create `src/infrastructure/api/HttpTrendRepository.ts`
    - Implement TrendRepository interface
    - fetchTrendReport: GET /api/report/trend with URL-encoded params (token, months, endMonth)
    - Handle HTTP 200 (parse JSON), 401 (Vietnamese error), 400 (parse message or fallback), other (generic error)
    - exportTrendReport: GET /api/report/trend/export, read Content-Disposition, trigger download via anchor element
    - Follow same patterns as existing HttpReportRepository
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [ ]* 2.2 Write property test for URL encoding `src/infrastructure/api/__tests__/HttpTrendRepository.prop.test.ts`
    - **Property 5: URL query parameters encoding cho fetchTrendReport**
    - Test that token with special characters is properly encodeURIComponent'd
    - Test that months (3–12) appears as valid integer in query string
    - **Validates: Requirements 4.1, 4.6**

  - [ ]* 2.3 Write unit tests for HttpTrendRepository `src/infrastructure/api/__tests__/HttpTrendRepository.test.ts`
    - Test HTTP 200 success parsing
    - Test HTTP 401, 400, 5xx error handling
    - Test export success with Content-Disposition
    - Test export fallback filename
    - Test export error handling
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.7, 4.8, 4.9_

- [x] 3. Application layer hook
  - [x] 3.1 Create `src/application/hooks/useTrendReport.ts`
    - Define TrendReportState type (loading | error | success)
    - Implement useTrendReport hook accepting TrendRepository, token, months
    - Handle token null → error state without API call
    - Clamp months to 6 if outside 3–12 range
    - Use cancelled flag pattern for race conditions (matching existing useWeeklyReport)
    - Refetch when months changes
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 3.2 Write property test for months clamping `src/application/hooks/__tests__/useTrendReport.prop.test.ts`
    - **Property 8: months clamp — giá trị ngoài khoảng 3–12 được mặc định thành 6**
    - Test that out-of-range months values are clamped to 6
    - Test that in-range values (3–12) pass through unchanged
    - **Validates: Requirements 5.6**

  - [ ]* 3.3 Write unit tests for useTrendReport `src/application/hooks/__tests__/useTrendReport.test.ts`
    - Test loading → success transition
    - Test loading → error transition
    - Test token null error state
    - Test cancelled flag on unmount
    - Test refetch on months change
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Presentation utilities
  - [x] 5.1 Create `src/presentation/utils/trendKpiCalculations.ts`
    - Implement computeTrendKpis function
    - Handle empty monthlyBreakdown (return defaults "0đ", "—")
    - Find highest/lowest month by totalSpent (first occurrence on tie)
    - Format values using existing formatCurrency utility
    - Export TrendKpiValues interface
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 7.1, 7.2, 7.3, 7.4, 7.6_

  - [x] 5.2 Create `src/presentation/utils/trendHelpers.ts`
    - Implement getUniqueCategoriesSortedByTotal helper
    - Implement sortCategoryTrendsByAbsChange helper for table sorting
    - Implement classifyDirection helper (changePercent → TrendDirection)
    - _Requirements: 9.2, 10.1, 2.6_

  - [ ]* 5.3 Write property tests for computeTrendKpis `src/presentation/utils/__tests__/trendKpiCalculations.prop.test.ts`
    - **Property 1: computeTrendKpis với monthlyBreakdown rỗng trả về giá trị mặc định**
    - **Property 2: highestMonth luôn là tháng có totalSpent lớn nhất**
    - **Property 3: lowestMonth luôn là tháng có totalSpent nhỏ nhất**
    - **Validates: Requirements 14.2, 14.3, 14.4, 7.3, 7.4, 7.6**

  - [ ]* 5.4 Write property tests for trendHelpers `src/presentation/utils/__tests__/trendHelpers.prop.test.ts`
    - **Property 4: TrendDirection nhất quán với changePercent**
    - **Property 6: getUniqueCategoriesSortedByTotal sắp xếp đúng thứ tự và đầy đủ**
    - **Property 7: CategoryTrendTable sắp xếp theo |changePercent| giảm dần**
    - **Validates: Requirements 2.6, 9.2, 10.1**

- [x] 6. Presentation components - Charts
  - [x] 6.1 Create `src/presentation/components/TrendLineChart.tsx`
    - Register Chart.js modules (CategoryScale, LinearScale, PointElement, LineElement, Tooltip)
    - Render Line chart with jade color, pointRadius 5, tension 0
    - Format Y-axis ticks and tooltip with formatCurrency
    - Show empty state "Chưa có dữ liệu xu hướng" when data is empty
    - Include title "Xu hướng chi tiêu theo tháng"
    - Add aria-label with chart title and time period
    - Use container styling: rounded-lg border border-line bg-terminal p-5
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 13.2_

  - [x] 6.2 Create `src/presentation/components/CategoryStackedChart.tsx`
    - Register Chart.js modules (CategoryScale, LinearScale, BarElement, Tooltip)
    - Render stacked Bar chart using PALETTE from design
    - Use getUniqueCategoriesSortedByTotal for category order
    - Tooltip shows category name, formatted amount, and percentage
    - Show empty state "Chưa có dữ liệu danh mục" when data empty
    - Include title "Phân bổ danh mục theo tháng"
    - Add aria-label with chart title and time period
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 13.2_

- [x] 7. Presentation components - Table and selectors
  - [x] 7.1 Create `src/presentation/components/CategoryTrendTable.tsx`
    - Render HTML table with thead/tbody semantic structure
    - Columns: category name, average monthly (formatCurrency), change percent (+/-), direction indicator
    - Sort by |changePercent| descending using sortCategoryTrendsByAbsChange
    - Direction indicators: amber↑"Tăng", jade↓"Giảm", ink-dim—"Ổn định"
    - Show top growing (max 5) and top shrinking (max 5) sections
    - Show empty state "Chưa có dữ liệu xu hướng danh mục" when categoryTrends is empty
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 13.1_

  - [x] 7.2 Create `src/presentation/components/MonthSelector.tsx`
    - Controlled select component for months 3–12, default 6
    - Label linked via htmlFor/id
    - Keyboard accessible (Tab focus, arrow keys)
    - Visible focus indicator (ring with 3:1 contrast)
    - onChange callback to parent
    - _Requirements: 6.3, 13.5, 13.6_

  - [x] 7.3 Create `src/presentation/components/TrendHeader.tsx`
    - Display title "Báo cáo xu hướng chi tiêu" (font-display, text-3xl, bold, text-ink)
    - Display periodStart — periodEnd in dd/mm/yyyy format
    - Flex-col on mobile, flex-row justify-between on lg
    - Contains MonthSelector and export button slots
    - _Requirements: 6.2, 6.4_

  - [x] 7.4 Create `src/presentation/components/TrendExportButton.tsx`
    - Reuse styling pattern from ExportButton (border-jade, bg-jade/10, font-mono, rounded-lg)
    - Manage loading state: "⏳ Đang tải…", opacity-50, cursor-not-allowed, disabled
    - Show error text below button (amber, font-mono, text-xs)
    - Clear error on retry
    - Call exportTrendReport with current token, months, endMonth
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x] 7.5 Create `src/presentation/components/SkeletonTrendDashboard.tsx`
    - Render animate-pulse placeholders: header, selector, 4 KPI cards, 2 chart areas, 1 table area
    - Use class "animate-pulse rounded-lg bg-line/50"
    - _Requirements: 12.1_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Page component and routing
  - [x] 9.1 Create `src/presentation/pages/TrendDashboardPage.tsx`
    - Accept props: repository (TrendRepository), token (string | null)
    - Use useTrendReport hook with repository, token, months state
    - Compute KPIs via computeTrendKpis
    - Render loading state (SkeletonTrendDashboard)
    - Render error state (amber border card with message)
    - Render hasIncompleteData warning banner above KPI cards
    - Layout: max-w-7xl mx-auto, grid-cols-12 gap-6 on lg, grid-cols-1 gap-4 below
    - Orchestrate all child components: TrendHeader, KPI cards, TrendLineChart, CategoryStackedChart, CategoryTrendTable
    - Semantic HTML: main landmark, section for each group
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 12.1, 12.2, 12.3, 12.4, 12.5, 13.1, 13.4, 13.6_

  - [x] 9.2 Modify `src/App.tsx` to add /trend routing
    - Instantiate HttpTrendRepository with same baseUrl pattern
    - Route /trend path to TrendDashboardPage with token from query params
    - Keep existing "/" route to DashboardPage (backward compatible)
    - Route based on window.location.pathname
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 10. Component unit tests
  - [ ]* 10.1 Write unit tests for TrendDashboardPage `src/presentation/pages/__tests__/TrendDashboardPage.test.tsx`
    - Test loading state renders skeleton
    - Test error state renders amber card with message
    - Test success state renders KPIs, charts, table
    - Test hasIncompleteData banner visibility
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 10.2 Write unit tests for MonthSelector `src/presentation/components/__tests__/MonthSelector.test.tsx`
    - Test renders with default value 6
    - Test onChange callback fires with new value
    - Test keyboard accessibility (Tab, arrow keys)
    - Test label association (htmlFor/id)
    - _Requirements: 6.3, 13.5, 13.6_

  - [ ]* 10.3 Write unit tests for TrendLineChart `src/presentation/components/__tests__/TrendLineChart.test.tsx`
    - Test empty state message renders
    - Test chart renders with data (canvas present)
    - Test aria-label includes title and period
    - _Requirements: 8.1, 8.4, 8.5, 13.2_

  - [ ]* 10.4 Write unit tests for CategoryStackedChart `src/presentation/components/__tests__/CategoryStackedChart.test.tsx`
    - Test empty state message renders
    - Test chart renders with data (canvas present)
    - Test aria-label includes title and period
    - _Requirements: 9.1, 9.4, 9.5, 13.2_

  - [ ]* 10.5 Write unit tests for CategoryTrendTable `src/presentation/components/__tests__/CategoryTrendTable.test.tsx`
    - Test empty state message renders
    - Test direction indicators (colors and text)
    - Test sorting order by |changePercent|
    - Test top growing/shrinking sections
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 10.6 Write unit tests for TrendExportButton `src/presentation/components/__tests__/TrendExportButton.test.tsx`
    - Test loading state (disabled, text change)
    - Test error display below button
    - Test error clears on retry
    - _Requirements: 11.1, 11.2, 11.4, 11.5_

- [x] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All new files follow existing Clean Architecture conventions
- Only `src/App.tsx` is modified among existing files (for routing)
- Vietnamese language used for all user-facing strings

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "5.1", "5.2"] },
    { "id": 3, "tasks": ["2.2", "2.3", "3.1", "5.3", "5.4"] },
    { "id": 4, "tasks": ["3.2", "3.3", "6.1", "6.2"] },
    { "id": 5, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5"] },
    { "id": 6, "tasks": ["9.1"] },
    { "id": 7, "tasks": ["9.2"] },
    { "id": 8, "tasks": ["10.1", "10.2", "10.3", "10.4", "10.5", "10.6"] }
  ]
}
```
