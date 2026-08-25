import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import pptxgen from "pptxgenjs";
import * as XLSX from "xlsx";

import {
  LayoutDashboard,
  BrainCircuit,
  CircleHelp,
  GitCompareArrows,
  FlaskConical,
  SlidersHorizontal,
  FileText,
  Database,
  Settings,
  Download,
  Leaf,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Droplets,
  Wind,
  Trees,
  Factory,
  CloudSun,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  RotateCcw,
  Search,
  Info,
  Sparkles,
  Target,
  ShieldCheck,
  BarChart3,
  Globe2,
  Zap,
  Menu,
  X,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";

import "./App.css";

/* =========================================================
   DATA
========================================================= */

const years = [
  { year: "2016", score: 35.4, rank: 142 },
  { year: "2017", score: 33.1, rank: 148 },
  { year: "2018", score: 32.8, rank: 155 },
  { year: "2019", score: 31.2, rank: 161 },
  { year: "2020", score: 30.8, rank: 164 },
  { year: "2021", score: 29.9, rank: 168 },
  { year: "2022", score: 28.7, rank: 172 },
  { year: "2023", score: 27.9, rank: 179 },
  { year: "2024", score: 28.7, rank: 176 },
];

const forecastData = [
  { year: "2024", historical: 28.7, predicted: null },
  { year: "2025", historical: null, predicted: 29.4 },
  { year: "2026", historical: null, predicted: 30.1 },
  { year: "2027", historical: null, predicted: 31.2 },
  { year: "2028", historical: null, predicted: 32.3 },
  { year: "2029", historical: null, predicted: 33.4 },
  { year: "2030", historical: null, predicted: 34.6 },
];

const regionalData = [
  { region: "Europe", score: 64.1 },
  { region: "North America", score: 51.4 },
  { region: "Asia", score: 34.2 },
  { region: "Latin America", score: 32.1 },
  { region: "Africa", score: 24.7 },
  { region: "India", score: 28.7 },
];

const indicatorData = [
  {
    name: "Air Quality",
    value: 45.2,
    unit: "µg/m³",
    status: "Poor",
    icon: Wind,
  },
  {
    name: "Water Quality",
    value: 42.6,
    unit: "/100",
    status: "Poor",
    icon: Droplets,
  },
  {
    name: "Biodiversity & Habitat",
    value: 54.1,
    unit: "/100",
    status: "Moderate",
    icon: Trees,
  },
  {
    name: "Forest Cover",
    value: 24.2,
    unit: "%",
    status: "Low",
    icon: Trees,
  },
  {
    name: "Climate & Energy",
    value: 30.3,
    unit: "/100",
    status: "Moderate",
    icon: CloudSun,
  },
  {
    name: "Waste Management",
    value: 38.6,
    unit: "/100",
    status: "Poor",
    icon: Trash2,
  },
];

const importanceData = [
  { name: "Air Quality", value: 17.2 },
  { name: "Water Quality", value: 16.2 },
  { name: "Forest Cover", value: 11.4 },
  { name: "Biodiversity", value: 9.8 },
  { name: "Waste Management", value: 7.9 },
  { name: "Renewable Energy", value: 6.3 },
  { name: "CO₂ Emissions", value: 4.1 },
  { name: "Others", value: 20.9 },
];

const shapData = [
  { name: "Base Value", value: 28.1, positive: false },
  { name: "Forest Cover", value: 2.8, positive: true },
  { name: "Renewable Energy", value: 1.9, positive: true },
  { name: "Waste Management", value: 1.5, positive: true },
  { name: "Air Quality", value: -2.7, positive: false },
  { name: "Water Quality", value: -2.1, positive: false },
  { name: "CO₂ Emissions", value: -1.3, positive: false },
  { name: "Others", value: -0.6, positive: false },
];

const twinCountries = [
  {
    country: "Indonesia",
    similarity: 0.91,
    score: 31.2,
    air: 32.1,
    water: 42.1,
    forest: 50.1,
    renewable: 19.2,
  },
  {
    country: "Vietnam",
    similarity: 0.88,
    score: 34.4,
    air: 34.5,
    water: 55.4,
    forest: 50.1,
    renewable: 26.6,
  },
  {
    country: "Philippines",
    similarity: 0.86,
    score: 31.8,
    air: 41.2,
    water: 50.1,
    forest: 25.9,
    renewable: 24.4,
  },
  {
    country: "Thailand",
    similarity: 0.84,
    score: 38.2,
    air: 42.1,
    water: 52.1,
    forest: 40.8,
    renewable: 23.7,
  },
  {
    country: "Bangladesh",
    similarity: 0.82,
    score: 27.4,
    air: 29.2,
    water: 39.1,
    forest: 14.5,
    renewable: 4.8,
  },
];

const scenarioData = [
  {
    name: "Renewable Energy Expansion",
    description: "Expand solar and wind capacity.",
    impact: "+10%",
    score: "+3.8",
    confidence: "High impact",
  },
  {
    name: "Forest Restoration",
    description: "Restore degraded forest regions.",
    impact: "+12%",
    score: "+4.2",
    confidence: "High impact",
  },
  {
    name: "Urban Wastewater Modernization",
    description: "Improve wastewater treatment infrastructure.",
    impact: "+6%",
    score: "+2.4",
    confidence: "Medium impact",
  },
  {
    name: "Clean Air Action Plan",
    description: "Reduce industrial, vehicle and urban emissions.",
    impact: "+8%",
    score: "+3.1",
    confidence: "High impact",
  },
];

const priorityData = [
  {
    rank: 1,
    intervention: "Renewable Energy Expansion",
    gain: "+6.4",
    impact: 9.2,
    confidence: "87%",
  },
  {
    rank: 2,
    intervention: "Forest Restoration Mission",
    gain: "+4.8",
    impact: 8.3,
    confidence: "85%",
  },
  {
    rank: 3,
    intervention: "Clean Air Action Plan",
    gain: "+4.2",
    impact: 7.9,
    confidence: "83%",
  },
  {
    rank: 4,
    intervention: "Urban Wastewater Modernization",
    gain: "+2.9",
    impact: 7.5,
    confidence: "84%",
  },
  {
    rank: 5,
    intervention: "Sustainable Waste Management",
    gain: "+3.1",
    impact: 6.8,
    confidence: "80%",
  },
];

const heatmapData = [
  ["Air Quality", 42, 55, 61],
  ["Water Quality", 38, 58, 64],
  ["Biodiversity", 55, 62, 69],
  ["Climate & Energy", 45, 51, 60],
  ["Waste Management", 39, 47, 58],
];

/* =========================================================
   SIDEBAR
========================================================= */

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "prediction", label: "AI Prediction", icon: BrainCircuit },
  { id: "explainable", label: "Explainable AI", icon: CircleHelp },
  { id: "twin", label: "Twin Finder", icon: GitCompareArrows },
  { id: "policy", label: "Policy & Scenario", icon: FlaskConical },
  { id: "optimizer", label: "Priority Optimizer", icon: SlidersHorizontal },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "data", label: "Data Explorer", icon: Database },
];

function Sidebar({ activePage, setActivePage, mobileOpen, setMobileOpen }) {
  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Leaf size={21} />
          </div>

          <div>
            <div className="brand-title">EcoLens AI</div>
            <div className="brand-subtitle">Sustainable Policy Platform</div>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileOpen(false);
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

       <div className="sidebar-bottom">
  <button
    className="nav-item"
    onClick={() => setActivePage("settings")}
  >
    <Settings size={17} />
    <span>Settings</span>
  </button>

  <div className="sidebar-version">
    EcoLens AI v1.0
  </div>
</div>
      </aside>
    </>
  );
}

/* =========================================================
   HEADER
========================================================= */

function TopHeader({ title, setMobileOpen }) {
  const handleDownloadReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("EcoLens AI", 20, 25);

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Environmental Performance Report", 20, 35);

  doc.setFontSize(11);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
    20,
    45
  );

  doc.line(20, 50, 190, 50);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 20, 65);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const text =
    "EcoLens AI analyzes environmental performance data, " +
    "compares countries and provides environmental insights " +
    "to support sustainable decision making.";

  doc.text(doc.splitTextToSize(text, 170), 20, 75);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Key Features", 20, 105);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text("• Environmental Performance Analysis", 25, 115);
  doc.text("• Country Comparison", 25, 123);
  doc.text("• Data Explorer", 25, 131);
  doc.text("• Benchmark Analysis", 25, 139);
  doc.text("• Explainable AI Insights", 25, 147);
  doc.text("• Environmental Indicators", 25, 155);

  doc.setFontSize(9);
  doc.text(
    "Generated by EcoLens AI - Environmental Intelligence Platform",
    20,
    285
  );

  doc.save("EcoLens_AI_Report.pdf");
};
  return (
    <header className="top-header">
      <div className="header-left">
  <button className="mobile-menu" onClick={() => setMobileOpen(true)}>
    <Menu size={22} />
  </button>

  <select
    className="country-selector"
    defaultValue="India"
  >
    <option value="India">🇮🇳 India</option>
    <option value="United States">🇺🇸 United States</option>
    <option value="United Kingdom">🇬🇧 United Kingdom</option>
    <option value="China">🇨🇳 China</option>
    <option value="Japan">🇯🇵 Japan</option>
    <option value="Germany">🇩🇪 Germany</option>
    <option value="France">🇫🇷 France</option>
    <option value="Canada">🇨🇦 Canada</option>
    <option value="Australia">🇦🇺 Australia</option>
    <option value="Brazil">🇧🇷 Brazil</option>
    <option value="South Korea">🇰🇷 South Korea</option>
    <option value="Singapore">🇸🇬 Singapore</option>
    <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
    <option value="Switzerland">🇨🇭 Switzerland</option>
    <option value="Netherlands">🇳🇱 Netherlands</option>
  </select>
</div>

     <div className="header-actions">
  <button
    className="header-button"
    onClick={handleDownloadReport}
  >
    <Download size={15} />
    Download Report
  </button>
</div>
    </header>
  );
}

