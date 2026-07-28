import { HttpReportRepository } from "./infrastructure/api/HttpReportRepository";
import { DashboardPage } from "./presentation/pages/DashboardPage";

// Composition root: the only place that knows the concrete repository
// implementation. Swap HttpReportRepository for a mock in tests without
// touching DashboardPage or useWeeklyReport.
const repository = new HttpReportRepository(
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
);

function App() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  return <DashboardPage repository={repository} token={token} />;
}

export default App;
