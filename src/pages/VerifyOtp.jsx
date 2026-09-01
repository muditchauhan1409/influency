import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useVerifyOtp } from "../scripts/verifyOtp";
import "../styles/signUp.css";

export default function VerifyOtp() {
  const {
    email,
    otp, setOtp,
    error, loading,
    resending, resendMsg,
    timeLeft, formatTime,
    handleVerify, handleResend,
  } = useVerifyOtp();

  return (
    <div className="onboarding-page">
      <div className="onboarding-left">
        <div className="brand">
          <Sparkles size={18} className="brand-icon" />
          <span className="brand-name">Influency</span>
        </div>

        <p className="eyebrow">EMAIL VERIFICATION</p>
        <h1 className="hero-title">
          Check Your
          <br />
          <span className="hero-title-accent">Inbox</span>
        </h1>
        <p className="hero-sub-dark">
          We've sent a 6-digit code to <strong>{email}</strong>. Enter it below to continue.
        </p>
      </div>

      <div className="onboarding-right">
        <div className="card card-compact">
          <h2 className="card-title">Verify your email</h2>
          <p className="card-sub">
            Code expires in <strong>{timeLeft > 0 ? formatTime() : "00:00"}</strong>
          </p>

          <div className="signup-fields">
            <input
              className="signup-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              style={{ letterSpacing: "8px", textAlign: "center", fontSize: "1.2rem" }}
            />
          </div>

          {error && <p className="field-error">{error}</p>}
          {resendMsg && <p className="card-sub" style={{ color: "#2e7d32" }}>{resendMsg}</p>}

          <button
            className="btn-primary"
            onClick={handleVerify}
            disabled={loading || timeLeft === 0}
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
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#7a1f3d",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Resend code
              </button>
            )}
          </p>

          <p className="card-footer">
            <Link to="/login">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}