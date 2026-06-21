// PASTE PATH: src/pages/Collaborations.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../scripts/dashboard";
import { COLLAB_TABS, useCollaborations } from "../scripts/collaborations";
import "../styles/dashboard.css";
import "../styles/collaborations.css";

export default function Collaborations({ onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab, setActiveTab, filtered, counts } = useCollaborations();

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
              <span className="nav-emoji">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {badgeValue && <span className="nav-badge">{badgeValue}</span>}
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="discover-main">

        <div className="discover-header">
          <div className="discover-title">Collaborations</div>
          <div className="discover-sub">Track your brand partnerships from start to finish</div>
        </div>

        <div className="collab-tabs">
          {COLLAB_TABS.map((tab) => (
            <button
              key={tab}
              className={`collab-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="collab-tab-count">{counts[tab]}</span>
            </button>
          ))}
        </div>

        <div className="collab-list">
          {filtered.map((c) => (
            <div className="collab-card" key={c.id}>
              <div className="collab-card-logo" style={{ background: c.bg }}>
                {c.initials}
              </div>

              <div className="collab-card-info">
                <div className="collab-card-top">
                  <div className="collab-card-brand">{c.brand}</div>
                  <span className={`collab-status-tag ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </div>
                <div className="collab-card-campaign">{c.campaign}</div>
                <div className="collab-card-meta">
                  <span>{c.budget}</span>
                  <span className="collab-dot">•</span>
                  <span>{c.deadline}</span>
                  {c.earnedTrust && (
                    <>
                      <span className="collab-dot">•</span>
                      <span className="collab-trust-earned">+{c.earnedTrust} trust pts earned</span>
                    </>
                  )}
                </div>

                {c.status === "Active" && (
                  <div className="collab-progress-bar">
                    <span style={{ width: `${c.progress}%` }} />
                  </div>
                )}
              </div>

              <div className="collab-card-actions">
                {c.status === "Active" && (
                  <button className="collab-action-btn primary">View Details</button>
                )}
                {c.status === "Pending" && (
                  <>
                    <button className="collab-action-btn primary">Accept</button>
                    <button className="collab-action-btn outline">Decline</button>
                  </>
                )}
                {c.status === "Completed" && (
                  <button className="collab-action-btn outline">View Summary</button>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="discover-empty">No {activeTab.toLowerCase()} collaborations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}