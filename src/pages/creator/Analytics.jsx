// PASTE PATH: src/pages/Analytics.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../scripts/dashboard";
import {
  STAT_CARDS,
  TRUST_HISTORY,
  FOLLOWER_GROWTH,
  CAMPAIGN_PERFORMANCE,
  AUDIENCE_BREAKDOWN,
} from "../../scripts/analytics";
import "../../styles/dashboard.css";
import "../../styles/analytics.css";

function LineChart({ data, color = "#7a1f33" }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const width = 480;
  const height = 140;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lineFill)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke={color} strokeWidth="2" />
      ))}
      {data.map((d, i) => (
        <text key={d.label} x={points[i].x} y={height - 2} textAnchor="middle" className="chart-axis-label">
          {d.label}
        </text>
      ))}
    </svg>
  );
}

function DonutChart({ data }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="donut-wrap">
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="75" cy="75" r={radius} fill="none" stroke="#f0e0e2" strokeWidth="16" />
        {data.map((d) => {
          const dash = (d.pct / 100) * circumference;
          const circle = (
            <circle
              key={d.label}
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
    </div>
  );
}

export default function Analytics({ onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="inf-wrap discover-wrap">

      {/* LEFT SIDEBAR — same as dashboard */}
      <div className="left-sb">
        <div className="logo-block">
          <div className="logo-icon">✦</div>
          <div className="logo-text">
            <span className="logo-gold">Influ</span>
            <span className="logo-white">ency</span>
          </div>
        </div>

        {NAV_ITEMS.map((item) => {
          const isNotif = item.label === "Notifications";
          const badgeValue = isNotif
            ? (notifUnreadCount > 0 ? notifUnreadCount : null)
            : item.badge;
          return (
            <div
              key={item.label}
              className={`nav-item ${!isNotif && location.pathname === item.path ? "active" : ""}`}
              onClick={() =>
                isNotif
                  ? onOpenNotifications && onOpenNotifications()
                  : item.path && navigate(item.path)
              }
            >
              <span className="nav-icon-wrap">
  {typeof item.icon === "string" ? item.icon : <item.icon size={18} strokeWidth={1.8} />}
</span>
              <span className="nav-label">{item.label}</span>
              {badgeValue && <span className="nav-badge">{badgeValue}</span>}
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="discover-main analytics-main">

        <div className="discover-header">
          <div className="discover-title">Analytics</div>
          <div className="discover-sub">Track your growth, performance, and trust </div>
        </div>

        {/* Stat Cards */}
        <div className="analytics-stats-grid">
          {STAT_CARDS.map((s) => (
            <div className="analytics-stat-card" key={s.label}>
              <div className="analytics-stat-icon">{s.icon}</div>
              <p className="analytics-stat-value">{s.value}</p>
              <p className="analytics-stat-label">{s.label}</p>
              <p className={`analytics-stat-change ${s.positive ? "positive" : "negative"}`}>
                {s.positive ? "↑" : "↓"} {s.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="analytics-charts-row">
          <div className="analytics-chart-card">
            <p className="analytics-chart-title">Trust Score Growth</p>
            <LineChart data={TRUST_HISTORY} color="#7a1f33" />
          </div>
          <div className="analytics-chart-card">
            <p className="analytics-chart-title">Follower Growth (K)</p>
            <LineChart data={FOLLOWER_GROWTH} color="#c87a4a" />
          </div>
        </div>

        {/* Audience + Campaign Performance */}
        <div className="analytics-bottom-row">
          <div className="analytics-chart-card audience-card">
            <p className="analytics-chart-title">Audience Age Breakdown</p>
            <DonutChart data={AUDIENCE_BREAKDOWN} />
            <div className="audience-legend">
              {AUDIENCE_BREAKDOWN.map((d) => (
                <div className="audience-legend-row" key={d.label}>
                  <span className="audience-dot" style={{ background: d.color }} />
                  <span className="audience-legend-label">{d.label}</span>
                  <span className="audience-legend-pct">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-chart-card campaign-perf-card">
            <p className="analytics-chart-title">Top Campaign Performance</p>
            <div className="campaign-perf-list">
              {CAMPAIGN_PERFORMANCE.map((c) => (
                <div className="campaign-perf-row" key={c.brand}>
                  <div className="campaign-perf-brand">{c.brand}</div>
                  <div className="campaign-perf-stats">
                    <span>{c.reach} reach</span>
                    <span className="collab-dot">•</span>
                    <span>{c.engagement} engagement</span>
                    <span className="collab-dot">•</span>
                    <span className="campaign-perf-trust">+{c.trustEarned} trust</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}