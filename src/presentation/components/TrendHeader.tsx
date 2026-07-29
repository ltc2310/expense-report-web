interface TrendHeaderProps {
  periodLabel: string; // Already formatted "dd/mm/yyyy — dd/mm/yyyy"
  children?: React.ReactNode; // Slot for MonthSelector and export button
}

export function TrendHeader({ periodLabel, children }: TrendHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          Báo cáo xu hướng chi tiêu
        </h1>
        <p className="mt-1 text-sm text-ink-dim">
          {periodLabel}
        </p>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
