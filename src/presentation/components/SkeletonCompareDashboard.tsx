export default function SkeletonCompareDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-6">
      {/* Header placeholder */}
      <div className="h-10 w-64 animate-pulse rounded-lg bg-line/50" />

      {/* Subtitle row */}
      <div className="h-6 w-48 animate-pulse rounded-lg bg-line/50" />

      {/* 4 KPI card placeholders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-line/50"
          />
        ))}
      </div>

      {/* Table placeholder */}
      <div className="h-64 animate-pulse rounded-lg bg-line/50" />
    </div>
  );
}
