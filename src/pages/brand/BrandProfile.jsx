// PASTE PATH: src/pages/BrandProfile.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../scripts/dashboard";
import {
  useBrandProfile,
  INDUSTRY_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
  PLATFORM_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  VERIFICATION_ITEMS,
} from "../../scripts/brandProfile";

import "../../styles/dashboard.css";
import "../../styles/settings.css";
import "../../styles/userProfile.css";
import "../../styles/brandProfile.css";

/* ── Mock data (replace with real API calls later) ── */
const ACTIVE_CAMPAIGNS = [
  { id: 1, title: "Summer Collection Launch", platform: "Instagram", budget: "₹80K", creators: 4, status: "live", daysLeft: 12 },
  { id: 2, title: "App Download Drive", platform: "YouTube", budget: "₹1.5L", creators: 2, status: "live", daysLeft: 5 },
  { id: 3, title: "Festive Season Reels", platform: "Instagram", budget: "₹2L", creators: 8, status: "drafting", daysLeft: null },
];

const CAMPAIGN_HISTORY = [
  { id: "A", brand: "Influency Summer '23", date: "Jul 2023", creators: 6, reach: "2.1M", rating: 4.8, status: "completed" },
  { id: "B", brand: "Product Launch Blitz", date: "Mar 2023", creators: 3, reach: "890K", rating: 4.6, status: "completed" },
  { id: "C", brand: "Brand Awareness Q1", date: "Jan 2023", creators: 10, reach: "4.5M", rating: 4.9, status: "completed" },
];

const REVIEWS = [
  { creator: "Priya Mehta", handle: "@priyacreates", date: "Nov 2024", rating: 5, text: "Very professional brand. Clear brief, timely payments, and genuinely collaborative. Would work with them again." },
  { creator: "Rahul Joshi", handle: "@rahulvibes", date: "Oct 2024", rating: 5, text: "One of the smoothest brand partnerships I've had. They gave us creative freedom and were responsive throughout." },
  { creator: "Ananya Das", handle: "@ananyalife", date: "Sep 2024", rating: 4, text: "Great campaign structure. Minor delay in product delivery but comms were transparent. Overall solid." },
];

