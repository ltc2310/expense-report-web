import { useEffect, useState } from "react";
import { CompareReport } from "../../domain/entities/CompareReport";
import { CompareRepository } from "../../domain/ports/CompareRepository";

export type CompareReportState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: CompareReport };

/**
 * Application-layer use case: load the month comparison report for a given
 * token and two month/year pairs.
 * Only depends on the CompareRepository port, so it can be tested with a
 * fake repository without hitting a real network.
 */
export function useCompareReport(
  repository: CompareRepository,
  token: string | null,
  monthA: number,
  yearA: number,
  monthB: number,
  yearB: number
): CompareReportState {
  const [state, setState] = useState<CompareReportState>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({
        status: "error",
        message:
          "Trang này cần được mở từ bot. Vui lòng kiểm tra lại đường link.",
      });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    repository
      .fetchCompareReport(token, monthA, yearA, monthB, yearB)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ status: "error", message: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [repository, token, monthA, yearA, monthB, yearB]);

  return state;
}
