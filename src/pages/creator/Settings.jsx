// PASTE PATH: src/pages/creator/Settings.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../scripts/dashboard";
import "../../styles/dashboard.css";
import "../../styles/settings.css";
import {
  Sparkles,
  User as UserIcon,
  Mail,
  Link2,
  Palette,
  Moon,
  Type,
  Camera,
  Play,
  Music2,
  AtSign,
  Bell,
  Briefcase,
  MessageCircle,
  Trophy,
  Megaphone,
  Lock,
  Eye,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Package,
  Power,
  Pencil,
  Star,
  CheckCircle2,
} from "lucide-react";

import { API_URL as API, WS_URL } from "../../config/api";

const LINKED_ACCOUNTS = [
  { icon: Camera, name: "Instagram", handle: "@nikitaroy", connected: true },
  { icon: Play, name: "YouTube", handle: "Nikita Roy Vlogs", connected: true },
  { icon: Music2, name: "TikTok", handle: "Not connected", connected: false },
  { icon: AtSign, name: "X (Twitter)", handle: "Not connected", connected: false },
];

export default function Settings({ darkMode, setDarkMode, onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [settings, setSettings] = useState({
    language: "English",
    notifications: {
      campaignMatches: true,
      messages: true,
      trustScoreUpdates: true,
      platformAnnouncements: false,
    },
    privacy: {
      profileVisibility: "Everyone",
      analyticsSharing: true,
      twoFactorEnabled: false,
    },
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const token = () => localStorage.getItem("token");

  // Load user + settings from backend
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setUsername(u.username || "");
    }

    const fetchMe = async () => {
      try {
        const t = token();
        if (!t) return;
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setUsername(data.user.username || "");
          const storedU = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({ ...storedU, ...data.user }));
        }
      } catch (err) {
        console.error("Fetch me error:", err);
      }
    };

    const fetchSettings = async () => {
      try {
        const t = token();
        if (!t) return;
        const res = await fetch(`${API_URL}/users/settings`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json();
        if (data.success && data.user) {
          setSettings((prev) => ({
            ...prev,
            language: data.user.language || prev.language,
            notifications: { ...prev.notifications, ...(data.user.notifications || {}) },
            privacy: { ...prev.privacy, ...(data.user.privacy || {}) },
          }));
          if (typeof data.user.darkMode === "boolean") {
            setDarkMode(data.user.darkMode);
            document.body.classList.toggle("dark", data.user.darkMode);
            localStorage.setItem("theme", data.user.darkMode ? "dark" : "light");
          }
        }
      } catch (err) {
        console.error("Fetch settings error:", err);
      } finally {
        setSettingsLoaded(true);
      }
    };

    fetchMe();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generic PATCH helper for any settings field
  const saveSettings = async (partial) => {
    try {
      const t = token();
      if (!t) return;
      await fetch(`${API_URL}/users/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify(partial),
      });
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  const handleDarkToggle = (e) => {
    const val = e.target.checked;
    setDarkMode(val);
    document.body.classList.toggle("dark", val);
    localStorage.setItem("theme", val ? "dark" : "light");
    saveSettings({ darkMode: val });
  };

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    setSettings((prev) => ({ ...prev, language: val }));
    saveSettings({ language: val });
  };

  const handleNotifToggle = (key) => (e) => {
    const val = e.target.checked;
    setSettings((prev) => {
      const next = { ...prev, notifications: { ...prev.notifications, [key]: val } };
      saveSettings({ notifications: next.notifications });
      return next;
    });
  };

  const handleVisibilityChange = (e) => {
    const val = e.target.value;
    setSettings((prev) => {
      const next = { ...prev, privacy: { ...prev.privacy, profileVisibility: val } };
      saveSettings({ privacy: next.privacy });
      return next;
    });
  };

  const handleAnalyticsToggle = (e) => {
    const val = e.target.checked;
    setSettings((prev) => {
      const next = { ...prev, privacy: { ...prev.privacy, analyticsSharing: val } };
      saveSettings({ privacy: next.privacy });
      return next;
    });
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      setUsernameError("Username cannot be empty");
      return;
    }
    setUsernameSaving(true);
    setUsernameMsg("");
    setUsernameError("");
    try {
      const res = await fetch(`${API_URL}/follow/username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUsernameError(data.message || "Failed to save username");
      } else {
        setUsernameMsg("Username saved!");
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.username = data.user.username;
        localStorage.setItem("user", JSON.stringify(stored));
        setUser(stored);
        setTimeout(() => setUsernameMsg(""), 3000);
      }
    } catch (err) {
      setUsernameError("Cannot connect to server");
    } finally {
      setUsernameSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="settings-wrap">
      {/* LEFT SIDEBAR */}
      <div className="left-sb">
        <div className="logo-block">
          <div className="logo-icon">
            <Sparkles size={16} />
          </div>
          <div className="logo-text">
            <span className="logo-gold">Influ</span>
            <span className="logo-white">ency</span>
          </div>
        </div>

        {NAV_ITEMS.map((item) => {
          const isNotif = item.label === "Notifications";
          const badgeValue = isNotif
            ? notifUnreadCount > 0
              ? notifUnreadCount
              : null
            : item.badge;
          return (
            <div
              key={item.label}
              className={`nav-item ${!isNotif && location.pathname === item.path ? "active" : ""}`}
              onClick={() => (isNotif ? onOpenNotifications?.() : item.path && navigate(item.path))}
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

        <div className="trust-card">
          <div className="trust-ring-wrap">
            <svg className="ring-svg" width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="22" fill="none" stroke="url(#lg-s)" strokeWidth="5"
                strokeDasharray="126 141" strokeLinecap="round"
              />
              <defs>
                <linearGradient id="lg-s" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c87a4a" />
                  <stop offset="100%" stopColor="#7a1f33" />
                </linearGradient>
              </defs>
            </svg>
            <div className="trust-meta">
              <div className="trust-score-big">{user?.trustScore || 0}</div>
              <div className="trust-label">Trust Score</div>
            </div>
          </div>
          <div className="badge-row">
            <span className="badge badge-elite">
              <Star size={11} fill="currentColor" /> Elite
            </span>
            <span className="badge badge-level">Lvl 7</span>
            <span className="badge badge-verified-g">
              <CheckCircle2 size={11} /> ID'd
            </span>
          </div>
          <div className="trust-user">
            {user?.name || "User"}
            {user?.username && <> <span className="trust-handle">@{user.username}</span></>}
            <br />
            <span className="trust-pts">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="settings-main">
        <div className="settings-header">
          <div className="settings-title">Settings</div>
          <div className="settings-sub">Manage your account, privacy and preferences</div>
        </div>

        {/* Profile Section */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon"><UserIcon size={15} /></div>
            <div>
              <div className="settings-section-title">Profile</div>
              <div className="settings-section-desc">Your public identity on Influency</div>
            </div>
          </div>

          <div className="settings-avatar-row">
            <div className="settings-avatar">
              {user?.avatar || <UserIcon size={22} />}
              <div className="settings-avatar-edit"><Pencil size={9} /></div>
            </div>
            <div className="settings-avatar-info">
              <div className="settings-avatar-name">{user?.name || "—"}</div>
              <div className="settings-avatar-handle">
                {user?.username ? `@${user.username}` : "No username set"} · {user?.location || "Location not set"}
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon"><UserIcon size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Display Name</div>
              <div className="settings-row-sub">Your registered name</div>
            </div>
            <div className="settings-row-right">
              <input
                className="settings-input"
                value={user?.name || ""}
                readOnly
                style={{ opacity: 0.7, cursor: "not-allowed" }}
              />
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon"><Mail size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Email</div>
              <div className="settings-row-sub">Used for login</div>
            </div>
            <div className="settings-row-right">
              <input
                className="settings-input"
                value={user?.email || ""}
                readOnly
                style={{ opacity: 0.7, cursor: "not-allowed" }}
              />
            </div>
          </div>

          <div className="settings-row" style={{ flexWrap: "wrap", gap: 10 }}>
            <div className="settings-row-icon"><Link2 size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Username</div>
              <div className="settings-row-sub">
                Used for search & messaging · influency.in/@{username || "you"}
              </div>
            </div>
            <div className="settings-row-right" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: 10, color: "#7a1f33", fontWeight: 600, fontSize: 14 }}>
                  @
                </span>
                <input
                  className="settings-input"
                  style={{ paddingLeft: 24, minWidth: 160 }}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""));
                    setUsernameMsg("");
                    setUsernameError("");
                  }}
                  placeholder="choose_username"
                  maxLength={30}
                />
              </div>
              <button
                className="settings-edit-btn"
                onClick={handleSaveUsername}
                disabled={usernameSaving}
                style={{
                  background: "linear-gradient(135deg,#7a1f33,#c87a4a)",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  whiteSpace: "nowrap",
                }}
              >
                {usernameSaving ? "Saving..." : "Save"}
              </button>
            </div>
            {(usernameMsg || usernameError) && (
              <div
                style={{
                  width: "100%",
                  paddingLeft: 44,
                  fontSize: 12,
                  color: usernameError ? "#c0392b" : "#2f8f53",
                }}
              >
                {usernameMsg || usernameError}
              </div>
            )}
            <div style={{ width: "100%", paddingLeft: 44, fontSize: 11, color: "#aaa" }}>
              3–30 characters · letters, numbers, . and _ only
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon"><Palette size={15} /></div>
            <div>
              <div className="settings-section-title">Appearance</div>
              <div className="settings-section-desc">Theme and display preferences</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon"><Moon size={16} /></div>
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
            <div className="settings-row-icon"><Type size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Language</div>
              <div className="settings-row-sub">App display language</div>
            </div>
            <div className="settings-row-right">
              <select className="settings-select" value={settings.language} onChange={handleLanguageChange}>
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
            <div className="settings-section-icon"><Link2 size={15} /></div>
            <div>
              <div className="settings-section-title">Linked Accounts</div>
              <div className="settings-section-desc">Social platforms connected to your profile</div>
            </div>
          </div>
          {LINKED_ACCOUNTS.map((acc) => (
            <div className="settings-row" key={acc.name}>
              <div className="settings-row-icon"><acc.icon size={16} /></div>
              <div className="settings-row-info">
                <div className="settings-row-label">{acc.name}</div>
                <div className="settings-row-sub">{acc.handle}</div>
              </div>
              <div className="settings-row-right">
                <span className={`settings-tag ${acc.connected ? "green" : ""}`}>
                  {acc.connected ? (
                    <>
                      <CheckCircle2 size={11} /> Connected
                    </>
                  ) : (
                    "Connect"
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon"><Bell size={15} /></div>
            <div>
              <div className="settings-section-title">Notifications</div>
              <div className="settings-section-desc">Choose what you want to be notified about</div>
            </div>
          </div>
          {[
            { icon: Briefcase, key: "campaignMatches", label: "New Campaign Matches", sub: "When a brand matches your profile" },
            { icon: MessageCircle, key: "messages", label: "Messages", sub: "Direct messages from brands" },
            { icon: Trophy, key: "trustScoreUpdates", label: "Trust Score Updates", sub: "When your score changes" },
            { icon: Megaphone, key: "platformAnnouncements", label: "Platform Announcements", sub: "News and feature updates" },
          ].map((n) => (
            <div className="settings-row" key={n.key}>
              <div className="settings-row-icon"><n.icon size={16} /></div>
              <div className="settings-row-info">
                <div className="settings-row-label">{n.label}</div>
                <div className="settings-row-sub">{n.sub}</div>
              </div>
              <label className="toggle-wrap">
                <input
                  type="checkbox"
                  checked={settings.notifications[n.key]}
                  onChange={handleNotifToggle(n.key)}
                  disabled={!settingsLoaded}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>

        {/* Privacy */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon"><Lock size={15} /></div>
            <div>
              <div className="settings-section-title">Privacy & Security</div>
              <div className="settings-section-desc">Control your data and account security</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon"><Eye size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Profile Visibility</div>
              <div className="settings-row-sub">Who can see your profile</div>
            </div>
            <div className="settings-row-right">
              <select
                className="settings-select"
                value={settings.privacy.profileVisibility}
                onChange={handleVisibilityChange}
              >
                <option>Everyone</option>
                <option>Verified Brands Only</option>
                <option>Private</option>
              </select>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon"><BarChart3 size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Analytics Sharing</div>
              <div className="settings-row-sub">Share stats with matched brands</div>
            </div>
            <label className="toggle-wrap">
              <input
                type="checkbox"
                checked={settings.privacy.analyticsSharing}
                onChange={handleAnalyticsToggle}
                disabled={!settingsLoaded}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon"><ShieldCheck size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Two-Factor Authentication</div>
              <div className="settings-row-sub">Extra security on login</div>
            </div>
            <div className="settings-row-right">
              <span className="settings-tag">Enable</span>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon"><AlertTriangle size={15} /></div>
            <div>
              <div className="settings-section-title">Account Actions</div>
              <div className="settings-section-desc">Manage or exit your account</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon"><Package size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Export My Data</div>
              <div className="settings-row-sub">Download all your Influency data</div>
            </div>
            <div className="settings-row-right">
              <button className="settings-edit-btn">Export</button>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon"><Power size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Logout</div>
              <div className="settings-row-sub">Sign out of your account</div>
            </div>
            <div className="settings-row-right">
              <button className="settings-danger-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}