export default function BrandProfile({ darkMode, setDarkMode, onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    profile,
    updateField,
    toggleInArray,
    handleSave,
    saved,
    editMode,
    setEditMode,
    loading,
    error,
  } = useBrandProfile();

  const selectedBudget = BUDGET_RANGE_OPTIONS.find((b) => b.value === profile.budgetRange);
  const selectedSize = COMPANY_SIZE_OPTIONS.find((s) => s.value === profile.companySize);

  const trustScore = profile.trustScore || 78;

  const stats = [
    ["14", "Campaigns"],
    ["4.8★", "Rating"],
    ["37", "Creators"],
    [trustScore, "Trust"],
  ];

  if (loading) return <div className="inf-wrap" style={{ alignItems: "center", justifyContent: "center", color: "#aaa" }}>Loading brand profile…</div>;
  if (error) return <div className="inf-wrap" style={{ alignItems: "center", justifyContent: "center", color: "#c87a4a" }}>Error: {error}</div>;

  return (
    <div className="inf-wrap">

      {/* ── LEFT SIDEBAR ── */}
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
          const badgeValue = isNotif ? (notifUnreadCount > 0 ? notifUnreadCount : null) : item.badge;
          return (
            <div
              key={item.label}
              className={`nav-item ${!isNotif && location.pathname === item.path ? "active" : ""}`}
              onClick={() =>
                isNotif
                  ? onOpenNotifications?.()
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

        <div className="spacer" />

        {/* Trust ring in sidebar */}
        <div className="trust-card">
          <div className="trust-ring-wrap">
            <svg className="ring-svg" width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="url(#lg-brand)" strokeWidth="5"
                strokeDasharray={`${(trustScore / 100) * 138} 141`} strokeLinecap="round" />
              <defs>
                <linearGradient id="lg-brand" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c87a4a" />
                  <stop offset="100%" stopColor="#7a1f33" />
                </linearGradient>
              </defs>
            </svg>
            <div className="trust-meta">
              <div className="trust-score-big">{trustScore}</div>
              <div className="trust-label">Trust Score</div>
            </div>
          </div>
          <div className="badge-row">
            <span className="badge badge-elite">⭐ Verified</span>
            <span className="badge badge-level">Brand</span>
          </div>
          <div className="trust-user">
            {profile.companyName || "Your Brand"}
            <span className="trust-handle"> {profile.handle}</span><br />
            <span className="trust-pts">↑ +3 pts this week</span>
          </div>
        </div>
      </div>

      {/* ── MAIN FEED ── */}
      <div className="feed">

        {editMode ? (
          /* ════════ EDIT MODE ════════ */
          <>
            <div className="card edit-topbar">
              <button className="btn-outline-sm" onClick={() => setEditMode(false)}>← Back to Profile</button>
              <div className="edit-topbar-title">Edit Brand Profile</div>
              <button className="btn-primary-sm" onClick={handleSave}>
                {saved ? "✓ Saved!" : "💾 Save Changes"}
              </button>
            </div>

            {/* Basic Info */}
            <div className="settings-section">
              <div className="settings-section-header">
                <div className="settings-section-icon">🏢</div>
                <div>
                  <div className="settings-section-title">Brand Identity</div>
                  <div className="settings-section-desc">How creators see your brand</div>
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon">📛</div>
                <div className="settings-row-info"><div className="settings-row-label">Company Name</div></div>
                <div className="settings-row-right">
                  <input className="settings-input" value={profile.companyName} onChange={(e) => updateField("companyName", e.target.value)} placeholder="Acme Corp" />
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon">🔗</div>
                <div className="settings-row-info"><div className="settings-row-label">Brand Handle</div></div>
                <div className="settings-row-right">
                  <input className="settings-input" value={profile.handle} onChange={(e) => updateField("handle", e.target.value)} placeholder="@acmecorp" />
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon">💡</div>
                <div className="settings-row-info"><div className="settings-row-label">Tagline</div></div>
                <div className="settings-row-right">
                  <input className="settings-input" value={profile.tagline} onChange={(e) => updateField("tagline", e.target.value)} placeholder="One line that defines your brand" />
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon">🌐</div>
                <div className="settings-row-info"><div className="settings-row-label">Website</div></div>
                <div className="settings-row-right">
                  <input className="settings-input" value={profile.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://yourbrand.com" />
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-row-icon">📝</div>
                <div className="settings-row-info"><div className="settings-row-label">Brand Description</div></div>
                <div className="settings-row-right" style={{ flex: 1 }}>
                  <textarea
                    className="settings-input"
                    style={{ width: "100%", minHeight: 70, resize: "vertical", boxSizing: "border-box" }}
                    value={profile.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="What your brand does, your values, who you want to collaborate with…"
                  />
                </div>
              </div>
            </div>

            {/* Grid sections */}
            <div className="profile-grid">

              {/* Industry */}
              <div className="settings-section">
                <div className="settings-section-header">
                  <div className="settings-section-icon">🏷️</div>
                  <div>
                    <div className="settings-section-title">Industry / Category</div>
                    <div className="settings-section-desc">Creators match based on these</div>
                  </div>
                </div>
                <div className="settings-section-body">
                  <div className="chip-grid">
                    {INDUSTRY_OPTIONS.map((n) => (
                      <button key={n} className={`chip ${profile.industry.includes(n) ? "chip-active" : ""}`} onClick={() => toggleInArray("industry", n)}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Company size */}
              <div className="settings-section">
                <div className="settings-section-header">
                  <div className="settings-section-icon">🏗️</div>
                  <div>
                    <div className="settings-section-title">Company Size</div>
                  </div>
                </div>
                <div className="settings-section-body">
                  <div className="chip-grid">
                    {COMPANY_SIZE_OPTIONS.map((s) => (
                      <button key={s.value} className={`chip ${profile.companySize === s.value ? "chip-active" : ""}`} onClick={() => updateField("companySize", s.value)}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div className="settings-section">
                <div className="settings-section-header">
                  <div className="settings-section-icon">💰</div>
                  <div>
                    <div className="settings-section-title">Campaign Budget Range</div>
                    <div className="settings-section-desc">Per campaign, not total</div>
                  </div>
                </div>
                <div className="settings-section-body">
                  <div className="chip-grid">
                    {BUDGET_RANGE_OPTIONS.map((b) => (
                      <button key={b.value} className={`chip ${profile.budgetRange === b.value ? "chip-active" : ""}`} onClick={() => updateField("budgetRange", b.value)}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Platforms */}
              <div className="settings-section">
                <div className="settings-section-icon-header">
                  <div className="settings-section-header">
                    <div className="settings-section-icon">📱</div>
                    <div>
                      <div className="settings-section-title">Target Platforms</div>
                      <div className="settings-section-desc">Where your campaigns run</div>
                    </div>
                  </div>
                </div>
                <div className="settings-section-body">
                  <div className="chip-grid">
                    {PLATFORM_OPTIONS.map((p) => (
                      <button key={p} className={`chip ${profile.targetPlatforms.includes(p) ? "chip-active" : ""}`} onClick={() => toggleInArray("targetPlatforms", p)}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Campaign Types */}
              <div className="settings-section profile-grid-full">
                <div className="settings-section-header">
                  <div className="settings-section-icon">🎬</div>
                  <div>
                    <div className="settings-section-title">Campaign Types</div>
                    <div className="settings-section-desc">What kind of content you run</div>
                  </div>
                </div>
                <div className="settings-section-body">
                  <div className="chip-grid">
                    {CAMPAIGN_TYPE_OPTIONS.map((c) => (
                      <button key={c} className={`chip ${profile.campaignTypes.includes(c) ? "chip-active" : ""}`} onClick={() => toggleInArray("campaignTypes", c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </>
        ) : (
          /* ════════ VIEW MODE ════════ */
          <>

            {/* ── Hero Card ── */}
            <div className="card">
              <div className="profile-card-cover brand-cover">
                <span className="badge badge-verified-g cover-badge">✓ Verified Brand</span>
              </div>
              <div className="profile-card-body">
                <div className="profile-top-row">
                  <div className="brand-avatar-wrap">
                    <div className="profile-avatar brand-avatar">
                      {profile.logoUrl
                        ? <img src={profile.logoUrl} alt="logo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 32 }}>{profile.logoEmoji}</span>}
                      <div className="verify-dot">✓</div>
                    </div>
                  </div>
                  <button className="btn-outline-sm" onClick={() => setEditMode(true)}>✎ Edit Profile</button>
                </div>

                <div className="profile-name-block">
                  <div className="profile-name">{profile.companyName || "Your Brand Name"}</div>
                  <div className="profile-sub">{profile.handle} · {profile.location}</div>
                  {profile.tagline && <div className="brand-tagline">"{profile.tagline}"</div>}
                </div>

                <div className="tag-row">
                  {profile.industry.map((n) => (
                    <span className="pill pill-cat" key={n}>{n}</span>
                  ))}
                </div>

                <div className="badge-row" style={{ marginTop: 10 }}>
                  <span className="badge badge-verified-g">✓ Verified Brand</span>
                  <span className="badge badge-elite">⭐ Premium Partner</span>
                  {selectedSize && <span className="badge badge-level">{selectedSize.label}</span>}
                </div>

                {profile.description && <p className="profile-bio-text">{profile.description}</p>}

                <div className="profile-stats">
                  {stats.map(([num, lbl], i) => (
                    <div key={lbl} style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                      {i > 0 && <div className="stat-divider" />}
                      <div className="profile-stat">
                        <div className="stat-num" style={lbl === "Trust" ? { color: "#22C55E" } : {}}>{num}</div>
                        <div className="stat-lbl">{lbl}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="btn-row">
                  <button className="btn-primary-sm">🚀 Launch Campaign</button>
                  <button className="btn-primary-sm">🔍 Find Creators</button>
                  <button className="btn-outline-sm">💬 Support</button>
                </div>
              </div>
            </div>

            {/* ── Trust Score Card ── */}
            <div className="card trust-analysis-card">
              <div className="trust-analysis-header">
                <div className="score-ring-svg-wrap" style={{ width: 80, height: 80 }}>
                  <svg width="80" height="80" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#lg-bt)"
                      strokeWidth="10"
                      strokeDasharray="314"
                      strokeDashoffset={314 - (trustScore / 100) * 314}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)" />
                    <defs>
                      <linearGradient id="lg-bt" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c87a4a" />
                        <stop offset="100%" stopColor="#7a1f33" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="score-overlay">
                    <div className="score-ring-val" style={{ fontSize: 22 }}>{trustScore}</div>
                  </div>
                </div>
                <div>
                  <div className="trend-section-title" style={{ marginBottom: 4 }}>AI Brand Trust Score</div>
                  <div className="trust-analysis-sub">Score reflects timely payments, creator satisfaction &amp; campaign quality.</div>
                </div>
              </div>
              <div className="verify-list">
                {VERIFICATION_ITEMS.map((v) => (
                  <div className="verify-list-row" key={v.label}>
                    <span className="verify-check">✓</span>
                    <span className="verify-label">{v.label}</span>
                    <span className="pill pill-budget">+{v.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── About ── */}
            <div className="card" style={{ padding: 18 }}>
              <div className="trend-section-title">About</div>
              <p className="profile-bio-text" style={{ marginTop: 8 }}>{profile.description || "No description added yet."}</p>
              <div className="about-grid">
                <div className="about-box">
                  <div className="about-label">Location</div>
                  <div className="about-value">{profile.location}</div>
                </div>
                <div className="about-box">
                  <div className="about-label">Company Size</div>
                  <div className="about-value">{selectedSize?.label || "—"}</div>
                </div>
                <div className="about-box">
                  <div className="about-label">Budget Range</div>
                  <div className="about-value about-value-accent">{selectedBudget?.label || "—"}</div>
                </div>
                {profile.website && (
                  <div className="about-box">
                    <div className="about-label">Website</div>
                    <div className="about-value">
                      <a href={profile.website} target="_blank" rel="noreferrer" className="about-value-accent" style={{ textDecoration: "none" }}>
                        🌐 {profile.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Target Platforms & Campaign Types ── */}
            <div className="card" style={{ padding: 18 }}>
              <div className="trend-section-title">Campaign Preferences</div>
              <div style={{ marginTop: 10 }}>
                <div className="about-label" style={{ marginBottom: 8 }}>Target Platforms</div>
                <div className="chip-grid">
                  {profile.targetPlatforms.length
                    ? profile.targetPlatforms.map((p) => <span className="chip chip-active" key={p}>{p}</span>)
                    : <span style={{ opacity: 0.5, fontSize: 13 }}>Not set yet</span>}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="about-label" style={{ marginBottom: 8 }}>Campaign Types</div>
                <div className="chip-grid">
                  {profile.campaignTypes.length
                    ? profile.campaignTypes.map((c) => <span className="chip chip-active" key={c}>{c}</span>)
                    : <span style={{ opacity: 0.5, fontSize: 13 }}>Not set yet</span>}
                </div>
              </div>
            </div>

            {/* ── Active Campaigns ── */}
            <div className="card trending-card">
              <div className="trend-section-title">Active Campaigns</div>
              <div className="campaigns-list">
                {ACTIVE_CAMPAIGNS.map((c) => (
                  <div className="history-row" key={c.id}>
                    <div className="brand-logo" style={{ background: "linear-gradient(135deg,#7a1f33,#c87a4a)", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                      {c.status === "live" ? "🔴" : "📝"}
                    </div>
                    <div className="history-row-info">
                      <div className="brand-name">{c.title}</div>
                      <div className="brand-cat">{c.platform} · {c.creators} creators</div>
                      <div className="campaign-pills" style={{ marginTop: 6 }}>
                        {c.status === "live"
                          ? <span className="pill pill-budget">● Live · {c.daysLeft}d left</span>
                          : <span className="pill pill-dead">📝 Drafting</span>}
                        <span className="pill pill-cat">{c.budget}</span>
                      </div>
                    </div>
                    <button className="btn-outline-sm" style={{ fontSize: 11, padding: "4px 10px" }}>Manage</button>
                  </div>
                ))}
              </div>
              <button className="view-all-btn" style={{ marginTop: 14 }}>+ New Campaign</button>
            </div>

            {/* ── Campaign History ── */}
            <div className="card trending-card">
              <div className="trend-section-title">Campaign History</div>
              <div className="campaigns-list">
                {CAMPAIGN_HISTORY.map((c) => (
                  <div className="history-row" key={c.id}>
                    <div className="brand-logo" style={{ background: "linear-gradient(135deg,#1a3a2a,#2f8f53)", color: "#fff", fontSize: 16 }}>✓</div>
                    <div className="history-row-info">
                      <div className="brand-name">{c.brand}</div>
                      <div className="brand-cat">{c.creators} creators · {c.reach} reach</div>
                      <div className="campaign-pills" style={{ marginTop: 6 }}>
                        <span className="pill pill-budget">✓ Completed · {c.rating} ★</span>
                        <span className="pill pill-cat">{c.date}</span>
                      </div>
                    </div>
                    <div className="history-rating">{c.rating} ★</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Reviews from Creators ── */}
            <div className="card" style={{ padding: 18 }}>
              <div className="reviews-header">
                <div className="trend-section-title" style={{ marginBottom: 0 }}>Creator Reviews</div>
                <div className="reviews-score">4.8 ★★★★★ <span>({REVIEWS.length})</span></div>
              </div>
              {REVIEWS.map((r) => (
                <div className="review-card" key={r.creator}>
                  <div className="review-head">
                    <div>
                      <div className="review-brand">
                        {r.creator}
                        <span className="badge badge-verified-g" style={{ fontSize: 10, padding: "2px 7px", marginLeft: 6 }}>Verified Creator</span>
                      </div>
                      <div className="review-date">{r.handle} · {r.date}</div>
                    </div>
                    <div className="review-stars">{"★".repeat(r.rating)}</div>
                  </div>
                  <p className="review-text">"{r.text}"</p>
                </div>
              ))}
            </div>

          </>
        )}
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="right-sb">
        {!editMode && (
          <>
            {/* Quick Stats */}
            <div className="right-card">
              <div className="right-title">Campaign Analytics</div>
              <div className="analytics-grid">
                <div className="analytics-box">
                  <div className="analytics-val">7.4M</div>
                  <div className="analytics-lbl">Total Reach</div>
                </div>
                <div className="analytics-box">
                  <div className="analytics-val" style={{ color: "#2f8f53" }}>4.8★</div>
                  <div className="analytics-lbl">Avg Rating</div>
                </div>
                <div className="analytics-box">
                  <div className="analytics-val">₹18L</div>
                  <div className="analytics-lbl">Total Spent</div>
                </div>
                <div className="analytics-box">
                  <div className="analytics-val" style={{ color: "#2f8f53" }}>94%</div>
                  <div className="analytics-lbl">On-time</div>
                </div>
              </div>
            </div>

            {/* Top Creators Worked With */}
            <div className="right-card">
              <div className="right-title">Top Creators</div>
              {[
                { name: "Priya Mehta", handle: "@priyacreates", pct: 98, cls: "pct-high" },
                { name: "Rahul Joshi", handle: "@rahulvibes", pct: 95, cls: "pct-high" },
                { name: "Ananya Das", handle: "@ananyalife", pct: 91, cls: "pct-mid" },
              ].map((c) => (
                <div className="match-item" key={c.handle}>
                  <div className="match-logo" style={{ background: "linear-gradient(135deg,#7a1f33,#c87a4a)", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                    {c.name[0]}
                  </div>
                  <div>
                    <div className="match-name">{c.name}</div>
                    <div className="match-cat">{c.handle}</div>
                  </div>
                  <div className={`match-pct ${c.cls}`}>{c.pct}%</div>
                </div>
              ))}
              <button className="view-all-btn">Find More Creators</button>
            </div>

            {/* Budget Health */}
            <div className="right-card">
              <div className="right-title">Budget Overview</div>
              <div className="availability-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, opacity: 0.7 }}>
                    <span>Spent this month</span><span>₹3.4L / ₹5L</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, height: 6, overflow: "hidden" }}>
                    <div style={{ width: "68%", height: "100%", background: "linear-gradient(90deg,#c87a4a,#7a1f33)", borderRadius: 6 }} />
                  </div>
                </div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Renews in 12 days</div>
              </div>
              <button className="view-all-btn" style={{ marginTop: 10 }}>Manage Budget</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}