// PASTE PATH: src/scripts/welcome.js
import { useNavigate } from "react-router-dom";

const DASHBOARD_CARDS = [
  { icon: "🔍", title: "Find Creators", sub: "AI-powered matching" },
  { icon: "🛡️", title: "Verify Account", sub: "Boost your score" },
  { icon: "🚀", title: "Launch Campaign", sub: "Start collaborating" },
  { icon: "📊", title: "Analytics", sub: "Track everything" },
];

export function useWelcome() {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/role-select");
  };

  return { dashboardCards: DASHBOARD_CARDS, handleGoToDashboard };
}