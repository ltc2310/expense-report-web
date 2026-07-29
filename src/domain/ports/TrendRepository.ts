import { TrendReport } from "../entities/TrendReport";

/**
 * Shared contract for fetching and exporting trend reports. The presentation
 * layer and application hooks only depend on this interface, never on `fetch`
 * or any concrete HTTP client directly.
 */
export interface TrendRepository {
  fetchTrendReport(token: string, months?: number, endMonth?: string): Promise<TrendReport>;

  /**
   * Downloads the trend report as an Excel (.xlsx) file from the server
   * and triggers a browser download.
   */
  exportTrendReport(token: string, months?: number, endMonth?: string): Promise<void>;
}
