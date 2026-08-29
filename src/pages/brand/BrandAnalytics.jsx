import { Briefcase, CheckCircle, Users, Star } from "lucide-react";
import BrandSidebar from "../../components/brand/BrandSidebar";
import { useAnalytics } from "../../scripts/analytics";
import "../../styles/dashboard.css";
import "../../styles/analytics.css";

function LineChart({ data, color = "#7a1f33" }) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const width = 480, height = 140, padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return { x, y };
  });
  const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
      <defs>
        <linearGradient id="lineFillB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lineFillB)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke={color} strokeWidth="2" />)}
      {data.map((d, i) => (
        <text key={d.label} x={points[i].x} y={height - 2} textAnchor="middle" className="chart-axis-label">{d.label}</text>
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
            <circle key={d.label} cx="75" cy="75" r={radius} fill="none" stroke={d.color}
              strokeWidth="16" strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += dash;
          return circle;
        })}
      </svg>
    </div>
  );
}

export default function BrandAnalytics({ onOpenNotifications, notifUnreadCount }) {
  const { data, loading, error } = useAnalytics("brand");

  const statCards = data ? [
    { icon: Briefcase, label: "Total Campaigns", value: data.stats.totalCampaigns },
    { icon: CheckCircle, label: "Campaigns Completed", value: data.stats.campaignsCompleted },
    { icon: Users, label: "Creators Worked With", value: data.stats.totalCreators },
    { icon: Star, label: "Trust Score", value: data.stats.trustScore },
  ] : [];

  return (
    <div className="inf-wrap discover-wrap">
      <BrandSidebar onOpenNotifications={onOpenNotifications} notifUnreadCount={notifUnreadCount} />

      <div className="discover-main analytics-main">
        <div className="discover-header">
          <div className="discover-title">Analytics</div>
          <div className="discover-sub">Track your campaigns, reach, and creator partnerships</div>
        </div>

        {loading && <p style={{ opacity: 0.6 }}>Loading analytics…</p>}
        {error && <p style={{ color: "#c0392b" }}>{error}</p>}

        {data && (
          <>
            <div className="analytics-stats-grid">
              {statCards.map((s) => (
                <div className="analytics-stat-card" key={s.label}>
                  <div className="analytics-stat-icon"><s.icon size={20} strokeWidth={1.8} /></div>
                  <p className="analytics-stat-value">{s.value}</p>
                  <p className="analytics-stat-label">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="analytics-charts-row">
              <div className="analytics-chart-card">
                <p className="analytics-chart-title">Campaigns Completed / Month</p>
                <LineChart data={data.monthlyCampaigns} color="#7a1f33" />
              </div>
              <div className="analytics-chart-card">
                <p className="analytics-chart-title">New Collabs / Month</p>
                <LineChart data={data.monthlyApplications} color="#c87a4a" />
              </div>
            </div>

            <div className="analytics-bottom-row">
              <div className="analytics-chart-card audience-card">
                <p className="analytics-chart-title">Collabs by Status</p>
                {data.statusBreakdown.length ? (
                  <>
                    <DonutChart data={data.statusBreakdown} />
                    <div className="audience-legend">
                      {data.statusBreakdown.map((d) => (
                        <div className="audience-legend-row" key={d.label}>
                          <span className="audience-dot" style={{ background: d.color }} />
                          <span className="audience-legend-label" style={{ textTransform: "capitalize" }}>{d.label}</span>
                          <span className="audience-legend-pct">{d.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : <p style={{ opacity: 0.5, fontSize: 13 }}>No collabs yet.</p>}
              </div>

              <div className="analytics-chart-card campaign-perf-card">
                <p className="analytics-chart-title">Top Creators</p>
                <div className="campaign-perf-list">
                  {data.topCreators.length ? data.topCreators.map((c, i) => (
                    <div className="campaign-perf-row" key={i}>
                      <div className="campaign-perf-brand">{c.name} (@{c.username})</div>
                      <div className="campaign-perf-stats">
                        <span>Trust: {c.trustScore}</span>
                      </div>
                    </div>
                  )) : <p style={{ opacity: 0.5, fontSize: 13 }}>No creators yet.</p>}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}