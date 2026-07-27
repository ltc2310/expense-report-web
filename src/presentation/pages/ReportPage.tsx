import { ReportRepository } from "../../domain/ports/ReportRepository";
import { useWeeklyReport } from "../../application/hooks/useWeeklyReport";
import { TotalScreen } from "../components/TotalScreen";
import { CategoryDonutChart } from "../components/CategoryDonutChart";
import { TransactionTable } from "../components/TransactionTable";
import { ExportButton } from "../components/ExportButton";

interface ReportPageProps {
  repository: ReportRepository;
  token: string | null;
}

export function ReportPage({ repository, token }: ReportPageProps) {
  const state = useWeeklyReport(repository, token);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <header className="mb-6 text-center">
        <p className="font-display text-lg font-semibold tracking-tight text-ink">
          📊 Báo cáo chi tiêu
        </p>
      </header>

      {state.status === "loading" && (
        <p className="text-center font-mono text-sm text-ink-dim">Đang tải báo cáo…</p>
      )}

      {state.status === "error" && (
        <div className="rounded-lg border border-line bg-terminal p-5 text-center">
          <p className="font-mono text-sm text-amber">{state.message}</p>
        </div>
      )}

      {state.status === "success" && (
        <div className="space-y-4">
          <TotalScreen total={state.data.total} from={state.data.from} to={state.data.to} />

          {state.data.byCategory.length > 0 && (
            <CategoryDonutChart byCategory={state.data.byCategory} />
          )}

          <TransactionTable transactions={state.data.transactions} />

          <ExportButton
            transactions={state.data.transactions}
            from={state.data.from}
            to={state.data.to}
          />
        </div>
      )}
    </main>
  );
}
