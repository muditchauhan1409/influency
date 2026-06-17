// PASTE PATH: src/pages/Welcome.jsx
import { Link } from "react-router-dom";
import { useWelcome } from "../scripts/welcome";
import "../styles/welcome.css";

export default function Welcome() {
  const { dashboardCards, handleGoToDashboard } = useWelcome();

  return (
    <div className="onboarding-page">
      <div className="onboarding-left welcome-left">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">Influency</span>
        </div>

        <h1 className="welcome-title">
          You're In.
          <br />
          Welcome to
          <br />
          <span className="hero-title-accent">Influency ✦</span>
        </h1>
        <p className="hero-sub-dark">
          The platform where trust is currency and every collaboration is an
          opportunity to grow.
        </p>
      </div>

      <div className="onboarding-right">
        <div className="card card-compact welcome-card">
          <div className="progress-bar">
            <span className="progress-step active" />
            <span className="progress-step active" />
            <span className="progress-step active" />
            <span className="progress-step active" />
          </div>

          <div className="welcome-icon">🎉</div>
          <h2 className="card-title">You're all set!</h2>
          <p className="card-sub">Your Influency account is live. Your trust journey starts now.</p>

          <div className="trust-score-box">
            <p className="trust-score-label">YOUR TRUST SCORE</p>
            <div className="trust-score-row">
              <span className="trust-score-number">10</span>
              <div className="trust-score-info">
                <span className="tag tag-new-creator">🌱 New Creator</span>
                <p className="trust-score-desc">
                  Complete verifications to reach <strong>Elite status</strong>
                </p>
              </div>
            </div>
            <p className="trust-score-out">out of 100</p>
            <div className="trust-preview-bar">
              <span style={{ width: "10%" }} />
            </div>
          </div>

          <div className="dashboard-grid">
            {dashboardCards.map((c, i) => (
              <div
                className="dashboard-tile"
                key={c.title}
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <span className="dashboard-tile-icon">{c.icon}</span>
                <p className="dashboard-tile-title">{c.title}</p>
                <p className="dashboard-tile-sub">{c.sub}</p>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={handleGoToDashboard}>
            Go to Dashboard
          </button>

          <p className="card-footer">
            Need help? <a href="#">Visit Help Center</a> or <a href="#">Contact Support</a>
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