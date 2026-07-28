import { ReportRepository } from "../../domain/ports/ReportRepository";
import { ExportButton } from "./ExportButton";
import { formatDateRange } from "../utils/formatters";

interface SummaryHeaderProps {
  from: Date;
  to: Date;
  repository: ReportRepository;
  token: string;
}

export function SummaryHeader({ from, to, repository, token }: SummaryHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          Báo cáo chi tiêu
        </h1>
        <p className="mt-1 text-sm text-ink-dim">
          {formatDateRange(from, to)}
        </p>
      </div>
      <ExportButton repository={repository} token={token} />
    </header>
  );
}
