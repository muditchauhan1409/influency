// PASTE PATH: src/pages/creator/Messages.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../scripts/dashboard";
import { useMessages } from "../../scripts/messages";
import "../../styles/dashboard.css";
import "../../styles/settings.css";
import "../../styles/messages.css";

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
};

const timeLabel = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const AVATAR_COLORS = [
  "linear-gradient(135deg,#3d1424,#1a0810)",
  "linear-gradient(135deg,#0a1020,#1e2840)",
  "linear-gradient(135deg,#0a1a08,#1a3014)",
  "linear-gradient(135deg,#7a1f33,#c87a4a)",
];

export default function Messages({ onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    conversations, active, activeId, messages,
    search, setSearch, searchResults, searchLoading,
    followRequests,
    draft, setDraft,
    sendMessage, handleTyping, openConversation,
    sendFollowRequest, acceptRequest, rejectRequest,
    typingFrom, wsReady, messagesEndRef,
    deleteMessage,
  } = useMessages();
  const [hoveredMsg, setHoveredMsg] = useState(null);

  const meId = JSON.parse(localStorage.getItem("user") || "{}")?._id;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    else handleTyping();
  };

  const showSearch = search.length >= 2;

  return (
    <div className="messages-wrap">

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

        <div className="trust-card">
          <div className="trust-ring-wrap">
            <div style={{ width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg,#7a1f33,#c87a4a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 16 }}>
              ✦
            </div>
            <div className="trust-meta">
              <div className="trust-score-big" style={{ fontSize: 13, color: wsReady ? "#2f8f53" : "#aaa" }}>
                {wsReady ? "● Live" : "○ Offline"}
              </div>
              <div className="trust-label">Messages</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONVERSATION + SEARCH LIST */}
      <div className="conv-list">
        <div className="conv-list-header">
          <div className="conv-list-title">Messages</div>
          <div className="conv-search-wrap">
            <span className="conv-search-icon">🔍</span>
            <input
              className="conv-search-input"
              placeholder="Search @username to connect"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Follow Requests */}
        {followRequests.length > 0 && !showSearch && (
          <div style={{ padding: "10px 14px 0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#7a1f33",
              textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              Follow Requests ({followRequests.length})
            </div>
            {followRequests.map((req, i) => (
              <div key={req._id} style={{ display: "flex", alignItems: "center", gap: 10,
                padding: "8px 0", borderBottom: "1px solid rgba(122,31,51,0.07)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 12, fontWeight: 700 }}>
                  {getInitials(req.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0810" }}>
                    @{req.username || req.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>{req.role}</div>
                </div>
                <button
                  onClick={() => acceptRequest(req._id)}
                  style={{ background: "#7a1f33", color: "#fff", border: "none",
                    borderRadius: 8, padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>
                  ✓
                </button>
                <button
                  onClick={() => rejectRequest(req._id)}
                  style={{ background: "rgba(122,31,51,0.08)", color: "#7a1f33", border: "none",
                    borderRadius: 8, padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search Results */}
        {showSearch ? (
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#7a1f33",
              textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              {searchLoading ? "Searching..." : `Results for "${search}"`}
            </div>
            {searchResults.length === 0 && !searchLoading && (
              <div style={{ fontSize: 13, color: "#999", textAlign: "center", padding: "20px 0" }}>
                No users found
              </div>
            )}
            {searchResults.map((u, i) => (
              <div key={u._id} style={{ display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: "1px solid rgba(122,31,51,0.07)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 13, fontWeight: 700 }}>
                  {getInitials(u.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a0810" }}>
                    @{u.username}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    {u.followersCount} followers · {u.role}
                  </div>
                </div>
                {u.isFollowing && u.isFollowedByThem ? (
                  <button
                    onClick={() => openConversation(u._id)}
                    style={{ background: "linear-gradient(135deg,#7a1f33,#c87a4a)", color: "#fff",
                      border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, cursor: "pointer" }}>
                    💬 Chat
                  </button>
                ) : u.requestSent || u.isFollowing ? (
                  <span style={{ fontSize: 11, color: "#888", padding: "6px 10px",
                    border: "1px solid #eee", borderRadius: 8 }}>
                    {u.requestSent ? "Requested" : "Following"}
                  </span>
                ) : (
                  <button
                    onClick={() => sendFollowRequest(u._id)}
                    style={{ background: "rgba(122,31,51,0.08)", color: "#7a1f33",
                      border: "1px solid rgba(122,31,51,0.2)", borderRadius: 8,
                      padding: "6px 12px", fontSize: 11, cursor: "pointer" }}>
                    + Follow
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Conversation List */
          <div className="conv-items">
            {conversations.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#999", fontSize: 13 }}>
                Search @username to find and follow people.<br />
                Once you both follow each other, you can chat!
              </div>
            ) : (
              conversations.map((c, i) => (
                <div
                  key={c.userId}
                  className={`conv-item ${c.userId.toString() === activeId ? "conv-item-active" : ""}`}
                  onClick={() => openConversation(c.userId.toString())}
                >
                  <div className="conv-avatar"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], color: "#fff",
                      fontSize: 13, fontWeight: 700 }}>
                    {getInitials(c.name)}
                  </div>
                  <div className="conv-item-info">
                    <div className="conv-item-top">
                      <span className="conv-item-name">@{c.username || c.name}</span>
                      <span className="conv-item-time">
                        {c.lastMessage ? timeLabel(c.lastMessage.time) : ""}
                      </span>
                    </div>
                    <div className="conv-item-bottom">
                      <span className="conv-item-preview">
                        {c.lastMessage
                          ? `${c.lastMessage.fromMe ? "You: " : ""}${c.lastMessage.text}`
                          : "Start a conversation"}
                      </span>
                      {c.unread > 0 && <span className="conv-unread-badge">{c.unread}</span>}
                    </div>
                    <span className={`pill conv-type-pill ${c.role === "brand" ? "pill-cat" : "pill-budget"}`}>
                      {c.role}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* CHAT PANEL */}
      <div className="chat-panel">
        {active ? (
          <>
            <div className="chat-header">
              <div className="conv-avatar chat-header-avatar"
                style={{ background: AVATAR_COLORS[0], color: "#fff", fontSize: 15, fontWeight: 700 }}>
                {getInitials(active.name)}
              </div>
              <div>
                <div className="chat-header-name">@{active.username || active.name}</div>
                <div className="chat-header-sub">
                  {active.role} · {wsReady ? "● Online" : "● Offline"}
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span className="badge badge-verified-g">✓ Connected</span>
              </div>
            </div>

            <div className="chat-thread" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "16px 24px", gap: 4 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#bbb", fontSize: 13, padding: "40px 0" }}>
                  No messages yet — say hi! 👋
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={m._id || i}
                  className={`chat-bubble-row ${m.fromMe ? "chat-row-me" : ""}`}
                  style={{ position: "relative", display: "flex", flexDirection: "column",
                    alignItems: m.fromMe ? "flex-end" : "flex-start", marginBottom: 2 }}
                  onMouseEnter={() => setHoveredMsg(m._id || i)}
                  onMouseLeave={() => setHoveredMsg(null)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6,
                    flexDirection: m.fromMe ? "row-reverse" : "row" }}>
                    <div className={`chat-bubble ${m.fromMe ? "chat-bubble-me" : "chat-bubble-them"}`}>
                      {m.text}
                    </div>
                    {m.fromMe && hoveredMsg === (m._id || i) && (
                      <button
                        onClick={() => deleteMessage(m._id)}
                        style={{ background: "rgba(192,57,43,0.1)", border: "none", borderRadius: 6,
                          padding: "3px 7px", fontSize: 11, color: "#c0392b", cursor: "pointer",
                          flexShrink: 0 }}
                        title="Delete message"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                  <span className="chat-bubble-time" style={{ fontSize: 10, color: "#bbb",
                    marginTop: 2, paddingLeft: m.fromMe ? 0 : 4, paddingRight: m.fromMe ? 4 : 0 }}>
                    {timeLabel(m.createdAt)}
                  </span>
                </div>
              ))}
              {typingFrom === active.userId && (
                <div className="chat-bubble-row">
                  <div className="chat-bubble chat-bubble-them" style={{ color: "#aaa", fontStyle: "italic" }}>
                    typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-composer">
              <input
                className="chat-input"
                placeholder={`Message @${active.username || active.name}...`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="chat-send-btn"
                onClick={sendMessage}
                disabled={!draft.trim() || !wsReady}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="chat-empty">
            <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Your Messages</div>
            <div style={{ fontSize: 13, color: "#999" }}>
              Search @username → Follow → Get followed back → Chat!
            </div>
          </div>
        )}
      </div>

    </div>
  );
}