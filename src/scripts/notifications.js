// PASTE PATH: src/scripts/notifications.js
import { useState } from "react";

export const NOTIFICATION_GROUPS = [
  {
    section: "Yesterday",
    items: [
      {
        id: "n1",
        avatar: "🧑",
        name: "vee_daily19",
        verified: true,
        text: "mentioned you in a comment: Nice! Check your DMs!",
        time: "1d",
        type: "mention",
      },
    ],
  },
  {
    section: "This week",
    items: [
      {
        id: "n2",
        avatar: "🏃",
        name: "unfilteredmaahii",
        text: "started following you.",
        time: "2d",
        type: "follow",
        actionLabel: "Following",
      },
      {
        id: "n3",
        avatar: "👤",
        name: "deepikaaa.007",
        text: "started following you.",
        time: "2d",
        type: "follow",
        actionLabel: "Following",
      },
      {
        id: "n4",
        avatar: "👩",
        name: "mehika_jain",
        text: "requested to follow you.",
        time: "4d",
        type: "follow_request",
      },
      {
        id: "n5",
        avatar: "🧑‍🤝‍🧑",
        name: "pluthra22",
        text: "mentioned you in a comment: @you",
        time: "5d",
        type: "mention",
      },
    ],
  },
];

export function useNotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((v) => !v);

  return { isOpen, open, close, toggle, activeTab, setActiveTab };
}