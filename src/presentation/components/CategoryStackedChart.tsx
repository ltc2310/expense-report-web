import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { MonthlyBreakdown } from "../../domain/entities/TrendReport";
import { normalizeByCategory } from "../../domain/entities/TrendReport";
import { getUniqueCategoriesSortedByTotal } from "../utils/trendHelpers";
import { formatCurrency } from "../utils/formatters";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const PALETTE = [
  "#4ADE80", "#F5A524", "#22C55E", "#FB923C",
  "#16A34A", "#38BDF8", "#A78BFA", "#F472B6",
  "#FACC15", "#34D399", "#F87171", "#818CF8",
];

interface CategoryStackedChartProps {
  monthlyBreakdown: MonthlyBreakdown[];
  periodLabel: string;
}

export function CategoryStackedChart({
  monthlyBreakdown,
  periodLabel,
}: CategoryStackedChartProps) {
  const isEmpty =
    monthlyBreakdown.length === 0 ||
    monthlyBreakdown.every((m) => normalizeByCategory(m.byCategory).length === 0);

  if (isEmpty) {
    return (
      <div className="rounded-lg border border-line bg-terminal p-5">
        <p className="font-display text-sm font-semibold text-ink">
          Phân bổ danh mục theo tháng
        </p>
        <p className="mt-6 text-center text-sm text-ink-dim">
          Chưa có dữ liệu danh mục
        </p>
      </div>
    );
  }

  const allCategories = getUniqueCategoriesSortedByTotal(monthlyBreakdown);

  const data = {
    labels: monthlyBreakdown.map((m) => m.monthLabel),
    datasets: allCategories.map((cat, i) => ({
      label: cat,
      data: monthlyBreakdown.map((m) => {
        const normalized = normalizeByCategory(m.byCategory);
        const found = normalized.find((c) => c.category === cat);
        return found?.amount ?? 0;
      }),
      backgroundColor: PALETTE[i % PALETTE.length],
      borderColor: "#142621",
      borderWidth: 1,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true as const,
        ticks: { color: "#8FA79C" },
        grid: { color: "#24413A" },
      },
      y: {
        stacked: true as const,
        beginAtZero: true,
        ticks: {
          color: "#8FA79C",
          callback: (value: string | number) => formatCurrency(Number(value)),
        },
        grid: { color: "#24413A" },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown; dataIndex: number; dataset: { label?: string } }) => {
            const value = Number(ctx.raw);
            const monthTotal = monthlyBreakdown[ctx.dataIndex].totalSpent;
            const pct = monthTotal > 0 ? Math.round((value / monthTotal) * 100) : 0;
            return ` ${ctx.dataset.label}: ${formatCurrency(value)} (${pct}%)`;
          },
        },
      },
      legend: { display: false },
    },
  };

  return (
    <div className="rounded-lg border border-line bg-terminal p-5">
      <p className="font-display text-sm font-semibold text-ink">
        Phân bổ danh mục theo tháng
      </p>
      <div
        className="mt-4 h-[300px]"
        aria-label={`Phân bổ danh mục theo tháng — ${periodLabel}`}
      >
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
