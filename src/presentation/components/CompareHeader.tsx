interface CompareHeaderProps {
  monthALabel: string;
  monthBLabel: string;
  children?: React.ReactNode; // Slot for export button
}

export function CompareHeader({ monthALabel, monthBLabel, children }: CompareHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          📊 So sánh chi tiêu
        </h1>
        <p className="mt-1 text-sm text-ink-dim">
          {monthALabel} vs {monthBLabel}
        </p>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
