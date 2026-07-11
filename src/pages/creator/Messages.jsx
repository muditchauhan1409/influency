// PASTE PATH: src/pages/Messages.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../scripts/dashboard";
import { useMessages } from "../../scripts/messages";
import "../../styles/dashboard.css";
import "../../styles/settings.css";
import "../../styles/messages.css";

export default function Messages({ onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    conversations,
    active,
    activeId,
    search,
    setSearch,
    draft,
    setDraft,
    sendMessage,
    openConversation,
  } = useMessages();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="messages-wrap">

      {/* LEFT SIDEBAR — same collapsible sidebar as everywhere else */}
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
              <circle cx="28" cy="28" r="22" fill="none" stroke="url(#lg-msg)" strokeWidth="5"
                strokeDasharray="126 141" strokeLinecap="round" />
              <defs>
                <linearGradient id="lg-msg" x1="0%" y1="0%" x2="100%" y2="0%">
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

      {/* CONVERSATION LIST */}
      <div className="conv-list">
        <div className="conv-list-header">
          <div className="conv-list-title">Messages</div>
          <div className="conv-search-wrap">
            <span className="conv-search-icon">🔍</span>
            <input
              className="conv-search-input"
              placeholder="Search brands or creators"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="conv-items">
          {conversations.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <div
                key={c.id}
                className={`conv-item ${c.id === activeId ? "conv-item-active" : ""}`}
                onClick={() => openConversation(c.id)}
              >
                <div className="conv-avatar" style={c.avatarStyle}>
                  {c.initials}
                  {c.online && <span className="conv-online-dot" />}
                </div>
                <div className="conv-item-info">
                  <div className="conv-item-top">
                    <span className="conv-item-name">{c.name}</span>
                    <span className="conv-item-time">{last?.time}</span>
                  </div>
                  <div className="conv-item-bottom">
                    <span className="conv-item-preview">{last?.from === "me" ? "You: " : ""}{last?.text}</span>
                    {c.unread > 0 && <span className="conv-unread-badge">{c.unread}</span>}
                  </div>
                  <span className={`pill conv-type-pill ${c.type === "Brand" ? "pill-cat" : "pill-budget"}`}>
                    {c.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT PANEL */}
      <div className="chat-panel">
        {active ? (
          <>
            <div className="chat-header">
              <div className="conv-avatar chat-header-avatar" style={active.avatarStyle}>
                {active.initials}
                {active.online && <span className="conv-online-dot" />}
              </div>
              <div>
                <div className="chat-header-name">{active.name}</div>
                <div className="chat-header-sub">
                  {active.type} {active.online ? "· Online" : "· Offline"}
                </div>
              </div>
            </div>

            <div className="chat-thread">
              {active.messages.map((m, i) => (
                <div className={`chat-bubble-row ${m.from === "me" ? "chat-row-me" : ""}`} key={i}>
                  <div className={`chat-bubble ${m.from === "me" ? "chat-bubble-me" : "chat-bubble-them"}`}>
                    {m.text}
                  </div>
                  <span className="chat-bubble-time">{m.time}</span>
                </div>
              ))}
            </div>

            <div className="chat-composer">
              <input
                className="chat-input"
                placeholder={`Message ${active.name}...`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="chat-send-btn" onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-empty">Select a conversation to start chatting</div>
        )}
      </div>

    </div>
  );
}