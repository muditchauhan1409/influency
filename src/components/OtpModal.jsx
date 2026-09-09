import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/otpModal.css";

import { API_URL as API, WS_URL } from "../config/api";
const OTP_DURATION = 300;

export default function OtpModal({ email, purpose, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const intervalRef = useRef(null);

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
      const res = await fetch(`${API}/auth/${endpoint}`, {
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
      setLoading(false);
      onVerified(data);
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
      const res = await fetch(`${API}/auth/resend-otp`, {
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

  return (
    <div className="otp-modal-overlay" onClick={onClose}>
      <div className="otp-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="otp-modal-close" onClick={onClose}>✕</button>
        <h2 className="card-title">Verify your email</h2>
        <p className="card-sub">We've sent a 6-digit code to <strong>{email}</strong></p>
        <p className="card-sub">Code expires in <strong>{timeLeft > 0 ? formatTime() : "00:00"}</strong></p>

        <input
          className="signup-input"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          style={{ letterSpacing: "8px", textAlign: "center", fontSize: "1.2rem", width: "100%" }}
          autoFocus
        />

        {error && <p className="field-error">{error}</p>}
        {resendMsg && <p className="card-sub" style={{ color: "#2e7d32" }}>{resendMsg}</p>}

        <button
          className="btn-primary"
          onClick={handleVerify}
          disabled={loading || timeLeft === 0}
          style={{ marginTop: "12px", width: "100%" }}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <p className="card-footer">
          Didn't get the code?{" "}
          {resending ? (
            <span>Sending...</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              style={{ background: "none", border: "none", padding: 0, color: "#7a1f3d", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
            >
              Resend code
            </button>
          )}
        </p>
      </div>
    </div>
  );
}