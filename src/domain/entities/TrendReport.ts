export type TrendDirection = "increasing" | "decreasing" | "stable";

export interface CategoryAmount {
  category: string;
  amount: number; // >= 0
}

/**
 * The BE may return byCategory as either:
 * - An array of CategoryAmount[] (design spec)
 * - A Record<string, number> object map (actual BE response)
 * Use normalizeByCategoryto convert to CategoryAmount[] before iterating.
 */
export type ByCategoryRaw = CategoryAmount[] | Record<string, number>;

export interface MonthlyBreakdown {
  month: string;        // format YYYY-MM
  monthLabel: string;   // tên hiển thị, e.g. "Tháng 6/2024"
  totalSpent: number;   // >= 0
  totalIncome: number;  // >= 0
  transactionCount: number; // integer >= 0
  byCategory: ByCategoryRaw;
  topCategory: string | { name: string; amount: number } | null;
}

/**
 * Normalizes byCategory from either array or object format into CategoryAmount[].
 */
export function normalizeByCategory(raw: ByCategoryRaw): CategoryAmount[] {
  if (Array.isArray(raw)) {
    return raw;
  }
  // Object map: { "Ăn uống": 1053000, ... }
  return Object.entries(raw).map(([category, amount]) => ({ category, amount }));
}

export interface CategoryTrend {
  category: string;
  monthlyAmounts: number[]; // length === monthsCount, each >= 0
  changePercent: number;
  direction: TrendDirection;
  averageMonthly: number; // >= 0
}

export interface TrendOverview {
  totalSpent: number;        // >= 0
  averageMonthlySpent: number; // >= 0
  highestMonth: string;      // format YYYY-MM
  lowestMonth: string;       // format YYYY-MM
  overallDirection: TrendDirection;
  overallChangePercent: number;
  hasIncompleteData: boolean;
  monthsWithData: number;    // 1–12
}

export interface TrendReport {
  userId: string;
  periodStart: string;       // ISO 8601 date YYYY-MM-DD
  periodEnd: string;         // ISO 8601 date YYYY-MM-DD
  monthsCount: number;       // 3–12
  overview: TrendOverview;
  monthlyBreakdown: MonthlyBreakdown[];
  categoryTrends: CategoryTrend[];
  topGrowingCategories: CategoryTrend[];
  topShrinkingCategories: CategoryTrend[];
  generatedAt: string;       // ISO 8601 datetime
}
