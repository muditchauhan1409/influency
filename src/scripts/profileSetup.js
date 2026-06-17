// PASTE PATH: src/scripts/profileSetup.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CREATOR_NICHES = [
  { label: "Fashion", icon: "👗" },
  { label: "Food", icon: "🍔" },
  { label: "Travel", icon: "🏃" },
  { label: "Fitness", icon: "💪" },
  { label: "Beauty", icon: "💄" },
  { label: "Tech", icon: "💻" },
  { label: "Gaming", icon: "🎮" },
  { label: "Art", icon: "🎨" },
  { label: "Lifestyle", icon: "🌿" },
  { label: "Education", icon: "📚" },
];

const BRAND_INDUSTRIES = [
  { label: "Fashion & Apparel", icon: "👗" },
  { label: "Beauty & Skincare", icon: "💄" },
  { label: "Food & Beverage", icon: "🍔" },
  { label: "Tech & Gadgets", icon: "💻" },
  { label: "Travel & Hospitality", icon: "✈️" },
  { label: "Health & Fitness", icon: "💪" },
];

const REGISTERED_BRAND_PERKS = [
  "Registered Brand",
  "Official Business Account",
  "Company Domain Verified",
  "Business Identity Verified",
  "Trusted Brand Status",
  "Platform Verified Brand",
];

export function useProfileSetup() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "creator";
  const isBrand = role === "brand";

  const [selectedTags, setSelectedTags] = useState(
    isBrand ? ["Fashion & Apparel"] : ["Fashion"]
  );

  const tagOptions = isBrand ? BRAND_INDUSTRIES : CREATOR_NICHES;

  const toggleTag = (label) => {
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const handleContinue = () => {
    navigate("/verify-connect", { state: { role } });
  };

  return {
    role,
    isBrand,
    tagOptions,
    selectedTags,
    toggleTag,
    handleContinue,
    registeredBrandPerks: REGISTERED_BRAND_PERKS,
  };
}