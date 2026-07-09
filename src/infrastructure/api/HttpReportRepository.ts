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

    return response.json();
  }
}
