// PASTE PATH: src/scripts/signUp.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useSignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "creator";
  const [agreed, setAgreed] = useState(false);

  const handleCreateAccount = () => {
    if (!agreed) return;
    navigate("/profile-setup", { state: { role } });
  };

  return { role, agreed, setAgreed, handleCreateAccount };
}