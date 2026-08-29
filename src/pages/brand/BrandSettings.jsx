// PASTE PATH: src/pages/brand/BrandSettings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Link2, Palette, Moon, Languages,
  Bell, Briefcase, MessageCircle, Megaphone,
  Shield, Eye, BarChart2, Lock, Package, Power,
} from "lucide-react";
import BrandSidebar from "../../components/brand/BrandSidebar";
import "../../styles/dashboard.css";
import "../../styles/settings.css";

const API_URL = "http://localhost:5000/api";

export default function BrandSettings({ darkMode, setDarkMode, onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [handle, setHandle] = useState("");
  const [handleSaving, setHandleSaving] = useState(false);
  const [handleMsg, setHandleMsg] = useState("");
  const [handleError, setHandleError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setHandle(u.username || "");
    }
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setHandle(data.user.username || "");
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({ ...stored, ...data.user, _id: data.user._id }));
        }
      } catch (err) {
        console.error("Fetch me error:", err);
      }
    };
    fetchMe();
  }, []);

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

  const handleSaveHandle = async () => {
    if (!handle.trim()) {
      setHandleError("Handle cannot be empty");
      return;
    }
    setHandleSaving(true);
    setHandleMsg("");
    setHandleError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/follow/username`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username: handle.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHandleError(data.message || "Failed to save handle");
      } else {
        setHandleMsg("Handle saved!");
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        stored.username = data.user.username;
        localStorage.setItem("user", JSON.stringify(stored));
        setUser(stored);
        setTimeout(() => setHandleMsg(""), 3000);
      }
    } catch (err) {
      setHandleError("Cannot connect to server");
    } finally {
      setHandleSaving(false);
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
      <BrandSidebar onOpenNotifications={onOpenNotifications} notifUnreadCount={notifUnreadCount} />

      {/* MAIN CONTENT */}
      <div className="settings-main">

        <div className="settings-header">
          <div className="settings-title">Settings</div>
          <div className="settings-sub">Manage your brand account, campaigns and preferences</div>
        </div>

        {/* Profile Section */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon"><User size={18} /></div>
            <div>
              <div className="settings-section-title">Company Profile</div>
              <div className="settings-section-desc">Your public identity on Influency</div>
            </div>
          </div>

          <div className="settings-avatar-row">
            <div className="settings-avatar">
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt="logo" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                : <Briefcase size={22} />}
              <div className="settings-avatar-edit">✎</div>
            </div>
            <div className="settings-avatar-info">
              <div className="settings-avatar-name">{user?.name || "—"}</div>
              <div className="settings-avatar-handle">
                {user?.username ? `@${user.username}` : "No handle set"} · {user?.location || "Location not set"}
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon"><User size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Company Name</div>
              <div className="settings-row-sub">Your registered name</div>
            </div>
            <div className="settings-row-right">
              <input className="settings-input" value={user?.name || ""} readOnly
                style={{ opacity: 0.7, cursor: "not-allowed" }} />
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon"><Mail size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Email</div>
              <div className="settings-row-sub">Used for login</div>
            </div>
            <div className="settings-row-right">
              <input className="settings-input" value={user?.email || ""} readOnly
                style={{ opacity: 0.7, cursor: "not-allowed" }} />
            </div>
          </div>

          <div className="settings-row" style={{ flexWrap: "wrap", gap: 10 }}>
            <div className="settings-row-icon"><Link2 size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Brand Handle</div>
              <div className="settings-row-sub">
                Used for search & messaging · influency.in/@{handle || "yourbrand"}
              </div>
            </div>
            <div className="settings-row-right" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: 10, color: "#7a1f33", fontWeight: 600, fontSize: 14 }}>@</span>
                <input
                  className="settings-input"
                  style={{ paddingLeft: 24, minWidth: 160 }}
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""));
                    setHandleMsg("");
                    setHandleError("");
                  }}
                  placeholder="yourbrand"
                  maxLength={30}
                />
              </div>
              <button
                className="settings-edit-btn"
                onClick={handleSaveHandle}
                disabled={handleSaving}
                style={{ background: "linear-gradient(135deg,#7a1f33,#c87a4a)", color: "#fff",
                  border: "none", padding: "8px 16px", whiteSpace: "nowrap" }}
              >
                {handleSaving ? "Saving..." : "Save"}
              </button>
            </div>
            {(handleMsg || handleError) && (
              <div style={{ width: "100%", paddingLeft: 44, fontSize: 12,
                color: handleError ? "#c0392b" : "#2f8f53" }}>
                {handleMsg || handleError}
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
            <div className="settings-section-icon"><Palette size={18} /></div>
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
            <div className="settings-row-icon"><Languages size={16} /></div>
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

        {/* Notifications */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon"><Bell size={18} /></div>
            <div>
              <div className="settings-section-title">Notifications</div>
              <div className="settings-section-desc">Choose what you want to be notified about</div>
            </div>
          </div>
          {[
            { icon: Briefcase, label: "New Creator Applications", sub: "When a creator applies to your campaign", on: true },
            { icon: MessageCircle, label: "Messages", sub: "Direct messages from creators", on: true },
            { icon: BarChart2, label: "Campaign Performance", sub: "Weekly reach & engagement summaries", on: true },
            { icon: Megaphone, label: "Platform Announcements", sub: "News and feature updates", on: false },
          ].map((n) => (
            <div className="settings-row" key={n.label}>
              <div className="settings-row-icon"><n.icon size={16} /></div>
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
            <div className="settings-section-icon"><Shield size={18} /></div>
            <div>
              <div className="settings-section-title">Privacy & Security</div>
              <div className="settings-section-desc">Control your data and account security</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon"><Eye size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Profile Visibility</div>
              <div className="settings-row-sub">Who can see your brand profile</div>
            </div>
            <div className="settings-row-right">
              <select className="settings-select">
                <option>Everyone</option>
                <option>Verified Creators Only</option>
                <option>Private</option>
              </select>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon"><BarChart2 size={16} /></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Analytics Sharing</div>
              <div className="settings-row-sub">Share campaign stats with matched creators</div>
            </div>
            <label className="toggle-wrap">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon"><Lock size={16} /></div>
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
            <div className="settings-section-icon"><Package size={18} /></div>
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