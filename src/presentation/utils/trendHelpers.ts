import type {
  MonthlyBreakdown,
  CategoryTrend,
  TrendDirection,
} from "../../domain/entities/TrendReport";
import { normalizeByCategory } from "../../domain/entities/TrendReport";

/**
 * Collects all unique categories across all months, sums their amounts,
 * and returns them sorted by total descending.
 */
export function getUniqueCategoriesSortedByTotal(
  monthlyBreakdown: MonthlyBreakdown[]
): string[] {
  const totals = new Map<string, number>();
  for (const month of monthlyBreakdown) {
    for (const { category, amount } of normalizeByCategory(month.byCategory)) {
      totals.set(category, (totals.get(category) ?? 0) + amount);
    }
  }
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);
}

/**
 * Sorts CategoryTrend[] by absolute value of changePercent descending.
 */
export function sortCategoryTrendsByAbsChange(
  trends: CategoryTrend[]
): CategoryTrend[] {
  return [...trends].sort(
    (a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)
  );
}

/**
 * Classifies a changePercent into a TrendDirection:
 * - "increasing" if changePercent > 10
 * - "decreasing" if changePercent < -10
 * - "stable" if -10 <= changePercent <= 10
 */
export function classifyDirection(changePercent: number): TrendDirection {
  if (changePercent > 10) return "increasing";
  if (changePercent < -10) return "decreasing";
  return "stable";
}
