import { describe, it, expect } from "vitest";
import { computeTrendKpis, TrendKpiValues } from "../trendKpiCalculations";
import { TrendReport, MonthlyBreakdown, TrendOverview } from "../../../domain/entities/TrendReport";

function makeTrendReport(
  overrides: Partial<{
    overview: Partial<TrendOverview>;
    monthlyBreakdown: MonthlyBreakdown[];
  }> = {}
): TrendReport {
  const defaultOverview: TrendOverview = {
    totalSpent: 0,
    averageMonthlySpent: 0,
    highestMonth: "2024-01",
    lowestMonth: "2024-01",
    overallDirection: "stable",
    overallChangePercent: 0,
    hasIncompleteData: false,
    monthsWithData: 1,
  };

  return {
    userId: "user-1",
    periodStart: "2024-01-01",
    periodEnd: "2024-06-30",
    monthsCount: 6,
    overview: { ...defaultOverview, ...overrides.overview },
    monthlyBreakdown: overrides.monthlyBreakdown ?? [],
    categoryTrends: [],
    topGrowingCategories: [],
    topShrinkingCategories: [],
    generatedAt: "2024-07-01T00:00:00Z",
  };
}

function makeMonth(monthLabel: string, totalSpent: number): MonthlyBreakdown {
  return {
    month: "2024-01",
    monthLabel,
    totalSpent,
    totalIncome: 0,
    transactionCount: 0,
    byCategory: [],
    topCategory: "",
  };
}

describe("computeTrendKpis", () => {
  it("returns defaults when monthlyBreakdown is empty", () => {
    const report = makeTrendReport({
      overview: { totalSpent: 5000000, averageMonthlySpent: 1000000 },
      monthlyBreakdown: [],
    });

    const result = computeTrendKpis(report);

    expect(result).toEqual({
      totalFormatted: "0đ",
      averageMonthlyFormatted: "0đ",
      highestMonth: "—",
      lowestMonth: "—",
    });
  });

  it("formats totalSpent and averageMonthlySpent from overview using formatCurrency", () => {
    const report = makeTrendReport({
      overview: { totalSpent: 1500000, averageMonthlySpent: 250000 },
      monthlyBreakdown: [makeMonth("Tháng 1/2024", 1500000)],
    });

    const result = computeTrendKpis(report);

    expect(result.totalFormatted).toBe("1.500.000đ");
    expect(result.averageMonthlyFormatted).toBe("250.000đ");
  });

  it("finds highest month by totalSpent", () => {
    const report = makeTrendReport({
      overview: { totalSpent: 3000000, averageMonthlySpent: 1000000 },
      monthlyBreakdown: [
        makeMonth("Tháng 1/2024", 500000),
        makeMonth("Tháng 2/2024", 2000000),
        makeMonth("Tháng 3/2024", 500000),
      ],
    });

    const result = computeTrendKpis(report);

    expect(result.highestMonth).toBe("Tháng 2/2024");
  });

  it("finds lowest month by totalSpent", () => {
    const report = makeTrendReport({
      overview: { totalSpent: 3000000, averageMonthlySpent: 1000000 },
      monthlyBreakdown: [
        makeMonth("Tháng 1/2024", 500000),
        makeMonth("Tháng 2/2024", 2000000),
        makeMonth("Tháng 3/2024", 800000),
      ],
    });

    const result = computeTrendKpis(report);

    expect(result.lowestMonth).toBe("Tháng 1/2024");
  });

  it("returns first occurrence on tie for highest", () => {
    const report = makeTrendReport({
      overview: { totalSpent: 4000000, averageMonthlySpent: 2000000 },
      monthlyBreakdown: [
        makeMonth("Tháng 1/2024", 2000000),
        makeMonth("Tháng 2/2024", 2000000),
      ],
    });

    const result = computeTrendKpis(report);

    expect(result.highestMonth).toBe("Tháng 1/2024");
  });

  it("returns first occurrence on tie for lowest", () => {
    const report = makeTrendReport({
      overview: { totalSpent: 2000000, averageMonthlySpent: 1000000 },
      monthlyBreakdown: [
        makeMonth("Tháng 1/2024", 1000000),
        makeMonth("Tháng 2/2024", 1000000),
      ],
    });

    const result = computeTrendKpis(report);

    expect(result.lowestMonth).toBe("Tháng 1/2024");
  });

  it("handles single month breakdown", () => {
    const report = makeTrendReport({
      overview: { totalSpent: 500000, averageMonthlySpent: 500000 },
      monthlyBreakdown: [makeMonth("Tháng 6/2024", 500000)],
    });

    const result = computeTrendKpis(report);

    expect(result.totalFormatted).toBe("500.000đ");
    expect(result.averageMonthlyFormatted).toBe("500.000đ");
    expect(result.highestMonth).toBe("Tháng 6/2024");
    expect(result.lowestMonth).toBe("Tháng 6/2024");
  });
});
