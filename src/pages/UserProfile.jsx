// PASTE PATH: src/pages/UserProfile.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS, BRAND_MATCHES } from "../scripts/dashboard";
import {
  useUserProfile,
  NICHE_OPTIONS,
  CONTENT_CATEGORY_OPTIONS,
  LANGUAGE_OPTIONS,
  AVAILABILITY_OPTIONS,
  RADIUS_OPTIONS,
  RESPONSE_TIME_OPTIONS,
  VERIFICATION_ITEMS,
  PORTFOLIO_ITEMS,
  CAMPAIGN_HISTORY,
  REVIEWS,
  ANALYTICS_SNAPSHOT,
} from "../scripts/userProfile";
import "../styles/dashboard.css";
import "../styles/settings.css";
import "../styles/userProfile.css";

export default function UserProfile({ darkMode, setDarkMode , onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profile,
    updateField,
    toggleInArray,
    updateSocial,
    handleSave,
    saved,
    editMode,
    setEditMode,
  } = useUserProfile();

  const currentAvailability = AVAILABILITY_OPTIONS.find((a) => a.value === profile.availability);

  const stats = [
    ["120K", "Followers"],
    ["4.9★", "Rating"],
    ["48", "Collabs"],
    ["92", "Trust"],
  ];

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
      <span className="nav-emoji">{item.icon}</span>
      <span className="nav-label">{item.label}</span>
      {badgeValue && <span className="nav-badge">{badgeValue}</span>}
    </div>
  );
})}

        <div className="spacer" />

        <div className="trust-card">
          <div className="trust-ring-wrap">
            <svg className="ring-svg" width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="url(#lg-up)" strokeWidth="5"
                strokeDasharray="126 141" strokeLinecap="round" />
              <defs>
                <linearGradient id="lg-up" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c87a4a" />
                  <stop offset="100%" stopColor="#7a1f33" />
                </linearGradient>
              </defs>
            </svg>
            <div className="trust-meta">
              <div className="trust-score-big">92</div>
              <div className="trust-label">Trust Score</div>
            </div>
          </div>
          <div className="badge-row">
            <span className="badge badge-elite">⭐ Elite</span>
            <span className="badge badge-level">Lvl 7</span>
            <span className="badge badge-verified-g">✓ ID'd</span>
          </div>
          <div className="trust-user">
            {profile.name} <span className="trust-handle">{profile.handle}</span><br />
            <span className="trust-pts">↑ +4 pts this week</span>
          </div>
        </div>
      </div>

      {/* MAIN FEED */}
      <div className="feed">

        {editMode ? (
  /* ============ EDIT MODE ============ */
  <>
    <div className="card edit-topbar">
      <button className="btn-outline-sm" onClick={() => setEditMode(false)}>← Back to Profile</button>
      <div className="edit-topbar-title">Edit Your Profile</div>
      <button className="btn-primary-sm" onClick={handleSave}>
        {saved ? "✓ Saved!" : "💾 Save Changes"}
      </button>
    </div>

    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-icon">👤</div>
        <div>
          <div className="settings-section-title">Basic Info</div>
          <div className="settings-section-desc">How you appear to brands</div>
        </div>
      </div>
      <div className="settings-row">
        <div className="settings-row-icon">📛</div>
        <div className="settings-row-info">
          <div className="settings-row-label">Display Name</div>
        </div>
        <div className="settings-row-right">
          <input className="settings-input" value={profile.name} onChange={(e) => updateField("name", e.target.value)} />
        </div>
      </div>
      <div className="settings-row">
        <div className="settings-row-icon">🔗</div>
        <div className="settings-row-info">
          <div className="settings-row-label">Username</div>
        </div>
        <div className="settings-row-right">
          <input className="settings-input" value={profile.handle} onChange={(e) => updateField("handle", e.target.value)} />
        </div>
      </div>
      <div className="settings-row">
        <div className="settings-row-icon">📝</div>
        <div className="settings-row-info">
          <div className="settings-row-label">Bio</div>
        </div>
        <div className="settings-row-right" style={{ flex: 1 }}>
          <textarea
            className="settings-input"
            style={{ width: "100%", minHeight: 60, resize: "vertical", boxSizing: "border-box" }}
            value={profile.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </div>
      </div>
    </div>

    <div className="profile-grid">

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">🟢</div>
          <div>
            <div className="settings-section-title">Availability Status</div>
            <div className="settings-section-desc">Let brands know if you're open for work</div>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="chip-grid">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`chip ${profile.availability === opt.value ? "chip-active" : ""}`}
                style={profile.availability === opt.value ? { borderColor: opt.color, color: opt.color } : {}}
                onClick={() => updateField("availability", opt.value)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>
        {profile.availability === "booked" && (
          <div className="settings-row">
            <div className="settings-row-icon">📅</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Booked Until</div>
            </div>
            <div className="settings-row-right">
              <input type="date" className="settings-input" value={profile.bookedUntil} onChange={(e) => updateField("bookedUntil", e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">🏷️</div>
          <div>
            <div className="settings-section-title">Preferred Niches</div>
            <div className="settings-section-desc">Brands match you based on these</div>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="chip-grid">
            {NICHE_OPTIONS.map((n) => (
              <button key={n} className={`chip ${profile.niches.includes(n) ? "chip-active" : ""}`} onClick={() => toggleInArray("niches", n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">📍</div>
          <div>
            <div className="settings-section-title">Location & Service Radius</div>
            <div className="settings-section-desc">How far you're willing to work</div>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-icon">🏙️</div>
          <div className="settings-row-info">
            <div className="settings-row-label">Current Location</div>
          </div>
          <div className="settings-row-right">
            <select className="settings-select" value={profile.location} onChange={(e) => updateField("location", e.target.value)}>
              <option>Mumbai, IN</option>
              <option>Delhi, IN</option>
              <option>Bangalore, IN</option>
              <option>Pune, IN</option>
              <option>Hyderabad, IN</option>
            </select>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="chip-grid">
            {RADIUS_OPTIONS.map((r) => (
              <button key={r.value} className={`chip ${profile.radius === r.value ? "chip-active" : ""}`} onClick={() => updateField("radius", r.value)}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="radius-hint">
            📌 You'll be matched to campaigns within{" "}
            <strong>
              {["remote", "national", "global"].includes(profile.radius)
                ? RADIUS_OPTIONS.find((r) => r.value === profile.radius)?.label
                : `${profile.radius} km of ${profile.location}`}
            </strong>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">🔗</div>
          <div>
            <div className="settings-section-title">Social Media Handles</div>
            <div className="settings-section-desc">Verified handles boost Trust Score</div>
          </div>
        </div>
        {profile.socials.map((s) => (
          <div className="settings-row" key={s.platform}>
            <div className="settings-row-icon">{s.icon}</div>
            <div className="settings-row-info">
              <div className="settings-row-label">{s.platform}</div>
              <div className="settings-row-sub">{s.followers ? `${s.followers} followers` : "Not connected"}</div>
            </div>
            <div className="settings-row-right" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input className="settings-input" placeholder="@handle" value={s.handle} onChange={(e) => updateSocial(s.platform, "handle", e.target.value)} />
              <span className={`settings-tag ${s.connected ? "green" : ""}`}>{s.connected ? "✓ Connected" : "Connect"}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">🗣️</div>
          <div>
            <div className="settings-section-title">Languages Spoken</div>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="chip-grid">
            {LANGUAGE_OPTIONS.map((l) => (
              <button key={l} className={`chip ${profile.languages.includes(l) ? "chip-active" : ""}`} onClick={() => toggleInArray("languages", l)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">🎬</div>
          <div>
            <div className="settings-section-title">Content Categories</div>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="chip-grid">
            {CONTENT_CATEGORY_OPTIONS.map((c) => (
              <button key={c} className={`chip ${profile.contentCategories.includes(c) ? "chip-active" : ""}`} onClick={() => toggleInArray("contentCategories", c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">⏱️</div>
          <div>
            <div className="settings-section-title">Typical Response Time</div>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="chip-grid">
            {RESPONSE_TIME_OPTIONS.map((r) => (
              <button key={r} className={`chip ${profile.responseTime === r ? "chip-active" : ""}`} onClick={() => updateField("responseTime", r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-section profile-grid-full">
        <div className="settings-section-header">
          <div className="settings-section-icon">💰</div>
          <div>
            <div className="settings-section-title">Rate Range</div>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="rate-range-row">
            <div className="rate-input-group">
              <span className="rate-prefix">₹</span>
              <input type="number" className="settings-input" value={profile.rateMin} onChange={(e) => updateField("rateMin", Number(e.target.value))} />
            </div>
            <span className="rate-sep">to</span>
            <div className="rate-input-group">
              <span className="rate-prefix">₹</span>
              <input type="number" className="settings-input" value={profile.rateMax} onChange={(e) => updateField("rateMax", Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

    </div>
  </>
) : (
          /* ============ VIEW MODE ============ */
          <>
            {/* Hero / Profile Card */}
            <div className="card">
              <div className="profile-card-cover">
                <span className="badge badge-verified-g cover-badge">✓ Verified Creator</span>
              </div>
              <div className="profile-card-body">
                <div className="profile-top-row">
                  <div className="profile-avatar">
                    {profile.avatarEmoji}
                    <div className="verify-dot">✓</div>
                  </div>
                  <button className="btn-outline-sm" onClick={() => setEditMode(true)}>
                    ✎ Edit Profile
                  </button>
                </div>

                <div className="profile-name-block">
                  <div className="profile-name">{profile.name}</div>
                  <div className="profile-sub">{profile.handle} · {profile.location}</div>
                </div>

                <div className="tag-row">
                  {profile.niches.map((n) => (
                    <span className="pill pill-cat" key={n}>{n}</span>
                  ))}
                </div>

                <div className="badge-row" style={{ marginTop: 10 }}>
                  <span className="badge badge-verified-g">✓ Verified</span>
                  <span className="badge badge-elite">⭐ Elite Creator</span>
                  <span className="badge badge-level">🏅 Top Creator 2024</span>
                </div>

                <p className="profile-bio-text">{profile.bio}</p>

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
                  <button className="btn-primary-sm">👤 Connect</button>
                  <button className="btn-primary-sm">✨ Collaborate</button>
                  <button className="btn-outline-sm">💬 Message</button>
                </div>
              </div>
            </div>

            {/* Trust Analysis */}
            <div className="card trust-analysis-card">
              <div className="trust-analysis-header">
                <div className="score-ring-svg-wrap" style={{ width: 80, height: 80 }}>
                  <svg width="80" height="80" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#lg-trust)" strokeWidth="10"
                      strokeDasharray="314" strokeDashoffset="57"
                      strokeLinecap="round" transform="rotate(-90 60 60)" />
                    <defs>
                      <linearGradient id="lg-trust" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c87a4a" />
                        <stop offset="100%" stopColor="#7a1f33" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="score-overlay">
                    <div className="score-ring-val" style={{ fontSize: 22 }}>92</div>
                  </div>
                </div>
                <div>
                  <div className="trend-section-title" style={{ marginBottom: 4 }}>AI Trust Analysis</div>
                  <div className="trust-analysis-sub">Score is 92 because of consistent verification &amp; delivery.</div>
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

            {/* About */}
            <div className="card" style={{ padding: 18 }}>
              <div className="trend-section-title">About</div>
              <p className="profile-bio-text" style={{ marginTop: 8 }}>{profile.bio}</p>
              <div className="about-grid">
                <div className="about-box">
                  <div className="about-label">Location</div>
                  <div className="about-value">{profile.location}</div>
                </div>
                <div className="about-box">
                  <div className="about-label">Languages</div>
                  <div className="about-value">{profile.languages.join(", ")}</div>
                </div>
                {profile.socials.filter((s) => s.connected).map((s) => (
                  <div className="about-box" key={s.platform}>
                    <div className="about-label">{s.platform}</div>
                    <div className="about-value about-value-accent">{s.handle}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Categories */}
            <div className="card" style={{ padding: 18 }}>
              <div className="trend-section-title">Content Categories</div>
              <div className="chip-grid" style={{ marginTop: 12 }}>
                {profile.contentCategories.map((c) => (
                  <span className="chip chip-active" key={c}>{c}</span>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="card" style={{ padding: 18 }}>
              <div className="portfolio-header">
                <div className="trend-section-title" style={{ marginBottom: 0 }}>Portfolio</div>
                <span className="see-all-link">See all →</span>
              </div>
              <div className="portfolio-grid">
                {PORTFOLIO_ITEMS.map((p) => (
                  <div className="portfolio-tile" style={{ background: p.bg }} key={p.id}>
                    <span>{p.emoji}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign History */}
            <div className="card trending-card">
              <div className="trend-section-title">Campaign History</div>
              <div className="campaigns-list">
                {CAMPAIGN_HISTORY.map((c) => (
                  <div className="history-row" key={c.id}>
                    <div className="brand-logo" style={c.logoStyle}>{c.id}</div>
                    <div className="history-row-info">
                      <div className="brand-name">{c.brand}</div>
                      <div className="brand-cat">{c.title}</div>
                      <div className="campaign-pills" style={{ marginTop: 6 }}>
                        {c.status === "verified" ? (
                          <span className="pill pill-budget">✓ Verified · +{c.points} pts</span>
                        ) : (
                          <span className="pill pill-dead">● Pending</span>
                        )}
                        <span className="pill pill-cat">{c.date}</span>
                      </div>
                    </div>
                    <div className="history-rating">
                      {c.rating ? `${c.rating.toFixed(1)} ★` : "In progress"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="card" style={{ padding: 18 }}>
              <div className="reviews-header">
                <div className="trend-section-title" style={{ marginBottom: 0 }}>Reviews</div>
                <div className="reviews-score">4.9 ★★★★★ <span>({REVIEWS.length})</span></div>
              </div>
              {REVIEWS.map((r) => (
                <div className="review-card" key={r.brand}>
                  <div className="review-head">
                    <div>
                      <div className="review-brand">{r.brand} <span className="badge badge-verified-g" style={{ fontSize: 10, padding: "2px 7px" }}>Verified Brand</span></div>
                      <div className="review-date">{r.date}</div>
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

      {/* RIGHT SIDEBAR */}
      <div className="right-sb">

        {!editMode && (
          <>
            <div className="right-card">
              <div className="right-title">Brand Matches</div>
              {BRAND_MATCHES.map((b) => (
                <div className="match-item" key={b.id}>
                  <div className="match-logo" style={b.logoStyle}>{b.id}</div>
                  <div>
                    <div className="match-name">{b.name}</div>
                    <div className="match-cat">{b.cat}</div>
                  </div>
                  <div className={`match-pct ${b.cls}`}>{b.pct}%</div>
                </div>
              ))}
              <button className="view-all-btn">View All Matches</button>
            </div>

            <div className="right-card">
              <div className="right-title">Analytics Snapshot</div>
              <div className="analytics-grid">
                <div className="analytics-box">
                  <div className="analytics-val">{ANALYTICS_SNAPSHOT.engagement}</div>
                  <div className="analytics-lbl">Engagement</div>
                </div>
                <div className="analytics-box">
                  <div className="analytics-val" style={{ color: "#2f8f53" }}>{ANALYTICS_SNAPSHOT.response}</div>
                  <div className="analytics-lbl">Response</div>
                </div>
                <div className="analytics-box">
                  <div className="analytics-val">{ANALYTICS_SNAPSHOT.reach}</div>
                  <div className="analytics-lbl">Total Reach</div>
                </div>
                <div className="analytics-box">
                  <div className="analytics-val" style={{ color: "#2f8f53" }}>{ANALYTICS_SNAPSHOT.avgRating}</div>
                  <div className="analytics-lbl">Avg Rating</div>
                </div>
              </div>
            </div>

            <div className="right-card">
              <div className="right-title">Availability</div>
              <div className="availability-row">
                <span className="availability-dot" style={{ background: currentAvailability?.color }} />
                <span className="availability-label" style={{ color: currentAvailability?.color }}>
                  {currentAvailability?.label}
                </span>
              </div>
              <button className="view-all-btn" onClick={() => setEditMode(true)} style={{ marginTop: 12 }}>
                Update Status
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}