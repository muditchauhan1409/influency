import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export function useSignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || "creator";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerShake = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleCreateAccount = async () => {
    if (!name.trim()) return triggerShake("Please enter your name.");
    if (!email.trim() || !email.includes("@")) return triggerShake("Please enter a valid email.");
    if (!password.trim() || password.length < 6) return triggerShake("Password must be at least 6 characters.");
    if (!agreed) return triggerShake("Please agree to the Terms of Service and Privacy Policy.");

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerShake(data.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);
      navigate("/profile-setup", { state: { role } });

    } catch (err) {
      triggerShake("Cannot connect to server. Please try again.");
      setLoading(false);
    }
  };

  return {
    role,
    name, setName,
    email, setEmail,
    password, setPassword,
    agreed, setAgreed,
    error, shake, loading,
    handleCreateAccount,
  };
}