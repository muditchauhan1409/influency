// PASTE PATH: src/pages/VerifyConnect.jsx
import { Link } from "react-router-dom";
import { useVerifyConnect } from "../scripts/verifyConnect";
import "../styles/verifyConnect.css";

export default function VerifyConnect() {
  const { verificationItems, scoreList, potentialTotal, handleGoToDashboard } =
    useVerifyConnect();

  return (
    <div className="onboarding-page">
      <div className="onboarding-left">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">Influency</span>
        </div>

        <p className="eyebrow">STEP 3 OF 3</p>
        <h1 className="hero-title">
          Build Your
          <br />
          <span className="hero-title-accent">Trust Score</span>
        </h1>
        <p className="hero-sub-dark">
          Every verification adds to your Trust Score. More trust = better
          collaborations.
        </p>

        <div className="score-list">
          {scoreList.map((item) => (
            <div className="score-row" key={item.label}>
              <span className="score-label">
                {item.done && <span className="check-icon">✓</span>} {item.label}
              </span>
              <span className="pts-pill">+{item.pts} pts</span>
            </div>
          ))}
        </div>

        <div className="score-total-row">
          <span className="score-total-label">Potential Total</span>
          <span className="pts-pill pts-total">{potentialTotal} pts</span>
        </div>
      </div>

      <div className="onboarding-right">
        <div className="card card-compact">
          <div className="progress-bar">
            <span className="progress-step active" />
            <span className="progress-step active" />
            <span className="progress-step active" />
            <span className="progress-step" />
          </div>

          <Link to="/profile-setup" className="back-link">
            Back
          </Link>

          <h2 className="card-title">Verify &amp; Connect</h2>
          <p className="card-sub">Complete verifications to unlock your full Trust Score.</p>

          {verificationItems.map((item) => (
            <div className="verify-item verify-done" key={item.title}>
              <span className="verify-icon">{item.icon}</span>
              <div className="verify-text">
                <p className="verify-title">{item.title}</p>
                <p className="verify-sub">{item.sub}</p>
              </div>
              <span className="tag tag-done">✓ Done</span>
            </div>
          ))}

          <p className="helper-text center">
            You can complete verifications later from your profile.
          </p>

          <button className="btn-primary" onClick={handleGoToDashboard}>
            Go to Dashboard
          </button>
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