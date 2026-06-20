import { useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../scripts/dashboard";
import "../styles/dashboard.css";
import "../styles/settings.css";

export default function Settings({  darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const handleDarkToggle = (e) => {
    const val = e.target.checked;
    setDarkMode(val);
    if (val) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="settings-wrap">

      {/* LEFT SIDEBAR — same as dashboard */}
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
            className={`nav-item ${item.label === "Settings" ? "active" : ""}`}
            onClick={() => navigate(item.label === "Settings" ? "/settings" : "/dashboard")}
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
              <circle cx="28" cy="28" r="22" fill="none" stroke="url(#lg-s)" strokeWidth="5"
                strokeDasharray="126 141" strokeLinecap="round" />
              <defs>
                <linearGradient id="lg-s" x1="0%" y1="0%" x2="100%" y2="0%">
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
            Nikita Roy <span className="trust-handle">@nikitaroy</span><br />
            <span className="trust-pts">↑ +4 pts this week</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="settings-main">

        <div className="settings-header">
          <div className="settings-title">Settings</div>
          <div className="settings-sub">Manage your account, privacy and preferences</div>
        </div>

        {/* Profile */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon">👤</div>
            <div>
              <div className="settings-section-title">Profile</div>
              <div className="settings-section-desc">Your public creator identity</div>
            </div>
          </div>
          <div className="settings-avatar-row">
            <div className="settings-avatar">
              👩‍🎨
              <div className="settings-avatar-edit">✎</div>
            </div>
            <div className="settings-avatar-info">
              <div className="settings-avatar-name">Nikita Roy</div>
              <div className="settings-avatar-handle">@nikitaroy · Mumbai, IN</div>
            </div>
            
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">📛</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Display Name</div>
              <div className="settings-row-sub">Shown on your public profile</div>
            </div>
            <div className="settings-row-right">
              <input className="settings-input" defaultValue="Nikita Roy" />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">🔗</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Username</div>
              <div className="settings-row-sub">influency.in/@nikitaroy</div>
            </div>
            <div className="settings-row-right">
              <input className="settings-input" defaultValue="@nikitaroy" />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">📍</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Location</div>
              <div className="settings-row-sub">Used for brand matching</div>
            </div>
            <div className="settings-row-right">
              <select className="settings-select">
                <option>Mumbai, IN</option>
                <option>Delhi, IN</option>
                <option>Bangalore, IN</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon">🎨</div>
            <div>
              <div className="settings-section-title">Appearance</div>
              <div className="settings-section-desc">Theme and display preferences</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">🌙</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Dark Mode</div>
              <div className="settings-row-sub">Switch to dark theme</div>
            </div>
            <div className="settings-row-right">
              <label className="toggle-wrap">
                <input type="checkbox" checked={darkMode} onChange={handleDarkToggle} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">🔤</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Language</div>
              <div className="settings-row-sub">App display language</div>
            </div>
            <div className="settings-row-right">
              <select className="settings-select">
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon">🔗</div>
            <div>
              <div className="settings-section-title">Linked Accounts</div>
              <div className="settings-section-desc">Social platforms connected to your profile</div>
            </div>
          </div>
          {[
            { icon: "📸", name: "Instagram", handle: "@nikitaroy", connected: true },
            { icon: "▶️", name: "YouTube", handle: "Nikita Roy Vlogs", connected: true },
            { icon: "🎵", name: "TikTok", handle: "Not connected", connected: false },
            { icon: "𝕏", name: "X (Twitter)", handle: "Not connected", connected: false },
          ].map((acc) => (
            <div className="settings-row" key={acc.name}>
              <div className="settings-row-icon">{acc.icon}</div>
              <div className="settings-row-info">
                <div className="settings-row-label">{acc.name}</div>
                <div className="settings-row-sub">{acc.handle}</div>
              </div>
              <div className="settings-row-right">
                <span className={`settings-tag ${acc.connected ? "green" : ""}`}>
                  {acc.connected ? "✓ Connected" : "Connect"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon">🔔</div>
            <div>
              <div className="settings-section-title">Notifications</div>
              <div className="settings-section-desc">Choose what you want to be notified about</div>
            </div>
          </div>
          {[
            { icon: "💼", label: "New Campaign Matches", sub: "When a brand matches your profile", on: true },
            { icon: "💬", label: "Messages", sub: "Direct messages from brands", on: true },
            { icon: "🏆", label: "Trust Score Updates", sub: "When your score changes", on: true },
            { icon: "📣", label: "Platform Announcements", sub: "News and feature updates", on: false },
          ].map((n) => (
            <div className="settings-row" key={n.label}>
              <div className="settings-row-icon">{n.icon}</div>
              <div className="settings-row-info">
                <div className="settings-row-label">{n.label}</div>
                <div className="settings-row-sub">{n.sub}</div>
              </div>
              <label className="toggle-wrap">
                <input type="checkbox" defaultChecked={n.on} />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>

        {/* Privacy */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon">🔒</div>
            <div>
              <div className="settings-section-title">Privacy & Security</div>
              <div className="settings-section-desc">Control your data and account security</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">👁️</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Profile Visibility</div>
              <div className="settings-row-sub">Who can see your profile</div>
            </div>
            <div className="settings-row-right">
              <select className="settings-select">
                <option>Everyone</option>
                <option>Verified Brands Only</option>
                <option>Private</option>
              </select>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">📊</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Analytics Sharing</div>
              <div className="settings-row-sub">Share stats with matched brands</div>
            </div>
            <label className="toggle-wrap">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">🛡️</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Two-Factor Authentication</div>
              <div className="settings-row-sub">Extra security on login</div>
            </div>
            <div className="settings-row-right">
              <span className="settings-tag">Enable</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon">⚠️</div>
            <div>
              <div className="settings-section-title">Danger Zone</div>
              <div className="settings-section-desc">Irreversible account actions</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">📦</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Export My Data</div>
              <div className="settings-row-sub">Download all your Influency data</div>
            </div>
            <div className="settings-row-right">
              <button className="settings-edit-btn">Export</button>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">🗑️</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Delete Account</div>
              <div className="settings-row-sub">Permanently remove your account</div>
            </div>
            <div className="settings-row-right">
              <button className="settings-danger-btn">Delete</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}