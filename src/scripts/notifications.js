// PASTE PATH: src/scripts/notifications.js
import { useState, useEffect } from "react";

export const NOTIFICATIONS = [
  { id: 1, category: "brand", icon: "🏷️", accent: "#7a1f33", title: "Nike India sent a new campaign brief", desc: "Air Max Summer '26 — budget ₹2,00,000", time: "5m ago", read: false },
  { id: 2, category: "trust", icon: "📈", accent: "#2f8f53", title: "Your Trust Score increased to 92", desc: "+4 pts from Response Rate improvement", time: "1h ago", read: false },
  { id: 3, category: "message", icon: "💬", accent: "#6366f1", title: "Aria Chen sent you a message", desc: "\"We should do a joint collab sometime...\"", time: "2h ago", read: false },
  { id: 4, category: "campaign", icon: "✅", accent: "#c87a4a", title: "Campaign marked as completed", desc: "Nike 'Air Max Summer' verified · +8 trust pts", time: "3h ago", read: true },
  { id: 5, category: "brand", icon: "🤝", accent: "#7a1f33", title: "boAt approved your collaboration request", desc: "Nirvana 521 ANC Launch", time: "Yesterday", read: true },
  { id: 6, category: "system", icon: "👁️", accent: "#8a7a7e", title: "Your profile was viewed by 12 new brands", desc: "This week", time: "Yesterday", read: true },
  { id: 7, category: "campaign", icon: "⏰", accent: "#c87a4a", title: "Nykaa campaign deadline in 2 days", desc: "New Nude Palette Launch — submit by Jun 23", time: "2d ago", read: true },
  { id: 8, category: "trust", icon: "🛡️", accent: "#2f8f53", title: "Identity verification approved", desc: "+15 Trust Score points added", time: "3d ago", read: true },
  { id: 9, category: "message", icon: "💬", accent: "#6366f1", title: "Starbucks India sent you a message", desc: "\"Excited for the next collection reveal!\"", time: "4d ago", read: true },
  { id: 10, category: "system", icon: "🔔", accent: "#8a7a7e", title: "Weekly performance report is ready", desc: "6.8% engagement · 2.1M reach", time: "1w ago", read: true },
];

export const NOTIF_TABS = [
  { value: "all", label: "All" },
  { value: "brand", label: "Brands" },
  { value: "trust", label: "Trust" },
  { value: "campaign", label: "Campaigns" },
  { value: "message", label: "Messages" },
  { value: "system", label: "System" },
];

export function useNotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [allNotifications, setAllNotifications] = useState(NOTIFICATIONS);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("notif-panel-open");
    } else {
      document.body.classList.remove("notif-panel-open");
    }
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setAllNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const notifications =
    activeTab === "all"
      ? allNotifications
      : allNotifications.filter((n) => n.category === activeTab);

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