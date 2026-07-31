import { CategoryDiff } from "../../domain/entities/CompareReport";
import { formatCurrency } from "../utils/formatters";

interface CompareCategoryTableProps {
  categoryDiffs: CategoryDiff[];
  monthALabel: string;
  monthBLabel: string;
}

function formatPercentChange(percentChange: number | null): {
  text: string;
  className: string;
} {
  if (percentChange === null) {
    return { text: "Mới", className: "text-amber" };
  }
  if (percentChange > 0) {
    return { text: `↑ ${percentChange.toFixed(1)}%`, className: "text-amber" };
  }
  if (percentChange < 0) {
    return {
      text: `↓ ${Math.abs(percentChange).toFixed(1)}%`,
      className: "text-jade",
    };
  }
  return { text: "→ 0%", className: "text-ink-dim" };
}

function formatDiff(absoluteDiff: number, percentChange: number | null): {
  text: string;
  className: string;
} {
  if (percentChange === null) {
    // New category → show as increase
    return { text: `+${formatCurrency(absoluteDiff)}`, className: "text-amber" };
  }
  if (absoluteDiff > 0) {
    return { text: `+${formatCurrency(absoluteDiff)}`, className: "text-amber" };
  }
  if (absoluteDiff < 0) {
    return { text: `-${formatCurrency(Math.abs(absoluteDiff))}`, className: "text-jade" };
  }
  return { text: formatCurrency(0), className: "text-ink-dim" };
}

export function CompareCategoryTable({
  categoryDiffs,
  monthALabel,
  monthBLabel,
}: CompareCategoryTableProps) {
  return (
    <div className="rounded-lg border border-line bg-terminal overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="px-4 py-3 text-left font-mono text-xs font-semibold text-jade">
              Danh mục
            </th>
            <th className="px-4 py-3 text-right font-mono text-xs font-semibold text-jade">
              {monthALabel}
            </th>
            <th className="px-4 py-3 text-right font-mono text-xs font-semibold text-jade">
              {monthBLabel}
            </th>
            <th className="px-4 py-3 text-right font-mono text-xs font-semibold text-jade">
              Chênh lệch
            </th>
            <th className="px-4 py-3 text-right font-mono text-xs font-semibold text-jade">
              % Thay đổi
            </th>
          </tr>
        </thead>
        <tbody>
          {categoryDiffs.map((diff, index) => {
            const percent = formatPercentChange(diff.percentChange);
            const diffFormatted = formatDiff(diff.absoluteDiff, diff.percentChange);

            return (
              <tr
                key={diff.category}
                className={`border-b border-line/50 ${
                  index % 2 === 0 ? "bg-void/30" : ""
                }`}
              >
                <td className="px-4 py-3 font-body text-ink">
                  {diff.category}
                  {diff.percentChange === null && (
                    <span className="ml-2 inline-block rounded bg-amber/20 px-1.5 py-0.5 text-[10px] font-mono text-amber">
                      Mới
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                  {formatCurrency(diff.amountA)}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                  {formatCurrency(diff.amountB)}
                </td>
                <td className={`px-4 py-3 text-right font-mono tabular-nums ${diffFormatted.className}`}>
                  {diffFormatted.text}
                </td>
                <td className={`px-4 py-3 text-right font-mono tabular-nums ${percent.className}`}>
                  {percent.text}
                </td>
              </tr>
            );
          })}
          {categoryDiffs.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-ink-dim">
                Không có dữ liệu danh mục
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
