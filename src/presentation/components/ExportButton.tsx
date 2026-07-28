import { useState } from "react";
import { ReportRepository } from "../../domain/ports/ReportRepository";

interface ExportButtonProps {
  repository: ReportRepository;
  token: string;
}

export function ExportButton({ repository, token }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);

    try {
      await repository.exportReport(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
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
