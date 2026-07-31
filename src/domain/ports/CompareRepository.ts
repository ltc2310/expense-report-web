import { CompareReport } from "../entities/CompareReport";

/**
 * Shared contract for fetching and exporting month comparison reports.
 * The presentation layer and application hooks only depend on this interface,
 * never on `fetch` or any concrete HTTP client directly.
 */
export interface CompareRepository {
  fetchCompareReport(
    token: string,
    monthA: number,
    yearA: number,
    monthB: number,
    yearB: number
  ): Promise<CompareReport>;

  /**
   * Downloads the compare report as an Excel (.xlsx) file from the server
   * and triggers a browser download.
   */
  exportCompareReport(
    token: string,
    monthA: number,
    yearA: number,
    monthB: number,
    yearB: number
  ): Promise<void>;
}
