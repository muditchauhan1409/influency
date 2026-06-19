// PASTE PATH: src/pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../scripts/login";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const {
    
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    handleLogin,
  } = useLogin();

  return (
    <div className="onboarding-page">
      <div className="onboarding-left login-left">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">Influency</span>
        </div>

        <p className="eyebrow">— WELCOME BACK</p>
        <h1 className="hero-title">
          Pick Up Right
          <br />
          <span className="hero-title-accent">Where You Left</span>
        </h1>
        <p className="hero-sub-dark">
          Your collaborations, your trust score, your creator journey —
          all waiting for you.
        </p>

        <div className="login-stat-strip">
          <div className="login-stat">
            <p className="login-stat-value">94</p>
            <p className="login-stat-label">Avg Trust Score</p>
          </div>
          <div className="login-stat">
            <p className="login-stat-value">2.4K</p>
            <p className="login-stat-label">Active Collabs</p>
          </div>
          <div className="login-stat">
            <p className="login-stat-value">98%</p>
            <p className="login-stat-label">Satisfaction</p>
          </div>
        </div>
      </div>

      <div className="onboarding-right">
        <div className="card card-compact login-card">
          <h2 className="card-title">Sign in to Influency</h2>
          <p className="card-sub">Glad to see you again. Let's get back to building trust.</p>

          <div className="oauth-row">
            <button className="oauth-btn">
              <span className="oauth-icon">G</span>
               Google
            </button>
            <button className="oauth-btn">
              <span className="oauth-icon">📷</span>
               Instagram
            </button>
          </div>

          <div className="login-divider">
            <span>or sign in with email</span>
          </div>

          <label className="field-label">Email address</label>
          <input
            className={`field-input ${error.includes("email") ? "field-error" : ""}`}
            placeholder="hello@influency.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="login-password-label-row">
            <label className="field-label">Password</label>
            <Link to="/forgot-password" className="login-forgot-link">
              Forgot password?
            </Link>
          </div>
          <div className="login-password-wrap">
            <input
              className={`field-input ${error.includes("password") ? "field-error" : ""}`}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <p className="fp-error-text">{error}</p>}

          <button className="btn-primary login-submit" onClick={() => navigate("/signup")}>
            Sign In
          </button>

          <p className="card-footer">
            New to Influency? <Link to="/role-select">Create an account</Link>
          </p>
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