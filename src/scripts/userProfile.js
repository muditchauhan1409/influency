// PASTE PATH: src/scripts/userProfile.js
import { useState, useEffect } from "react";

const STORAGE_KEY = "influency_user_profile";

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

const defaultProfile = {
  name: "Nikita Roy",
  handle: "@nikitaroy",
  bio: "Fashion-forward content creator from Mumbai obsessed with sustainable style, boutique travel, and the art of everyday elegance. I work with brands that actually believe in quality over quantity. 🌸",
  location: "Mumbai, IN",
  avatarEmoji: "👩‍🎨",
  niches: ["Fashion", "Lifestyle", "Travel"],
  contentCategories: ["OOTD", "Reels", "Travel Vlogs", "Reviews", "Brand Stories", "Unboxing", "Skincare"],
  availability: "open",
  bookedUntil: "",
  radius: "50",
  languages: ["English", "Hindi"],
  responseTime: "Within a day",
  rateMin: 5000,
  rateMax: 25000,
  socials: [
    { platform: "Instagram", icon: "📸", handle: "@nikitaroy", followers: "120K", connected: true },
    { platform: "YouTube", icon: "▶️", handle: "Nikita Roy", followers: "34K", connected: true },
    { platform: "TikTok", icon: "🎵", handle: "", followers: "", connected: false },
    { platform: "X (Twitter)", icon: "𝕏", handle: "", followers: "", connected: false },
  ],
};

export function useUserProfile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProfile(JSON.parse(stored));
    } catch {
      // corrupt/missing storage — keep defaults
    }
  }, []);

  const updateField = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleInArray = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
    setSaved(false);
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
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return {
    profile,
    updateField,
    toggleInArray,
    updateSocial,
    handleSave,
    saved,
    editMode,
    setEditMode,
  };
}