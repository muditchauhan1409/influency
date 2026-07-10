import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export function useLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);
      if (data.user.role === "brand") {
  navigate("/brand-dashboard");
} else {
  navigate("/dashboard");
}

    } catch (err) {
      setError("Cannot connect to server. Please try again.");
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    error, loading,
    handleLogin,
  };
}