// PASTE PATH: src/pages/UserProfile.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../scripts/dashboard";
import {
  useUserProfile,
  NICHE_OPTIONS,
  LANGUAGE_OPTIONS,
  AVAILABILITY_OPTIONS,
  RADIUS_OPTIONS,
  RESPONSE_TIME_OPTIONS,
} from "../scripts/userProfile";
import "../styles/dashboard.css";
import "../styles/userProfile.css";

export default function UserProfile({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profile,
    updateField,
    toggleNiche,
    toggleLanguage,
    updateSocial,
    handleSave,
    saved,
  } = useUserProfile();

  return (
    <div className="settings-wrap">

      {/* LEFT SIDEBAR */}
      <div className="left-sb">
        <div className="logo-block">
          <div className="logo-icon">✦</div>
          <div className="logo-text">
            <span className="logo-gold">Influ</span>
            <span className="logo-white">ency</span>
          </div>
        </div>

        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => item.path && navigate(item.path)}
          >
            <span className="nav-emoji">{item.icon}</span>
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}

        <div className="spacer" />

        <div className="trust-card">
          <div className="trust-ring-wrap">
            <svg className="ring-svg" width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="url(#lg-p)" strokeWidth="5"
                strokeDasharray="126 141" strokeLinecap="round" />
              <defs>
                <linearGradient id="lg-p" x1="0%" y1="0%" x2="100%" y2="0%">
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

      {/* MAIN CONTENT */}
      <div className="settings-main profile-main">

        <div className="settings-header">
          <div className="settings-title">My Profile</div>
          <div className="settings-sub">This is what brands see when they view your profile</div>
        </div>

        {/* Profile Header Card — full bleed */}
        <div className="profile-hero-card">
          <div className="profile-hero-cover">
            <span className="badge badge-verified-g cover-badge">✓ Verified Creator</span>
          </div>
          <div className="profile-hero-body">
            <div className="profile-hero-avatar">
              {profile.avatarEmoji}
              <div className="settings-avatar-edit">✎</div>
            </div>
            <div className="profile-hero-info">
              <input
                className="profile-name-input"
                value={profile.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              <input
                className="profile-handle-input"
                value={profile.handle}
                onChange={(e) => updateField("handle", e.target.value)}
              />
            </div>
            <div className="badge-row">
              <span className="badge badge-elite">⭐ Elite</span>
              <span className="badge badge-level">Lvl 7</span>
            </div>
          </div>
          <textarea
            className="profile-bio-input"
            value={profile.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            rows={2}
          />
        </div>

        {/* Everything below split into 2 columns */}
        <div className="profile-grid">

          {/* Availability Status */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">🟢</div>
              <div>
                <div className="settings-section-title">Availability Status</div>
                <div className="settings-section-desc">Let brands know if you're open for work</div>
              </div>
            </div>
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
            {profile.availability === "booked" && (
              <div className="settings-row" style={{ marginTop: 12 }}>
                <div className="settings-row-icon">📅</div>
                <div className="settings-row-info">
                  <div className="settings-row-label">Booked Until</div>
                  <div className="settings-row-sub">Brands will see this date</div>
                </div>
                <div className="settings-row-right">
                  <input
                    type="date"
                    className="settings-input"
                    value={profile.bookedUntil}
                    onChange={(e) => updateField("bookedUntil", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preferred Niches */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">🏷️</div>
              <div>
                <div className="settings-section-title">Preferred Niches</div>
                <div className="settings-section-desc">Brands match you based on these categories</div>
              </div>
            </div>
            <div className="chip-grid">
              {NICHE_OPTIONS.map((n) => (
                <button
                  key={n}
                  className={`chip ${profile.niches.includes(n) ? "chip-active" : ""}`}
                  onClick={() => toggleNiche(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Service Radius */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">📍</div>
              <div>
                <div className="settings-section-title">Location & Service Radius</div>
                <div className="settings-section-desc">How far from your city you're willing to work</div>
              </div>
            </div>
            <div className="settings-row">
              <div className="settings-row-icon">🏙️</div>
              <div className="settings-row-info">
                <div className="settings-row-label">Current Location</div>
                <div className="settings-row-sub">Used for nearby brand matching</div>
              </div>
              <div className="settings-row-right">
                <select
                  className="settings-select"
                  value={profile.location}
                  onChange={(e) => updateField("location", e.target.value)}
                >
                  <option>Mumbai, IN</option>
                  <option>Delhi, IN</option>
                  <option>Bangalore, IN</option>
                  <option>Pune, IN</option>
                  <option>Hyderabad, IN</option>
                </select>
              </div>
            </div>
            <div className="chip-grid" style={{ marginTop: 10 }}>
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  className={`chip ${profile.radius === r.value ? "chip-active" : ""}`}
                  onClick={() => updateField("radius", r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="radius-hint">
              📌 You'll only see and be matched to campaigns within{" "}
              <strong>
                {["remote", "national", "global"].includes(profile.radius)
                  ? RADIUS_OPTIONS.find((r) => r.value === profile.radius)?.label
                  : `${profile.radius} km of ${profile.location}`}
              </strong>
            </div>
          </div>

          {/* Social Media Handles */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">🔗</div>
              <div>
                <div className="settings-section-title">Social Media Handles</div>
                <div className="settings-section-desc">Verified handles boost your Trust Score</div>
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
                  <input
                    className="settings-input"
                    placeholder="@handle"
                    value={s.handle}
                    onChange={(e) => updateSocial(s.platform, "handle", e.target.value)}
                  />
                  <span className={`settings-tag ${s.connected ? "green" : ""}`}>
                    {s.connected ? "✓ Connected" : "Connect"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Languages Spoken */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">🗣️</div>
              <div>
                <div className="settings-section-title">Languages Spoken</div>
                <div className="settings-section-desc">Helps brands match content language preferences</div>
              </div>
            </div>
            <div className="chip-grid">
              {LANGUAGE_OPTIONS.map((l) => (
                <button
                  key={l}
                  className={`chip ${profile.languages.includes(l) ? "chip-active" : ""}`}
                  onClick={() => toggleLanguage(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">⏱️</div>
              <div>
                <div className="settings-section-title">Typical Response Time</div>
                <div className="settings-section-desc">Shown on your public profile</div>
              </div>
            </div>
            <div className="chip-grid">
              {RESPONSE_TIME_OPTIONS.map((r) => (
                <button
                  key={r}
                  className={`chip ${profile.responseTime === r ? "chip-active" : ""}`}
                  onClick={() => updateField("responseTime", r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Card */}
          <div className="settings-section profile-grid-full">
            <div className="settings-section-header">
              <div className="settings-section-icon">💰</div>
              <div>
                <div className="settings-section-title">Rate Range</div>
                <div className="settings-section-desc">Your typical collaboration budget (₹ per campaign)</div>
              </div>
            </div>
            <div className="rate-range-row">
              <div className="rate-input-group">
                <span className="rate-prefix">₹</span>
                <input
                  type="number"
                  className="settings-input"
                  value={profile.rateMin}
                  onChange={(e) => updateField("rateMin", Number(e.target.value))}
                />
              </div>
              <span className="rate-sep">to</span>
              <div className="rate-input-group">
                <span className="rate-prefix">₹</span>
                <input
                  type="number"
                  className="settings-input"
                  value={profile.rateMax}
                  onChange={(e) => updateField("rateMax", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Save bar */}
        <div className="profile-save-bar">
          <button className="settings-edit-btn save-btn" onClick={handleSave}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>

      </div> 

      </div>
  );
}