import { CompareRepository } from "../../domain/ports/CompareRepository";
import { useCompareReport } from "../../application/hooks/useCompareReport";
import { formatCurrency } from "../utils/formatters";
import SkeletonCompareDashboard from "../components/SkeletonCompareDashboard";
import { CompareHeader } from "../components/CompareHeader";
import { CompareExportButton } from "../components/CompareExportButton";
import { KpiCard } from "../components/KpiCard";
import { CompareCategoryTable } from "../components/CompareCategoryTable";

interface CompareDashboardPageProps {
  repository: CompareRepository;
  token: string | null;
}

function formatPercentKpi(percentChange: number | null): string {
  if (percentChange === null) return "Mới";
  if (percentChange > 0) return `↑ ${percentChange.toFixed(1)}%`;
  if (percentChange < 0) return `↓ ${Math.abs(percentChange).toFixed(1)}%`;
  return "→ 0%";
}

function formatDiffKpi(totalDifference: number): string {
  if (totalDifference > 0) return `+${formatCurrency(totalDifference)}`;
  if (totalDifference < 0) return `-${formatCurrency(Math.abs(totalDifference))}`;
  return formatCurrency(0);
}

export function CompareDashboardPage({ repository, token }: CompareDashboardPageProps) {
  const urlParams = new URLSearchParams(window.location.search);
  const monthA = parseInt(urlParams.get("monthA") ?? "0", 10);
  const yearA = parseInt(urlParams.get("yearA") ?? "0", 10);
  const monthB = parseInt(urlParams.get("monthB") ?? "0", 10);
  const yearB = parseInt(urlParams.get("yearB") ?? "0", 10);

  const state = useCompareReport(repository, token, monthA, yearA, monthB, yearB);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10">
      {state.status === "loading" && <SkeletonCompareDashboard />}

      {state.status === "error" && (
        <section className="rounded-lg border border-amber bg-terminal p-6 text-center">
          <p className="font-mono text-sm text-amber">{state.message}</p>
          <p className="mt-2 text-sm text-ink-dim">
            Vui lòng kiểm tra lại đường link báo cáo
          </p>
        </section>
      )}

      {state.status === "success" &&
        (() => {
          const { data } = state;

          return (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
              {/* Header section */}
              <div className="col-span-1 lg:col-span-12">
                <CompareHeader
                  monthALabel={data.monthA.label}
                  monthBLabel={data.monthB.label}
                >
                  <CompareExportButton
                    repository={repository}
                    token={token!}
                    monthA={monthA}
                    yearA={yearA}
                    monthB={monthB}
                    yearB={yearB}
                  />
                </CompareHeader>
              </div>

              {/* KPI Cards section */}
              <section
                className="col-span-1 lg:col-span-12"
                aria-label="Chỉ số so sánh"
              >
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <KpiCard
                    icon="💰"
                    label={`Tổng chi ${data.monthA.label}`}
                    value={formatCurrency(data.monthA.totalSpent)}
                    ariaLabel={`Tổng chi ${data.monthA.label}: ${formatCurrency(data.monthA.totalSpent)}`}
                  />
                  <KpiCard
                    icon="💰"
                    label={`Tổng chi ${data.monthB.label}`}
                    value={formatCurrency(data.monthB.totalSpent)}
                    ariaLabel={`Tổng chi ${data.monthB.label}: ${formatCurrency(data.monthB.totalSpent)}`}
                  />
                  <KpiCard
                    icon="📊"
                    label="Chênh lệch"
                    value={formatDiffKpi(data.totalDifference)}
                    ariaLabel={`Chênh lệch: ${formatDiffKpi(data.totalDifference)}`}
                  />
                  <KpiCard
                    icon="📈"
                    label="Thay đổi"
                    value={formatPercentKpi(data.totalPercentChange)}
                    ariaLabel={`Thay đổi: ${formatPercentKpi(data.totalPercentChange)}`}
                  />
                </div>
              </section>

              {/* Category Comparison Table */}
              <section
                className="col-span-1 lg:col-span-12"
                aria-label="Bảng so sánh danh mục"
              >
                <CompareCategoryTable
                  categoryDiffs={data.categoryDiffs}
                  monthALabel={data.monthA.label}
                  monthBLabel={data.monthB.label}
                />
              </section>
            </div>
          );
        })()}
    </main>
  );
}
