import { HttpReportRepository } from "./infrastructure/api/HttpReportRepository";
import { HttpTrendRepository } from "./infrastructure/api/HttpTrendRepository";
import { HttpCompareRepository } from "./infrastructure/api/HttpCompareRepository";
import { DashboardPage } from "./presentation/pages/DashboardPage";
import { TrendDashboardPage } from "./presentation/pages/TrendDashboardPage";
import { CompareDashboardPage } from "./presentation/pages/CompareDashboardPage";

// Composition root: the only place that knows the concrete repository
// implementations. Swap for mocks in tests without touching page components.
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const repository = new HttpReportRepository(baseUrl);
const trendRepository = new HttpTrendRepository(baseUrl);
const compareRepository = new HttpCompareRepository(baseUrl);

function App() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const pathname = window.location.pathname;

  if (pathname === "/compare") {
    return <CompareDashboardPage repository={compareRepository} token={token} />;
  }

  if (pathname === "/trend") {
    return <TrendDashboardPage repository={trendRepository} token={token} />;
  }

  return <DashboardPage repository={repository} token={token} />;
}

export default App;
