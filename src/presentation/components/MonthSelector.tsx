interface MonthSelectorProps {
  value: number;
  onChange: (months: number) => void;
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="month-selector"
        className="text-sm text-ink-dim font-mono"
      >
        Số tháng phân tích:
      </label>
      <select
        id="month-selector"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-terminal border border-line rounded-lg px-3 py-2 text-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-jade/50"
      >
        {Array.from({ length: 10 }, (_, i) => i + 3).map((n) => (
          <option key={n} value={n}>
            {n} tháng
          </option>
        ))}
      </select>
    </div>
  );
}
