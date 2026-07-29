import { useEffect, useState } from "react";
import { TrendReport } from "../../domain/entities/TrendReport";
import { TrendRepository } from "../../domain/ports/TrendRepository";

export type TrendReportState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: TrendReport };

/**
 * Application-layer use case: load the trend report for a given token and month range.
 * Only depends on the TrendRepository port, so it can be tested with a
 * fake repository without hitting a real network.
 *
 * Clamps months to 6 if outside the valid 3–12 range.
 */
export function useTrendReport(
  repository: TrendRepository,
  token: string | null,
  months: number
): TrendReportState {
  const [state, setState] = useState<TrendReportState>({ status: "loading" });

  const effectiveMonths = months >= 3 && months <= 12 ? months : 6;

  useEffect(() => {
    if (!token) {
      setState({
        status: "error",
        message: "Trang này cần được mở từ bot. Vui lòng kiểm tra lại đường link.",
      });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    repository
      .fetchTrendReport(token, effectiveMonths)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ status: "error", message: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [repository, token, effectiveMonths]);

  return state;
}
