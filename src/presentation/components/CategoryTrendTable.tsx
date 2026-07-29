import { CategoryTrend } from "../../domain/entities/TrendReport";
import { sortCategoryTrendsByAbsChange } from "../utils/trendHelpers";
import { formatCurrency } from "../utils/formatters";

interface CategoryTrendTableProps {
  categoryTrends: CategoryTrend[];
  topGrowingCategories: CategoryTrend[];
  topShrinkingCategories: CategoryTrend[];
}

function formatChangePercent(value: number): string {
  const fixed = value.toFixed(1);
  if (value > 0) return `+${fixed}%`;
  if (value < 0) return `${fixed}%`;
  return `0.0%`;
}

function DirectionIndicator({ direction }: { direction: CategoryTrend["direction"] }) {
  if (direction === "increasing") {
    return <span className="text-amber">↑ Tăng</span>;
  }
  if (direction === "decreasing") {
    return <span className="text-jade">↓ Giảm</span>;
  }
  return <span className="text-ink-dim">— Ổn định</span>;
}

function TrendRow({ trend }: { trend: CategoryTrend }) {
  return (
    <tr className="text-ink">
      <td className="py-2 pr-4 whitespace-nowrap">{trend.category}</td>
      <td className="py-2 pr-4 text-right font-mono tabular-nums whitespace-nowrap">
        {formatCurrency(trend.averageMonthly)}
      </td>
      <td className="py-2 pr-4 text-right font-mono tabular-nums whitespace-nowrap">
        {formatChangePercent(trend.changePercent)}
      </td>
      <td className="py-2 text-right whitespace-nowrap">
        <DirectionIndicator direction={trend.direction} />
      </td>
    </tr>
  );
}

export function CategoryTrendTable({
  categoryTrends,
  topGrowingCategories,
  topShrinkingCategories,
}: CategoryTrendTableProps) {
  if (categoryTrends.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-terminal p-5">
        <p className="py-4 text-center text-sm text-ink-dim">
          Chưa có dữ liệu xu hướng danh mục
        </p>
      </div>
    );
  }

  const sorted = sortCategoryTrendsByAbsChange(categoryTrends);
  const growing = topGrowingCategories.slice(0, 5);
  const shrinking = topShrinkingCategories.slice(0, 5);

  return (
    <div className="rounded-lg border border-line bg-terminal p-5 overflow-x-auto">
      <p className="font-display text-sm font-semibold text-ink mb-4">
        Xu hướng theo danh mục
      </p>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink-dim">
            <th className="pb-2 pr-4 font-medium">Danh mục</th>
            <th className="pb-2 pr-4 text-right font-medium">TB tháng</th>
            <th className="pb-2 pr-4 text-right font-medium">Thay đổi</th>
            <th className="pb-2 text-right font-medium">Xu hướng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {sorted.map((trend) => (
            <TrendRow key={trend.category} trend={trend} />
          ))}
        </tbody>
      </table>

      {growing.length > 0 && (
        <div className="mt-6">
          <p className="font-display text-sm font-semibold text-ink mb-3">
            Tăng mạnh nhất
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-dim">
                <th className="pb-2 pr-4 font-medium">Danh mục</th>
                <th className="pb-2 pr-4 text-right font-medium">TB tháng</th>
                <th className="pb-2 pr-4 text-right font-medium">Thay đổi</th>
                <th className="pb-2 text-right font-medium">Xu hướng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {growing.map((trend) => (
                <TrendRow key={trend.category} trend={trend} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {shrinking.length > 0 && (
        <div className="mt-6">
          <p className="font-display text-sm font-semibold text-ink mb-3">
            Giảm mạnh nhất
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-dim">
                <th className="pb-2 pr-4 font-medium">Danh mục</th>
                <th className="pb-2 pr-4 text-right font-medium">TB tháng</th>
                <th className="pb-2 pr-4 text-right font-medium">Thay đổi</th>
                <th className="pb-2 text-right font-medium">Xu hướng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shrinking.map((trend) => (
                <TrendRow key={trend.category} trend={trend} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
