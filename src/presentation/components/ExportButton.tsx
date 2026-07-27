import { Transaction } from "../../domain/entities/WeeklySummary";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  transactions: Transaction[];
  from: Date;
  to: Date;
}

function formatDateShort(date: Date): string {
  const d = new Date(date);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

export function ExportButton({ transactions, from, to }: ExportButtonProps) {
  const handleExport = () => {
    const sorted = [...transactions].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    });

    const rows = sorted.map((t) => ({
      Ngày: t.createdAt
        ? new Date(t.createdAt).toLocaleDateString("vi-VN")
        : "",
      "Danh mục": t.category,
      "Ghi chú": t.note,
      "Số tiền (VND)": t.amount,
    }));

    // Add total row
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    rows.push({
      Ngày: "",
      "Danh mục": "",
      "Ghi chú": "TỔNG CỘNG",
      "Số tiền (VND)": total,
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Chi tiêu");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 18 },
      { wch: 30 },
      { wch: 15 },
    ];

    const fileName = `chi-tieu_${formatDateShort(from)}_den_${formatDateShort(to)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="text-center pt-2">
      <button
        onClick={handleExport}
        className="rounded-lg border border-jade bg-jade/10 px-6 py-3 font-mono text-sm font-semibold text-jade transition hover:bg-jade/20 active:scale-95"
      >
        📥 Xuất file Excel
      </button>
    </div>
  );
}
