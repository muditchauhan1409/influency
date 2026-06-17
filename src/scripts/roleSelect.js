// PASTE PATH: src/scripts/roleSelect.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useRoleSelect() {
  const [role, setRole] = useState("creator");
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/signup", { state: { role } });
  };

  return { role, setRole, handleContinue };
}