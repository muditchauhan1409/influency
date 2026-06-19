// PASTE PATH: src/scripts/signUp.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useSignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "creator";

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleCreateAccount = () => {
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setError("");
    navigate("/profile-setup", { state: { role } });
  };

  return { role, agreed, setAgreed, handleCreateAccount, error, shake };
}