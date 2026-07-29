import { TrendReport } from "../../domain/entities/TrendReport";
import { formatCurrency } from "./formatters";

export interface TrendKpiValues {
  totalFormatted: string;          // e.g. "1.500.000đ"
  averageMonthlyFormatted: string; // e.g. "250.000đ"
  highestMonth: string;            // monthLabel, e.g. "Tháng 3/2024"
  lowestMonth: string;             // monthLabel, e.g. "Tháng 1/2024"
}

export function computeTrendKpis(report: TrendReport): TrendKpiValues {
  const { overview, monthlyBreakdown } = report;

  if (monthlyBreakdown.length === 0) {
    return {
      totalFormatted: "0đ",
      averageMonthlyFormatted: "0đ",
      highestMonth: "—",
      lowestMonth: "—",
    };
  }

  // Tìm tháng chi nhiều nhất (first occurrence nếu tie)
  const highest = monthlyBreakdown.reduce((max, m) =>
    m.totalSpent > max.totalSpent ? m : max
  );

  // Tìm tháng chi ít nhất (first occurrence nếu tie)
  const lowest = monthlyBreakdown.reduce((min, m) =>
    m.totalSpent < min.totalSpent ? m : min
  );

  return {
    totalFormatted: formatCurrency(overview.totalSpent),
    averageMonthlyFormatted: formatCurrency(overview.averageMonthlySpent),
    highestMonth: highest.monthLabel,
    lowestMonth: lowest.monthLabel,
  };
}
