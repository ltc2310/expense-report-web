import { CompareReport } from "../../domain/entities/CompareReport";
import { CompareRepository } from "../../domain/ports/CompareRepository";

export class HttpCompareRepository implements CompareRepository {
  constructor(private readonly baseUrl: string) {}

  async fetchCompareReport(
    token: string,
    monthA: number,
    yearA: number,
    monthB: number,
    yearB: number
  ): Promise<CompareReport> {
    const params = new URLSearchParams();
    params.set("token", token);
    params.set("monthA", String(monthA));
    params.set("yearA", String(yearA));
    params.set("monthB", String(monthB));
    params.set("yearB", String(yearB));

    const response = await fetch(
      `${this.baseUrl}/api/report/compare?${params.toString()}`
    );

    if (response.status === 401) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }

    if (response.status === 400) {
      const err = await response
        .json()
        .catch(() => ({ message: "Yêu cầu không hợp lệ" }));
      throw new Error(err.message || "Yêu cầu không hợp lệ");
    }

    if (!response.ok) {
      throw new Error(
        "Không thể tải báo cáo so sánh. Vui lòng thử lại sau."
      );
    }

    const data: CompareReport = await response.json();
    return data;
  }

  async exportCompareReport(
    token: string,
    monthA: number,
    yearA: number,
    monthB: number,
    yearB: number
  ): Promise<void> {
    const params = new URLSearchParams();
    params.set("token", token);
    params.set("monthA", String(monthA));
    params.set("yearA", String(yearA));
    params.set("monthB", String(monthB));
    params.set("yearB", String(yearB));

    const response = await fetch(
      `${this.baseUrl}/api/report/compare/export?${params.toString()}`
    );

    if (!response.ok) {
      const err = await response
        .json()
        .catch(() => ({ message: "Không thể xuất báo cáo" }));
      throw new Error(err.message || "Không thể xuất báo cáo");
    }

    // Extract filename from Content-Disposition header
    const disposition = response.headers.get("Content-Disposition");
    const filename =
      disposition?.match(/filename="(.+)"/)?.[1] ?? "compare-report.xlsx";

    // Trigger browser download
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
