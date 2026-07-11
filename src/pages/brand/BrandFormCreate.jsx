// PASTE PATH: src/pages/BrandFormCreate.jsx
import { useNavigate } from "react-router-dom";
import { useCreateForm } from "../../scripts/brandDashboard";
import "../../styles/dashboard.css";
import "../../styles/settings.css";
import "../../styles/brandDashboard.css";
import BrandSidebar from "../../components/brand/BrandSidebar";

const FIXED_QUESTIONS = [
  { label: "Full Name", profileField: "name" },
  { label: "Location", profileField: "location" },
  { label: "Your Niches", profileField: "niches" },
  { label: "Availability Status", profileField: "availability" },
  { label: "Work Status / Response Time", profileField: "responseTime" },
  { label: "About You (Bio)", profileField: "bio" },
  { label: "Minimum Rate (₹)", profileField: "rateMin" },
  { label: "Maximum Rate (₹)", profileField: "rateMax" },
];

export default function BrandFormCreate() {
  const navigate = useNavigate();
  const {
    title, setTitle,
    description, setDescription,
    includeFixedTemplate, setIncludeFixedTemplate,
    customQuestions,
    addCustomQuestion,
    updateQuestion,
    removeQuestion,
    handleSubmit,
    loading,
    error,
  } = useCreateForm();

  return (
    <div className="settings-wrap">
      <div className="left-sb">
        <div className="logo-block">
          <div className="logo-icon">✦</div>
          <div className="logo-text">
            <span className="logo-gold">Influ</span>
            <span className="logo-white">ency</span>
          </div>
        </div>
        <div className="nav-item" onClick={() => navigate("/brand-dashboard")}>
          <span className="nav-emoji">←</span>
          <span className="nav-label">Back to Dashboard</span>
        </div>
      </div>

      <div className="settings-main">
        <div className="settings-header">
          <div className="settings-title">Create New Form</div>
          <div className="settings-sub">Build a form to send to creators — their profile data will auto-fill the answers</div>
        </div>

        {/* Basic Info */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon">📋</div>
            <div>
              <div className="settings-section-title">Form Details</div>
              <div className="settings-section-desc">Basic information about this form</div>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">✏️</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Form Title</div>
              <div className="settings-row-sub">e.g. "Summer Campaign 2026 - Creator Brief"</div>
            </div>
            <div className="settings-row-right" style={{ flex: 1 }}>
              <input
                className="settings-input"
                style={{ width: "100%" }}
                placeholder="Enter form title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-icon">📝</div>
            <div className="settings-row-info">
              <div className="settings-row-label">Description</div>
              <div className="settings-row-sub">Brief description of this campaign</div>
            </div>
            <div className="settings-row-right" style={{ flex: 1 }}>
              <textarea
                className="settings-input"
                style={{ width: "100%", minHeight: 60, resize: "vertical" }}
                placeholder="What is this form for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Fixed Template */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon">⚡</div>
            <div>
              <div className="settings-section-title">Fixed Template Questions</div>
              <div className="settings-section-desc">These questions auto-fill from creator's profile</div>
            </div>
            <label className="toggle-wrap" style={{ marginLeft: "auto" }}>
              <input
                type="checkbox"
                checked={includeFixedTemplate}
                onChange={(e) => setIncludeFixedTemplate(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          {includeFixedTemplate && (
            <div style={{ padding: "12px 20px 16px" }}>
              {FIXED_QUESTIONS.map((q, i) => (
                <div key={i} className="brand-question-preview">
                  <span className="brand-question-num">{i + 1}</span>
                  <span className="brand-question-label">{q.label}</span>
                  <span className="brand-autofill-badge">⚡ Auto-fill</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Questions */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-icon">➕</div>
            <div>
              <div className="settings-section-title">Custom Questions</div>
              <div className="settings-section-desc">Add your own questions</div>
            </div>
          </div>
          <div style={{ padding: "12px 20px 16px" }}>
            {customQuestions.map((q, i) => (
              <div key={q.id} className="brand-custom-question">
                <div className="brand-custom-question-top">
                  <input
                    className="settings-input"
                    style={{ flex: 1 }}
                    placeholder="Question label..."
                    value={q.label}
                    onChange={(e) => updateQuestion(i, "label", e.target.value)}
                  />
                  <select
                    className="settings-select"
                    value={q.type}
                    onChange={(e) => updateQuestion(i, "type", e.target.value)}
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="select">Single Select</option>
                    <option value="multiselect">Multi Select</option>
                  </select>
                  <button
                    className="settings-danger-btn"
                    onClick={() => removeQuestion(i)}
                    style={{ padding: "7px 10px" }}
                  >
                    🗑️
                  </button>
                </div>
                {(q.type === "select" || q.type === "multiselect") && (
                  <input
                    className="settings-input"
                    style={{ width: "100%", marginTop: 8 }}
                    placeholder="Options (comma separated): Option 1, Option 2, Option 3"
                    value={q.options.join(", ")}
                    onChange={(e) =>
                      updateQuestion(i, "options", e.target.value.split(",").map((o) => o.trim()))
                    }
                  />
                )}
              </div>
            ))}
            <button className="view-all-btn" onClick={addCustomQuestion}>
              + Add Custom Question
            </button>
          </div>
        </div>

        {error && <p className="field-error">{error}</p>}

        <div className="profile-save-bar">
          <button className="btn-outline-sm" onClick={() => navigate("/brand-dashboard")}>
            Cancel
          </button>
          <button
            className="settings-edit-btn save-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: "linear-gradient(135deg, #7a1f33, #a0364a)", color: "#fff", border: "none", padding: "11px 24px" }}
          >
            {loading ? "Creating..." : "Create Form"}
          </button>
        </div>
      </div>
    </div>
  );
}