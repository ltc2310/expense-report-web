import { useEffect, useState } from "react";
import { WeeklySummary } from "../../domain/entities/WeeklySummary";
import { ReportRepository } from "../../domain/ports/ReportRepository";

export type ReportState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: WeeklySummary };

/**
 * Application-layer use case: load the weekly report for a given token.
 * Only depends on the ReportRepository port, so it can be tested with a
 * fake repository without hitting a real network.
 */
export function useWeeklyReport(
  repository: ReportRepository,
  token: string | null
): ReportState {
  const [state, setState] = useState<ReportState>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ status: "error", message: "Missing report link. Please open this page from the bot." });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    repository
      .fetchReport(token)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ status: "error", message: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [repository, token]);

  return state;
}
