// PASTE PATH: src/scripts/verifyConnect.js
import { useNavigate } from "react-router-dom";

const VERIFICATION_ITEMS = [
  {
    icon: "📧",
    title: "Email Verified",
    sub: "hello@influency.com",
    pts: 10,
    done: true,
  },
  {
    icon: "📱",
    title: "Phone Verification",
    sub: "Adds +10 Trust Score points",
    pts: 10,
    done: true,
  },
  {
    icon: "📷",
    title: "Connect Instagram",
    sub: "Verify audience & reach",
    pts: 15,
    done: true,
  },
  {
    icon: "🪪",
    title: "Identity Verification",
    sub: "Govt ID · Highest trust boost",
    pts: 15,
    done: true,
  },
];

const SCORE_LIST = [
  { label: "Email Verified", pts: 10, done: true },
  { label: "Phone Verified", pts: 10, done: true },
  { label: "Identity Verified", pts: 15, done: true },
  { label: "Instagram Connected", pts: 15, done: true },
  { label: "Profile Completed", pts: 10, done: true },
];

export function useVerifyConnect() {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/welcome");
  };

  const potentialTotal = SCORE_LIST.reduce((sum, item) => sum + item.pts, 0);

  return {
    verificationItems: VERIFICATION_ITEMS,
    scoreList: SCORE_LIST,
    potentialTotal,
    handleGoToDashboard,
  };
}