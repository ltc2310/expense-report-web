import { describe, it, expect } from "vitest";
import {
  getUniqueCategoriesSortedByTotal,
  sortCategoryTrendsByAbsChange,
  classifyDirection,
} from "../trendHelpers";
import type {
  MonthlyBreakdown,
  CategoryTrend,
} from "../../../domain/entities/TrendReport";

describe("getUniqueCategoriesSortedByTotal", () => {
  it("returns empty array for empty input", () => {
    expect(getUniqueCategoriesSortedByTotal([])).toEqual([]);
  });

  it("returns categories sorted by total descending", () => {
    const breakdown: MonthlyBreakdown[] = [
      {
        month: "2024-01",
        monthLabel: "Tháng 1/2024",
        totalSpent: 300,
        totalIncome: 0,
        transactionCount: 3,
        byCategory: [
          { category: "Food", amount: 100 },
          { category: "Transport", amount: 200 },
        ],
        topCategory: "Transport",
      },
      {
        month: "2024-02",
        monthLabel: "Tháng 2/2024",
        totalSpent: 450,
        totalIncome: 0,
        transactionCount: 3,
        byCategory: [
          { category: "Food", amount: 250 },
          { category: "Entertainment", amount: 200 },
        ],
        topCategory: "Food",
      },
    ];

    const result = getUniqueCategoriesSortedByTotal(breakdown);
    // Food: 100+250=350, Transport: 200, Entertainment: 200
    expect(result).toEqual(["Food", "Transport", "Entertainment"]);
  });

  it("contains no duplicates", () => {
    const breakdown: MonthlyBreakdown[] = [
      {
        month: "2024-01",
        monthLabel: "Tháng 1/2024",
        totalSpent: 100,
        totalIncome: 0,
        transactionCount: 1,
        byCategory: [{ category: "Food", amount: 50 }],
        topCategory: "Food",
      },
      {
        month: "2024-02",
        monthLabel: "Tháng 2/2024",
        totalSpent: 100,
        totalIncome: 0,
        transactionCount: 1,
        byCategory: [{ category: "Food", amount: 80 }],
        topCategory: "Food",
      },
    ];

    const result = getUniqueCategoriesSortedByTotal(breakdown);
    expect(result).toEqual(["Food"]);
  });
});

describe("sortCategoryTrendsByAbsChange", () => {
  it("returns empty array for empty input", () => {
    expect(sortCategoryTrendsByAbsChange([])).toEqual([]);
  });

  it("sorts by absolute changePercent descending", () => {
    const trends: CategoryTrend[] = [
      {
        category: "Food",
        monthlyAmounts: [100, 110],
        changePercent: 10,
        direction: "stable",
        averageMonthly: 105,
      },
      {
        category: "Transport",
        monthlyAmounts: [200, 100],
        changePercent: -50,
        direction: "decreasing",
        averageMonthly: 150,
      },
      {
        category: "Entertainment",
        monthlyAmounts: [50, 75],
        changePercent: 50,
        direction: "increasing",
        averageMonthly: 62.5,
      },
    ];

    const result = sortCategoryTrendsByAbsChange(trends);
    expect(result[0].category).toBe("Transport"); // |-50| = 50
    expect(result[1].category).toBe("Entertainment"); // |50| = 50
    expect(result[2].category).toBe("Food"); // |10| = 10
  });

  it("does not mutate original array", () => {
    const trends: CategoryTrend[] = [
      {
        category: "A",
        monthlyAmounts: [100],
        changePercent: 5,
        direction: "stable",
        averageMonthly: 100,
      },
      {
        category: "B",
        monthlyAmounts: [200],
        changePercent: -20,
        direction: "decreasing",
        averageMonthly: 200,
      },
    ];

    const original = [...trends];
    sortCategoryTrendsByAbsChange(trends);
    expect(trends).toEqual(original);
  });
});

describe("classifyDirection", () => {
  it('returns "increasing" for changePercent > 10', () => {
    expect(classifyDirection(11)).toBe("increasing");
    expect(classifyDirection(50)).toBe("increasing");
    expect(classifyDirection(100)).toBe("increasing");
  });

  it('returns "decreasing" for changePercent < -10', () => {
    expect(classifyDirection(-11)).toBe("decreasing");
    expect(classifyDirection(-50)).toBe("decreasing");
    expect(classifyDirection(-100)).toBe("decreasing");
  });

  it('returns "stable" for -10 <= changePercent <= 10', () => {
    expect(classifyDirection(0)).toBe("stable");
    expect(classifyDirection(10)).toBe("stable");
    expect(classifyDirection(-10)).toBe("stable");
    expect(classifyDirection(5)).toBe("stable");
    expect(classifyDirection(-5)).toBe("stable");
  });

  it("handles boundary values precisely", () => {
    expect(classifyDirection(10)).toBe("stable");
    expect(classifyDirection(10.001)).toBe("increasing");
    expect(classifyDirection(-10)).toBe("stable");
    expect(classifyDirection(-10.001)).toBe("decreasing");
  });
});
