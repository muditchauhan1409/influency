// PASTE PATH: src/scripts/userProfile.js
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

export const NICHE_OPTIONS = [
  "Lifestyle", "Fashion", "Clothing", "Beauty", "Beauty Products",
  "Food", "Travel", "Fitness", "Tech", "Gaming", "Art",
  "Parenting", "Finance", "Wellness",
];

export const CONTENT_CATEGORY_OPTIONS = [
  "OOTD", "Reels", "Travel Vlogs", "Reviews", "Brand Stories", "Unboxing", "Skincare", "Hauls", "Tutorials",
];

export const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali", "Gujarati", "Punjabi",
];

export const AVAILABILITY_OPTIONS = [
  { value: "open", label: "Open to Collaborations", icon: "✅", color: "#2f8f53" },
  { value: "booked", label: "Booked Until", icon: "📅", color: "#c87a4a" },
  { value: "unavailable", label: "Temporarily Unavailable", icon: "⏸️", color: "#8a7a7e" },
  { value: "closed", label: "Not Accepting New Brands", icon: "🚫", color: "#a13b3b" },
];

export const RADIUS_OPTIONS = [
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
  { value: "remote", label: "Remote Only" },
  { value: "national", label: "National" },
  { value: "global", label: "Global" },
];

export const RESPONSE_TIME_OPTIONS = [
  "Within 1 hour", "Within a few hours", "Within a day", "Within a few days",
];

export const VERIFICATION_ITEMS = [
  { label: "Email Verified", points: 10 },
  { label: "Phone Verified", points: 10 },
  { label: "Identity Verified", points: 15 },
  { label: "Instagram Linked", points: 15 },
  { label: "48 Campaigns Completed", points: 20 },
  { label: "Response Rate 88%", points: 4 },
];

// Static placeholders — not backend-driven yet
export const PORTFOLIO_ITEMS = [
  { id: 1, emoji: "👗", bg: "linear-gradient(135deg,#3d1424,#1a0810)" },
  { id: 2, emoji: "✈️", bg: "linear-gradient(135deg,#1e2840,#0a1020)" },
  { id: 3, emoji: "☕", bg: "linear-gradient(135deg,#3a2a10,#1a1206)" },
  { id: 4, emoji: "🌿", bg: "linear-gradient(135deg,#1a3014,#0a1a08)" },
  { id: 5, emoji: "💄", bg: "linear-gradient(135deg,#3d1430,#1a0816)" },
  { id: 6, emoji: "🏛️", bg: "linear-gradient(135deg,#2a2010,#140e06)" },
];

export const CAMPAIGN_HISTORY = [
  { id: "NK", brand: "Nike", title: "Air Max Summer Campaign", status: "verified", points: 8, date: "Mar 2024", rating: 5.0, logoStyle: { background: "rgba(0,0,0,0.5)", color: "#fff" } },
  { id: "SB", brand: "Starbucks", title: "Holiday Collection Reveal", status: "verified", points: 8, date: "Dec 2023", rating: 5.0, logoStyle: { background: "rgba(245,158,11,0.15)", color: "#F59E0B" } },
  { id: "NY", brand: "Nykaa", title: "New Nude Palette Launch", status: "pending", points: 0, date: "Jun 2024", rating: null, logoStyle: { background: "rgba(236,72,153,0.15)", color: "#F472B6" } },
  { id: "BT", brand: "boAt", title: "Nirvana 521 ANC Launch", status: "verified", points: 8, date: "Oct 2023", rating: 4.8, logoStyle: { background: "rgba(99,102,241,0.15)", color: "#818CF8" } },
];

export const REVIEWS = [
  { brand: "Nike India", date: "Mar 2024", rating: 5, text: "Nikita delivered outstanding content with great audience engagement, right on schedule and full of creativity." },
  { brand: "Starbucks India", date: "Dec 2023", rating: 5, text: "Truly professional with a strong creative vision. Her holiday reels became our best-performing seasonal content." },
];

export const ANALYTICS_SNAPSHOT = {
  engagement: "6.8%",
  response: "92%",
  reach: "2.1M",
  avgRating: "4.9★",
};

const emptySocials = [
  { platform: "Instagram", icon: "📸", handle: "", followers: "", connected: false },
  { platform: "YouTube", icon: "▶️", handle: "", followers: "", connected: false },
  { platform: "TikTok", icon: "🎵", handle: "", followers: "", connected: false },
  { platform: "X (Twitter)", icon: "𝕏", handle: "", followers: "", connected: false },
];

function mapUserToProfile(user) {
  return {
    _id: user._id || null,
    name: user.name || "",
    handle: user.handle ? `@${user.handle}` : "",
    bio: user.bio || "",
    location: user.location || "",
    avatarEmoji: user.avatar || "👤",
    avatarUrl: user.avatarUrl || null,
    niches: user.niches?.length ? user.niches : [],
    contentCategories: user.contentCategories?.length ? user.contentCategories : [],
    availability: user.availability || "open",
    bookedUntil: user.bookedUntil || "",
    radius: user.radius || "50",
    languages: user.languages?.length ? user.languages : [],
    responseTime: user.responseTime || "Within a day",
    rateMin: user.rateMin || 0,
    rateMax: user.rateMax || 0,
    socials: user.socials?.length ? user.socials : emptySocials,
    followers: user.followers || 0,
    campaignsCompleted: user.campaignsCompleted || 0,
    rating: user.rating || 0,
    trustScore: user.trustScore || 0,
  };
}

export function useUserProfile() {
  const [profile, setProfile] = useState(mapUserToProfile({}));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/users/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProfile(mapUserToProfile(data.dashboard));
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInArray = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const updateSocial = (platform, key, value) => {
    setProfile((prev) => ({
      ...prev,
      socials: prev.socials.map((s) =>
        s.platform === platform
          ? { ...s, [key]: value, connected: key === "handle" ? value.length > 0 : s.connected }
          : s
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const handleClean = profile.handle.replace(/^@/, "");

      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          handle: handleClean,
          bio: profile.bio,
          location: profile.location,
          niches: profile.niches,
          contentCategories: profile.contentCategories,
          languages: profile.languages,
          availability: profile.availability,
          bookedUntil: profile.bookedUntil,
          radius: profile.radius,
          responseTime: profile.responseTime,
          rateMin: profile.rateMin,
          rateMax: profile.rateMax,
          socials: profile.socials,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Save failed:", data.message);
        return;
      }

      setProfile(mapUserToProfile(data.user));
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    updateField,
    toggleInArray,
    updateSocial,
    handleSave,
    saving,
    saved,
    editMode,
    setEditMode,
  };
}