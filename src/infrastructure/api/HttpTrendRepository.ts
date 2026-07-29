import { TrendReport } from "../../domain/entities/TrendReport";
import { TrendRepository } from "../../domain/ports/TrendRepository";

export class HttpTrendRepository implements TrendRepository {
  constructor(private readonly baseUrl: string) {}

  async fetchTrendReport(
    token: string,
    months?: number,
    endMonth?: string
  ): Promise<TrendReport> {
    const params = new URLSearchParams();
    params.set("token", token);
    if (months !== undefined) {
      params.set("months", String(months));
    }
    if (endMonth !== undefined) {
      params.set("endMonth", endMonth);
    }

    const response = await fetch(
      `${this.baseUrl}/api/report/trend?${params.toString()}`
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
        "Không thể tải báo cáo xu hướng. Vui lòng thử lại sau."
      );
    }

    const data: TrendReport = await response.json();
    return data;
  }

  async exportTrendReport(
    token: string,
    months?: number,
    endMonth?: string
  ): Promise<void> {
    const params = new URLSearchParams();
    params.set("token", token);
    if (months !== undefined) {
      params.set("months", String(months));
    }
    if (endMonth !== undefined) {
      params.set("endMonth", endMonth);
    }

    const response = await fetch(
      `${this.baseUrl}/api/report/trend/export?${params.toString()}`
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
      disposition?.match(/filename="(.+)"/)?.[1] ?? "trend-report.xlsx";

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
