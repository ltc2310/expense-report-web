import type {
  WeeklySummary,
  CategorySummary,
} from "../../domain/entities/WeeklySummary";
import { formatCurrency } from "./formatters";

export interface KpiValues {
  total: string; // formatted currency
  transactionCount: number;
  average: string; // formatted currency
  topCategory: string; // category name
}

export interface BreakdownItem {
  category: string;
  amount: number; // raw number
  percentage: number; // 0-100
}

/**
 * Compute KPI values from a WeeklySummary.
 * Handles edge cases:
 * - Empty transactions → average = "0đ"
 * - Empty byCategory → topCategory = "—"
 * - Income transactions (amount < 0) are excluded from average calculation
 */
export function computeKpis(summary: WeeklySummary): KpiValues {
  const { total, transactions, byCategory } = summary;

  // Only count expense transactions for count and average
  const expenseTransactions = transactions.filter((t) => t.amount > 0);
  const transactionCount = expenseTransactions.length;

  const average =
    transactionCount === 0
      ? "0đ"
      : formatCurrency(Math.round(total / transactionCount));

  const topCategory =
    byCategory.length === 0
      ? "—"
      : byCategory.reduce((max, cat) => (cat.total > max.total ? cat : max))
          .category;

  return {
    total: formatCurrency(total),
    transactionCount,
    average,
    topCategory,
  };
}

/**
 * Compute category breakdown with percentages.
 * Each item gets a percentage relative to the total.
 * Returns empty array if byCategory is empty.
 */
export function computeCategoryBreakdown(
  byCategory: CategorySummary[],
  total: number
): BreakdownItem[] {
  if (byCategory.length === 0 || total === 0) {
    return [];
  }

  return byCategory.map((cat) => ({
    category: cat.category,
    amount: cat.total,
    percentage: Math.round((cat.total / total) * 100),
  }));
}
