// PASTE PATH: src/scripts/discover.js
import { useState, useEffect } from "react";

import { API_URL } from "../config/api";

export const NICHE_FILTERS = [
  "All", "Fashion", "Beauty", "Tech", "Fitness", "Food", "Travel", "Gaming", "Lifestyle",
];

const AVATAR_STYLES = [
  "linear-gradient(135deg,#7a1f33,#c87a4a)",
  "linear-gradient(135deg,#4a6fa5,#7a1f33)",
  "linear-gradient(135deg,#2f8f53,#7a1f33)",
  "linear-gradient(135deg,#c87a4a,#7a1f33)",
  "linear-gradient(135deg,#a0364a,#c87a4a)",
  "linear-gradient(135deg,#6366f1,#7a1f33)",
  "linear-gradient(135deg,#2a1a1f,#7a1f33)",
  "linear-gradient(135deg,#7a1f33,#2f8f53)",
];

function styleFor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
}

function initialsFor(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export function useDiscover() {
  const [view, setView] = useState("creators"); // "creators" | "brands"
  const [query, setQuery] = useState("");
  const [activeNiche, setActiveNiche] = useState("All");

  const [creators, setCreators] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchDiscover();
    }, 300); // debounce query typing
    return () => clearTimeout(t);
  }, [view, query, activeNiche]);

  const fetchDiscover = async () => {
    setLoading(true);
    try {
      const role = view === "creators" ? "creator" : "brand";
      const params = new URLSearchParams({ role });
      if (view === "creators" && activeNiche !== "All") params.set("niche", activeNiche);
      if (query.trim()) params.set("q", query.trim());

      const res = await fetch(`${API_URL}/follow/discover?${params.toString()}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) return;

      if (view === "creators") {
        setCreators(
          data.users.map((u) => ({
            id: u._id,
            emoji: u.avatarUrl ? null : "👤",
            avatarUrl: u.avatarUrl,
            name: u.name,
            handle: u.username ? `@${u.username}` : "",
            niche: u.niches?.[0] || "—",
            followers: u.followersCount >= 1000 ? `${(u.followersCount / 1000).toFixed(1)}K` : `${u.followersCount}`,
            trust: u.trustScore,
            bg: styleFor(u._id),
            initials: initialsFor(u.name),
            isFollowing: u.isFollowing,
            requestSent: u.requestSent,
          }))
        );
      } else {
        setBrands(
          data.users.map((u) => ({
            id: u._id,
            initials: initialsFor(u.name),
            avatarUrl: u.avatarUrl,
            name: u.name,
            category: u.niches?.join(", ") || "—",
            openCampaigns: u.openCampaigns || 0,
            bg: styleFor(u._id),
            isFollowing: u.isFollowing,
            requestSent: u.requestSent,
          }))
        );
      }
    } catch (err) {
      console.error("Discover fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendFollowRequest = async (targetId) => {
    try {
      const res = await fetch(`${API_URL}/follow/request/${targetId}`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setCreators((prev) => prev.map((c) => (c.id === targetId ? { ...c, requestSent: true } : c)));
        setBrands((prev) => prev.map((b) => (b.id === targetId ? { ...b, requestSent: true } : b)));
      }
      return data;
    } catch (err) {
      return { success: false, message: "Cannot connect to server" };
    }
  };

  return {
    view,
    setView,
    query,
    setQuery,
    activeNiche,
    setActiveNiche,
    filteredCreators: creators,
    filteredBrands: brands,
    loading,
    sendFollowRequest,
  };
}