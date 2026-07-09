import { Transaction } from "../../domain/entities/WeeklySummary";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const sorted = [...transactions].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <div className="rounded-lg border border-line bg-terminal p-5">
      <p className="font-display text-sm font-semibold text-ink">Transactions</p>
      <ul className="mt-4 divide-y divide-line">
        {sorted.map((t, i) => (
          <li key={t.id ?? i} className="flex items-baseline py-2 text-sm">
            <span className="shrink-0 text-ink">{t.category}</span>
            <span className="dot-leader" aria-hidden="true" />
            <span className="shrink-0 font-mono tabular-nums text-jade">
              {t.amount.toLocaleString("vi-VN")}đ
            </span>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="py-4 text-center text-sm text-ink-dim">
            No transactions this week.
          </li>
        )}
      </ul>
    </div>
  );
}
