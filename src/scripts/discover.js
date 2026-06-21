// PASTE PATH: src/scripts/discover.js
import { useState, useMemo } from "react";

export const NICHE_FILTERS = [
  "All", "Fashion", "Beauty", "Tech", "Fitness", "Food", "Travel", "Gaming", "Lifestyle",
];

export const CREATORS = [
  { id: "c1", emoji: "👗", name: "Aria Chen", handle: "@ariastyle", niche: "Fashion", followers: "2.4M", trust: 94, bg: "linear-gradient(135deg,#7a1f33,#c87a4a)" },
  { id: "c2", emoji: "✈️", name: "Zoe Williams", handle: "@zoetravels", niche: "Travel", followers: "1.7M", trust: 91, bg: "linear-gradient(135deg,#4a6fa5,#7a1f33)" },
  { id: "c3", emoji: "💪", name: "Kai Nakamura", handle: "@kai.fit", niche: "Fitness", followers: "620K", trust: 83, bg: "linear-gradient(135deg,#2f8f53,#7a1f33)" },
  { id: "c4", emoji: "🍜", name: "Marco Rivera", handle: "@marcoeats", niche: "Food", followers: "890K", trust: 87, bg: "linear-gradient(135deg,#c87a4a,#7a1f33)" },
  { id: "c5", emoji: "💄", name: "Sofia Lopes", handle: "@sofiabeauty", niche: "Beauty", followers: "3.1M", trust: 96, bg: "linear-gradient(135deg,#a0364a,#c87a4a)" },
  { id: "c6", emoji: "🎮", name: "Devon Park", handle: "@devonplays", niche: "Gaming", followers: "1.2M", trust: 88, bg: "linear-gradient(135deg,#6366f1,#7a1f33)" },
  { id: "c7", emoji: "💻", name: "Riya Sharma", handle: "@riyatech", niche: "Tech", followers: "540K", trust: 90, bg: "linear-gradient(135deg,#2a1a1f,#7a1f33)" },
  { id: "c8", emoji: "🌿", name: "Liam Foster", handle: "@liamlives", niche: "Lifestyle", followers: "780K", trust: 85, bg: "linear-gradient(135deg,#7a1f33,#2f8f53)" },
];

export const BRANDS = [
  { id: "b1", initials: "NK", name: "Nike India", category: "Sports & Fashion", budget: "₹2,00,000", openCampaigns: 3, bg: "#000" },
  { id: "b2", initials: "NY", name: "Nykaa", category: "Beauty & Wellness", budget: "₹80,000", openCampaigns: 5, bg: "rgba(236,72,153,0.85)" },
  { id: "b3", initials: "BT", name: "boAt Lifestyle", category: "Tech & Lifestyle", budget: "₹1,20,000", openCampaigns: 2, bg: "rgba(99,102,241,0.85)" },
  { id: "b4", initials: "SB", name: "Starbucks", category: "Food & Lifestyle", budget: "₹60,000", openCampaigns: 1, bg: "rgba(245,158,11,0.85)" },
  { id: "b5", initials: "ZM", name: "Zomato", category: "Food & Delivery", budget: "₹90,000", openCampaigns: 4, bg: "rgba(239,68,68,0.85)" },
  { id: "b6", initials: "MM", name: "Myntra", category: "Fashion", budget: "₹1,50,000", openCampaigns: 2, bg: "rgba(212,163,115,0.9)" },
];

export function useDiscover() {
  const [view, setView] = useState("creators"); // "creators" | "brands"
  const [query, setQuery] = useState("");
  const [activeNiche, setActiveNiche] = useState("All");

  const filteredCreators = useMemo(() => {
    return CREATORS.filter((c) => {
      const matchesNiche = activeNiche === "All" || c.niche === activeNiche;
      const matchesQuery =
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.handle.toLowerCase().includes(query.toLowerCase());
      return matchesNiche && matchesQuery;
    });
  }, [query, activeNiche]);

  const filteredBrands = useMemo(() => {
    return BRANDS.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return {
    view,
    setView,
    query,
    setQuery,
    activeNiche,
    setActiveNiche,
    filteredCreators,
    filteredBrands,
  };
}