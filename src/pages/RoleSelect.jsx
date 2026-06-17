// PASTE PATH: src/pages/RoleSelect.jsx

import { Link } from "react-router-dom";
import { useRoleSelect } from "../scripts/roleSelect";
import "../styles/roleSelect.css";
import "../styles/global.css";

export default function RoleSelect() {
  const { role, setRole, handleContinue } = useRoleSelect();

  return (
    <div className="onboarding-page">
      <div className="onboarding-left">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">Influency</span>
        </div>

        <div className="hero-card">
          <div className="hero-card-avatar">🧍</div>
          <div className="hero-card-info">
            <p className="hero-card-name">Aria Chen</p>
            <p className="hero-card-handle">@ariastyle</p>
          </div>
          <div className="hero-card-stats">
            <span className="badge-verified">✓ Verified</span>
            <div className="trust-mini">
              <span className="trust-label">Trust</span>
              <span className="trust-value">94</span>
            </div>
          </div>
        </div>

        <p className="eyebrow">— TRUST-BASED CREATOR PLATFORM</p>
        <h1 className="hero-title">
          Trust Is The
          <br />
          <span className="hero-title-accent">New Influence</span>
        </h1>
        <p className="hero-sub">Connect. Collaborate. Build Trust.</p>
        <p className="hero-sub-light">Where creators and brands meet with purpose.</p>

        <div className="rating-strip">
          <div className="rating-avatars">🧍🥤🧗🎨🎤</div>
          <div className="rating-text">
            <p className="rating-title">50K+ Verified Creators</p>
            <p className="rating-sub">98% satisfaction rate</p>
          </div>
          <div className="rating-stars">★★★★★</div>
        </div>

        <div className="stats-row">
          <div className="stat">
            <p className="stat-value">50K+</p>
            <p className="stat-label">Creators</p>
          </div>
          <div className="stat">
            <p className="stat-value">10K+</p>
            <p className="stat-label">Brands</p>
          </div>
          <div className="stat">
            <p className="stat-value">100K+</p>
            <p className="stat-label">Collabs</p>
          </div>
        </div>

        <div className="floating-collab">
          <span className="collab-emoji">🤝</span>
          <div>
            <p className="collab-title">New collab!</p>
            <p className="collab-sub">Nike × @kai.fit</p>
          </div>
          <span className="collab-dot" />
        </div>

        <div className="floating-match">
          <p className="match-label">AI MATCHED</p>
          <p className="match-value">96% Match</p>
        </div>
      </div>

      <div className="onboarding-right">
        <div className="card">
          <div className="progress-bar">
            <span className="progress-step active" />
            <span className="progress-step" />
            <span className="progress-step" />
            <span className="progress-step" />
          </div>

          <div className="card-icon">✦</div>
          <h2 className="card-title">Who are you?</h2>
          <p className="card-sub">Choose your role to personalize your Influency experience.</p>

          <div
            className={`role-option ${role === "creator" ? "selected" : ""}`}
            onClick={() => setRole("creator")}
          >
            <div className="role-option-top">
              <div className="role-icon">🎥</div>
              <div className="role-text">
                <div className="role-heading">
                  <span>I'm a Creator</span>
                  <span className="tag tag-popular">Most Popular</span>
                </div>
                <p className="role-desc">
                  Build your portfolio, grow your trust score, land premium brand deals.
                </p>
              </div>
              <span className="radio-dot" />
            </div>
            <div className="role-pills">
              <span className="pill">🎒 Portfolio</span>
              <span className="pill">⭐ Trust Score</span>
              <span className="pill">🤝 Collabs</span>
              <span className="pill">📊 Analytics</span>
            </div>
          </div>

          <div
            className={`role-option ${role === "brand" ? "selected" : ""}`}
            onClick={() => setRole("brand")}
          >
            <div className="role-option-top">
              <div className="role-icon">🏢</div>
              <div className="role-text">
                <div className="role-heading">
                  <span>I'm a Brand</span>
                  <span className="tag tag-business">For Business</span>
                </div>
                <p className="role-desc">
                  Discover verified creators, launch campaigns, and track ROI in one place.
                </p>
              </div>
              <span className="radio-dot" />
            </div>
            <div className="role-pills">
              <span className="pill">🔍 AI Matching</span>
              <span className="pill">📣 Campaigns</span>
              <span className="pill">✅ Verified</span>
              <span className="pill">📈 ROI</span>
            </div>
          </div>

          <button className="btn-primary" onClick={handleContinue}>
            Continue
          </button>

          <p className="card-footer">
            Already have an account? <Link to="/login">Sign In</Link>
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