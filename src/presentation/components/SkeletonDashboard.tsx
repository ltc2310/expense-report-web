export default function SkeletonDashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
      {/* Header placeholder */}
      <div className="col-span-1 lg:col-span-12">
        <div className="h-16 animate-pulse rounded-lg bg-line/50" />
      </div>

      {/* 4 KPI card placeholders */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="col-span-1 lg:col-span-3">
          <div className="h-28 animate-pulse rounded-lg bg-line/50" />
        </div>
      ))}

      {/* Chart placeholder */}
      <div className="col-span-1 lg:col-span-5">
        <div className="h-72 animate-pulse rounded-lg bg-line/50" />
      </div>

      {/* Table placeholder */}
      <div className="col-span-1 lg:col-span-7">
        <div className="h-72 animate-pulse rounded-lg bg-line/50" />
      </div>
    </div>
  );
}
