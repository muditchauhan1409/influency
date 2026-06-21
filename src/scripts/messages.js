// PASTE PATH: src/scripts/messages.js
import { useState } from "react";

export const CONVERSATIONS = [
  {
    id: "nike",
    name: "Nike India",
    type: "Brand",
    initials: "NK",
    avatarStyle: { background: "rgba(0,0,0,0.6)", color: "#fff" },
    online: true,
    messages: [
      { from: "them", text: "Hey Nikita! Loved how the Air Max reel turned out 🔥", time: "10:02 AM" },
      { from: "me", text: "Thank you! Glad the team liked it 😊", time: "10:05 AM" },
      { from: "them", text: "Let's lock the next deliverable date — can you do Friday?", time: "10:06 AM" },
    ],
  },
  {
    id: "ariachen",
    name: "Aria Chen",
    type: "Creator",
    initials: "AC",
    avatarStyle: { background: "linear-gradient(135deg,#3d1424,#1a0810)", color: "#fff" },
    online: true,
    messages: [
      { from: "them", text: "Hey! Saw your Nykaa collab, the edits were stunning ✨", time: "Yesterday" },
      { from: "me", text: "Thank you Aria! Yours too, loved the travel reel", time: "Yesterday" },
      { from: "them", text: "We should do a joint collab sometime, I'll DM the brand", time: "9:14 AM" },
    ],
  },
  {
    id: "nykaa",
    name: "Nykaa",
    type: "Brand",
    initials: "NY",
    avatarStyle: { background: "rgba(236,72,153,0.18)", color: "#F472B6" },
    online: false,
    messages: [
      { from: "them", text: "Hi Nikita, sending over the brief for the new Nude Palette launch.", time: "Mon" },
      { from: "them", text: "Budget is ₹80,000 for 2 reels + 4 stories. Let us know!", time: "Mon" },
    ],
  },
  {
    id: "boat",
    name: "boAt Lifestyle",
    type: "Brand",
    initials: "BT",
    avatarStyle: { background: "rgba(99,102,241,0.18)", color: "#818CF8" },
    online: false,
    messages: [
      { from: "me", text: "Sharing the final Nirvana 521 unboxing video, ready for review!", time: "2d" },
      { from: "them", text: "This looks amazing, approved! Releasing payment today.", time: "2d" },
    ],
  },
  {
    id: "zoe",
    name: "Zoe Williams",
    type: "Creator",
    initials: "ZW",
    avatarStyle: { background: "linear-gradient(135deg,#0a1020,#1e2840)", color: "#fff" },
    online: false,
    messages: [
      { from: "them", text: "Hey, are you free for a quick call about the travel campaign?", time: "3d" },
    ],
  },
  {
    id: "starbucks",
    name: "Starbucks India",
    type: "Brand",
    initials: "SB",
    avatarStyle: { background: "rgba(245,158,11,0.18)", color: "#F59E0B" },
    online: false,
    messages: [
      { from: "them", text: "Your holiday collection reel drove our best seasonal engagement!", time: "1w" },
      { from: "me", text: "So glad to hear that! Excited for the next one 🎉", time: "1w" },
    ],
  },
];

export function useMessages() {
  const [conversations, setConversations] = useState(
    CONVERSATIONS.map((c) => ({
      ...c,
      unread: c.id === "nike" ? 2 : c.id === "ariachen" ? 1 : 0,
    }))
  );
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");

  const active = conversations.find((c) => c.id === activeId);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openConversation = (id) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const sendMessage = () => {
    if (!draft.trim()) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { from: "me", text: draft, time: "Now" }] }
          : c
      )
    );
    setDraft("");
  };

  return {
    conversations: filtered,
    active,
    activeId,
    search,
    setSearch,
    draft,
    setDraft,
    sendMessage,
    openConversation,
  };
}