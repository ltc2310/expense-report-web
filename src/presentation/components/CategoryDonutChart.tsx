import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CategorySummary } from "../../domain/entities/WeeklySummary";

ChartJS.register(ArcElement, Tooltip, Legend);

// Rotating palette derived from the jade/amber accent family, kept small
// and disciplined rather than one random color per category.
const PALETTE = ["#4ADE80", "#F5A524", "#22C55E", "#FB923C", "#16A34A", "#38BDF8"];

interface CategoryDonutChartProps {
  byCategory: CategorySummary[];
}

export function CategoryDonutChart({ byCategory }: CategoryDonutChartProps) {
  const sorted = [...byCategory].sort((a, b) => b.total - a.total);

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
      <p className="font-display text-sm font-semibold text-ink">By category</p>
      <div className="mx-auto mt-4 max-w-[220px]">
        <Doughnut
          data={data}
          options={{
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "#DCE8DE",
                  font: { family: "Inter", size: 11 },
                  boxWidth: 10,
                  padding: 12,
                },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    ` ${ctx.label}: ${Number(ctx.raw).toLocaleString("vi-VN")}đ`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
