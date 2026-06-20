// PASTE PATH: src/scripts/dashboard.js
// Update sirf NAV_ITEMS array — baaki sab same rahega

export const NAV_ITEMS = [
  { icon: "🏠", label: "Home", path: "/dashboard" },
  { icon: "🧭", label: "Discover", path: "/discover" },
  { icon: "💼", label: "Collaborations", path: "/collaborations", badge: 3 },
  { icon: "💬", label: "Messages", path: "/messages", badge: 7 },
  { icon: "🔔", label: "Notifications", path: "/notifications" },
  { icon: "👤", label: "Profile", path: "/profile" },
  { icon: "📊", label: "Analytics", path: "/analytics" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

export const CAMPAIGNS = [
  { id: "NK", name: "Nike India", cat: "Sports & Fashion", budget: "₹2,00,000", tag: "Fashion", closes: "4d", logoStyle: { background: "rgba(0,0,0,0.5)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } },
  { id: "NY", name: "Nykaa", cat: "Beauty & Wellness", budget: "₹80,000", tag: "Beauty", closes: "7d", logoStyle: { background: "rgba(236,72,153,0.15)", color: "#F472B6", border: "1px solid rgba(236,72,153,0.2)" } },
  { id: "BT", name: "boAt Lifestyle", cat: "Tech & Lifestyle", budget: "₹1,20,000", tag: "Tech", closes: "2d", logoStyle: { background: "rgba(99,102,241,0.15)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.2)" } },
];

export const BRAND_MATCHES = [
  { id: "NK", name: "Nike", cat: "Sports", pct: 98, cls: "pct-98", logoStyle: { background: "rgba(0,0,0,0.5)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } },
  { id: "NY", name: "Nykaa", cat: "Beauty", pct: 96, cls: "pct-96", logoStyle: { background: "rgba(236,72,153,0.12)", color: "#F472B6", border: "1px solid rgba(236,72,153,0.2)" } },
  { id: "BT", name: "boAt", cat: "Tech", pct: 94, cls: "pct-94", logoStyle: { background: "rgba(99,102,241,0.12)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.2)" } },
  { id: "SB", name: "Starbucks", cat: "Lifestyle", pct: 91, cls: "pct-91", logoStyle: { background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" } },
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