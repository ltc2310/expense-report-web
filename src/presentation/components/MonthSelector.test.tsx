import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MonthSelector } from "./MonthSelector";

describe("MonthSelector", () => {
  it("renders label linked to select via htmlFor/id", () => {
    render(<MonthSelector value={6} onChange={() => {}} />);

    const label = screen.getByText("Số tháng phân tích:");
    expect(label).toHaveAttribute("for", "month-selector");

    const select = screen.getByRole("combobox", { name: "Số tháng phân tích:" });
    expect(select).toHaveAttribute("id", "month-selector");
  });

  it("renders options from 3 to 12", () => {
    render(<MonthSelector value={6} onChange={() => {}} />);

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(10);
    expect(options[0]).toHaveTextContent("3 tháng");
    expect(options[9]).toHaveTextContent("12 tháng");
  });

  it("displays the controlled value", () => {
    render(<MonthSelector value={9} onChange={() => {}} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("9");
  });

  it("calls onChange with the selected numeric value", () => {
    const handleChange = vi.fn();

    render(<MonthSelector value={6} onChange={handleChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "10" } });

    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it("is keyboard accessible (native select supports Tab focus)", () => {
    render(<MonthSelector value={6} onChange={() => {}} />);

    const select = screen.getByRole("combobox");
    select.focus();
    expect(select).toHaveFocus();
  });

  it("has focus ring classes for visible focus indicator", () => {
    render(<MonthSelector value={6} onChange={() => {}} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("focus:ring-2", "focus:ring-jade/50");
  });
});
