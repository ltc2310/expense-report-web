import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MonthlyBreakdown } from "../../domain/entities/TrendReport";
import { formatCurrency } from "../utils/formatters";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface TrendLineChartProps {
  monthlyBreakdown: MonthlyBreakdown[];
  periodLabel: string; // e.g. "01/01/2024 — 30/06/2024"
}

export function TrendLineChart({ monthlyBreakdown, periodLabel }: TrendLineChartProps) {
  const title = "Xu hướng chi tiêu theo tháng";

  if (monthlyBreakdown.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-terminal p-5">
        <p className="font-display text-sm font-semibold text-ink">{title}</p>
        <p className="mt-6 text-center text-sm text-ink-dim">
          Chưa có dữ liệu xu hướng
        </p>
      </div>
    );
  }

  const data = {
    labels: monthlyBreakdown.map((m) => m.monthLabel),
    datasets: [
      {
        data: monthlyBreakdown.map((m) => m.totalSpent),
        borderColor: "#4ADE80",
        backgroundColor: "#4ADE80",
        pointBackgroundColor: "#4ADE80",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#8FA79C" },
        grid: { color: "#24413A" },
      },
      y: {
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
          label: (ctx: { raw: unknown }) => formatCurrency(Number(ctx.raw)),
        },
      },
      legend: { display: false },
    },
  };

  return (
    <div className="rounded-lg border border-line bg-terminal p-5">
      <p className="font-display text-sm font-semibold text-ink">{title}</p>
      <div
        className="mt-4 h-64"
        aria-label={`${title}, ${periodLabel}`}
        role="img"
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
