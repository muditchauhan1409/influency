// PASTE PATH: src/scripts/profileSetup.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CREATOR_NICHES = [
  { label: "Fashion", icon: "shirt" },
  { label: "Food", icon: "utensils" },
  { label: "Travel", icon: "plane" },
  { label: "Fitness", icon: "dumbbell" },
  { label: "Beauty", icon: "sparkle" },
  { label: "Tech", icon: "laptop" },
  { label: "Gaming", icon: "gamepad" },
  { label: "Art", icon: "palette" },
  { label: "Lifestyle", icon: "leaf" },
  { label: "Education", icon: "book" },
];

const BRAND_INDUSTRIES = [
  { label: "Fashion & Apparel", icon: "shirt" },
  { label: "Beauty & Skincare", icon: "sparkle" },
  { label: "Food & Beverage", icon: "utensils" },
  { label: "Tech & Gadgets", icon: "laptop" },
  { label: "Travel & Hospitality", icon: "plane" },
  { label: "Health & Fitness", icon: "dumbbell" },
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