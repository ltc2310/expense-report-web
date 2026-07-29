import { useState } from "react";
import { TrendRepository } from "../../domain/ports/TrendRepository";
import { useTrendReport } from "../../application/hooks/useTrendReport";
import { computeTrendKpis } from "../utils/trendKpiCalculations";
import SkeletonTrendDashboard from "../components/SkeletonTrendDashboard";
import { TrendHeader } from "../components/TrendHeader";
import { MonthSelector } from "../components/MonthSelector";
import { TrendExportButton } from "../components/TrendExportButton";
import { KpiCard } from "../components/KpiCard";
import { TrendLineChart } from "../components/TrendLineChart";
import { CategoryStackedChart } from "../components/CategoryStackedChart";
import { CategoryTrendTable } from "../components/CategoryTrendTable";

interface TrendDashboardPageProps {
  repository: TrendRepository;
  token: string | null;
}

/**
 * Formats an ISO date string "YYYY-MM-DD" to "dd/mm/yyyy".
 */
function formatDateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function TrendDashboardPage({ repository, token }: TrendDashboardPageProps) {
  const [months, setMonths] = useState(6);
  const state = useTrendReport(repository, token, months);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10">
      {state.status === "loading" && <SkeletonTrendDashboard />}

      {state.status === "error" && (
        <section className="rounded-lg border border-amber bg-terminal p-6 text-center">
          <p className="font-mono text-sm text-amber">{state.message}</p>
          <p className="mt-2 text-sm text-ink-dim">
            Vui lòng kiểm tra lại đường link báo cáo
          </p>
        </section>
      )}

      {state.status === "success" && (() => {
        const periodLabel = `${formatDateLabel(state.data.periodStart)} — ${formatDateLabel(state.data.periodEnd)}`;
        const kpis = computeTrendKpis(state.data);

        return (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            {/* Header section */}
            <div className="col-span-1 lg:col-span-12">
              <TrendHeader periodLabel={periodLabel}>
                <MonthSelector value={months} onChange={setMonths} />
                <TrendExportButton
                  repository={repository}
                  token={token!}
                  months={months}
                />
              </TrendHeader>
            </div>

            {/* Incomplete data warning banner */}
            {state.data.overview.hasIncompleteData && (
              <div className="col-span-1 lg:col-span-12">
                <div className="rounded-lg border border-amber bg-terminal p-4 text-center">
                  <p className="font-mono text-sm text-amber">
                    Dữ liệu chưa đầy đủ cho toàn bộ kỳ báo cáo
                  </p>
                </div>
              </div>
            )}

            {/* KPI Cards section */}
            <section
              className="col-span-1 lg:col-span-12"
              aria-label="Chỉ số tổng quan"
            >
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KpiCard
                  icon="💰"
                  label="Tổng chi toàn kỳ"
                  value={kpis.totalFormatted}
                  ariaLabel={`Tổng chi toàn kỳ: ${kpis.totalFormatted}`}
                />
                <KpiCard
                  icon="📊"
                  label="Trung bình tháng"
                  value={kpis.averageMonthlyFormatted}
                  ariaLabel={`Trung bình tháng: ${kpis.averageMonthlyFormatted}`}
                />
                <KpiCard
                  icon="📈"
                  label="Tháng chi nhiều nhất"
                  value={kpis.highestMonth}
                  ariaLabel={`Tháng chi nhiều nhất: ${kpis.highestMonth}`}
                />
                <KpiCard
                  icon="📉"
                  label="Tháng chi ít nhất"
                  value={kpis.lowestMonth}
                  ariaLabel={`Tháng chi ít nhất: ${kpis.lowestMonth}`}
                />
              </div>
            </section>

            {/* Charts section */}
            <section
              className="col-span-1 lg:col-span-6"
              aria-label="Biểu đồ xu hướng"
            >
              <TrendLineChart
                monthlyBreakdown={state.data.monthlyBreakdown}
                periodLabel={periodLabel}
              />
            </section>

            <section
              className="col-span-1 lg:col-span-6"
              aria-label="Biểu đồ phân bổ danh mục"
            >
              <CategoryStackedChart
                monthlyBreakdown={state.data.monthlyBreakdown}
                periodLabel={periodLabel}
              />
            </section>

            {/* Category Trend Table section */}
            <section
              className="col-span-1 lg:col-span-12"
              aria-label="Bảng xu hướng danh mục"
            >
              <CategoryTrendTable
                categoryTrends={state.data.categoryTrends}
                topGrowingCategories={state.data.topGrowingCategories}
                topShrinkingCategories={state.data.topShrinkingCategories}
              />
            </section>
          </div>
        );
      })()}
    </main>
  );
}
