export interface CategorySummary {
  category: string;
  total: number;
}

export interface Transaction {
  id?: string;
  amount: number;
  category: string;
  note: string;
  /** Actual spending date */
  spentAt?: string;
  /** Record creation date */
  createdAt?: string;
}

export interface WeeklySummary {
  /** Total expenses (positive amounts only). */
  total: number;
  /** Total income (from negative-amount transactions, shown as positive). */
  totalIncome?: number;
  byCategory: CategorySummary[];
  transactions: Transaction[];
  from: Date;
  to: Date;
}