/* =========================================================
   COMMON COMPONENTS
========================================================= */

function PageTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="page-title">
      <div className="page-title-icon">
        <Icon size={20} />
      </div>

      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function CardHeader({ title, subtitle, action }) {
  return (
    <div className="card-header">
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {action}
    </div>
  );
}

function KpiCard({ title, value, suffix, note, type = "normal", icon }) {
  const Icon = icon;

  return (
    <Card className="kpi-card">
      <div className="kpi-top">
        <span>{title}</span>
        {Icon && <Icon size={16} />}
      </div>

      <div className={`kpi-value ${type}`}>
        {value}
        {suffix && <small>{suffix}</small>}
      </div>

      {note && <div className="kpi-note">{note}</div>}
    </Card>
  );
}

function StatusBadge({ children, type = "moderate" }) {
  return <span className={`status-badge ${type}`}>{children}</span>;
}

function EmptyState({ icon: Icon = Database, title, text }) {
  return (
    <div className="empty-state">
      <Icon size={34} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const healthData = [
    { name: "Good", value: 17 },
    { name: "Moderate", value: 33 },
    { name: "Poor", value: 50 },
  ];

  return (
    <div className="page">
      <PageTitle
        icon={LayoutDashboard}
        title="Environmental Intelligence Dashboard"
        subtitle="Current environmental status and key indicators"
      />

      <div className="updated-row">
        <span>Last Updated: 20 May 2025</span>
      </div>

      <section className="kpi-grid five">
        <KpiCard
          title="EPI Score (2024)"
          value="28.7"
          suffix="/100"
          note="Environmental Performance Index"
          type="positive"
        />

        <KpiCard
          title="Global Rank"
          value="176"
          suffix="/180"
          note="4 positions from bottom"
          type="positive"
        />

        <KpiCard
          title="Trend (vs 2022)"
          value="Poor"
          note="Score declining"
          type="danger"
        />

        <KpiCard
          title="Regional Rank"
          value="28"
          suffix="/31"
          note="Asia ranking"
          type="positive"
        />

        <KpiCard
          title="Data Coverage"
          value="95%"
          note="19 / 20 indicators"
          type="positive"
        />
      </section>

      <div className="dashboard-main-grid">
        <Card>
          <CardHeader
            title="Key Environmental Indicators (2024)"
            subtitle="Current indicator values"
          />

          <div className="indicator-list">
            {indicatorData.map((item) => {
              const Icon = item.icon;

              return (
                <div className="indicator-row" key={item.name}>
                  <div className="indicator-name">
                    <span className="indicator-icon">
                      <Icon size={15} />
                    </span>
                    {item.name}
                  </div>

                  <div className="indicator-number">
                    {item.value} {item.unit}
                  </div>

                  <StatusBadge
                    type={
                      item.status === "Poor"
                        ? "poor"
                        : item.status === "Low"
                        ? "low"
                        : "moderate"
                    }
                  >
                    {item.status}
                  </StatusBadge>
                </div>
              );
            })}
          </div>
        </Card>

       <Card>
  <CardHeader title="EPI Score Trend" subtitle="2016 – 2024" />

  <div className="chart-container">
    <ResponsiveContainer width="100%" height={230}>
      <LineChart
        data={years}
        margin={{
          top: 10,
          right: 20,
          left: 5,
          bottom: 20,
        }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="year"
          fontSize={11}
          tickMargin={10}
          interval={0}
          padding={{ left: 10, right: 10 }}
        />

        <YAxis
          domain={[20, 40]}
          fontSize={11}
          tickMargin={8}
          width={35}
        />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="score"
          stroke="#087c3e"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</Card>

        <Card>
  <CardHeader title="Global Rank Trend" subtitle="2016 – 2024" />

  <div className="chart-container">
    <ResponsiveContainer width="100%" height={230}>
      <LineChart
        data={years}
        margin={{
          top: 10,
          right: 20,
          left: 5,
          bottom: 20,
        }}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="year"
          fontSize={11}
          tickMargin={10}
          interval={0}
          padding={{ left: 10, right: 10 }}
        />

        <YAxis
          reversed
          domain={[120, 190]}
          fontSize={11}
          tickMargin={8}
          width={35}
        />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="rank"
          stroke="#263b50"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</Card>
      </div>

      <div className="three-column-grid">
        <Card>
          <CardHeader title="EPI Score by Region (2024)" />

          <ResponsiveContainer width="100%" height={245}>
            <BarChart
              data={regionalData}
              layout="vertical"
              margin={{ left: 10, right: 10 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" fontSize={10} />
              <YAxis
                type="category"
                dataKey="region"
                width={82}
                fontSize={9}
              />
              <Tooltip />
              <Bar dataKey="score" fill="#3c9667" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader
            title="Indicator Heatmap"
            subtitle="Global comparison"
          />

          <div className="heatmap">
            <div className="heatmap-head">
              <span></span>
              <span>India</span>
              <span>Regional Avg</span>
              <span>Global Avg</span>
            </div>

            {heatmapData.map((row) => (
              <div className="heatmap-row" key={row[0]}>
                <strong>{row[0]}</strong>

                <span className="heat low">{row[1]}</span>
                <span className="heat medium">{row[2]}</span>
                <span className="heat high">{row[3]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Environmental Health Overview" />

          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={healthData}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  <Cell fill="#268a5b" />
                  <Cell fill="#d0a52c" />
                  <Cell fill="#d95050" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <strong>50%</strong>
              <span>Poor</span>
            </div>
          </div>

          <div className="legend-list">
            <span>
              <i className="dot green"></i> Good <b>17%</b>
            </span>
            <span>
              <i className="dot yellow"></i> Moderate <b>33%</b>
            </span>
            <span>
              <i className="dot red"></i> Poor <b>50%</b>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================
   AI PREDICTION
========================================================= */

function Prediction() {
  return (
    <div className="page">
      <PageTitle
        icon={BrainCircuit}
        title="AI Prediction Engine"
        subtitle="Predict future EPI score, rank and environmental trends"
      />

      <div className="prediction-controls">
        <label>
          Base Year
          <select>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
          </select>
        </label>

        <label>
          Prediction Year
          <select>
            <option>2030</option>
            <option>2029</option>
            <option>2028</option>
          </select>
        </label>
      </div>

      <div className="prediction-top-grid">
        <Card>
          <div className="prediction-result">
            <span>Predicted EPI Score (2030)</span>
            <strong>34.6</strong>
            <small>↑ 5.9 from 2024</small>
          </div>
        </Card>

        <Card>
          <div className="prediction-result">
            <span>Global Rank (2030)</span>
            <strong>162</strong>
            <small>↑ 14 ranks</small>
          </div>
        </Card>

        <Card className="confidence-card">
          <span>Prediction Confidence</span>

          <div className="confidence-ring">
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="confidence-bg"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="confidence-progress"
              />
            </svg>

            <div>
              <strong>87%</strong>
              <span>High</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="two-column-grid">
        <Card>
          <CardHeader
            title="EPI Score Forecast"
            subtitle="Historical and predicted values"
          />

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[20, 45]} />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="historical"
                stroke="#087c3e"
                strokeWidth={2.5}
                name="Historical"
              />

              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#4385c7"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                name="Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader
            title="Indicator-wise Forecast (2030)"
            subtitle="Expected indicator performance"
          />

          <div className="forecast-list">
            {[
              ["Air Quality (PM2.5)", "40.1", "Moderate"],
              ["Water Quality", "48.3", "Moderate"],
              ["Biodiversity & Habitat", "59.7", "Moderate"],
              ["Forest Cover", "26.0", "Low"],
              ["Climate & Energy", "37.9", "Moderate"],
              ["Waste Management", "45.2", "Moderate"],
            ].map(([name, value, status]) => (
              <div className="forecast-row" key={name}>
                <span>{name}</span>

                <div className="forecast-bar">
                  <div style={{ width: `${Math.min(value * 1.7, 100)}%` }} />
                </div>

                <strong>{value}</strong>
                <StatusBadge type={status === "Low" ? "low" : "moderate"}>
                  {status}
                </StatusBadge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="model-information">
        <CardHeader title="Model Information" />

        <div className="model-grid">
          <div>
            <span>Model Type</span>
            <strong>XGBoost Regressor</strong>
          </div>

          <div>
            <span>Training Data</span>
            <strong>2006 – 2024</strong>
          </div>

          <div>
            <span>Features Used</span>
            <strong>20 Indicators</strong>
          </div>

          <div>
            <span>Evaluation</span>
            <strong>R² Score: 0.86</strong>
          </div>

          <div>
            <span>MAE</span>
            <strong>2.31</strong>
          </div>

          <div className="forecast-insight">
            <span>Forecast Insights</span>
            <p>
              India's EPI score is projected to improve by 5.9 points by
              2030. Key improvements are expected from climate & energy,
              forest cover and waste management.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* =========================================================
   EXPLAINABLE AI
========================================================= */

function ExplainableAI() {
  return (
    <div className="page">
      <PageTitle
        icon={CircleHelp}
        title="Explainable AI"
        subtitle="Understand why the model predicted the EPI score"
      />

      <div className="explain-top">
        <Card>
          <div className="explain-score">
            <span>Predicted EPI Score (2030)</span>
            <strong>34.6</strong>
          </div>
        </Card>

        <Card>
          <div className="explain-score">
            <span>Model Confidence</span>
            <strong>87%</strong>
          </div>
        </Card>

        <Card>
          <div className="meaning-box">
            <Info size={20} />
            <div>
              <strong>What does this mean?</strong>
              <p>
                The model predicts that India's EPI score in 2030 will be
                34.6. This prediction is influenced by the factors below.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="two-column-grid">
        <Card>
          <CardHeader
            title="Feature Importance (Global)"
            subtitle="How much each indicator contributes"
          />

          <ResponsiveContainer width="100%" height={390}>
            <BarChart
              data={importanceData}
              layout="vertical"
              margin={{ left: 10, right: 20 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={115} fontSize={10} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b8f63" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader
            title="SHAP Explanation (This Prediction)"
            subtitle="Positive and negative contribution"
          />

          <div className="shap-list">
            {shapData.map((item) => (
              <div className="shap-row" key={item.name}>
                <span>{item.name}</span>

                <div className="shap-bar">
                  <div
                    className={item.value >= 0 ? "positive" : "negative"}
                    style={{
                      width: `${Math.min(Math.abs(item.value) * 18, 100)}%`,
                    }}
                  />
                </div>

                <strong className={item.value >= 0 ? "plus" : "minus"}>
                  {item.value > 0 ? "+" : ""}
                  {item.value}
                </strong>
              </div>
            ))}
          </div>

          <div className="projected-score">
            <span>Projected EPI Score</span>
            <strong>34.6</strong>
          </div>
        </Card>
      </div>

      <Card className="takeaway-card">
        <div className="takeaway-icon">
          <Sparkles size={22} />
        </div>

        <div>
          <h3>Key Takeaways</h3>
          <p>
            Improving air quality and water quality will have the highest
            positive impact on EPI score. Forest cover and renewable energy
            are also strong positive contributors.
          </p>
        </div>
      </Card>
    </div>
  );
}

/* =========================================================
   TWIN FINDER
========================================================= */

/* =========================================================
   TWIN FINDER
========================================================= */

function TwinFinder() {
  const [selectedCountryName, setSelectedCountryName] = useState("India");
  const [selectedTwinName, setSelectedTwinName] = useState(null);

  /* ---------------------------------------------------------
     COUNTRY DATA
  --------------------------------------------------------- */

  const countryData = [
    {
      country: "India",
      flag: "🇮🇳",
      score: 28.7,
      air: 45.2,
      water: 42.6,
      forest: 24.2,
      renewable: 19.1,
      waste: 38.6,
      economic: 42,
      demographic: 52,
      governance: 47,
      social: 53,
      environmental: 32,
    },
    {
      country: "Indonesia",
      flag: "🇮🇩",
      score: 31.2,
      air: 32.1,
      water: 42.1,
      forest: 50.1,
      renewable: 19.2,
      waste: 52.3,
      economic: 44,
      demographic: 55,
      governance: 49,
      social: 51,
      environmental: 45,
    },
    {
      country: "Vietnam",
      flag: "🇻🇳",
      score: 34.4,
      air: 34.5,
      water: 55.4,
      forest: 50.1,
      renewable: 26.6,
      waste: 55.8,
      economic: 46,
      demographic: 57,
      governance: 54,
      social: 55,
      environmental: 52,
    },
    {
      country: "Philippines",
      flag: "🇵🇭",
      score: 31.8,
      air: 41.2,
      water: 50.1,
      forest: 25.9,
      renewable: 24.4,
      waste: 46.2,
      economic: 43,
      demographic: 58,
      governance: 46,
      social: 54,
      environmental: 39,
    },
    {
      country: "Thailand",
      flag: "🇹🇭",
      score: 38.2,
      air: 42.1,
      water: 52.1,
      forest: 40.8,
      renewable: 23.7,
      waste: 52.8,
      economic: 50,
      demographic: 48,
      governance: 57,
      social: 59,
      environmental: 50,
    },
    {
      country: "Bangladesh",
      flag: "🇧🇩",
      score: 27.4,
      air: 29.2,
      water: 39.1,
      forest: 14.5,
      renewable: 4.8,
      waste: 31.7,
      economic: 38,
      demographic: 61,
      governance: 42,
      social: 49,
      environmental: 28,
    },
  ];

  /* ---------------------------------------------------------
     SELECTED COUNTRY
  --------------------------------------------------------- */

  const selectedCountry =
    countryData.find(
      (country) => country.country === selectedCountryName
    ) || countryData[0];

  /* ---------------------------------------------------------
     SIMILARITY CALCULATION
     
     Lower normalized distance = more similar.
     We convert the distance into a similarity percentage.
  --------------------------------------------------------- */

  const calculateSimilarity = (countryA, countryB) => {
    const indicators = [
      "air",
      "water",
      "forest",
      "renewable",
      "waste",
      "economic",
      "demographic",
      "governance",
      "social",
      "environmental",
    ];

    let squaredDifference = 0;

    indicators.forEach((indicator) => {
      const difference =
        Number(countryA[indicator]) -
        Number(countryB[indicator]);

      squaredDifference += difference * difference;
    });

    const distance = Math.sqrt(squaredDifference);

    /*
      Maximum practical distance used to convert the result
      into a percentage.
    */
    const similarity = Math.max(
      0,
      Math.min(100, 100 - distance * 0.65)
    );

    return similarity;
  };

  /* ---------------------------------------------------------
     FIND TOP TWINS
  --------------------------------------------------------- */

  const twinCountries = useMemo(() => {
    return countryData
      .filter(
        (country) =>
          country.country !== selectedCountry.country
      )
      .map((country) => ({
        ...country,
        similarity: calculateSimilarity(
          selectedCountry,
          country
        ),
      }))
      .sort((a, b) => b.similarity - a.similarity);
  }, [selectedCountryName]);

  /* ---------------------------------------------------------
     CURRENT TWIN
  --------------------------------------------------------- */

  const selectedTwin =
    twinCountries.find(
      (country) => country.country === selectedTwinName
    ) || twinCountries[0];

  /* ---------------------------------------------------------
     WHEN COUNTRY CHANGES
  --------------------------------------------------------- */

  const handleCountryChange = (event) => {
    const newCountry = event.target.value;

    setSelectedCountryName(newCountry);

    /*
      Reset the selected twin so that the new country's
      highest-ranked twin is automatically selected.
    */
    setSelectedTwinName(null);
  };

  /* ---------------------------------------------------------
     RADAR DATA
  --------------------------------------------------------- */

  const radarData = [
    {
      subject: "Economic",
      Selected: selectedCountry.economic,
      Twin: selectedTwin?.economic || 0,
    },
    {
      subject: "Demographic",
      Selected: selectedCountry.demographic,
      Twin: selectedTwin?.demographic || 0,
    },
    {
      subject: "Governance",
      Selected: selectedCountry.governance,
      Twin: selectedTwin?.governance || 0,
    },
    {
      subject: "Social",
      Selected: selectedCountry.social,
      Twin: selectedTwin?.social || 0,
    },
    {
      subject: "Environmental",
      Selected: selectedCountry.environmental,
      Twin: selectedTwin?.environmental || 0,
    },
  ];

  /* ---------------------------------------------------------
     INDICATOR COMPARISON
  --------------------------------------------------------- */

  const indicatorComparisons = [
    {
      name: "Air Quality",
      selected: selectedCountry.air,
      twin: selectedTwin?.air || 0,
      unit: "µg/m³",
    },
    {
      name: "Water Quality",
      selected: selectedCountry.water,
      twin: selectedTwin?.water || 0,
      unit: "/100",
    },
    {
      name: "Forest Cover",
      selected: selectedCountry.forest,
      twin: selectedTwin?.forest || 0,
      unit: "%",
    },
    {
      name: "Renewable Energy",
      selected: selectedCountry.renewable,
      twin: selectedTwin?.renewable || 0,
      unit: "%",
    },
    {
      name: "Waste Management",
      selected: selectedCountry.waste,
      twin: selectedTwin?.waste || 0,
      unit: "/100",
    },
  ];

  /* ---------------------------------------------------------
     KEY SIMILARITIES
  --------------------------------------------------------- */

  const similarityItems = [
    {
      name: "Air Quality",
      selected: selectedCountry.air,
      twin: selectedTwin?.air || 0,
    },
    {
      name: "Water Quality",
      selected: selectedCountry.water,
      twin: selectedTwin?.water || 0,
    },
    {
      name: "Forest Cover",
      selected: selectedCountry.forest,
      twin: selectedTwin?.forest || 0,
    },
    {
      name: "Renewable Energy",
      selected: selectedCountry.renewable,
      twin: selectedTwin?.renewable || 0,
    },
    {
      name: "Waste Management",
      selected: selectedCountry.waste,
      twin: selectedTwin?.waste || 0,
    },
  ];

  const keySimilarities = similarityItems
    .map((item) => ({
      ...item,
      difference: Math.abs(item.selected - item.twin),
    }))
    .sort((a, b) => a.difference - b.difference)
    .slice(0, 5);

  /* ---------------------------------------------------------
     LEARNING OPPORTUNITIES
  --------------------------------------------------------- */

  const learningAreas = indicatorComparisons
    .map((item) => ({
      ...item,
      difference: item.twin - item.selected,
    }))
    .filter((item) => item.difference > 0)
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 3);

  /* ---------------------------------------------------------
     TREND DATA
  --------------------------------------------------------- */

  const trendData = years.map((item, index) => {
    const selectedTrend =
      selectedCountry.score -
      (8 - index) * 0.7;

    const twinTrend =
      selectedTwin.score -
      (8 - index) * 0.45;

    return {
      year: item.year,
      selected: Number(selectedTrend.toFixed(1)),
      twin: Number(twinTrend.toFixed(1)),
    };
  });

  return (
    <div className="page">

      {/* ---------------------------------------------------
          PAGE TITLE
      --------------------------------------------------- */}

      <PageTitle
        icon={GitCompareArrows}
        title="Environmental Twin Finder"
        subtitle="Find countries similar to any selected country and learn from their environmental journey"
      />

      {/* ---------------------------------------------------
          COUNTRY SELECTOR
      --------------------------------------------------- */}

      <Card className="country-selection-card">

        <div className="country-selection-content">

          <div>
            <span className="selection-label">
              Select Country
            </span>

            <p>
              Choose any country to discover its closest
              environmental twins.
            </p>
          </div>

          <div className="country-select-wrapper">

            <span className="selected-country-flag">
              {selectedCountry.flag}
            </span>

            <select
              value={selectedCountryName}
              onChange={handleCountryChange}
              className="country-select"
            >
              {countryData.map((country) => (
                <option
                  value={country.country}
                  key={country.country}
                >
                  {country.country}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>

        </div>

      </Card>

      {/* ---------------------------------------------------
          SELECTED COUNTRY SUMMARY
      --------------------------------------------------- */}

      <div className="twin-selected-summary">

        <div>
          <span>Selected Country</span>

          <strong>
            {selectedCountry.flag}{" "}
            {selectedCountry.country}
          </strong>
        </div>

        <div>
          <span>EPI Score</span>
          <strong>{selectedCountry.score}</strong>
        </div>

        <div>
          <span>Countries Compared</span>
          <strong>{countryData.length - 1}</strong>
        </div>

        <div>
          <span>Best Twin</span>

          <strong>
            {twinCountries[0]?.flag}{" "}
            {twinCountries[0]?.country}
          </strong>
        </div>

      </div>

      {/* ---------------------------------------------------
          MAIN TWIN GRID
      --------------------------------------------------- */}

      <div className="twin-grid">

        {/* TOP TWINS */}

        <Card>

          <CardHeader
            title={`Top Environmental Twins of ${selectedCountry.country}`}
            subtitle="Automatically ranked using environmental and socioeconomic similarity"
          />

          <div className="twin-list">

            {twinCountries.slice(0, 5).map((country, index) => (

              <button
                className={`twin-item ${
                  selectedTwin?.country === country.country
                    ? "selected"
                    : ""
                }`}
                key={country.country}
                onClick={() =>
                  setSelectedTwinName(country.country)
                }
              >

                <span className="twin-rank">
                  {index + 1}
                </span>

                <span className="country-flag">
                  {country.flag}
                </span>

                <div>

                  <strong>
                    {country.country}
                  </strong>

                  <small>
                    Similarity Score{" "}
                    {country.similarity.toFixed(1)}%
                  </small>

                </div>

                <div className="twin-score">

                  <strong>
                    {country.similarity.toFixed(1)}%
                  </strong>

                  <ArrowUpRight size={15} />

                </div>

              </button>

            ))}

          </div>

          <button className="secondary-button full">
            View All Twins
          </button>

        </Card>

        {/* RADAR */}

        <Card>

          <CardHeader
            title={`Similarity Breakdown`}
            subtitle={`${selectedCountry.country} vs ${selectedTwin?.country}`}
          />

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <RadarChart data={radarData}>

              <PolarGrid />

              <PolarAngleAxis
                dataKey="subject"
                fontSize={10}
              />

              <PolarRadiusAxis />

              <Radar
                name={selectedCountry.country}
                dataKey="Selected"
                stroke="#1c7d4d"
                fill="#1c7d4d"
                fillOpacity={0.2}
              />

              <Radar
                name={selectedTwin?.country}
                dataKey="Twin"
                stroke="#4385c7"
                fill="#4385c7"
                fillOpacity={0.2}
              />

              <Legend />

            </RadarChart>

          </ResponsiveContainer>

        </Card>

        {/* KEY SIMILARITIES */}

        <Card>

          <CardHeader
            title="Key Similarities"
            subtitle="Closest matching indicators"
          />

          <div className="similarity-list">

            {keySimilarities.map((item) => (

              <div key={item.name}>

                <CheckCircle2 size={17} />

                <span>
                  {item.name}
                </span>

                <strong>
                  ±{item.difference.toFixed(1)}
                </strong>

              </div>

            ))}

          </div>

        </Card>

      </div>

      {/* ---------------------------------------------------
          TREND + INDICATOR COMPARISON
      --------------------------------------------------- */}

      <div className="two-column-grid">

        {/* TREND */}

        <Card>

          <CardHeader
            title="EPI Score Trend Comparison"
            subtitle={`${selectedCountry.country} vs ${selectedTwin?.country}`}
          />

          <ResponsiveContainer
            width="100%"
            height={270}
          >

            <LineChart data={trendData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="year" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="selected"
                stroke="#087c3e"
                name={selectedCountry.country}
                strokeWidth={2.5}
              />

              <Line
                type="monotone"
                dataKey="twin"
                stroke="#4385c7"
                name={selectedTwin?.country}
                strokeWidth={2.5}
              />

            </LineChart>

          </ResponsiveContainer>

        </Card>

        {/* INDICATOR COMPARISON */}

        <Card>

          <CardHeader
            title="Indicator Comparison"
            subtitle={`${selectedCountry.country} vs ${selectedTwin?.country}`}
          />

          <div className="comparison-table">

            <div className="comparison-header-row">
              <span>Indicator</span>
              <strong>
                {selectedCountry.country}
              </strong>
              <strong>
                {selectedTwin?.country}
              </strong>
              <span>Difference</span>
            </div>

            {indicatorComparisons.map((item) => {

              const difference =
                item.twin - item.selected;

              return (
                <div
                  className="comparison-row"
                  key={item.name}
                >

                  <span>
                    {item.name}
                  </span>

                  <strong>
                    {item.selected}
                  </strong>

                  <strong>
                    {item.twin}
                  </strong>

                  <span
                    className={
                      difference > 0
                        ? "better"
                        : difference < 0
                        ? "worse"
                        : ""
                    }
                  >
                    {difference > 0
                      ? `+${difference.toFixed(1)}`
                      : difference < 0
                      ? difference.toFixed(1)
                      : "Same"}
                  </span>

                </div>
              );

            })}

          </div>

        </Card>

      </div>

      {/* ---------------------------------------------------
          POLICY LEARNING INSIGHTS
      --------------------------------------------------- */}

      <Card className="twin-learning-card">

        <CardHeader
          title={`What Can ${selectedCountry.country} Learn From ${selectedTwin?.country}?`}
          subtitle="Data-driven areas where the selected twin performs better"
        />

        {learningAreas.length > 0 ? (

          <div className="learning-grid">

            {learningAreas.map((item) => (

              <div
                className="learning-item"
                key={item.name}
              >

                <div className="learning-icon">
                  <TrendingUp size={18} />
                </div>

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <p>
                    {selectedTwin.country} performs{" "}
                    <b>
                      {item.difference.toFixed(1)}
                    </b>{" "}
                    points higher than{" "}
                    {selectedCountry.country}.
                  </p>

                  <span>
                    Potential policy learning area
                  </span>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <EmptyState
            icon={Target}
            title="No major learning gap identified"
            text="The selected country is performing similarly to its environmental twin across the available indicators."
          />

        )}

      </Card>

      {/* ---------------------------------------------------
          SIMILARITY EXPLANATION
      --------------------------------------------------- */}

      <Card className="twin-method-card">

        <div className="twin-method-icon">
          <BrainCircuit size={22} />
        </div>

        <div>

          <h3>
            How Twin Finder Works
          </h3>

          <p>
            EcoLens AI compares environmental,
            energy, waste, forest and socioeconomic
            indicators between the selected country
            and other countries. Countries with the
            smallest overall difference receive the
            highest similarity scores and are ranked as
            environmental twins.
          </p>

        </div>

      </Card>

    </div>
  );
}
/* =========================================================
   POLICY & SCENARIO
========================================================= */

/* =========================================================
   POLICY & SCENARIO
========================================================= */

function PolicyScenario() {
  const [customScenarioOpen, setCustomScenarioOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  /*
    Each intervention has its own environmental impact.
    These values are used for the front-end simulation.
    Later, you can replace these with your actual ML model/API output.
  */
  const scenarioEffects = {
    "Renewable Energy Expansion": {
      epiGain: 3.8,
      rankGain: 12,
      indicators: {
        "Renewable Energy": 10,
        "CO₂ Emissions": 12,
        "Climate & Energy": 8.4,
        "Air Quality (PM2.5)": 4,
      },
    },

    "Forest Restoration": {
      epiGain: 4.2,
      rankGain: 14,
      indicators: {
        "Forest Cover": 15,
        Biodiversity: 12,
        "Climate & Energy": 5.2,
        "Air Quality (PM2.5)": 3,
      },
    },

    "Urban Wastewater Modernization": {
      epiGain: 2.4,
      rankGain: 7,
      indicators: {
        "Water Quality": 14,
        "Waste Management": 8,
        "Biodiversity": 5,
      },
    },

    "Clean Air Action Plan": {
      epiGain: 3.1,
      rankGain: 10,
      indicators: {
        "Air Quality (PM2.5)": 16,
        "CO₂ Emissions": 8,
        "Climate & Energy": 6,
      },
    },
  };

  /* ---------------------------------------------------------
     SELECT / UNSELECT SCENARIO
  --------------------------------------------------------- */

  const toggleScenario = (name) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );

    // If user changes selection, previous simulation is no
    // longer considered current.
    setHasRun(false);
  };

  /* ---------------------------------------------------------
     RUN SCENARIO
  --------------------------------------------------------- */

  const runScenario = () => {
    if (!selected.length) {
      alert("Please select at least one intervention before running the scenario.");
      return;
    }

    setIsRunning(true);
    setHasRun(false);

    /*
      Small delay makes the simulation feel like an AI/model
      execution instead of an instant UI change.
    */
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 900);
  };

  /* ---------------------------------------------------------
     RESET SCENARIO
  --------------------------------------------------------- */

  const resetScenario = () => {
    setSelected([]);
    setHasRun(false);
    setIsRunning(false);
  };

  /* ---------------------------------------------------------
     CALCULATE COMBINED RESULTS
  --------------------------------------------------------- */

  const simulation = useMemo(() => {
    let totalGain = 0;
    let totalRankGain = 0;

    const indicatorImpactMap = {};

    selected.forEach((name) => {
      const effect = scenarioEffects[name];

      if (!effect) return;

      totalGain += effect.epiGain;
      totalRankGain += effect.rankGain;

      Object.entries(effect.indicators).forEach(
        ([indicator, impact]) => {
          indicatorImpactMap[indicator] =
            (indicatorImpactMap[indicator] || 0) + impact;
        }
      );
    });

    /*
      Prevent unrealistic values if several scenarios are selected.
      This is only a UI simulation. Your real ML model can replace it.
    */
    totalGain = Math.min(totalGain, 15);
    totalRankGain = Math.min(totalRankGain, 50);

    const baselineScore = 34.6;
    const baselineRank = 162;

    const projectedScore = Math.min(
      baselineScore + totalGain,
      50
    );

    const projectedRank = Math.max(
      baselineRank - totalRankGain,
      100
    );

    return {
      baselineScore,
      baselineRank,
      totalGain,
      totalRankGain,
      projectedScore,
      projectedRank,
      indicatorImpactMap,
    };
  }, [selected]);

  /* ---------------------------------------------------------
     INDICATOR IMPACT DATA
  --------------------------------------------------------- */

  const indicatorRows = [
    "Renewable Energy",
    "CO₂ Emissions",
    "Air Quality (PM2.5)",
    "Water Quality",
    "Forest Cover",
    "Biodiversity",
    "Climate & Energy",
    "Waste Management",
  ];

  const displayedIndicators = indicatorRows
    .map((indicator) => ({
      name: indicator,
      impact: simulation.indicatorImpactMap[indicator] || 0,
    }))
    .filter((item) => item.impact !== 0);

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  return (
    <div className="page">
      <PageTitle
        icon={FlaskConical}
        title="AI-driven Policy & Scenario Analysis"
        subtitle="Simulate sustainability intervention scenarios and evaluate impact"
      />

      {/* ---------------------------------------------------
          HEADER
      --------------------------------------------------- */}

      <div className="scenario-header">
        <div>
          <span className="scenario-selection-info">
            {selected.length === 0
              ? "Select interventions to build your scenario"
              : `${selected.length} intervention${
                  selected.length > 1 ? "s" : ""
                } selected`}
          </span>
        </div>

        <div className="scenario-header-actions">
          {selected.length > 0 && (
            <button
              className="outline-button"
              onClick={resetScenario}
              disabled={isRunning}
            >
              <RotateCcw size={15} />
              Reset
            </button>
          )}

 {customScenarioOpen && (
  <div className="custom-scenario-panel">
    <div className="custom-scenario-header">
      <h3>Create Custom Scenario</h3>

      <button
        type="button"
        className="custom-scenario-close"
        onClick={() => setCustomScenarioOpen(false)}
      >
        ×
      </button>
    </div>

    <p>Select the interventions you want to include in your scenario.</p>

    <label>
      <input type="checkbox" />
      Renewable Energy
    </label>

    <label>
      <input type="checkbox" />
      Energy Efficiency
    </label>

    <label>
      <input type="checkbox" />
      Forest Protection
    </label>

    <label>
      <input type="checkbox" />
      Carbon Reduction
    </label>

    <label>
      <input type="checkbox" />
      Waste Management
    </label>

    <label>
      <input type="checkbox" />
      Water Management
    </label>

    <button type="button" className="run-scenario-button">
      Run Custom Scenario
    </button>
  </div>
)}
        </div>
      </div>

      {/* ---------------------------------------------------
          MAIN SCENARIO GRID
      --------------------------------------------------- */}

      <div className="scenario-grid">

        {/* =================================================
            RECOMMENDED SCENARIOS
        ================================================= */}

        <Card>
          <CardHeader
            title="Recommended Scenarios"
            subtitle="AI-selected high impact interventions"
          />

          <div className="scenario-list">
            {scenarioData.map((scenario) => {
              const isSelected = selected.includes(scenario.name);

              return (
                <div
                  className={`scenario-item ${
                    isSelected ? "selected" : ""
                  }`}
                  key={scenario.name}
                >
                  {/* Icon */}

                  <div className="scenario-icon">
                    <Zap size={18} />
                  </div>

                  {/* Content */}

                  <div className="scenario-content">
                    <div className="scenario-name">
                      <strong>{scenario.name}</strong>

                      <StatusBadge
                        type={
                          scenario.confidence === "Medium impact"
                            ? "moderate"
                            : "positive"
                        }
                      >
                        {scenario.confidence}
                      </StatusBadge>
                    </div>

                    <p>{scenario.description}</p>

                    <div className="scenario-meta">
                      <span>
                        Expected EPI gain {scenario.score}
                      </span>

                      <span>
                        Impact {scenario.impact}
                      </span>
                    </div>
                  </div>

                  {/* Selection button */}

                  <button
                    className={`scenario-check ${
                      isSelected ? "checked" : ""
                    }`}
                    onClick={() => toggleScenario(scenario.name)}
                    aria-label={`Select ${scenario.name}`}
                  >
                    {isSelected ? (
                      <CheckCircle2 size={21} />
                    ) : (
                      <span></span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* RUN BUTTON */}

          <button
            className={`primary-button full ${
              isRunning ? "running" : ""
            }`}
            onClick={runScenario}
            disabled={isRunning || selected.length === 0}
          >
            {isRunning ? (
              <>
                <span className="scenario-spinner"></span>
                Running AI Simulation...
              </>
            ) : (
              <>
                <Play size={15} />
                Run Scenario
              </>
            )}
          </button>

          {/* Message before selection */}

          {!selected.length && (
            <div className="scenario-help">
              <Info size={15} />
              <span>
                Select one or more interventions above to simulate
                their combined environmental impact.
              </span>
            </div>
          )}
        </Card>

        {/* =================================================
            SIMULATION RESULTS
        ================================================= */}

        <Card>
          <CardHeader
            title="Scenario Simulation"
            subtitle={
              hasRun
                ? "AI-calculated projected impact"
                : "Projected impact on indicators"
            }
          />

          {!hasRun ? (
            <div className="scenario-not-run">
              <div className="scenario-not-run-icon">
                <FlaskConical size={30} />
              </div>

              <h3>Scenario not run yet</h3>

              <p>
                Select one or more interventions and click
                <strong> Run Scenario </strong>
                to calculate the projected environmental impact.
              </p>
            </div>
          ) : (
            <>
              {/* Indicator impacts */}

              <div className="impact-table">
                {displayedIndicators.length > 0 ? (
                  displayedIndicators.map((item) => (
                    <div
                      className="impact-row"
                      key={item.name}
                    >
                      <span>{item.name}</span>

                      <strong>
                        +{item.impact.toFixed(1)}%
                      </strong>

                      <span className="impact-direction">
                        ↑
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="scenario-no-impact">
                    No indicator impact available.
                  </div>
                )}
              </div>

              {/* Overall result */}

              <div className="scenario-overall">

                <div>
                  <span>EPI Score (2030)</span>

                  <strong>
                    {simulation.baselineScore.toFixed(1)}
                    {" → "}
                    {simulation.projectedScore.toFixed(1)}
                  </strong>

                  <small>
                    +
                    {simulation.totalGain.toFixed(1)}
                    {" points"}
                  </small>
                </div>

                <div>
                  <span>Global Rank</span>

                  <strong>
                    {simulation.baselineRank}
                    {" → "}
                    {simulation.projectedRank}
                  </strong>

                  <small>
                    +
                    {simulation.totalRankGain}
                    {" ranks"}
                  </small>
                </div>

              </div>

              {/* Success message */}

              <div className="scenario-success">
                <CheckCircle2 size={18} />

                <span>
                  Scenario produces a positive projected
                  environmental impact.
                </span>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* =================================================
          SCENARIO SUMMARY
      ================================================= */}

      <Card className="scenario-summary-card">
        <CardHeader
          title="Scenario Summary"
          subtitle={
            selected.length
              ? `${selected.length} intervention${
                  selected.length > 1 ? "s" : ""
                } selected`
              : "No interventions selected"
          }
        />

        <div className="selected-scenarios">
          {selected.length ? (
            <div className="selected-scenario-list">
              {selected.map((item) => {
                const effect = scenarioEffects[item];

                return (
                  <div
                    className="selected-scenario-card"
                    key={item}
                  >
                    <div className="selected-scenario-icon">
                      <CheckCircle2 size={17} />
                    </div>

                    <div>
                      <strong>{item}</strong>

                      <span>
                        Expected EPI gain +
                        {effect.epiGain.toFixed(1)}
                        {" points"}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleScenario(item)}
                      aria-label={`Remove ${item}`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Target}
              title="Select a scenario"
              text="Choose one or more interventions to simulate their combined environmental impact."
            />
          )}
        </div>

        {/* =================================================
            FINAL AI RESULT
        ================================================= */}

        {hasRun && selected.length > 0 && (
          <div className="scenario-final-result">

            <div className="final-result-icon">
              <Sparkles size={21} />
            </div>

            <div className="final-result-content">
              <strong>AI Simulation Complete</strong>

              <p>
                The selected{" "}
                {selected.length === 1
                  ? "intervention"
                  : "interventions"}{" "}
                are projected to improve India's EPI score
                from{" "}
                <b>
                  {simulation.baselineScore.toFixed(1)}
                </b>{" "}
                to{" "}
                <b>
                  {simulation.projectedScore.toFixed(1)}
                </b>
                , representing an improvement of{" "}
                <b>
                  +{simulation.totalGain.toFixed(1)} points
                </b>
                .
              </p>
            </div>

            <div className="final-result-score">
              <span>Projected EPI</span>
              <strong>
                {simulation.projectedScore.toFixed(1)}
              </strong>
            </div>

          </div>
        )}
      </Card>
    </div>
  );
}
/* =========================================================
   PRIORITY OPTIMIZER
========================================================= */

function PriorityOptimizer() {
  const [optimizationRun, setOptimizationRun] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const interventionPool = [
    {
      name: "Renewable Energy Expansion",
      gain: 6.4,
      impact: 9.2,
      confidence: 87,
      category: "Climate & Energy",
      description: "Expand solar and wind capacity to improve clean-energy performance.",
    },
    {
      name: "Forest Restoration Mission",
      gain: 4.8,
      impact: 8.3,
      confidence: 85,
      category: "Biodiversity",
      description: "Restore degraded forests and improve ecosystem resilience.",
    },
    {
      name: "Clean Air Action Plan",
      gain: 4.2,
      impact: 7.9,
      confidence: 83,
      category: "Air Quality",
      description: "Reduce industrial, transport and urban air pollution.",
    },
    {
      name: "Urban Wastewater Modernization",
      gain: 2.9,
      impact: 7.5,
      confidence: 84,
      category: "Water Quality",
      description: "Improve wastewater treatment and reduce water pollution.",
    },
    {
      name: "Sustainable Waste Management",
      gain: 3.1,
      impact: 6.8,
      confidence: 80,
      category: "Waste Management",
      description: "Improve recycling, waste collection and treatment systems.",
    },
    {
      name: "Electric Public Transport",
      gain: 3.7,
      impact: 7.2,
      confidence: 81,
      category: "Air Quality",
      description: "Increase electric buses and low-emission public transportation.",
    },
    {
      name: "Industrial Emission Control",
      gain: 3.5,
      impact: 7.6,
      confidence: 82,
      category: "Air Quality",
      description: "Reduce industrial emissions through cleaner production systems.",
    },
    {
      name: "Clean Energy Storage",
      gain: 3.2,
      impact: 7.0,
      confidence: 79,
      category: "Climate & Energy",
      description: "Improve renewable-energy reliability through large-scale storage.",
    },
  ];

  /*
   * Different optimization strategies.
   * Each time Optimize Again is clicked, the AI evaluates
   * the intervention pool using a different weighting.
   */
  const strategies = [
    {
      name: "Maximum Environmental Gain",
      gainWeight: 0.55,
      impactWeight: 0.30,
      confidenceWeight: 0.15,
    },
    {
      name: "Balanced Sustainability",
      gainWeight: 0.40,
      impactWeight: 0.35,
      confidenceWeight: 0.25,
    },
    {
      name: "High Confidence Strategy",
      gainWeight: 0.30,
      impactWeight: 0.25,
      confidenceWeight: 0.45,
    },
    {
      name: "Environmental Impact Priority",
      gainWeight: 0.35,
      impactWeight: 0.50,
      confidenceWeight: 0.15,
    },
  ];

  const currentStrategy =
    strategies[optimizationRun % strategies.length];

  /*
   * Normalize each factor to 0–1 and calculate
   * an AI optimization score.
   */
  const optimizedInterventions = useMemo(() => {
    const maxGain = Math.max(
      ...interventionPool.map((item) => item.gain)
    );

    const maxImpact = Math.max(
      ...interventionPool.map((item) => item.impact)
    );

    const maxConfidence = Math.max(
      ...interventionPool.map((item) => item.confidence)
    );

    return interventionPool
      .map((item) => {
        const normalizedGain = item.gain / maxGain;
        const normalizedImpact = item.impact / maxImpact;
        const normalizedConfidence =
          item.confidence / maxConfidence;

        const aiScore =
          normalizedGain * currentStrategy.gainWeight +
          normalizedImpact * currentStrategy.impactWeight +
          normalizedConfidence * currentStrategy.confidenceWeight;

        return {
          ...item,
          aiScore,
        };
      })
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 3);
  }, [optimizationRun]);

  /*
   * Calculate final results from the selected interventions.
   */
  const totalGain = optimizedInterventions.reduce(
    (total, item) => total + item.gain,
    0
  );

  const averageImpact =
    optimizedInterventions.reduce(
      (total, item) => total + item.impact,
      0
    ) / optimizedInterventions.length;

  const averageConfidence =
    optimizedInterventions.reduce(
      (total, item) => total + item.confidence,
      0
    ) / optimizedInterventions.length;

  /*
   * Base predicted EPI score = 34.6
   */
  const baseEpi = 34.6;

  /*
   * The gain is slightly adjusted to represent
   * diminishing returns when multiple interventions
   * are combined.
   */
  const combinedGain = totalGain * 0.88;

  const projectedEpi = Math.min(
    100,
    baseEpi + combinedGain
  );

  /*
   * Base predicted rank = 162.
   * Every EPI point produces an estimated rank improvement.
   */
  const rankImprovement = Math.round(combinedGain * 7);

  const projectedRank = Math.max(
    1,
    162 - rankImprovement
  );

  const handleOptimize = () => {
    setIsOptimizing(true);

    /*
     * Small delay makes the optimization feel like
     * an actual AI analysis process.
     */
    setTimeout(() => {
      setOptimizationRun((prev) => prev + 1);
      setIsOptimizing(false);
    }, 700);
  };

  return (
    <div className="page">
      <PageTitle
        icon={SlidersHorizontal}
        title="Sustainability Priority Optimizer"
        subtitle="Find the best set of interventions for maximum environmental improvement"
      />

      {/* =====================================================
          OPTIMIZER HEADER
      ===================================================== */}

      <div className="optimizer-header-card">
        <div>
          <div className="optimizer-ai-title">
            <Sparkles size={18} />
            AI Optimization Engine
          </div>

          <h2>
            {isOptimizing
              ? "Analyzing intervention combinations..."
              : "Recommended intervention strategy"}
          </h2>

          <p>
            The AI evaluates expected EPI gain, environmental impact
            and prediction confidence to identify the strongest
            combination of interventions.
          </p>
        </div>

        <div className="optimizer-strategy">
          <span>Current Strategy</span>
          <strong>{currentStrategy.name}</strong>
        </div>
      </div>

      {/* =====================================================
          TOP RESULTS
      ===================================================== */}

      <div className="optimizer-result-grid">
        <Card className="optimizer-result-card">
          <span>Total Expected EPI Gain</span>

          <strong>
            +{combinedGain.toFixed(1)}
          </strong>

          <small>
            From the selected top 3 interventions
          </small>
        </Card>

        <Card className="optimizer-result-card">
          <span>Projected EPI Score</span>

          <strong>
            {projectedEpi.toFixed(1)}
          </strong>

          <small>
            Current prediction: {baseEpi}
          </small>
        </Card>

        <Card className="optimizer-result-card">
          <span>Projected Rank</span>

          <strong>
            {projectedRank}
          </strong>

          <small>
            +{rankImprovement} rank improvement
          </small>
        </Card>

        <Card className="optimizer-result-card">
          <span>Average Confidence</span>

          <strong>
            {Math.round(averageConfidence)}%
          </strong>

          <small>
            Model confidence
          </small>
        </Card>
      </div>

      {/* =====================================================
          MAIN OPTIMIZER
      ===================================================== */}

      <div className="optimizer-grid">
        <Card>
          <CardHeader
            title="Top Priority Interventions"
            subtitle={`AI-ranked using ${currentStrategy.name}`}
          />

          <div className="priority-table">
            <div className="priority-head">
              <span>Rank</span>
              <span>Intervention</span>
              <span>Expected EPI Gain</span>
              <span>Impact Score</span>
              <span>Confidence</span>
            </div>

            {optimizedInterventions.map((item, index) => (
              <div
                className="priority-row"
                key={item.name}
              >
                <span className="rank-number">
                  {index + 1}
                </span>

                <div className="priority-intervention">
                  <strong>{item.name}</strong>

                  <small>
                    {item.category}
                  </small>
                </div>

                <span className="gain">
                  +{item.gain.toFixed(1)}
                </span>

                <span>
                  {item.impact.toFixed(1)}
                </span>

                <StatusBadge type="positive">
                  {item.confidence}%
                </StatusBadge>
              </div>
            ))}
          </div>

          <button
            className="outline-button"
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            <RotateCcw
              size={15}
              className={
                isOptimizing
                  ? "optimizer-spin"
                  : ""
              }
            />

            {isOptimizing
              ? "Optimizing..."
              : "Optimize Again"}
          </button>
        </Card>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <Card className="optimization-summary">
          <CardHeader
            title="Optimization Summary"
            subtitle="AI-selected strategy"
          />

          <div className="summary-box">
            <span>Selected Strategy</span>

            <strong>
              Top 3 Interventions
            </strong>

            <small>
              {currentStrategy.name}
            </small>
          </div>

          <div className="summary-box green">
            <span>Total Expected EPI Gain</span>

            <strong>
              +{combinedGain.toFixed(1)}
            </strong>
          </div>

          <div className="summary-box">
            <span>Projected Rank Improvement</span>

            <strong>
              +{rankImprovement} ranks
            </strong>
          </div>

          <div className="summary-box">
            <span>Average Impact Score</span>

            <strong>
              {averageImpact.toFixed(1)}/10
            </strong>
          </div>

          <div className="why-box">
            <Info size={18} />

            <div>
              <strong>
                Why did AI select these?
              </strong>

              <p>
                These interventions provide the strongest
                combination of expected EPI improvement,
                environmental impact and prediction confidence
                under the current optimization strategy.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* =====================================================
          SELECTED INTERVENTIONS
      ===================================================== */}

      <Card className="selected-interventions-card">
        <CardHeader
          title="AI-Selected Intervention Plan"
          subtitle="Recommended actions for policymakers"
        />

        <div className="selected-intervention-list">
          {optimizedInterventions.map((item, index) => (
            <div
              className="selected-intervention"
              key={item.name}
            >
              <div className="selected-number">
                {index + 1}
              </div>

              <div className="selected-info">
                <strong>{item.name}</strong>

                <p>
                  {item.description}
                </p>
              </div>

              <div className="selected-metric">
                <span>EPI Gain</span>
                <strong>
                  +{item.gain.toFixed(1)}
                </strong>
              </div>

              <div className="selected-metric">
                <span>Impact</span>
                <strong>
                  {item.impact.toFixed(1)}/10
                </strong>
              </div>

              <div className="selected-metric">
                <span>Confidence</span>
                <strong>
                  {item.confidence}%
                </strong>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* =====================================================
          OPTIMIZATION STATUS
      ===================================================== */}

      <div className="optimizer-success">
        <CheckCircle2 size={19} />

        <div>
          <strong>
            Optimization completed successfully
          </strong>

          <span>
            The recommended strategy could improve the
            projected EPI score from {baseEpi} to{" "}
            {projectedEpi.toFixed(1)}.
          </span>
        </div>
      </div>
    </div>
  );
}
/* =========================================================
   REPORTS
========================================================= */

function Reports() {
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const reportDate = "May 2025";

  const reportData = {
    country: "India",
    epiScore: "28.7",
    globalRank: "176 / 180",
    predictedScore: "34.6",
    predictedRank: "162",
    confidence: "87%",
    improvement: "+5.9 points",
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(8, 124, 62);
    doc.text("EcoLens AI", 20, 25);

    doc.setTextColor(30, 40, 35);
    doc.setFontSize(20);
    doc.text("Environmental Intelligence Report", 20, 40);

    doc.setFontSize(14);
    doc.text("Country: India", 20, 55);
    doc.text(`Report Period: ${reportDate}`, 20, 65);

    doc.setDrawColor(180, 200, 190);
    doc.line(20, 72, 190, 72);

    doc.setFontSize(16);
    doc.text("Environmental Performance", 20, 88);

    doc.setFontSize(12);
    doc.text(`Current EPI Score: ${reportData.epiScore}`, 25, 100);
    doc.text(`Global Rank: ${reportData.globalRank}`, 25, 110);

    doc.setFontSize(16);
    doc.text("AI Prediction - 2030", 20, 130);

    doc.setFontSize(12);
    doc.text(
      `Predicted EPI Score: ${reportData.predictedScore}`,
      25,
      142
    );

    doc.text(
      `Predicted Global Rank: ${reportData.predictedRank}`,
      25,
      152
    );

    doc.text(
      `Prediction Confidence: ${reportData.confidence}`,
      25,
      162
    );

    doc.text(
      `Expected Improvement: ${reportData.improvement}`,
      25,
      172
    );

    doc.setFontSize(16);
    doc.text("Key Environmental Indicators", 20, 192);

    doc.setFontSize(11);

    indicatorData.forEach((item, index) => {
      const y = 204 + index * 10;

      doc.text(
        `${item.name}: ${item.value} ${item.unit} - ${item.status}`,
        25,
        y
      );
    });

    doc.setFontSize(16);
    doc.text("Recommended Policy Actions", 20, 270);

    doc.setFontSize(11);

    scenarioData.forEach((scenario, index) => {
      const y = 282 + index * 8;

      doc.text(
        `${index + 1}. ${scenario.name} - Expected EPI Gain ${scenario.score}`,
        25,
        y
      );
    });

    doc.save("EcoLens_AI_Environmental_Report.pdf");
  };

  const generateExcel = () => {
    const workbook = XLSX.utils.book_new();

    const summaryData = [
      ["EcoLens AI - Environmental Intelligence Report"],
      [],
      ["Country", "India"],
      ["Current EPI Score", 28.7],
      ["Global Rank", "176 / 180"],
      ["Predicted EPI Score 2030", 34.6],
      ["Predicted Rank 2030", 162],
      ["Prediction Confidence", "87%"],
      ["Expected Improvement", "+5.9 points"],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    summarySheet["!cols"] = [
      { wch: 32 },
      { wch: 25 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Summary"
    );

    const indicatorRows = [
      ["Indicator", "Value", "Unit", "Status"],
      ...indicatorData.map((item) => [
        item.name,
        item.value,
        item.unit,
        item.status,
      ]),
    ];

    const indicatorSheet = XLSX.utils.aoa_to_sheet(indicatorRows);

    indicatorSheet["!cols"] = [
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      indicatorSheet,
      "Indicators"
    );

    const scenarioRows = [
      [
        "Intervention",
        "Description",
        "Expected EPI Gain",
        "Impact",
        "Confidence",
      ],
      ...scenarioData.map((scenario) => [
        scenario.name,
        scenario.description,
        scenario.score,
        scenario.impact,
        scenario.confidence,
      ]),
    ];

    const scenarioSheet = XLSX.utils.aoa_to_sheet(
      scenarioRows
    );

    scenarioSheet["!cols"] = [
      { wch: 35 },
      { wch: 50 },
      { wch: 22 },
      { wch: 15 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      scenarioSheet,
      "Policy Scenarios"
    );

    const twinRows = [
      [
        "Country",
        "Similarity",
        "EPI Score",
        "Air Quality",
        "Water Quality",
        "Forest Cover",
        "Renewable Energy",
      ],
      ...twinCountries.map((country) => [
        country.country,
        country.similarity,
        country.score,
        country.air,
        country.water,
        country.forest,
        country.renewable,
      ]),
    ];

    const twinSheet = XLSX.utils.aoa_to_sheet(twinRows);

    twinSheet["!cols"] = [
      { wch: 18 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 16 },
      { wch: 16 },
      { wch: 20 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      twinSheet,
      "Environmental Twins"
    );

    XLSX.writeFile(
      workbook,
      "EcoLens_AI_Environmental_Report.xlsx"
    );
  };

  const generatePowerPoint = async () => {
    const pptx = new pptxgen();

    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "EcoLens AI";
    pptx.subject = "Environmental Intelligence Report";
    pptx.title = "EcoLens AI Environmental Report";

    // Slide 1
    let slide = pptx.addSlide();

    slide.addText("EcoLens AI", {
      x: 0.7,
      y: 0.6,
      w: 5,
      h: 0.5,
      fontSize: 28,
      bold: true,
      color: "087C3E",
    });

    slide.addText("Environmental Intelligence Report", {
      x: 0.7,
      y: 1.3,
      w: 8,
      h: 0.7,
      fontSize: 25,
      bold: true,
      color: "18352A",
    });

    slide.addText("India", {
      x: 0.7,
      y: 2.2,
      w: 3,
      h: 0.5,
      fontSize: 20,
    });

    slide.addText(`Report Period: ${reportDate}`, {
      x: 0.7,
      y: 2.8,
      w: 4,
      h: 0.4,
      fontSize: 14,
      color: "66756D",
    });

    slide.addText(
      "AI-powered environmental performance analysis, prediction and policy intelligence.",
      {
        x: 0.7,
        y: 4,
        w: 10,
        h: 0.8,
        fontSize: 18,
        color: "46554D",
      }
    );

    // Slide 2
    slide = pptx.addSlide();

    slide.addText("Current Environmental Performance", {
      x: 0.6,
      y: 0.4,
      w: 8,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: "18352A",
    });

    slide.addText(
      `EPI Score: ${reportData.epiScore}`,
      {
        x: 0.8,
        y: 1.5,
        w: 4,
        h: 0.6,
        fontSize: 22,
        bold: true,
        color: "087C3E",
      }
    );

    slide.addText(
      `Global Rank: ${reportData.globalRank}`,
      {
        x: 5,
        y: 1.5,
        w: 4,
        h: 0.6,
        fontSize: 22,
        bold: true,
      }
    );

    slide.addText("Key Indicators", {
      x: 0.8,
      y: 2.6,
      w: 4,
      h: 0.4,
      fontSize: 18,
      bold: true,
    });

    indicatorData.forEach((item, index) => {
      slide.addText(
        `${item.name}: ${item.value} ${item.unit} (${item.status})`,
        {
          x: 1,
          y: 3.2 + index * 0.45,
          w: 8,
          h: 0.3,
          fontSize: 13,
        }
      );
    });

    // Slide 3
    slide = pptx.addSlide();

    slide.addText("AI Prediction - 2030", {
      x: 0.6,
      y: 0.4,
      w: 8,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: "18352A",
    });

    slide.addText(
      `Predicted EPI Score: ${reportData.predictedScore}`,
      {
        x: 0.8,
        y: 1.5,
        w: 5,
        h: 0.6,
        fontSize: 22,
        bold: true,
        color: "087C3E",
      }
    );

    slide.addText(
      `Predicted Global Rank: ${reportData.predictedRank}`,
      {
        x: 0.8,
        y: 2.3,
        w: 5,
        h: 0.6,
        fontSize: 20,
      }
    );

    slide.addText(
      `Prediction Confidence: ${reportData.confidence}`,
      {
        x: 0.8,
        y: 3.1,
        w: 5,
        h: 0.6,
        fontSize: 20,
      }
    );

    slide.addText(
      `Expected Improvement: ${reportData.improvement}`,
      {
        x: 0.8,
        y: 3.9,
        w: 6,
        h: 0.6,
        fontSize: 20,
        color: "087C3E",
      }
    );

    // Slide 4
    slide = pptx.addSlide();

    slide.addText("Recommended Policy Actions", {
      x: 0.6,
      y: 0.4,
      w: 8,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: "18352A",
    });

    scenarioData.forEach((scenario, index) => {
      slide.addText(
        `${index + 1}. ${scenario.name}`,
        {
          x: 0.8,
          y: 1.3 + index * 1,
          w: 6,
          h: 0.35,
          fontSize: 17,
          bold: true,
        }
      );

      slide.addText(
        `${scenario.description}\nExpected EPI Gain: ${scenario.score} | Impact: ${scenario.impact}`,
        {
          x: 1,
          y: 1.7 + index * 1,
          w: 9,
          h: 0.5,
          fontSize: 13,
          color: "53635A",
        }
      );
    });

    // Slide 5
    slide = pptx.addSlide();

    slide.addText("Environmental Twin Countries", {
      x: 0.6,
      y: 0.4,
      w: 8,
      h: 0.5,
      fontSize: 24,
      bold: true,
      color: "18352A",
    });

    twinCountries.forEach((country, index) => {
      slide.addText(
        `${index + 1}. ${country.country} — Similarity: ${country.similarity}`,
        {
          x: 0.9,
          y: 1.4 + index * 0.7,
          w: 8,
          h: 0.4,
          fontSize: 17,
        }
      );
    });

    await pptx.writeFile({
      fileName: "EcoLens_AI_Environmental_Report.pptx",
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);

    try {
      if (selectedFormat === "PDF") {
        generatePDF();
      }

      if (selectedFormat === "PowerPoint") {
        await generatePowerPoint();
      }

      if (selectedFormat === "Excel") {
        generateExcel();
      }

      setGenerated(true);
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Unable to generate the report. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page">
      <PageTitle
        icon={FileText}
        title="Reports & Insights"
        subtitle="Generate and download comprehensive environmental reports"
      />

      <div className="reports-grid">
        <Card className="report-preview-card">
          <CardHeader title="Report Preview" />

          <div className="report-preview">
            <div className="report-cover">
              <div className="cover-brand">
                <Leaf size={18} />
                <strong>EcoLens AI</strong>
              </div>

              <div className="cover-content">
                <span>Environmental</span>
                <strong>Intelligence Report</strong>
                <b>India</b>
                <small>May 2025</small>
              </div>

              <div className="cover-image">
                <Trees size={70} />
              </div>
            </div>

            <div className="report-includes">
              <h3>Report Includes</h3>

              {[
                "Environmental Intelligence Dashboard Summary",
                "AI Prediction & Forecast (2030)",
                "Explainable AI Insights",
                "Environmental Twin Comparison",
                "Policy & Scenario Analysis",
                "Priority Recommendations",
                "Key Insights & Takeaways",
                "Methodology & Data Sources",
              ].map((item) => (
                <div key={item}>
                  <CheckCircle2 size={15} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Choose Report Format"
            subtitle="Select a format and download your report"
          />

          <div className="format-list">
            <button
              className={selectedFormat === "PDF" ? "selected" : ""}
              onClick={() => {
                setSelectedFormat("PDF");
                setGenerated(false);
              }}
            >
              <FileText size={22} />
              <span>PDF</span>
              {selectedFormat === "PDF" && (
                <CheckCircle2 size={17} />
              )}
            </button>

            <button
              className={
                selectedFormat === "PowerPoint" ? "selected" : ""
              }
              onClick={() => {
                setSelectedFormat("PowerPoint");
                setGenerated(false);
              }}
            >
              <BarChart3 size={22} />
              <span>PowerPoint</span>
              {selectedFormat === "PowerPoint" && (
                <CheckCircle2 size={17} />
              )}
            </button>

            <button
              className={selectedFormat === "Excel" ? "selected" : ""}
              onClick={() => {
                setSelectedFormat("Excel");
                setGenerated(false);
              }}
            >
              <Database size={22} />
              <span>Excel</span>
              {selectedFormat === "Excel" && (
                <CheckCircle2 size={17} />
              )}
            </button>
          </div>

          <div className="selected-format">
            Selected format:
            <strong>{selectedFormat}</strong>
          </div>

          <button
            className="primary-button full generate-button"
            onClick={handleGenerate}
            disabled={generating}
          >
            <Download size={16} />

            {generating
              ? "Generating..."
              : generated
              ? `${selectedFormat} Downloaded ✓`
              : `Download ${selectedFormat} Report`}
          </button>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Report Insights"
          subtitle="AI-generated summary"
        />

        <div className="insight-grid">
          <div>
            <TrendingUp size={20} />
            <strong>Positive Outlook</strong>
            <p>
              EPI score is projected to increase from 28.7 to
              34.6 by 2030.
            </p>
          </div>

          <div>
            <AlertTriangle size={20} />
            <strong>Critical Areas</strong>
            <p>
              Air quality, water quality and waste management
              remain major areas requiring attention.
            </p>
          </div>

          <div>
            <Target size={20} />
            <strong>Recommended Action</strong>
            <p>
              Prioritize renewable energy, forest restoration
              and clean air interventions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* =========================================================
   DATA EXPLORER
========================================================= */

/* =========================================================
   DATA EXPLORER
========================================================= */

function DataExplorer() {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return indicatorData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  /* ---------------------------------------------------------
     EXPORT DATA
  --------------------------------------------------------- */

  const exportData = () => {
    const exportRows = [
      [
        "Indicator",
        "Value",
        "Unit",
        "Status",
        "Data Coverage",
        "Trend",
      ],

      ...rows.map((item) => [
        item.name,
        item.value,
        item.unit,
        item.status,
        "95%",
        "Declining",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(exportRows);

    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Environmental Data"
    );

    XLSX.writeFile(
      workbook,
      "EcoLens_AI_Environmental_Data.xlsx"
    );
  };

  return (
    <div className="page">
      <PageTitle
        icon={Database}
        title="Data Explorer"
        subtitle="Explore environmental indicators and model input data"
      />

      <Card>
        <div className="data-toolbar">

          <div className="search-box">
            <Search size={16} />

            <input
              placeholder="Search indicators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* EXPORT DATA BUTTON */}

          <button
            className="outline-button"
            onClick={exportData}
          >
            <Download size={15} />
            Export Data
          </button>

        </div>

        <div className="data-table-wrapper">
          <table>

            <thead>
              <tr>
                <th>Indicator</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Data Coverage</th>
                <th>Trend</th>
              </tr>
            </thead>

            <tbody>

              {rows.length > 0 ? (
                rows.map((item) => (
                  <tr key={item.name}>

                    <td>
                      <strong>{item.name}</strong>
                    </td>

                    <td>{item.value}</td>

                    <td>{item.unit}</td>

                    <td>
                      <StatusBadge
                        type={
                          item.status === "Poor"
                            ? "poor"
                            : item.status === "Low"
                            ? "low"
                            : "moderate"
                        }
                      >
                        {item.status}
                      </StatusBadge>
                    </td>

                    <td>
                      <span className="coverage">
                        95%
                      </span>
                    </td>

                    <td>
                      <span className="trend-down">
                        <TrendingDown size={15} />
                        Declining
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No indicators found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>
      </Card>
    </div>
  );
}
function SettingsPage({ darkMode, setDarkMode }) {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your EcoLens AI preferences</p>
        </div>
      </div>

      <div className="settings-card">
        <h2>Appearance</h2>

        <div className="setting-row">
          <div>
            <strong>Dark Mode</strong>
            <p>Switch between light and dark appearance.</p>
          </div>

          <button
            className={`settings-toggle ${
              darkMode ? "active" : ""
            }`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <span></span>
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h2>Notifications</h2>

        <div className="setting-row">
          <div>
            <strong>Environmental Alerts</strong>
            <p>Receive important environmental performance updates.</p>
          </div>

          <button
            className={`settings-toggle ${
              notifications ? "active" : ""
            }`}
            onClick={() => setNotifications(!notifications)}
          >
            <span></span>
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h2>Application Information</h2>

        <div className="info-row">
          <span>Application</span>
          <strong>EcoLens AI</strong>
        </div>

        <div className="info-row">
          <span>Version</span>
          <strong>1.0</strong>
        </div>

        <div className="info-row">
          <span>Purpose</span>
          <strong>Environmental Intelligence</strong>
        </div>
      </div>
    </div>
  );
}
/* =========================================================
   APP
========================================================= */

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;

      case "prediction":
        return <Prediction />;

      case "explainable":
        return <ExplainableAI />;

      case "twin":
        return <TwinFinder />;

      case "policy":
        return <PolicyScenario />;

      case "optimizer":
        return <PriorityOptimizer />;

      case "reports":
        return <Reports />;

      case "data":
        return <DataExplorer />;

   case "settings":
  return (
    <SettingsPage
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  );

      default:
        return <Dashboard />;
    }
  };

 return (
  <div className={`app-shell ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="main-content">
        <TopHeader
          setMobileOpen={setMobileOpen}
          title={activePage}
        />

        <div className="content-wrapper">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;