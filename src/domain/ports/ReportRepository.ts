import { WeeklySummary } from "../entities/WeeklySummary";

/**
 * Shared contract for fetching a weekly report. The presentation layer and
 * application hooks only depend on this interface, never on `fetch` or any
 * concrete HTTP client directly.
 */
export interface ReportRepository {
  fetchReport(token: string): Promise<WeeklySummary>;

  /**
   * Downloads the weekly report as an Excel (.xlsx) file from the server
   * and triggers a browser download with the filename from Content-Disposition.
   */
  exportReport(token: string): Promise<void>;
}
