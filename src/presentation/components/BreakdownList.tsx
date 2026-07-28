import type { BreakdownItem } from "../utils/kpiCalculations";
import { formatCurrency } from "../utils/formatters";

interface BreakdownListProps {
  items: BreakdownItem[];
}

export function BreakdownList({ items }: BreakdownListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.category} className="flex items-center justify-between gap-3">
          <span className="text-sm text-ink-dim">
            {item.category}
          </span>
          <span className="shrink-0 text-right text-sm font-mono text-ink whitespace-nowrap">
            {formatCurrency(item.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
