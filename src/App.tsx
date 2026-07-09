import { HttpReportRepository } from "./infrastructure/api/HttpReportRepository";
import { ReportPage } from "./presentation/pages/ReportPage";

// Composition root: the only place that knows the concrete repository
// implementation. Swap HttpReportRepository for a mock in tests without
// touching ReportPage or useWeeklyReport.
const repository = new HttpReportRepository(
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
);

function App() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  return <ReportPage repository={repository} token={token} />;
}

export default App;
