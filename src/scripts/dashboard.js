// PASTE PATH: src/scripts/dashboard.js
import nikeLogo from "../assets/logos/nike.svg";
import nykaaLogo from "../assets/logos/nykaa.svg";
import boatLogo from "../assets/logos/boat.svg";
import starbucksLogo from "../assets/logos/starbucks.svg";
import {
  Home, Compass, Briefcase, MessageCircle,
  Bell, User, BarChart2, Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { icon: Home,          label: "Home",           path: "/dashboard" },
  { icon: Compass,       label: "Discover",        path: "/discover" },
  { icon: Briefcase,     label: "Collaborations",  path: "/collaborations", badge: 3 },
  { icon: MessageCircle, label: "Messages",         path: "/messages", badge: 7 },
  { icon: Bell,          label: "Notifications",   path: "/notifications" },
  { icon: User,          label: "Profile",          path: "/profile" },
  { icon: BarChart2,     label: "Analytics",        path: "/analytics" },
  { icon: Settings,      label: "Settings",         path: "/settings" },
];

export const CAMPAIGNS = [
  { id: "NK", logo: nikeLogo, name: "Nike India", cat: "Sports & Fashion", budget: "₹2,00,000", tag: "Fashion", closes: "4d", logoStyle: { background: "#000" } },
  { id: "NY", logo: nykaaLogo, name: "Nykaa", cat: "Beauty & Wellness", budget: "₹80,000", tag: "Beauty", closes: "7d", logoStyle: { background: "rgba(236,72,153,0.15)" } },
  { id: "BT", logo: boatLogo, name: "boAt Lifestyle", cat: "Tech & Lifestyle", budget: "₹1,20,000", tag: "Tech", closes: "2d", logoStyle: { background: "rgba(99,102,241,0.15)" } },
];

export const BRAND_MATCHES = [
  { id: "NK", logo: nikeLogo, name: "Nike", cat: "Sports", pct: 98, cls: "pct-98", logoStyle: { background: "#000" } },
  { id: "NY", logo: nykaaLogo, name: "Nykaa", cat: "Beauty", pct: 96, cls: "pct-96", logoStyle: { background: "rgba(236,72,153,0.12)" } },
  { id: "BT", logo: boatLogo, name: "boAt", cat: "Tech", pct: 94, cls: "pct-94", logoStyle: { background: "rgba(99,102,241,0.12)" } },
  { id: "SB", logo: starbucksLogo, name: "Starbucks", cat: "Lifestyle", pct: 91, cls: "pct-91", logoStyle: { background: "rgba(245,158,11,0.12)" } },
];

export const CREATORS = [
  { emoji: "👗", name: "Aria Chen", sub: "Fashion · 2.4M · Trust 94", bg: "linear-gradient(135deg,#1a0810,#3d1424)" },
  { emoji: "✈️", name: "Zoe Williams", sub: "Travel · 1.7M · Trust 91", bg: "linear-gradient(135deg,#0a1020,#1e2840)" },
  { emoji: "💪", name: "Kai Nakamura", sub: "Fitness · 620K · Trust 83", bg: "linear-gradient(135deg,#0a1a08,#1a3014)" },
  { emoji: "🍜", name: "Marco Rivera", sub: "Food · 890K · Trust 87", bg: "linear-gradient(135deg,#1a1a0a,#2a2810)" },
];

export const SCORE_FACTORS = [
  { label: "Identity Verified", val: "+15", color: "#22C55E" },
  { label: "Instagram Linked", val: "+15", color: "#22C55E" },
  { label: "48 Campaigns Done", val: "+20", color: "#22C55E" },
  { label: "Response Rate 88%", val: "+4", color: "#F59E0B" },
];

// ===== REAL API HOOK =====
import { useState, useEffect } from "react";

import { API_URL } from "../config/api";

export function useDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/users/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.dashboard);
        localStorage.setItem("user", JSON.stringify(data.dashboard));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file) => {
    if (!file) return;
    setAvatarUploading(true);
    setAvatarError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch(`${API_URL}/users/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setAvatarError(data.message || "Upload failed");
        return;
      }
      setUser((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
      localStorage.setItem("user", JSON.stringify({ ...user, avatarUrl: data.avatarUrl }));
    } catch (err) {
      setAvatarError("Cannot connect to server");
    } finally {
      setAvatarUploading(false);
    }
  };

  return {
    user, loading,
    uploadAvatar, avatarUploading, avatarError,
    refetch: fetchDashboard,
  };
}