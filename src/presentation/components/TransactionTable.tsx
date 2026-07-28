import { useState } from "react";
import { Transaction } from "../../domain/entities/WeeklySummary";
import { formatCurrency } from "../utils/formatters";

interface TransactionTableProps {
  transactions: Transaction[];
}

const PAGE_SIZE = 10;

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...transactions].sort((a, b) => {
    const aTime = a.spentAt ? new Date(a.spentAt).getTime() : 0;
    const bTime = b.spentAt ? new Date(b.spentAt).getTime() : 0;
    return bTime - aTime;
  });

  const displayed = showAll ? sorted : sorted.slice(0, PAGE_SIZE);
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="rounded-lg border border-line bg-terminal p-5 overflow-x-auto">
      <p className="font-display text-sm font-semibold text-ink mb-4">Chi tiết giao dịch</p>

      {sorted.length === 0 ? (
        <p className="py-4 text-center text-sm text-ink-dim">
          Không có giao dịch nào trong khoảng thời gian này.
        </p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-dim">
                <th className="pb-2 pr-4 font-medium">Ngày chi</th>
                <th className="pb-2 pr-4 font-medium">Danh mục</th>
                <th className="pb-2 pr-4 font-medium">Ghi chú</th>
                <th className="pb-2 text-right font-medium">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {displayed.map((t, i) => (
                <tr key={t.id ?? i} className="text-ink">
                  <td className="py-2 pr-4 font-mono text-xs whitespace-nowrap">
                    {formatDate(t.spentAt)}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">{t.category}</td>
                  <td className="py-2 pr-4 text-ink-dim truncate max-w-[150px]">
                    {t.note}
                  </td>
                  <td className="py-2 text-right font-mono tabular-nums text-jade whitespace-nowrap">
                    {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-line font-semibold text-ink">
                <td colSpan={3} className="py-2 pr-4">Tổng cộng</td>
                <td className="py-2 text-right font-mono tabular-nums text-jade whitespace-nowrap">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>

          {sorted.length > PAGE_SIZE && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 w-full rounded-md border border-line py-2 text-sm text-ink-dim hover:text-ink hover:border-ink transition-colors"
            >
              Xem thêm ({sorted.length - PAGE_SIZE} giao dịch còn lại)
            </button>
          )}
        </>
      )}
    </div>
  );
}
