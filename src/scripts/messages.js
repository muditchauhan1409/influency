// PASTE PATH: src/scripts/messages.js
import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = "http://localhost:5000/api";
const WS_URL = "ws://localhost:5000";

export function useMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null); // userId of open chat
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [followRequests, setFollowRequests] = useState([]);
  const [typingFrom, setTypingFrom] = useState(null);
  const [wsReady, setWsReady] = useState(false);

  const ws = useRef(null);
  const typingTimer = useRef(null);
  const messagesEndRef = useRef(null);
  // meId not needed - backend sends fromMe field directly

  // ── Connect WebSocket ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Guard against React Strict Mode double-mount
    let didUnmount = false;

    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      if (didUnmount) { socket.close(); return; }
      socket.send(JSON.stringify({ type: "auth", token }));
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "auth_ok") {
        setWsReady(true);
      }

      if (data.type === "message") {
        // Incoming message from another user
        const incomingMsg = {
          _id: data._id,
          sender: data.sender,
          text: data.text,
          createdAt: data.createdAt,
          fromMe: false,
        };
        // If this conversation is open, append
        if (data.sender === activeId || data.receiver === activeId) {
          setMessages((prev) => [...prev, incomingMsg]);
        }
        // Update conversation last message
        setConversations((prev) =>
          prev.map((c) =>
            c.userId.toString() === data.sender
              ? { ...c, lastMessage: { text: data.text, fromMe: false, time: data.createdAt }, unread: c.unread + 1 }
              : c
          )
        );
      }

      if (data.type === "message_sent") {
        // Our own message confirmed by server
        const sentMsg = {
          _id: data._id,
          sender: data.sender,
          text: data.text,
          createdAt: data.createdAt,
          fromMe: true,
        };
        setMessages((prev) => [...prev, sentMsg]);
        setConversations((prev) =>
          prev.map((c) =>
            c.userId.toString() === data.receiver
              ? { ...c, lastMessage: { text: data.text, fromMe: true, time: data.createdAt } }
              : c
          )
        );
      }

      if (data.type === "typing") {
        setTypingFrom(data.from);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setTypingFrom(null), 2000);
      }
    };

    socket.onclose = () => {
      if (!didUnmount) setWsReady(false);
    };

    return () => {
      didUnmount = true;
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
      ws.current = null;
    };
  }, []);

  // ── Fetch conversations ──
  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setConversations(data.conversations);
    } catch (err) {
      console.error("Fetch conversations error:", err);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ── Fetch follow requests ──
  const fetchFollowRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/follow/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setFollowRequests(data.requests);
    } catch (err) {
      console.error("Fetch follow requests error:", err);
    }
  }, []);

  useEffect(() => { fetchFollowRequests(); }, [fetchFollowRequests]);

  // ── Open a conversation ──
  const openConversation = useCallback(async (userId) => {
    setActiveId(userId);
    setMessages([]);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(
          data.messages.map((m) => ({
            ...m,
            fromMe: m.fromMe === true, // backend sends this directly
          }))
        );
        // Clear unread
        setConversations((prev) =>
          prev.map((c) => (c.userId.toString() === userId ? { ...c, unread: 0 } : c))
        );
      }
    } catch (err) {
      console.error("Open conversation error:", err);
    }
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message via WebSocket ──
  const sendMessage = useCallback(() => {
    if (!draft.trim() || !activeId || !ws.current) return;
    ws.current.send(JSON.stringify({ type: "message", receiverId: activeId, text: draft.trim() }));
    setDraft("");
  }, [draft, activeId]);

  // ── Typing indicator ──
  const handleTyping = useCallback(() => {
    if (!activeId || !ws.current) return;
    ws.current.send(JSON.stringify({ type: "typing", receiverId: activeId }));
  }, [activeId]);

  // ── Search users by username ──
  useEffect(() => {
    if (search.replace(/^@+/, "").length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const token = localStorage.getItem("token");
        const cleanQuery = search.replace(/^@+/, "");
        const res = await fetch(`${API_URL}/follow/search?q=${encodeURIComponent(cleanQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setSearchResults(data.users);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Send follow request ──
  const sendFollowRequest = useCallback(async (targetId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/follow/request/${targetId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults((prev) =>
          prev.map((u) => (u._id === targetId ? { ...u, requestSent: true } : u))
        );
      }
      return data;
    } catch (err) {
      console.error("Follow request error:", err);
    }
  }, []);

  // ── Accept follow request ──
  const acceptRequest = useCallback(async (requesterId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/follow/accept/${requesterId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowRequests((prev) => prev.filter((r) => r._id !== requesterId));
      fetchConversations(); // they might now be a mutual connection
    } catch (err) {
      console.error("Accept request error:", err);
    }
  }, [fetchConversations]);

  // ── Reject follow request ──
  const rejectRequest = useCallback(async (requesterId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/follow/reject/${requesterId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowRequests((prev) => prev.filter((r) => r._id !== requesterId));
    } catch (err) {
      console.error("Reject request error:", err);
    }
  }, []);

  // ── Delete a message ──
  const deleteMessage = useCallback(async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/messages/message/${messageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m._id?.toString() !== messageId?.toString()));
      }
    } catch (err) {
      console.error("Delete message error:", err);
    }
  }, []);

  const active = conversations.find((c) => c.userId.toString() === activeId);

  return {
    conversations,
    active,
    activeId,
    messages,
    search, setSearch,
    searchResults,
    searchLoading,
    followRequests,
    draft, setDraft,
    sendMessage,
    handleTyping,
    openConversation,
    sendFollowRequest,
    acceptRequest,
    rejectRequest,
    typingFrom,
    wsReady,
    messagesEndRef,
    deleteMessage,
    fetchConversations,
  };
}