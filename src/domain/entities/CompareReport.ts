export interface CategoryDiff {
  category: string;
  amountA: number;
  amountB: number;
  absoluteDiff: number;
  percentChange: number | null; // null means "Mới" (new category)
}

export interface MonthData {
  month: number;
  year: number;
  label: string;
  totalSpent: number;
  transactionCount: number;
  byCategory: Record<string, number>;
}

export interface CompareReport {
  userId: string;
  monthA: MonthData;
  monthB: MonthData;
  totalDifference: number;
  totalPercentChange: number | null;
  categoryDiffs: CategoryDiff[];
  generatedAt: string;
}
