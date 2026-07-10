// PASTE PATH: src/pages/BrandDashboard.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useBrandDashboard } from "../scripts/brandDashboard";
import "../styles/dashboard.css";
import "../styles/brandDashboard.css";

const BRAND_NAV_ITEMS = [
  { icon: "🏠", label: "Home", path: "/brand-dashboard" },
  { icon: "📋", label: "Forms", path: "/brand-forms" },
  { icon: "🔍", label: "Discover", path: "/brand-discover" },
  { icon: "💬", label: "Messages", path: "/messages" },
  { icon: "🔔", label: "Notifications", path: "/notifications" },
  { icon: "📊", label: "Analytics", path: "/brand-analytics" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

const BRAND_STATS = [
  { label: "Active Campaigns", val: "3" },
  { label: "Creators Reached", val: "48" },
  { label: "Avg Response Rate", val: "91%" },
  { label: "Verified Collabs", val: "12" },
];

const TOP_CREATORS = [
  { initials: "AR", name: "Aria Chen", sub: "Fashion · 2.4M · Trust 94", bg: "linear-gradient(135deg,#3d1424,#1a0810)" },
  { initials: "ZW", name: "Zoe Williams", sub: "Travel · 1.7M · Trust 91", bg: "linear-gradient(135deg,#0a1020,#1e2840)" },
  { initials: "KN", name: "Kai Nakamura", sub: "Fitness · 620K · Trust 88", bg: "linear-gradient(135deg,#0a1a08,#1a3014)" },
];

export default function BrandDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { forms, loading, user, handleCreateForm, handleViewForm, fetchForms } = useBrandDashboard();
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState("");
  const [sendError, setSendError] = useState("");

  const handleSendForm = async () => {
    if (!selectedFormId || !creatorEmail.trim()) {
      setSendError("Please select a form and enter creator email.");
      return;
    }
    setSending(true);
    setSendError("");
    setSendMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/forms/${selectedFormId}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ creatorEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendError(data.message || "Failed to send form.");
      } else {
        setSendMsg(data.message);
        setCreatorEmail("");
        setSelectedFormId("");
        if (typeof fetchForms === "function") {
          fetchForms(); // refresh
        }
      }
    } catch (err) {
      setSendError("Cannot connect to server.");
    } finally {
      setSending(false);
    }
  };

  const totalSubmissions = forms.reduce((acc, f) => acc + (f.submissions?.length || 0), 0);
  const totalSent = forms.reduce((acc, f) => acc + (f.sentTo?.length || 0), 0);

  return (
    <div className="inf-wrap">

      {/* LEFT SIDEBAR — exact same as creator */}
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
              <div className="trust-score-big">{forms.length}</div>
              <div className="trust-label">Active Forms</div>
            </div>
          </div>
          <div className="badge-row">
            <span className="badge badge-elite">Verified Brand</span>
            <span className="badge badge-level">Pro</span>
          </div>
          <div className="trust-user">
            {user?.name || "Brand"} <br />
            <span className="trust-handle">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* FEED */}
      <div className="feed">

        {/* Brand Profile Card */}
        <div className="card">
          <div className="profile-card-cover brand-cover">
            <span className="badge badge-verified-g cover-badge">✓ Verified Brand</span>
          </div>
          <div className="profile-card-body">
            <div className="profile-top-row">
              <div className="profile-avatar brand-avatar">
                {user?.name?.[0] || "B"}
                <div className="verify-dot">✓</div>
              </div>
              <div className="badge-row">
                <span className="badge badge-elite">Verified Brand</span>
                <span className="badge badge-level">Pro Plan</span>
              </div>
            </div>
            <div className="profile-name-block">
              <div className="profile-name">{user?.name || "Brand Account"}</div>
              <div className="profile-sub">{user?.email}</div>
            </div>
            <div className="profile-stats">
              {[
                [forms.length, "Forms"],
                [totalSent, "Sent"],
                [totalSubmissions, "Responses"],
                ["91%", "Match Rate"],
              ].map(([num, lbl], i) => (
                <div key={lbl} style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                  {i > 0 && <div className="stat-divider" />}
                  <div className="profile-stat">
                    <div className="stat-num">{num}</div>
                    <div className="stat-lbl">{lbl}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-row">
              <button className="btn-primary-sm" onClick={handleCreateForm}>
                + Create Form
              </button>
              <button className="btn-outline-sm" onClick={() => navigate("/brand-discover")}>
                Find Creators
              </button>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="card trending-card">
          <div className="trend-section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Your Forms</span>
            <button className="apply-btn" onClick={handleCreateForm}>
              + New Form
            </button>
          </div>

          {loading ? (
            <div className="brand-empty">Loading forms...</div>
          ) : forms.length === 0 ? (
            <div className="brand-empty">
              <p>No forms yet — create your first form to start collecting creator info!</p>
              <button className="btn-primary-sm" style={{ marginTop: 16 }} onClick={handleCreateForm}>
                + Create Form
              </button>
            </div>
          ) : (
            <div className="campaigns-list">
              {forms.map((form) => (
                <div className="campaign-card" key={form._id} onClick={() => handleViewForm(form._id)}
                  style={{ cursor: "pointer" }}>
                  <div className="campaign-head">
                    <div className="brand-logo" style={{ background: "rgba(122,31,51,0.1)", color: "#7a1f33", fontSize: 18 }}>
                      F
                    </div>
                    <div>
                      <div className="brand-name">{form.title}</div>
                      <div className="brand-cat">{form.description || "No description"}</div>
                    </div>
                    <span className={`pill ${form.status === "active" ? "pill-budget" : "pill-dead"}`}
                      style={{ marginLeft: "auto" }}>
                      {form.status}
                    </span>
                  </div>
                  <div className="campaign-pills">
                    <span className="pill pill-cat">Sent: {form.sentTo?.length || 0}</span>
                    <span className="pill pill-budget">Responses: {form.submissions?.length || 0}</span>
                    <span className="pill pill-dead">{new Date(form.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                  <button
                    className="apply-btn"
                    style={{ marginTop: 10, width: "100%" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFormId(form._id);
                      setSendMsg("");
                      setSendError("");
                      setShowSendModal(true);
                    }}
                  >
                    Send to Creator →
                  </button>

                </div>
              ))}
            </div>

          )}
        </div>

        {/* Recommended Creators */}
        <div className="card">
          <div className="post-card-inner">
            <div className="trend-section-title">Recommended Creators</div>
            {TOP_CREATORS.map((c) => (
              <div className="creator-sugg" key={c.name} style={{ marginBottom: 12 }}>
                <div className="sugg-ava" style={{ background: c.bg, color: "#fff", fontSize: 13, fontWeight: 700 }}>
                  {c.initials}
                </div>
                <div>
                  <div className="sugg-name">{c.name}</div>
                  <div className="sugg-sub">{c.sub}</div>
                </div>
                <button className="sugg-connect" onClick={handleCreateForm}>
                  Send Form
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR */}

      <div className="right-sb">


        {/* Brand Stats */}
        <div className="right-card">
          <div className="right-title">Campaign Overview</div>
          <div className="score-ring-big">
            <div className="score-ring-svg-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#lg-brand)" strokeWidth="10"
                  strokeDasharray="314" strokeDashoffset="80"
                  strokeLinecap="round" transform="rotate(-90 60 60)" />
                <defs>
                  <linearGradient id="lg-brand" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c87a4a" />
                    <stop offset="100%" stopColor="#7a1f33" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="score-overlay">
                <div className="score-ring-val">{totalSubmissions}</div>
                <div className="score-ring-lbl">Responses</div>
              </div>
            </div>
          </div>
          <div className="score-factors">
            {[
              { label: "Forms Created", val: forms.length, color: "#7a1f33" },
              { label: "Forms Sent", val: totalSent, color: "#c87a4a" },
              { label: "Responses", val: totalSubmissions, color: "#2f8f53" },
            ].map((f) => (
              <div className="factor-row" key={f.label}>
                <div className="factor-dot" style={{ background: f.color }} />
                <div className="factor-label">{f.label}</div>
                <div className="factor-val">{f.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Creators */}
        <div className="right-card">
          <div className="right-title">Top Matches</div>
          {TOP_CREATORS.map((c) => (
            <div className="match-item" key={c.name}>
              <div className="match-logo" style={{ background: c.bg, color: "#fff", fontSize: 11, fontWeight: 700 }}>
                {c.initials}
              </div>
              <div>
                <div className="match-name">{c.name}</div>
                <div className="match-cat">{c.sub.split("·")[0].trim()}</div>
              </div>
              <div className="match-pct pct-98">94%</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="ai-cta-card">
          <div className="ai-cta-title">Creator Outreach</div>
          <div className="ai-cta-sub">Create a form and send it to matched creators — their profile data auto-fills your questions.</div>
          <button className="ai-cta-btn" onClick={handleCreateForm}>
            + Create Form
          </button>
        </div>

      </div>

      {/* SEND FORM MODAL */}
      {showSendModal && (
        <div className="modal-backdrop" onClick={() => setShowSendModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Send Form to Creator</div>
              <button className="notif-close-btn" onClick={() => setShowSendModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="settings-row" style={{ border: "none", padding: "0 0 14px" }}>
                <div className="settings-row-info">
                  <div className="settings-row-label">Select Form</div>
                  <div className="settings-row-sub">Which form do you want to send?</div>
                </div>
              </div>
              <select
                className="settings-select"
                style={{ width: "100%", marginBottom: 16 }}
                value={selectedFormId}
                onChange={(e) => setSelectedFormId(e.target.value)}
              >
                <option value="">-- Select a form --</option>
                {forms.map((f) => (
                  <option key={f._id} value={f._id}>{f.title}</option>
                ))}
              </select>

              <div className="settings-row" style={{ border: "none", padding: "0 0 8px" }}>
                <div className="settings-row-info">
                  <div className="settings-row-label">Creator Email</div>
                  <div className="settings-row-sub">Enter the creator's registered email</div>
                </div>
              </div>
              <input
                className="settings-input"
                style={{ width: "100%", boxSizing: "border-box", marginBottom: 16 }}
                type="email"
                placeholder="e.g. creator@gmail.com"
                value={creatorEmail}
                onChange={(e) => setCreatorEmail(e.target.value)}
              />

              {sendError && <p className="field-error">{sendError}</p>}
              {sendMsg && (
                <p style={{ color: "#2f8f53", fontSize: 13, marginBottom: 8 }}>
                  ✓ {sendMsg}
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-outline-sm" onClick={() => setShowSendModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary-sm"
                onClick={handleSendForm}
                disabled={sending}
                style={{ padding: "10px 24px" }}
              >
                {sending ? "Sending..." : "Send Form"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}