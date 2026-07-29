export default function SkeletonTrendDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-6">
      {/* Header placeholder */}
      <div className="h-10 w-64 animate-pulse rounded-lg bg-line/50" />

      {/* Period/selector row */}
      <div className="h-8 w-48 animate-pulse rounded-lg bg-line/50" />

      {/* 4 KPI card placeholders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-line/50"
          />
        ))}
      </div>

      {/* 2 chart placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 animate-pulse rounded-lg bg-line/50" />
        <div className="h-64 animate-pulse rounded-lg bg-line/50" />
      </div>

      {/* Table placeholder */}
      <div className="h-48 animate-pulse rounded-lg bg-line/50" />
    </div>
  );
}
