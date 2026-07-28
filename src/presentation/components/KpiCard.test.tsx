import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { KpiCard } from "./KpiCard";

describe("KpiCard", () => {
  it("renders value and label", () => {
    render(
      <KpiCard label="Tổng chi tiêu" value="1.500.000đ" ariaLabel="Tổng chi tiêu: 1.500.000đ" />
    );

    expect(screen.getByText("1.500.000đ")).toBeInTheDocument();
    expect(screen.getByText("Tổng chi tiêu")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <KpiCard label="Số giao dịch" value="12" icon="💳" ariaLabel="Số giao dịch: 12" />
    );

    expect(screen.getByText("💳")).toBeInTheDocument();
  });

  it("does not render icon element when icon is not provided", () => {
    const { container } = render(
      <KpiCard label="Chi tiêu trung bình" value="125.000đ" ariaLabel="Chi tiêu trung bình: 125.000đ" />
    );

    const iconSpan = container.querySelector("[aria-hidden='true']");
    expect(iconSpan).not.toBeInTheDocument();
  });

  it("has aria-label for accessibility (Req 7.3)", () => {
    render(
      <KpiCard label="Tổng chi tiêu" value="1.500.000đ" ariaLabel="Tổng chi tiêu: 1.500.000đ" />
    );

    expect(screen.getByLabelText("Tổng chi tiêu: 1.500.000đ")).toBeInTheDocument();
  });

  it("applies font-mono tabular-nums to the value", () => {
    render(
      <KpiCard label="Tổng chi tiêu" value="2.000.000đ" ariaLabel="Tổng chi tiêu: 2.000.000đ" />
    );

    const valueElement = screen.getByText("2.000.000đ");
    expect(valueElement).toHaveClass("font-mono", "tabular-nums");
  });

  it("applies text-ink-dim to the label", () => {
    render(
      <KpiCard label="Số giao dịch" value="8" ariaLabel="Số giao dịch: 8" />
    );

    const labelElement = screen.getByText("Số giao dịch");
    expect(labelElement).toHaveClass("text-ink-dim");
  });
});
