import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { formatCurrency, formatDateRange } from "./formatters";

describe("formatCurrency", () => {
  it("formats zero as 0đ", () => {
    expect(formatCurrency(0)).toBe("0đ");
  });

  it("formats small numbers without separators", () => {
    expect(formatCurrency(500)).toBe("500đ");
  });

  it("formats thousands with dot separator", () => {
    expect(formatCurrency(1500)).toBe("1.500đ");
  });

  it("formats millions with dot separators", () => {
    expect(formatCurrency(1500000)).toBe("1.500.000đ");
  });

  it("rounds decimal values", () => {
    expect(formatCurrency(1234.56)).toBe("1.235đ");
  });

  it("handles negative amounts", () => {
    expect(formatCurrency(-5000)).toBe("-5.000đ");
  });

  // Feature: executive-dashboard-redesign, Property 1: Currency formatting preserves numeric value
  // **Validates: Requirements 2.2**
  it("property: formatting preserves numeric value for non-negative integers", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 999_999_999 }), (n) => {
        const formatted = formatCurrency(n);
        // Extract digits from formatted string (remove dots and đ suffix)
        const digits = formatted.replace(/\./g, "").replace("đ", "");
        expect(Number(digits)).toBe(n);
      }),
      { numRuns: 100 }
    );
  });

  it("property: result always ends with đ suffix", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 999_999_999 }), (n) => {
        const formatted = formatCurrency(n);
        expect(formatted.endsWith("đ")).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

describe("formatDateRange", () => {
  it("formats a single-day range", () => {
    const d = new Date(2024, 0, 15); // Jan 15, 2024
    expect(formatDateRange(d, d)).toBe("15/01/2024 — 15/01/2024");
  });

  it("formats a multi-day range", () => {
    const from = new Date(2024, 2, 1); // Mar 1, 2024
    const to = new Date(2024, 2, 7); // Mar 7, 2024
    expect(formatDateRange(from, to)).toBe("01/03/2024 — 07/03/2024");
  });

  it("pads single-digit day and month with leading zero", () => {
    const from = new Date(2024, 0, 5); // Jan 5
    const to = new Date(2024, 8, 9); // Sep 9
    expect(formatDateRange(from, to)).toBe("05/01/2024 — 09/09/2024");
  });

  // Feature: executive-dashboard-redesign, Property 3: Date range formatting produces valid vi-VN output
  // **Validates: Requirements 3.2**
  it("property: output matches dd/mm/yyyy — dd/mm/yyyy format", () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date(2000, 0, 1), max: new Date(2099, 11, 31), noInvalidDate: true }),
        fc.date({ min: new Date(2000, 0, 1), max: new Date(2099, 11, 31), noInvalidDate: true }),
        (a, b) => {
          const from = a <= b ? a : b;
          const to = a <= b ? b : a;
          const result = formatDateRange(from, to);
          // Should match pattern: dd/mm/yyyy — dd/mm/yyyy
          const pattern = /^\d{2}\/\d{2}\/\d{4} — \d{2}\/\d{2}\/\d{4}$/;
          expect(result).toMatch(pattern);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("property: output contains correct from and to dates", () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date(2000, 0, 1), max: new Date(2099, 11, 31), noInvalidDate: true }),
        fc.date({ min: new Date(2000, 0, 1), max: new Date(2099, 11, 31), noInvalidDate: true }),
        (a, b) => {
          const from = a <= b ? a : b;
          const to = a <= b ? b : a;
          const result = formatDateRange(from, to);
          const [leftPart, rightPart] = result.split(" — ");

          // Verify from date
          const [fd, fm, fy] = leftPart.split("/").map(Number);
          expect(fd).toBe(from.getDate());
          expect(fm).toBe(from.getMonth() + 1);
          expect(fy).toBe(from.getFullYear());

          // Verify to date
          const [td, tm, ty] = rightPart.split("/").map(Number);
          expect(td).toBe(to.getDate());
          expect(tm).toBe(to.getMonth() + 1);
          expect(ty).toBe(to.getFullYear());
        }
      ),
      { numRuns: 100 }
    );
  });
});
