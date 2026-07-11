// PASTE PATH: src/pages/BrandFormResponses.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/dashboard.css";
import "../../styles/brandDashboard.css";
import "../../styles/brandFormResponses.css";

const BRAND_NAV_ITEMS = [
  { icon: "🏠", label: "Home", path: "/brand-dashboard" },
  { icon: "📋", label: "Forms", path: "/brand-forms" },
  { icon: "🔍", label: "Discover", path: "/brand-discover" },
  { icon: "💬", label: "Messages", path: "/messages" },
  { icon: "🔔", label: "Notifications", path: "/notifications" },
  { icon: "📊", label: "Analytics", path: "/brand-analytics" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

export default function BrandFormResponses() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      // Submissions fetch karo
      const subRes = await fetch(`http://localhost:5000/api/forms/${formId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const subData = await subRes.json();
      if (!subRes.ok) {
        setError(subData.message || "Failed to load submissions");
        return;
      }
      setSubmissions(subData.submissions || []);
      setLastRefresh(new Date());

      // Form details — my-forms se fetch karo (brand token compatible)
      const formRes = await fetch(`http://localhost:5000/api/forms/my-forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formData = await formRes.json();
      if (formRes.ok) {
        const matched = formData.forms?.find((f) => f._id === formId);
        if (matched) setForm(matched);
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    fetchSubmissions();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSubmissions, 30000);
    return () => clearInterval(interval);
  }, [fetchSubmissions]);

  // First submission auto-select
  useEffect(() => {
    if (submissions.length > 0 && !activeSubmission) {
      setActiveSubmission(submissions[0]);
    }
  }, [submissions]);

  const formatAnswer = (answer) => {
    if (!answer) return <span className="bfr-empty-ans">—</span>;
    if (Array.isArray(answer)) return answer.join(", ");
    return String(answer);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const timeAgo = (date) => {
    if (!date) return "";
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="inf-wrap">

      {/* LEFT SIDEBAR */}
      <div className="left-sb">
        <div className="logo-block">
          <div className="logo-icon">✦</div>
          <div className="logo-text">
            <span className="logo-gold">Influ</span>
            <span className="logo-white">ency</span>
          </div>
        </div>

        {BRAND_NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-emoji">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}

        <div className="spacer" />

        <div className="trust-card">
          <div className="trust-ring-wrap">
            <div className="brand-trust-icon">✦</div>
            <div className="trust-meta">
              <div className="trust-score-big">{submissions.length}</div>
              <div className="trust-label">Responses</div>
            </div>
          </div>
          <div className="badge-row">
            <span className="badge badge-elite">Verified Brand</span>
            <span className="badge badge-level">Pro</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="feed" style={{ maxWidth: "none", flex: 1 }}>

        {/* Header */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 14 }}>
            <button
              className="btn-outline-sm"
              onClick={() => navigate("/brand-dashboard")}
              style={{ padding: "7px 14px", fontSize: 13 }}
            >
              ← Back
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary, #1a0810)" }}>
                {form?.title || "Form Responses"}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                {submissions.length} response{submissions.length !== 1 ? "s" : ""}
                {lastRefresh && (
                  <span style={{ marginLeft: 10, color: "#2f8f53" }}>
                    ● Live · refreshed {timeAgo(lastRefresh)}
                  </span>
                )}
              </div>
            </div>
            <button
              className="apply-btn"
              onClick={fetchSubmissions}
              style={{ padding: "8px 16px", fontSize: 12 }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="brand-empty">Loading responses...</div>
          </div>
        ) : error ? (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="brand-empty" style={{ color: "#c0392b" }}>{error}</div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="brand-empty">
              <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No responses yet</div>
              <div style={{ fontSize: 13, color: "#888" }}>
                Creators haven't filled this form yet. Check back soon!
              </div>
            </div>
          </div>
        ) : (
          <div className="bfr-layout">

            {/* LEFT — Creator List */}
            <div className="bfr-creator-list">
              {submissions.map((sub) => {
                const creator = sub.creatorId;
                const isActive = activeSubmission?._id === sub._id;
                return (
                  <div
                    key={sub._id}
                    className={`bfr-creator-item ${isActive ? "bfr-creator-active" : ""}`}
                    onClick={() => setActiveSubmission(sub)}
                  >
                    <div
                      className="bfr-creator-avatar"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg,#7a1f33,#c87a4a)"
                          : "linear-gradient(135deg,#3d1424,#1a0810)",
                      }}
                    >
                      {getInitials(creator?.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="bfr-creator-name">{creator?.name || "Unknown"}</div>
                      <div className="bfr-creator-email">{creator?.email || ""}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div className="pill pill-budget" style={{ fontSize: 10 }}>✓ Submitted</div>
                      <div style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>
                        {timeAgo(sub.submittedAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT — Response Detail */}
            {activeSubmission && (
              <div className="bfr-response-panel">
                {/* Creator Header */}
                <div className="bfr-panel-header">
                  <div
                    className="bfr-panel-avatar"
                    style={{ background: "linear-gradient(135deg,#7a1f33,#c87a4a)" }}
                  >
                    {getInitials(activeSubmission.creatorId?.name)}
                  </div>
                  <div>
                    <div className="bfr-panel-name">{activeSubmission.creatorId?.name || "Unknown"}</div>
                    <div className="bfr-panel-email">{activeSubmission.creatorId?.email}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <span className={`pill ${activeSubmission.autoFilled ? "pill-budget" : "pill-cat"}`}>
                      {activeSubmission.autoFilled ? "⚡ Auto-filled" : "✍ Manual"}
                    </span>
                    <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>
                      Submitted {timeAgo(activeSubmission.submittedAt)}
                    </div>
                  </div>
                </div>

                {/* Answers */}
                <div className="bfr-answers-list">
                  {Object.entries(activeSubmission.answers || {}).map(([key, val]) => {
                    // Fixed template questions ka label map
                    const LABEL_MAP = {
                      ft_name: "Full Name",
                      ft_location: "Location",
                      ft_niches: "Niches",
                      ft_availability: "Availability",
                      ft_workstatus: "Work Status",
                      ft_bio: "About",
                      ft_rate_min: "Min Rate (₹)",
                      ft_rate_max: "Max Rate (₹)",
                    };
                    const isFixed = key.startsWith("ft_");
                    // Custom question label form se dhundo
                    const customQ = form?.customQuestions?.find((q) => q.id === key);
                    const label = LABEL_MAP[key] || customQ?.label || key;

                    return (
                      <div key={key} className="bfr-answer-row">
                        <div className="bfr-question-label">
                          {label}
                          {isFixed && (
                            <span className="brand-autofill-badge" style={{ marginLeft: 8 }}>
                              ⚡
                            </span>
                          )}
                        </div>
                        <div className="bfr-answer-value">{formatAnswer(val)}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="bfr-panel-footer">
                  <button
                    className="btn-outline-sm"
                    onClick={() => navigate("/messages")}
                    style={{ fontSize: 13 }}
                  >
                    💬 Message Creator
                  </button>
                  <button
                    className="btn-primary-sm"
                    onClick={() => navigate("/brand-discover")}
                    style={{ fontSize: 13 }}
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR — Summary */}
      <div className="right-sb">
        <div className="right-card">
          <div className="right-title">Response Summary</div>
          <div className="score-ring-big">
            <div className="score-ring-svg-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#lg-resp)" strokeWidth="10"
                  strokeDasharray="314"
                  strokeDashoffset={submissions.length > 0 ? Math.max(20, 314 - (submissions.length * 40)) : 314}
                  strokeLinecap="round" transform="rotate(-90 60 60)" />
                <defs>
                  <linearGradient id="lg-resp" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c87a4a" />
                    <stop offset="100%" stopColor="#7a1f33" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="score-overlay">
                <div className="score-ring-val">{submissions.length}</div>
                <div className="score-ring-lbl">Total</div>
              </div>
            </div>
          </div>
          <div className="score-factors">
            {[
              {
                label: "Auto-filled",
                val: submissions.filter((s) => s.autoFilled).length,
                color: "#c87a4a",
              },
              {
                label: "Manual",
                val: submissions.filter((s) => !s.autoFilled).length,
                color: "#7a1f33",
              },
              {
                label: "Latest",
                val: submissions.length > 0 ? timeAgo(submissions[0].submittedAt) : "—",
                color: "#2f8f53",
              },
            ].map((f) => (
              <div className="factor-row" key={f.label}>
                <div className="factor-dot" style={{ background: f.color }} />
                <div className="factor-label">{f.label}</div>
                <div className="factor-val">{f.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="right-card">
          <div className="right-title">Live Updates</div>
          <div style={{ padding: "8px 0", fontSize: 13, color: "#666", lineHeight: 1.6 }}>
            <div style={{ color: "#2f8f53", fontWeight: 600, marginBottom: 6 }}>● Auto-refreshing</div>
            Page refreshes every 30 seconds automatically. Click ↻ Refresh for instant update.
          </div>
        </div>

        <div className="ai-cta-card">
          <div className="ai-cta-title">More Outreach</div>
          <div className="ai-cta-sub">Send this form to more creators to get more responses.</div>
          <button className="ai-cta-btn" onClick={() => navigate("/brand-dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

    </div>
  );
}