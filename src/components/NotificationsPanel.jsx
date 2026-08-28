// PASTE PATH: src/components/NotificationsPanel.jsx
import { UserPlus, UserCheck, MessageCircle, Briefcase, Bell } from "lucide-react";
import { NOTIF_TABS } from "../scripts/notifications";
import "../styles/notifications.css";

const ICON_MAP = {
  follow_request: UserPlus,
  follow_accept: UserCheck,
  message: MessageCircle,
  campaign: Briefcase,
  system: Bell,
};

export default function NotificationsPanel({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  notifications,
  unreadCount,
  markAllRead,
  markRead,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="notif-backdrop" onClick={onClose} />
      <div className="notif-panel">
        <div className="notif-panel-header">
          <div>
            <div className="notif-panel-title">Notifications</div>
            {unreadCount > 0 && <div className="notif-panel-sub">{unreadCount} unread</div>}
          </div>
          <div className="notif-header-actions">
            {unreadCount > 0 && (
              <button className="notif-markread-btn" onClick={markAllRead}>
                Mark all read
              </button>
            )}
            <button className="notif-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="notif-tabs">
          {NOTIF_TABS.map((t) => (
            <button
              key={t.value}
              className={`notif-tab ${activeTab === t.value ? "notif-tab-active" : ""}`}
              onClick={() => setActiveTab(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="notif-empty">No notifications here yet</div>
          ) : (
            notifications.map((n) => {
              const Icon = ICON_MAP[n.type] || Bell;
              return (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? "notif-item-unread" : ""}`}
                  onClick={() => markRead(n.id)}
                >
                  <div
                    className="notif-icon"
                    style={{ background: `${n.accent}1a`, color: n.accent, border: `1px solid ${n.accent}33` }}
                  >
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <div className="notif-item-body">
                    <div className="notif-item-title">{n.title}</div>
                    <div className="notif-item-desc">{n.desc}</div>
                    <div className="notif-item-time">{n.time}</div>
                  </div>
                  {!n.read && <span className="notif-unread-dot" />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}