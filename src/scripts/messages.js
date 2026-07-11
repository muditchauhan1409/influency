// PASTE PATH: src/scripts/messages.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { socket, connectSocket } from "./socket";
import { getCurrentUser } from "./auth";

const API = "http://localhost:5000/api";

const AVATAR_STYLES = [
  { background: "rgba(0,0,0,0.6)", color: "#fff" },
  { background: "linear-gradient(135deg,#3d1424,#1a0810)", color: "#fff" },
  { background: "rgba(236,72,153,0.18)", color: "#F472B6" },
  { background: "rgba(99,102,241,0.18)", color: "#818CF8" },
  { background: "linear-gradient(135deg,#0a1020,#1e2840)", color: "#fff" },
  { background: "rgba(245,158,11,0.18)", color: "#F59E0B" },
];

function styleFor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
}

function initialsFor(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function timeFor(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d`;
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
}

export function useMessages() {
  const currentUser = getCurrentUser();
  const userId = currentUser?.id;

  const [connections, setConnections] = useState([]);
  const [convos, setConvos] = useState([]); // raw conversation docs from backend
  const [messagesByConvo, setMessagesByConvo] = useState({}); // convoId -> [messages]
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");

  // Load connections (accepted follows) + existing conversations
  useEffect(() => {
    if (!userId) return;
    connectSocket(userId);

    fetch(`${API}/follow/connections/${userId}`)
      .then((r) => r.json())
      .then((res) => setConnections(res.data || []));

    fetch(`${API}/messages/conversations/${userId}`)
      .then((r) => r.json())
      .then((res) => setConvos(res.data || []));
  }, [userId]);

  // Build unified conversation list: real convos + connections without a convo yet
  const conversations = useMemo(() => {
    const list = [];
    const seenUserIds = new Set();

    convos.forEach((c) => {
      const other = c.participants?.find((p) => p._id !== userId);
      if (!other) return;
      seenUserIds.add(other._id);

      const msgs = messagesByConvo[c._id] || [];
      const mapped = msgs.map((m) => ({
        from: m.sender === userId ? "me" : "them",
        text: m.text,
        time: timeFor(m.createdAt),
      }));

      list.push({
        id: c._id,
        userId: other._id,
        name: other.name,
        type: other.role === "brand" ? "Brand" : "Creator",
        initials: initialsFor(other.name),
        avatarStyle: styleFor(other._id),
        online: false,
        unread: 0,
        messages: mapped.length
          ? mapped
          : c.lastMessage
          ? [{ from: "them", text: c.lastMessage, time: timeFor(c.lastMessageAt) }]
          : [],
      });
    });

    connections.forEach((u) => {
      if (seenUserIds.has(u._id)) return;
      list.push({
        id: `pending:${u._id}`,
        userId: u._id,
        name: u.name,
        type: u.role === "brand" ? "Brand" : "Creator",
        initials: initialsFor(u.name),
        avatarStyle: styleFor(u._id),
        online: false,
        unread: 0,
        messages: [],
      });
    });

    return list;
  }, [convos, connections, messagesByConvo, userId]);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const active = conversations.find((c) => c.id === activeId);

  // Default to first conversation once loaded
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  // Fetch messages + join room when active conversation is a real (non-pending) convo
  useEffect(() => {
    if (!activeId || activeId.startsWith("pending:")) return;

    fetch(`${API}/messages/${activeId}`)
      .then((r) => r.json())
      .then((res) => {
        setMessagesByConvo((prev) => ({ ...prev, [activeId]: res.data || [] }));
      });

    socket.emit("joinConversation", activeId);
  }, [activeId]);

  // Listen for incoming real-time messages
  useEffect(() => {
    function handleNewMessage(msg) {
      setMessagesByConvo((prev) => {
        const existing = prev[msg.conversationId] || [];
        if (existing.some((m) => m._id === msg._id)) return prev;
        return { ...prev, [msg.conversationId]: [...existing, msg] };
      });
    }
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, []);

  const openConversation = useCallback((id) => {
    setActiveId(id);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!draft.trim() || !active) return;
    const text = draft;
    setDraft("");

    let conversationId = active.id;

    // If this is a pending (no-conversation-yet) connection, create it first
    if (conversationId.startsWith("pending:")) {
      const res = await fetch(`${API}/messages/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userA: userId, userB: active.userId }),
      });
      const data = await res.json();
      conversationId = data.data._id;
      setConvos((prev) => [data.data, ...prev]);
      setActiveId(conversationId);
      socket.emit("joinConversation", conversationId);
    }

    const res = await fetch(`${API}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, sender: userId, text }),
    });
    const data = await res.json();

    setMessagesByConvo((prev) => {
      const existing = prev[conversationId] || [];
      return { ...prev, [conversationId]: [...existing, data.data] };
    });
  }, [draft, active, userId]);

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