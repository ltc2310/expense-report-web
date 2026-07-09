export interface CategorySummary {
  category: string;
  total: number;
}

export interface Transaction {
  id?: string;
  amount: number;
  category: string;
  note: string;
  createdAt?: string;
}

export interface WeeklySummary {
  total: number;
  byCategory: CategorySummary[];
  transactions: Transaction[];
  from: Date;
  to: Date;
}
