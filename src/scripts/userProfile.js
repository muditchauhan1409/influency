// PASTE PATH: src/scripts/userProfile.js
import { useState, useEffect } from "react";

const STORAGE_KEY = "influency_user_profile";

export const NICHE_OPTIONS = [
  "Lifestyle", "Fashion", "Clothing", "Beauty", "Beauty Products",
  "Food", "Travel", "Fitness", "Tech", "Gaming", "Art",
  "Parenting", "Finance", "Wellness",
];

export const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali", "Gujarati", "Punjabi",
];

export const AVAILABILITY_OPTIONS = [
  { value: "open", label: "Open to Collab", icon: "✅", color: "#2f8f53" },
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

const defaultProfile = {
  name: "Nikita Roy",
  handle: "@nikitaroy",
  bio: "Fashion & Lifestyle Creator sharing real stories through reels, edits, and honest reviews.",
  location: "Mumbai, IN",
  avatarEmoji: "👩‍🎨",
  niches: ["Fashion", "Beauty", "Lifestyle"],
  availability: "open",
  bookedUntil: "",
  radius: "50",
  languages: ["English", "Hindi"],
  responseTime: "Within a day",
  rateMin: 5000,
  rateMax: 25000,
  socials: [
    { platform: "Instagram", icon: "📸", handle: "@nikitaroy", followers: "120K", connected: true },
    { platform: "YouTube", icon: "▶️", handle: "Nikita Roy Vlogs", followers: "34K", connected: true },
    { platform: "TikTok", icon: "🎵", handle: "", followers: "", connected: false },
    { platform: "X (Twitter)", icon: "𝕏", handle: "", followers: "", connected: false },
  ],
};

export function useUserProfile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProfile(JSON.parse(stored));
    } catch {
      // ignore corrupt storage, fall back to defaults
    }
  }, []);

  const updateField = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleNiche = (niche) => {
    setProfile((prev) => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter((n) => n !== niche)
        : [...prev.niches, niche],
    }));
    setSaved(false);
  };

  const toggleLanguage = (lang) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
    setSaved(false);
  };

  const updateSocial = (platform, key, value) => {
    setProfile((prev) => ({
      ...prev,
      socials: prev.socials.map((s) =>
        s.platform === platform ? { ...s, [key]: value, connected: key === "handle" ? value.length > 0 : s.connected } : s
      ),
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return {
    profile,
    updateField,
    toggleNiche,
    toggleLanguage,
    updateSocial,
    handleSave,
    saved,
  };
}