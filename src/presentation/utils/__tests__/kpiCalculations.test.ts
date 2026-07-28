import { describe, it, expect } from "vitest";
import {
  computeKpis,
  computeCategoryBreakdown,
} from "../kpiCalculations";
import type { WeeklySummary } from "../../../domain/entities/WeeklySummary";

describe("computeKpis", () => {
  it("computes all KPI values correctly for a typical summary", () => {
    const summary: WeeklySummary = {
      total: 1500000,
      byCategory: [
        { category: "Ăn uống", total: 900000 },
        { category: "Di chuyển", total: 600000 },
      ],
      transactions: [
        { amount: 500000, category: "Ăn uống", note: "Cơm trưa" },
        { amount: 400000, category: "Ăn uống", note: "Cà phê" },
        { amount: 600000, category: "Di chuyển", note: "Grab" },
      ],
      from: new Date("2024-01-01"),
      to: new Date("2024-01-07"),
    };

    const kpis = computeKpis(summary);

    expect(kpis.total).toBe("1.500.000đ");
    expect(kpis.transactionCount).toBe(3);
    expect(kpis.average).toBe("500.000đ");
    expect(kpis.topCategory).toBe("Ăn uống");
  });

  it("returns average '0đ' when transactions array is empty", () => {
    const summary: WeeklySummary = {
      total: 0,
      byCategory: [],
      transactions: [],
      from: new Date("2024-01-01"),
      to: new Date("2024-01-07"),
    };

    const kpis = computeKpis(summary);

    expect(kpis.average).toBe("0đ");
    expect(kpis.transactionCount).toBe(0);
  });

  it("returns topCategory '—' when byCategory is empty", () => {
    const summary: WeeklySummary = {
      total: 100000,
      byCategory: [],
      transactions: [
        { amount: 100000, category: "Khác", note: "test" },
      ],
      from: new Date("2024-01-01"),
      to: new Date("2024-01-07"),
    };

    const kpis = computeKpis(summary);

    expect(kpis.topCategory).toBe("—");
  });

  it("picks the category with the highest total as topCategory", () => {
    const summary: WeeklySummary = {
      total: 3000000,
      byCategory: [
        { category: "A", total: 500000 },
        { category: "B", total: 2000000 },
        { category: "C", total: 500000 },
      ],
      transactions: [
        { amount: 3000000, category: "B", note: "test" },
      ],
      from: new Date("2024-01-01"),
      to: new Date("2024-01-07"),
    };

    const kpis = computeKpis(summary);

    expect(kpis.topCategory).toBe("B");
  });
});

describe("computeCategoryBreakdown", () => {
  it("computes percentages correctly for each category", () => {
    const byCategory = [
      { category: "Ăn uống", total: 600000 },
      { category: "Di chuyển", total: 400000 },
    ];

    const result = computeCategoryBreakdown(byCategory, 1000000);

    expect(result).toEqual([
      { category: "Ăn uống", amount: 600000, percentage: 60 },
      { category: "Di chuyển", amount: 400000, percentage: 40 },
    ]);
  });

  it("returns empty array when byCategory is empty", () => {
    const result = computeCategoryBreakdown([], 1000000);
    expect(result).toEqual([]);
  });

  it("returns empty array when total is 0", () => {
    const byCategory = [{ category: "A", total: 0 }];
    const result = computeCategoryBreakdown(byCategory, 0);
    expect(result).toEqual([]);
  });

  it("rounds percentages to nearest integer", () => {
    const byCategory = [
      { category: "A", total: 333333 },
      { category: "B", total: 333333 },
      { category: "C", total: 333334 },
    ];

    const result = computeCategoryBreakdown(byCategory, 1000000);

    expect(result[0].percentage).toBe(33);
    expect(result[1].percentage).toBe(33);
    expect(result[2].percentage).toBe(33);
  });
});
