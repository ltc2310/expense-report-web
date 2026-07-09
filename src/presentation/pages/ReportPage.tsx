import { ReportRepository } from "../../domain/ports/ReportRepository";
import { useWeeklyReport } from "../../application/hooks/useWeeklyReport";
import { TotalScreen } from "../components/TotalScreen";
import { CategoryDonutChart } from "../components/CategoryDonutChart";
import { TransactionList } from "../components/TransactionList";

interface ReportPageProps {
  repository: ReportRepository;
  token: string | null;
}

export function ReportPage({ repository, token }: ReportPageProps) {
  const state = useWeeklyReport(repository, token);

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 py-10">
      <header className="mb-6 text-center">
        <p className="font-display text-lg font-semibold tracking-tight text-ink">
          Weekly Ledger
        </p>
      </header>

      {state.status === "loading" && (
        <p className="text-center font-mono text-sm text-ink-dim">Loading report…</p>
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
          <TransactionList transactions={state.data.transactions} />
        </div>
      )}
    </main>
  );
}
