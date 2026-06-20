// PASTE PATH: src/components/NotificationsPanel.jsx
import { NOTIFICATION_GROUPS } from "../scripts/notifications";
import "../styles/notifications.css";

export default function NotificationsPanel({ isOpen, onClose, activeTab, setActiveTab }) {
  if (!isOpen) return null;

  const TABS = ["All", "People you follow", "Comments", "Follows"];

  return (
    <>
      <div className="notif-overlay" onClick={onClose} />
      <div className="notif-panel">
        <div className="notif-header">
          <h2 className="notif-title">Notifications</h2>
          <button className="notif-close" onClick={onClose}>✕</button>
        </div>

        <div className="notif-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`notif-tab ${activeTab === tab.toLowerCase() ? "active" : ""}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="notif-request-row">
          <div className="notif-avatar-stack">
            <span className="notif-avatar">🧑‍🦱</span>
            <span className="notif-avatar overlap">👤</span>
          </div>
          <div className="notif-request-text">
            <p className="notif-name">Follow requests</p>
            <p className="notif-sub">bakchodhai_hum_1109 + 7 others</p>
          </div>
          <span className="notif-dot" />
          <span className="notif-chevron">›</span>
        </div>

        {NOTIFICATION_GROUPS.map((group) => (
          <div className="notif-group" key={group.section}>
            <p className="notif-section-label">{group.section}</p>
            {group.items.map((item) => (
              <div className="notif-row" key={item.id}>
                <span className="notif-avatar">{item.avatar}</span>
                <div className="notif-row-text">
                  <p className="notif-name">
                    {item.name} {item.verified && <span className="notif-verified">✓</span>}{" "}
                    <span className="notif-msg">{item.text}</span>
                  </p>
                  <p className="notif-time">{item.time}</p>
                </div>

                {item.type === "follow" && (
                  <button className="notif-action-btn following">{item.actionLabel}</button>
                )}

                {item.type === "follow_request" && (
                  <div className="notif-request-actions">
                    <button className="notif-action-btn confirm">Confirm</button>
                    <button className="notif-action-btn delete">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}