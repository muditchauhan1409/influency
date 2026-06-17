// PASTE PATH: src/scripts/forgotPassword.js
import { useState } from "react";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendResetLink = () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
  };

  const handleResend = () => {
    setSent(false);
    setTimeout(() => setSent(true), 50);
  };

  return { email, setEmail, sent, error, handleSendResetLink, handleResend };
}