// PASTE PATH: src/scripts/notifications.js
import { useState, useEffect, useRef, useCallback } from "react";

import { API_URL as API, WS_URL } from "../config/api";
const WS_URL = "ws://localhost:5000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export const NOTIF_TABS = [
  { value: "all", label: "All" },
  { value: "follow_request", label: "Follows" },
  { value: "follow_accept", label: "Connections" },
  { value: "message", label: "Messages" },
  { value: "campaign", label: "Campaigns" },
  { value: "system", label: "System" },
];

// category → { icon key, accent color } — icon rendering handled in NotificationsPanel.jsx
export const NOTIF_META = {
  follow_request: { accent: "#7a1f33" },
  follow_accept: { accent: "#2f8f53" },
  message: { accent: "#6366f1" },
  campaign: { accent: "#c87a4a" },
  system: { accent: "#8a7a7e" },
};

function timeLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 7 * 86400000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function useNotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [allNotifications, setAllNotifications] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("notif-panel-open");
    } else {
      document.body.classList.remove("notif-panel-open");
    }
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // ── Initial fetch ──
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API}/notifications`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setAllNotifications(data.notifications || []);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Real WebSocket connection for live push ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", token }));
    };

    ws.onmessage = (event) => {
      let data;
      try { data = JSON.parse(event.data); } catch { return; }

      if (data.type === "notification" && data.notification) {
        setAllNotifications((prev) => [data.notification, ...prev]);
      }
    };

    ws.onerror = (err) => {
      console.error("Notification WS error:", err);
    };

    return () => {
      ws.close();
    };
  }, []);

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    setAllNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: "PATCH",
        headers: authHeaders(),
      });
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const markRead = async (id) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: "PATCH",
        headers: authHeaders(),
      });
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const notifications = (
    activeTab === "all"
      ? allNotifications
      : allNotifications.filter((n) => n.type === activeTab)
  ).map((n) => ({
    ...n,
    id: n._id,
    time: timeLabel(n.createdAt),
    accent: NOTIF_META[n.type]?.accent || "#8a7a7e",
  }));

  return {
    isOpen,
    open,
    close,
    activeTab,
    setActiveTab,
    notifications,
    unreadCount,
    markAllRead,
    markRead,
  };
}