import { useState, useEffect, useCallback, useRef } from "react";

const API = "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export function useMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [followRequests, setFollowRequests] = useState([]);
  const [draft, setDraft] = useState("");
  const [typingFrom] = useState(null);
  const messagesEndRef = useRef(null);

  const wsReady = true;

  useEffect(() => {
    fetchConversations();
    fetchFollowRequests();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API}/messages/conversations`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setConversations(data.conversations || []);
    } catch (err) {
      console.error("Fetch conversations error:", err);
    }
  };

  const fetchFollowRequests = async () => {
    try {
      const res = await fetch(`${API}/follow/requests`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setFollowRequests(data.requests || []);
    } catch (err) {
      console.error("Fetch follow requests error:", err);
    }
  };

  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/follow/search?q=${encodeURIComponent(search.trim())}`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (data.success) setSearchResults(data.users || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const openConversation = useCallback((userId) => {
    const idStr = userId.toString();
    setActiveId(idStr);

    const fromConvo = conversations.find((c) => c.userId.toString() === idStr);
    const fromSearch = searchResults.find((u) => u._id.toString() === idStr);

    if (fromConvo) {
      setActiveUser({ userId: idStr, name: fromConvo.name, username: fromConvo.username, role: fromConvo.role });
    } else if (fromSearch) {
      setActiveUser({ userId: idStr, name: fromSearch.name, username: fromSearch.username, role: fromSearch.role });
    }

    setSearch("");
  }, [conversations, searchResults]);

  useEffect(() => {
    if (!activeId) return;

    const load = async () => {
      try {
        const res = await fetch(`${API}/messages/${activeId}`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) setMessages(data.messages || []);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!draft.trim() || !activeId) return;
    const text = draft;
    setDraft("");

    try {
      const res = await fetch(`${API}/messages/${activeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { ...data.message, fromMe: true }]);
        fetchConversations();
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  }, [draft, activeId]);

  const deleteMessage = useCallback(async (messageId) => {
    if (!messageId) return;
    try {
      await fetch(`${API}/messages/message/${messageId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      console.error("Delete message error:", err);
    }
  }, []);

  const handleTyping = useCallback(() => {}, []);

  const sendFollowRequest = useCallback(async (targetId) => {
    try {
      const res = await fetch(`${API}/follow/request/${targetId}`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults((prev) =>
          prev.map((u) => (u._id === targetId ? { ...u, requestSent: true } : u))
        );
      }
    } catch (err) {
      console.error("Send follow request error:", err);
    }
  }, []);

  const acceptRequest = useCallback(async (requesterId) => {
    try {
      const res = await fetch(`${API}/follow/accept/${requesterId}`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setFollowRequests((prev) => prev.filter((r) => r._id !== requesterId));
        fetchConversations();
      }
    } catch (err) {
      console.error("Accept request error:", err);
    }
  }, []);

  const rejectRequest = useCallback(async (requesterId) => {
    try {
      await fetch(`${API}/follow/reject/${requesterId}`, {
        method: "POST",
        headers: authHeaders(),
      });
      setFollowRequests((prev) => prev.filter((r) => r._id !== requesterId));
    } catch (err) {
      console.error("Reject request error:", err);
    }
  }, []);

  const active = activeId ? activeUser : null;

  return {
    conversations,
    active,
    activeId,
    messages,
    search,
    setSearch,
    searchResults,
    searchLoading,
    followRequests,
    draft,
    setDraft,
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
  };
}
