interface KpiCardProps {
  label: string;
  value: string;
  icon?: string;
  ariaLabel: string;
}

export function KpiCard({ label, value, icon, ariaLabel }: KpiCardProps) {
  return (
    <div
      className="rounded-lg border border-line bg-terminal px-5 py-6 text-center transition hover:border-jade/40 hover:shadow-[0_0_12px_rgba(74,222,128,0.08)]"
      aria-label={ariaLabel}
      role="group"
    >
      {icon && (
        <span className="mb-2 block text-2xl" aria-hidden="true">
          {icon}
        </span>
      )}
      <p className="font-mono text-2xl font-bold tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-1 text-sm text-ink-dim">{label}</p>
    </div>
  );
}
