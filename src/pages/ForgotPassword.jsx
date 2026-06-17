// PASTE PATH: src/pages/ForgotPassword.jsx
import { Link } from "react-router-dom";
import { useForgotPassword } from "../scripts/forgotPassword";
import "../styles/forgotPassword.css";

export default function ForgotPassword() {
  const { email, setEmail, sent, error, handleSendResetLink, handleResend } =
    useForgotPassword();

  return (
    <div className="onboarding-page">
      <div className="onboarding-left fp-left">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">Influency</span>
        </div>

        <h1 className="hero-title fp-title">
          Reset Your
          <br />
          <span className="hero-title-accent">Password</span>
        </h1>
        <p className="hero-sub-dark">
          We'll send a secure link to your email to get you back in.
        </p>

        <div className="fp-trust-strip">
          <span className="fp-trust-icon">🔒</span>
          <div>
            <p className="fp-trust-title">Bank-grade encryption</p>
            <p className="fp-trust-sub">Your account stays safe, always.</p>
          </div>
        </div>
      </div>

      <div className="onboarding-right">
        <div className="card card-compact fp-card">
          <Link to="/login" className="back-link">
            ← Back to Sign In
          </Link>

          {!sent ? (
            <div className="fp-form" key="form">
              <div className="fp-icon">🔐</div>
              <h2 className="card-title">Forgot password?</h2>
              <p className="card-sub">Enter your email and we'll send you a reset link.</p>

              <label className="field-label">Email address</label>
              <input
                className={`field-input ${error ? "field-error" : ""}`}
                placeholder="hello@influency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="fp-error-text">{error}</p>}

              <button className="btn-primary" onClick={handleSendResetLink}>
                Send Reset Link
              </button>

              <p className="card-footer">
                Remembered it? <Link to="/login">Sign In</Link>
              </p>
            </div>
          ) : (
            <div className="fp-success" key="success">
              <div className="fp-success-icon">✓</div>
              <h2 className="card-title">Check your inbox</h2>
              <p className="card-sub">
                We sent a reset link to <strong>{email}</strong>. It expires in
                15 minutes.
              </p>

              <button className="btn-primary fp-resend-btn" onClick={handleResend}>
                Resend Link
              </button>

              <p className="card-footer">
                Remembered it? <Link to="/login">Sign In</Link>
              </p>
            </div>
          )}
        </div>

        <nav className="onboarding-nav">
          <Link to="/role-select" className="onboarding-nav-link">Role Select</Link>
          <Link to="/login" className="onboarding-nav-link">Sign In</Link>
          <Link to="/signup" className="onboarding-nav-link">Sign Up</Link>
          <Link to="/profile-setup" className="onboarding-nav-link">Profile</Link>
          <Link to="/verify-connect" className="onboarding-nav-link">Verify</Link>
          <Link to="/welcome" className="onboarding-nav-link">Welcome</Link>
          <Link to="/forgot-password" className="onboarding-nav-link">Forgot PW</Link>
        </nav>
      </div>
    </div>
  );
}