import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { MdTrendingUp, MdShoppingCart, MdPeople, MdAttachMoney } from "react-icons/md";
import { getDashboardStats } from "../../http/dashboardAPI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PERIOD_OPTIONS = [
  { value: "7d",  label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "1y",  label: "1 year" },
];

const PALETTE = [
  "#ffa500", "#4a90e2", "#7ed321", "#d0021b", "#9013fe",
  "#50e3c2", "#f5a623", "#417505", "#bd10e0", "#9b9b9b",
];

const STATUS_COLORS = {
  new:        "#1565c0",
  processing: "#e65100",
  shipped:    "#6a1b9a",
  delivered:  "#2e7d32",
  cancelled:  "#c62828",
};

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

// ── Sub-components ──────────────────────────────────

const StatCard = ({ icon, label, value, color }) => (
  <div className="dash-stat-card">
    <div className="dash-stat-icon" style={{ background: color + "22", color }}>
      {icon}
    </div>
    <div>
      <div className="dash-stat-label">{label}</div>
      <div className="dash-stat-value">{value}</div>
    </div>
  </div>
);

const ChartCard = ({ title, height = 260, children }) => (
  <div className="dash-chart-card">
    <div className="dash-chart-title">{title}</div>
    <div style={{ height }}>{children}</div>
  </div>
);

// ── Main component ──────────────────────────────────

