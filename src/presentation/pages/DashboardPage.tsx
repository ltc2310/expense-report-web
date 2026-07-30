import { ReportRepository } from "../../domain/ports/ReportRepository";
import { useWeeklyReport } from "../../application/hooks/useWeeklyReport";
import { computeKpis } from "../utils/kpiCalculations";
import { formatCurrency } from "../utils/formatters";
import SkeletonDashboard from "../components/SkeletonDashboard";
import { SummaryHeader } from "../components/SummaryHeader";
import { KpiCard } from "../components/KpiCard";
import { CategoryDonutChart } from "../components/CategoryDonutChart";
import { TransactionTable } from "../components/TransactionTable";

interface DashboardPageProps {
  repository: ReportRepository;
  token: string | null;
}

export function DashboardPage({ repository, token }: DashboardPageProps) {
  const state = useWeeklyReport(repository, token);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10">
      {state.status === "loading" && <SkeletonDashboard />}

      {state.status === "error" && (
        <section className="rounded-lg border border-amber bg-terminal p-6 text-center">
          <p className="font-mono text-sm text-amber">{state.message}</p>
          <p className="mt-2 text-sm text-ink-dim">
            Vui lòng kiểm tra lại đường link báo cáo
          </p>
        </section>
      )}

      {state.status === "success" && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Summary Header - span full width */}
          <div className="col-span-1 lg:col-span-12">
            <SummaryHeader
              from={state.data.from}
              to={state.data.to}
              repository={repository}
              token={token!}
            />
          </div>

          {/* KPI Cards - each span 3 columns on desktop */}
          {(() => {
            const kpis = computeKpis(state.data);
            const hasIncome = (state.data.totalIncome ?? 0) > 0;
            return (
              <>
                <div className="col-span-1 lg:col-span-3">
                  <KpiCard
                    icon="💰"
                    label="Tổng chi tiêu"
                    value={kpis.total}
                    ariaLabel={`Tổng chi tiêu: ${kpis.total}`}
                  />
                </div>
                {hasIncome && (
                  <div className="col-span-1 lg:col-span-3">
                    <KpiCard
                      icon="💵"
                      label="Tổng thu nhập"
                      value={formatCurrency(state.data.totalIncome!)}
                      ariaLabel={`Tổng thu nhập: ${formatCurrency(state.data.totalIncome!)}`}
                    />
                  </div>
                )}
                <div className="col-span-1 lg:col-span-3">
                  <KpiCard
                    icon="💳"
                    label="Số giao dịch"
                    value={String(kpis.transactionCount)}
                    ariaLabel={`Số giao dịch: ${kpis.transactionCount}`}
                  />
                </div>
                <div className="col-span-1 lg:col-span-3">
                  <KpiCard
                    icon="📊"
                    label="Chi tiêu trung bình"
                    value={kpis.average}
                    ariaLabel={`Chi tiêu trung bình: ${kpis.average}`}
                  />
                </div>
                {!hasIncome && (
                  <div className="col-span-1 lg:col-span-3">
                    <KpiCard
                      icon="🏷️"
                      label="Danh mục cao nhất"
                      value={kpis.topCategory}
                      ariaLabel={`Danh mục cao nhất: ${kpis.topCategory}`}
                    />
                  </div>
                )}
              </>
            );
          })()}

          {/* Category Chart - span 5 columns on desktop */}
          <div className="col-span-1 lg:col-span-5">
            <CategoryDonutChart
              byCategory={state.data.byCategory}
              total={state.data.total}
            />
          </div>

          {/* Transaction Table - span 7 columns on desktop */}
          <div className="col-span-1 lg:col-span-7">
            <TransactionTable transactions={state.data.transactions} />
          </div>
        </section>
      )}
    </main>
  );
}
