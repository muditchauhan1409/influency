import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "../config/api";

export function useSignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "creator";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const triggerShake = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleCreateAccount = async () => {
    if (!name.trim()) return triggerShake("Please enter your name.");
    if (!email.trim() || !email.includes("@")) return triggerShake("Please enter a valid email.");
    if (!password.trim() || password.length < 6) return triggerShake("Password must be at least 6 characters.");
    if (username.trim() && !/^[a-zA-Z0-9_.]{3,30}$/.test(username.trim())) {
      return triggerShake("Username must be 3-30 characters (letters, numbers, . and _ only).");
    }
    if (!agreed) return triggerShake("Please agree to the Terms of Service and Privacy Policy.");

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, username: username.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        triggerShake(data.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setShowOtpModal(true);
    } catch (err) {
      triggerShake("Cannot connect to server. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpVerified = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setShowOtpModal(false);
    navigate("/profile-setup", { state: { role: data.user.role || role } });
  };

  return {
    role,
    name, setName,
    email, setEmail,
    password, setPassword,
    username, setUsername,
    agreed, setAgreed,
    error, shake, loading,
    handleCreateAccount,
    showOtpModal, setShowOtpModal,
    handleOtpVerified,
  };
}