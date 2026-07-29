import { useState } from "react";
import { TrendRepository } from "../../domain/ports/TrendRepository";

interface TrendExportButtonProps {
  repository: TrendRepository;
  token: string;
  months: number;
  endMonth?: string;
}

export function TrendExportButton({ repository, token, months, endMonth }: TrendExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setError(null);
    setLoading(true);

    try {
      await repository.exportTrendReport(token, months, endMonth);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xuất báo cáo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center pt-2">
      <button
        onClick={handleExport}
        disabled={loading}
        className="rounded-lg border border-jade bg-jade/10 px-6 py-3 font-mono text-sm font-semibold text-jade transition hover:bg-jade/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "⏳ Đang tải…" : "📥 Xuất file Excel"}
      </button>
      {error && (
        <p className="mt-2 font-mono text-xs text-amber">{error}</p>
      )}
    </div>
  );
}