const AdminDashboard = () => {
  const [period, setPeriod] = useState("30d");
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getDashboardStats(period)
      .then(setStats)
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <div className="orders-loading">Loading dashboard…</div>;
  if (error)   return <div className="orders-empty">Error: {error}</div>;
  if (!stats)  return null;

  const {
    summary,
    revenueByDay,
    ordersByStatus,
    salesByType,
    salesByBrand,
    topProducts,
    topCountries,
    topStates,
  } = stats;

  // ── Chart datasets ────────────────────────────────

  const revenueChartData = {
    labels: revenueByDay.map((d) => fmtDate(d.date)),
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueByDay.map((d) => parseFloat(d.revenue)),
        borderColor: "#ffa500",
        backgroundColor: "rgba(255,165,0,0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        yAxisID: "y",
      },
      {
        label: "Orders",
        data: revenueByDay.map((d) => d.count),
        borderColor: "#4a90e2",
        backgroundColor: "rgba(74,144,226,0.06)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        yAxisID: "y1",
      },
    ],
  };

  const statusChartData = {
    labels: ordersByStatus.map(
      (s) => s.status.charAt(0).toUpperCase() + s.status.slice(1)
    ),
    datasets: [
      {
        data: ordersByStatus.map((s) => s.count),
        backgroundColor: ordersByStatus.map(
          (s) => STATUS_COLORS[s.status] || "#9b9b9b"
        ),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const typeChartData = {
    labels: salesByType.map((t) => t.name),
    datasets: [
      {
        data: salesByType.map((t) => parseFloat(t.revenue) || 0),
        backgroundColor: PALETTE,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const brandChartData = {
    labels: salesByBrand.map((b) => b.name),
    datasets: [
      {
        label: "Revenue ($)",
        data: salesByBrand.map((b) => parseFloat(b.revenue) || 0),
        backgroundColor: "#ffa500",
        borderRadius: 4,
      },
    ],
  };

  const productChartData = {
    labels: topProducts.map((p) => p.name.split(",")[0]),
    datasets: [
      {
        label: "Units sold",
        data: topProducts.map((p) => p.totalQty),
        backgroundColor: "#4a90e2",
        borderRadius: 4,
      },
    ],
  };

  const countryChartData = {
    labels: topCountries.map((c) => c.country || "Unknown"),
    datasets: [
      {
        label: "Orders",
        data: topCountries.map((c) => c.count),
        backgroundColor: "#7ed321",
        borderRadius: 4,
      },
    ],
  };

  const stateChartData = {
    labels: topStates.map((s) => s.state_province || "Unknown"),
    datasets: [
      {
        label: "Orders",
        data: topStates.map((s) => s.count),
        backgroundColor: "#50e3c2",
        borderRadius: 4,
      },
    ],
  };

  // ── Chart options ─────────────────────────────────

  const lineOpts = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { position: "top" } },
    scales: {
      y: {
        beginAtZero: true,
        position: "left",
        title: { display: true, text: "Revenue ($)" },
        ticks: { callback: (v) => "$" + v.toLocaleString() },
      },
      y1: {
        beginAtZero: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Orders" },
      },
    },
  };

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12, padding: 12 } },
    },
  };

  const hBarOpts = (xLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, title: { display: true, text: xLabel } },
      y: { ticks: { font: { size: 11 } } },
    },
  });

  const vBarOpts = (yLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: yLabel } },
      x: { ticks: { font: { size: 11 } } },
    },
  });

  // ── Render ────────────────────────────────────────

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-page-header">
        <h2 className="admin-page-title">Dashboard</h2>
        <div className="dashboard-period-tabs">
          {PERIOD_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`period-tab${period === o.value ? " active" : ""}`}
              onClick={() => setPeriod(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="dash-stat-grid">
        <StatCard
          icon={<MdAttachMoney />}
          label="Total Revenue"
          value={fmtCurrency(summary.totalRevenue)}
          color="#ffa500"
        />
        <StatCard
          icon={<MdShoppingCart />}
          label="Total Orders"
          value={summary.totalOrders.toLocaleString()}
          color="#4a90e2"
        />
        <StatCard
          icon={<MdPeople />}
          label="Unique Buyers"
          value={summary.uniqueBuyers.toLocaleString()}
          color="#7ed321"
        />
        <StatCard
          icon={<MdTrendingUp />}
          label="Avg Order Value"
          value={fmtCurrency(summary.avgOrderValue)}
          color="#9013fe"
        />
      </div>

      {/* Revenue & Orders over time */}
      <div className="dash-chart-card dash-chart-full">
        <div className="dash-chart-title">Revenue &amp; Orders Over Time</div>
        <div style={{ height: 280 }}>
          {revenueByDay.length > 0 ? (
            <Line data={revenueChartData} options={lineOpts} />
          ) : (
            <div className="dash-no-data">No orders in this period</div>
          )}
        </div>
      </div>

      {/* Status doughnut + Category doughnut */}
      <div className="dash-charts-row">
        <ChartCard title="Orders by Status" height={260}>
          {ordersByStatus.length > 0 ? (
            <Doughnut data={statusChartData} options={doughnutOpts} />
          ) : (
            <div className="dash-no-data">No data</div>
          )}
        </ChartCard>
        <ChartCard title="Revenue by Category" height={260}>
          {salesByType.some((t) => parseFloat(t.revenue) > 0) ? (
            <Doughnut data={typeChartData} options={doughnutOpts} />
          ) : (
            <div className="dash-no-data">No sales data</div>
          )}
        </ChartCard>
      </div>

      {/* Top brands + Top products */}
      <div className="dash-charts-row">
        <ChartCard title="Top Brands by Revenue" height={300}>
          {salesByBrand.some((b) => parseFloat(b.revenue) > 0) ? (
            <Bar data={brandChartData} options={hBarOpts("Revenue ($)")} />
          ) : (
            <div className="dash-no-data">No sales data</div>
          )}
        </ChartCard>
        <ChartCard title="Top Products — Units Sold" height={300}>
          {topProducts.length > 0 ? (
            <Bar data={productChartData} options={hBarOpts("Units sold")} />
          ) : (
            <div className="dash-no-data">No sales data</div>
          )}
        </ChartCard>
      </div>

      {/* Locations */}
      <div className="dash-charts-row">
        <ChartCard title="Orders by Country" height={260}>
          {topCountries.length > 0 ? (
            <Bar data={countryChartData} options={vBarOpts("Orders")} />
          ) : (
            <div className="dash-no-data">No data</div>
          )}
        </ChartCard>
        <ChartCard title="Orders by State / Province" height={260}>
          {topStates.length > 0 ? (
            <Bar data={stateChartData} options={vBarOpts("Orders")} />
          ) : (
            <div className="dash-no-data">No data</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
