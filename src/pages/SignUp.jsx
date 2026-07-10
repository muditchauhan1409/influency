// PASTE PATH: src/pages/SignUp.jsx
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useSignUp } from "../scripts/signUp";
import "../styles/signUp.css";

export default function SignUp() {
  const {
    role, agreed, setAgreed, handleCreateAccount, error, shake,
    name, setName, email, setEmail, password, setPassword, loading
  } = useSignUp();

  return (
    <div className="onboarding-page">
      <div className="onboarding-left">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">Influency</span>
        </div>

        <p className="eyebrow">STEP 1 OF 3</p>
        <h1 className="hero-title">
          Create Your
          <br />
          <span className="hero-title-accent">Account</span>
        </h1>
        <p className="hero-sub-dark">
          Your journey to verified collaborations starts here. Join 50,000+
          creators and 10,000+ brands.
        </p>

        <div className="niche-pills">
          <span className="pill">👗 Fashion</span>
          <span className="pill">🍔 Food</span>
          <span className="pill">🏃 Travel</span>
          <span className="pill">💪 Fitness</span>
          <span className="pill">💄 Beauty</span>
          <span className="pill">💻 Tech</span>
          <span className="pill">🎮 Gaming</span>
          <span className="pill">🎨 Art</span>
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

          <div className="top-action">
            <Link to="/role-select" className="back-link">Back</Link>
            <span className="tag tag-role">
              {role === "brand" ? "🏢 Brand Account" : "🎥 Creator Account"}
            </span>
          </div>

          <h2 className="card-title">Create your account</h2>
          <p className="card-sub">Quick sign up — takes less than a minute.</p>

          <div className="oauth-row">
            <button className="oauth-btn" style={{ width: "100%" }}>
              <FcGoogle size={24} />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="signup-fields">
            <input
              className="signup-input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="signup-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="signup-input"
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I agree to Influency's <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </span>
          </label>

          {error && <p className="field-error">{error}</p>}

          <button
            className={`btn-primary ${shake ? "shake" : ""}`}
            onClick={handleCreateAccount}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
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