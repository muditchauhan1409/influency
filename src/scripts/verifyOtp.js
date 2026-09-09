import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "../config/api";
const OTP_DURATION = 300; // 5 minutes, matches backend Otp expiry

export function useVerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const purpose = location.state?.purpose || "signup"; // "signup" | "login"
  const role = location.state?.role || "creator";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!email) {
      navigate(purpose === "login" ? "/login" : "/signup");
    }
  }, [email, purpose, navigate]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = useCallback(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [timeLeft]);

  const handleVerify = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    if (timeLeft === 0) {
      setError("Code expired. Please resend a new one.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const endpoint = purpose === "login" ? "verify-login-otp" : "verify-signup-otp";
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid or expired OTP.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLoading(false);

      if (purpose === "signup") {
        navigate("/profile-setup", { state: { role: data.user.role || role } });
      } else {
        navigate(data.user.role === "brand" ? "/brand-dashboard" : "/dashboard");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg("");
    setError("");
    setResending(true);
    try {
      const res = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Could not resend OTP.");
        setResending(false);
        return;
      }

      setTimeLeft(OTP_DURATION);
      setOtp("");
      setResendMsg("A new code has been sent to your email.");
      setResending(false);
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
      setResending(false);
    }
  };

  return {
    email,
    otp, setOtp,
    error, loading,
    resending, resendMsg,
    timeLeft, formatTime,
    handleVerify, handleResend,
  };
}