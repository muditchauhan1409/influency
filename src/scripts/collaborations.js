// PASTE PATH: src/scripts/collaborations.js
import { useState, useMemo } from "react";

export const COLLAB_TABS = ["Active", "Pending", "Completed"];

export const COLLABORATIONS = [
  {
    id: "col1",
    brand: "Nike India",
    initials: "NK",
    bg: "#000",
    campaign: "Spring '26 Collection Launch",
    status: "Active",
    budget: "₹2,00,000",
    deadline: "Jul 12, 2026",
    progress: 65,
  },
  {
    id: "col2",
    brand: "boAt Lifestyle",
    initials: "BT",
    bg: "rgba(99,102,241,0.85)",
    campaign: "Wireless Earbuds Review Series",
    status: "Active",
    budget: "₹1,20,000",
    deadline: "Jun 30, 2026",
    progress: 30,
  },
  {
    id: "col3",
    brand: "Nykaa",
    initials: "NY",
    bg: "rgba(236,72,153,0.85)",
    campaign: "Monsoon Skincare Edit",
    status: "Pending",
    budget: "₹80,000",
    deadline: "Awaiting brand approval",
    progress: 0,
  },
  {
    id: "col4",
    brand: "Zomato",
    initials: "ZM",
    bg: "rgba(239,68,68,0.85)",
    campaign: "Foodie Friday Series",
    status: "Pending",
    budget: "₹90,000",
    deadline: "Awaiting your response",
    progress: 0,
  },
  {
    id: "col5",
    brand: "Starbucks",
    initials: "SB",
    bg: "rgba(245,158,11,0.85)",
    campaign: "Festive Cup Reveal",
    status: "Completed",
    budget: "₹60,000",
    deadline: "Completed May 18, 2026",
    progress: 100,
    earnedTrust: 8,
  },
  {
    id: "col6",
    brand: "Myntra",
    initials: "MM",
    bg: "rgba(212,163,115,0.9)",
    campaign: "End of Season Sale Promo",
    status: "Completed",
    budget: "₹1,50,000",
    deadline: "Completed Apr 02, 2026",
    progress: 100,
    earnedTrust: 12,
  },
];

export function useCollaborations() {
  const [activeTab, setActiveTab] = useState("Active");

  const filtered = useMemo(
    () => COLLABORATIONS.filter((c) => c.status === activeTab),
    [activeTab]
  );

  const counts = useMemo(() => {
    return COLLAB_TABS.reduce((acc, tab) => {
      acc[tab] = COLLABORATIONS.filter((c) => c.status === tab).length;
      return acc;
    }, {});
  }, []);

  return { activeTab, setActiveTab, filtered, counts };
}