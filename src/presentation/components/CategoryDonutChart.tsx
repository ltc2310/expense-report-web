import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CategorySummary } from "../../domain/entities/WeeklySummary";
import { computeCategoryBreakdown } from "../utils/kpiCalculations";
import { formatCurrency } from "../utils/formatters";
import { BreakdownList } from "./BreakdownList";

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  "#4ADE80", "#F5A524", "#22C55E", "#FB923C",
  "#16A34A", "#38BDF8", "#A78BFA", "#F472B6",
  "#FACC15", "#34D399", "#F87171", "#818CF8",
];

interface CategoryDonutChartProps {
  byCategory: CategorySummary[];
  total: number;
}

export function CategoryDonutChart({ byCategory, total }: CategoryDonutChartProps) {
  if (byCategory.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-terminal p-5">
        <p className="font-display text-sm font-semibold text-ink">Theo danh mục</p>
        <p className="mt-6 text-center text-sm text-ink-dim">
          Chưa có dữ liệu danh mục
        </p>
      </div>
    );
  }

  const sorted = [...byCategory].sort((a, b) => b.total - a.total);
  const breakdownItems = computeCategoryBreakdown(byCategory, total);

  const data = {
    labels: sorted.map((c) => c.category),
    datasets: [
      {
        data: sorted.map((c) => c.total),
        backgroundColor: sorted.map((_, i) => PALETTE[i % PALETTE.length]),
        borderColor: "#142621",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="rounded-lg border border-line bg-terminal p-5">
      <p className="font-display text-sm font-semibold text-ink">Theo danh mục</p>
      <div className="mt-4 flex flex-col lg:flex-row lg:items-start lg:gap-6">
        <div className="mx-auto max-w-[240px] shrink-0">
          <Doughnut
            data={data}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      const value = Number(ctx.raw);
                      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                      return ` ${ctx.label}: ${formatCurrency(value)} (${percentage}%)`;
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="mt-4 flex-1 lg:mt-0">
          <BreakdownList items={breakdownItems} />
        </div>
      </div>
    </div>
  );
}
