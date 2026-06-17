// PASTE PATH: src/pages/ProfileSetup.jsx
import { Link } from "react-router-dom";
import { useProfileSetup } from "../scripts/profileSetup";
import "../styles/profileSetup.css";

export default function ProfileSetup() {
  const {
    isBrand,
    tagOptions,
    selectedTags,
    toggleTag,
    handleContinue,
    registeredBrandPerks,
  } = useProfileSetup();

  return (
    <div className="onboarding-page">
      <div className="onboarding-left">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">Influency</span>
        </div>

        <p className="eyebrow">STEP 2 OF 3</p>
        <h1 className="hero-title">
          Build Your
          <br />
          <span className="hero-title-accent">Profile</span>
        </h1>
        <p className="hero-sub-dark">
          A complete profile earns +10 Trust Score points. Your first step to
          Elite status.
        </p>

        <div className="trust-preview-card">
          <p className="trust-preview-label">TRUST SCORE PREVIEW</p>
          <div className="trust-preview-row">
            <div className="trust-ring">10</div>
            <div>
              <p className="trust-preview-status">New Creator</p>
              <p className="trust-preview-desc">
                Complete your profile to reach <strong>Growing Creator</strong> status
              </p>
            </div>
          </div>
          <div className="trust-preview-bar">
            <span style={{ width: "10%" }} />
          </div>
        </div>
      </div>

      <div className="onboarding-right">
        <div className="card card-compact">
          <div className="progress-bar">
            <span className="progress-step active" />
            <span className="progress-step active" />
            <span className="progress-step" />
            <span className="progress-step" />
          </div>

          <Link to="/signup" className="back-link">
            Back
          </Link>

          <h2 className="card-title">Build your profile</h2>
          <p className="card-sub">This is what brands (or creators) will see first.</p>

          <div className="photo-upload-row">
            <div className="photo-placeholder" />
            <div>
              <p className="photo-title">Profile photo</p>
              <p className="photo-sub">JPG or PNG · Max 5MB</p>
            </div>
          </div>

          <label className="field-label">Display name / Handle</label>
          <input className="field-input" placeholder="@yourhandle" />

          <label className="field-label">Bio</label>
          <textarea
            className="field-textarea"
            placeholder="Tell brands (or creators) who you are and what you create..."
          />

          {isBrand && (
            <>
              <label className="field-label">Company / Brand name</label>
              <input className="field-input" placeholder="e.g. Nike, Nykaa, Zomato" />

              <div className="registered-card">
                <div className="registered-header">
                  <div className="registered-icon">🏛</div>
                  <div>
                    <p className="registered-name">Registered Brand</p>
                    <p className="registered-email">official@brandname.influency.com</p>
                  </div>
                  <span className="tag tag-premium">Premium</span>
                </div>
                <div className="registered-list">
                  {registeredBrandPerks.map((perk) => (
                    <div className="registered-item" key={perk}>
                      <span className="check-icon-circle">✓</span>
                      {perk}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <label className="field-label">{isBrand ? "Industry" : "Your niche(s)"}</label>
          <div className="niche-grid">
            {tagOptions.map((tag) => (
              <span
                key={tag.label}
                className={`pill pill-selectable ${
                  selectedTags.includes(tag.label) ? "pill-selected" : ""
                }`}
                onClick={() => toggleTag(tag.label)}
              >
                {tag.icon} {tag.label}
              </span>
            ))}
          </div>

          <label className="field-label">
            {isBrand ? "Campaign budget range" : "Follower range"}
          </label>
          <select className="field-input">
            <option>{isBrand ? "Select your budget" : "Select your reach"}</option>
            {isBrand ? (
              <>
                <option>Under ₹50K</option>
                <option>₹50K - ₹2L</option>
                <option>₹2L - ₹10L</option>
                <option>₹10L+</option>
              </>
            ) : (
              <>
                <option>0 - 1K</option>
                <option>1K - 10K</option>
                <option>10K - 100K</option>
                <option>100K+</option>
              </>
            )}
          </select>

          <button className="btn-primary" onClick={handleContinue}>
            Continue
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