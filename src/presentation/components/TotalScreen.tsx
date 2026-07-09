interface TotalScreenProps {
  total: number;
  from: Date;
  to: Date;
}

function formatDate(date: Date): string {
 return new Date(date).toLocaleDateString("vi-VN");
}

export function TotalScreen({ total, from, to }: TotalScreenProps) {
  return (
    <div className="scanlines rounded-lg border border-line bg-terminal px-6 py-8 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-dim">
        {formatDate(from)} - {formatDate(to)}
      </p>
      <p className="mt-3 font-mono text-4xl font-bold tabular-nums text-jade sm:text-5xl">
        {total.toLocaleString("vi-VN")}
        <span className="ml-1 text-2xl text-ink-dim">đ</span>
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-dim">
        Total spent
      </p>
    </div>
  );
}
