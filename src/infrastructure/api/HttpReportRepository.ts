import { WeeklySummary } from "../../domain/entities/WeeklySummary";
import { ReportRepository } from "../../domain/ports/ReportRepository";

export class HttpReportRepository implements ReportRepository {
  constructor(private readonly baseUrl: string) {}

  async fetchReport(token: string): Promise<WeeklySummary> {
    const response = await fetch(
      `${this.baseUrl}/api/report?token=${encodeURIComponent(token)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Report not found. The link may have expired.");
      }
      throw new Error("Failed to load report. Please try again later.");
    }

    const data = await response.json();
    return {
      ...data,
      from: new Date(data.from),
      to: new Date(data.to),
    };
  }

  async exportReport(token: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/api/report/export?token=${encodeURIComponent(token)}`
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: "Failed to generate report" }));
      throw new Error(err.message);
    }

    // Extract filename from Content-Disposition header
    const disposition = response.headers.get("Content-Disposition");
    const filename =
      disposition?.match(/filename="(.+)"/)?.[1] ?? "report.xlsx";

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
