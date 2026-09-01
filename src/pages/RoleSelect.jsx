// PASTE PATH: src/pages/RoleSelect.jsx

import { Link } from "react-router-dom";
import { useRoleSelect } from "../scripts/roleSelect";
import "../styles/roleSelect.css";
import "../styles/global.css";
import {
  Sparkles,
  Star,
  Users,
  Video,
  Building2,
  Briefcase,
  BarChart3,
  Search,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  Handshake,
} from "lucide-react";

export default function RoleSelect() {
  const { role, setRole, handleContinue } = useRoleSelect();

  return (
    <div className="onboarding-page">
        <div className="onboarding-left">
        <div className="brand">
          <Sparkles size={18} className="brand-icon" />
          <span className="brand-name">Influency</span>
        </div>

        <p className="eyebrow">TRUST-BASED CREATOR PLATFORM</p>
        <h1 className="hero-title">
          Trust Is The
          <br />
          <span className="hero-title-accent">New Influence</span>
        </h1>
        <p className="hero-sub">Connect. Collaborate. Build Trust.</p>
        <p className="hero-sub-light">Where creators and brands meet with purpose.</p>

        <div className="rating-strip">
          <div className="rating-avatars">
            <Users size={22} />
          </div>
          <div className="rating-text">
            <p className="rating-title">50K+ Verified Creators</p>
            <p className="rating-sub">98% satisfaction rate</p>
          </div>
          <div className="rating-stars">
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
          </div>
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
          <div className="stat stat-match">
            <p className="stat-label">AI MATCHED</p>
            <p className="stat-value stat-match-value">96%</p>
          </div>
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

          <div className="card-icon">
            <Sparkles size={20} />
          </div>
          <h2 className="card-title">Who are you?</h2>
          <p className="card-sub">Choose your role to personalize your Influency experience.</p>

          <div
            className={`role-option ${role === "creator" ? "selected" : ""}`}
            onClick={() => setRole("creator")}
          >
            <div className="role-option-top">
              <div className="role-icon">
                <Video size={20} />
              </div>
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
              <span className="pill"><Briefcase size={13} /> Portfolio</span>
              <span className="pill"><Star size={13} /> Trust Score</span>
              <span className="pill"><Handshake size={13} /> Collabs</span>
              <span className="pill"><BarChart3 size={13} /> Analytics</span>
            </div>
          </div>

          <div
            className={`role-option ${role === "brand" ? "selected" : ""}`}
            onClick={() => setRole("brand")}
          >
            <div className="role-option-top">
              <div className="role-icon">
                <Building2 size={20} />
              </div>
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
              <span className="pill"><Search size={13} /> AI Matching</span>
              <span className="pill"><Megaphone size={13} /> Campaigns</span>
              <span className="pill"><CheckCircle2 size={13} /> Verified</span>
              <span className="pill"><TrendingUp size={13} /> ROI</span>
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