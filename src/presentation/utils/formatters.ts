/**
 * Format a number as Vietnamese currency (VNĐ).
 * Uses dot separators for thousands and "đ" suffix.
 * Example: 1500000 → "1.500.000đ"
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return rounded < 0 ? `-${formatted}đ` : `${formatted}đ`;
}

/**
 * Format a date range as "dd/mm/yyyy — dd/mm/yyyy" using vi-VN locale.
 */
export function formatDateRange(from: Date, to: Date): string {
  const fmt = (d: Date): string => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return `${fmt(from)} — ${fmt(to)}`;
}
