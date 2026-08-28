// scripts/brandProfile.js
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ─── Static Option Lists ─── */
export const INDUSTRY_OPTIONS = [
  "Fashion & Apparel", "Beauty & Skincare", "Food & Beverage", "Tech & Gadgets",
  "Health & Wellness", "Travel & Hospitality", "Home & Decor", "Automotive",
  "Finance & Fintech", "Education & E-Learning", "Sports & Fitness", "Gaming",
  "Entertainment & Media", "Retail & E-Commerce", "Real Estate",
];

export const CAMPAIGN_TYPE_OPTIONS = [
  "Sponsored Posts", "Product Reviews", "Unboxing", "Brand Ambassadorship",
  "Event Coverage", "Affiliate Marketing", "Giveaways", "UGC (User-Generated Content)",
  "YouTube Integrations", "Reels / Shorts",
];

export const PLATFORM_OPTIONS = [
  "Instagram", "YouTube", "Twitter / X", "LinkedIn", "Facebook",
  "Snapchat", "Pinterest", "Moj", "Josh", "ShareChat",
];

export const COMPANY_SIZE_OPTIONS = [
  { value: "startup", label: "Startup (1–10)" },
  { value: "small", label: "Small (11–50)" },
  { value: "mid", label: "Mid-size (51–200)" },
  { value: "large", label: "Large (200+)" },
  { value: "enterprise", label: "Enterprise" },
];

export const BUDGET_RANGE_OPTIONS = [
  { value: "micro", label: "₹5K – ₹25K" },
  { value: "small", label: "₹25K – ₹1L" },
  { value: "mid", label: "₹1L – ₹5L" },
  { value: "large", label: "₹5L – ₹25L" },
  { value: "enterprise", label: "₹25L+" },
];

export const VERIFICATION_ITEMS = [
  { label: "GST / Business Registration verified", points: 20 },
  { label: "Brand website linked & active", points: 10 },
  { label: "First campaign completed", points: 15 },
  { label: "Payment method on file", points: 10 },
  { label: "Creator reviews received", points: 15 },
  { label: "Profile fully filled", points: 10 },
];

/* ─── Default brand profile shape ─── */
const DEFAULT_PROFILE = {
  _id: null,
  companyName: "",
  handle: "",
  tagline: "",
  logoUrl: "",
  logoEmoji: "🏢",
  website: "",
  industry: [],
  companySize: "startup",
  budgetRange: "small",
  targetPlatforms: [],
  campaignTypes: [],
  description: "",
  location: "Mumbai, IN",
  trustScore: 0,
};

/* ─── Hook ─── */
export function useBrandProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Fetch on mount */
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/brand/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load brand profile");
        return r.json();
      })
      .then((data) => {
        setProfile({ ...DEFAULT_PROFILE, ...data });
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const updateField = (key, value) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const toggleInArray = (key, value) =>
    setProfile((p) => ({
      ...p,
      [key]: p[key].includes(value)
        ? p[key].filter((v) => v !== value)
        : [...p[key], value],
    }));

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/api/brand/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setProfile((p) => ({ ...p, ...updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    profile,
    updateField,
    toggleInArray,
    handleSave,
    saved,
    editMode,
    setEditMode,
    loading,
    error,
  };
}