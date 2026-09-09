// PASTE PATH: src/pages/BrandForms.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/dashboard.css";
import "../../styles/brandDashboard.css";
import "../../styles/settings.css";
import { API_URL } from "../config/api";
import { API_URL as API, WS_URL } from "../config/api";

const BRAND_NAV_ITEMS = [
  { icon: "🏠", label: "Home", path: "/brand-dashboard" },
  { icon: "📋", label: "Forms", path: "/brand-forms" },
  { icon: "🔍", label: "Discover", path: "/brand-discover" },
  { icon: "💬", label: "Messages", path: "/messages" },
  { icon: "🔔", label: "Notifications", path: "/notifications" },
  { icon: "📊", label: "Analytics", path: "/brand-analytics" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

export default function BrandForms() {
  const navigate = useNavigate();
  const location = useLocation();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeFormId, setActiveFormId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/forms/my-forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setForms(data.forms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (formId) => {
    setSubsLoading(true);
    setActiveFormId(formId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/forms/${formId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSubmissions(data.submissions);
    } catch (err) {
      console.error(err);
    } finally {
      setSubsLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/forms/${formId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setForms((prev) => prev.filter((f) => f._id !== formId));
        if (activeFormId === formId) {
          setActiveFormId(null);
          setSubmissions([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const activeForm = forms.find((f) => f._id === activeFormId);

  return (
    <div className="inf-wrap">

      {/* LEFT SIDEBAR */}
      <div className="left-sb">
        <div className="logo-block">
          <div className="logo-icon">✦</div>
          <div className="logo-text">
            <span className="logo-gold">Influ</span>
            <span className="logo-white">ency</span>
          </div>
        </div>

        {BRAND_NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-emoji">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}

        <div className="spacer" />

        <div className="trust-card">
          <div className="trust-ring-wrap">
            <div className="brand-trust-icon">✦</div>
            <div className="trust-meta">
              <div className="trust-score-big">{forms.length}</div>
              <div className="trust-label">Total Forms</div>
            </div>
          </div>
          <div className="trust-user" style={{ marginTop: 8 }}>
            {user?.name}<br />
            <span className="trust-handle">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* MAIN — 2 column layout */}
      <div className="feed">
        <div className="brand-page-header">
          <div>
            <div className="settings-title">My Forms</div>
            <div className="settings-sub">Manage your creator outreach forms and view submissions</div>
          </div>
          <button className="btn-primary-sm" onClick={() => navigate("/brand-forms/create")}>
            + Create New Form
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, alignItems: "start" }}>

          {/* Forms List */}
          <div>
            {loading ? (
              <div className="brand-empty">Loading...</div>
            ) : forms.length === 0 ? (
              <div className="card" style={{ padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
                <div style={{ fontSize: 14, color: "#8a7a7e" }}>No forms yet</div>
                <button className="btn-primary-sm" style={{ marginTop: 12 }}
                  onClick={() => navigate("/brand-forms/create")}>
                  + Create Form
                </button>
              </div>
            ) : (
              forms.map((form) => (
                <div
                  key={form._id}
                  className={`campaign-card ${activeFormId === form._id ? "brand-form-active" : ""}`}
                  style={{ cursor: "pointer", marginBottom: 10 }}
                  onClick={() => fetchSubmissions(form._id)}
                >
                  <div className="campaign-head">
                    <div className="brand-logo" style={{ background: "rgba(122,31,51,0.1)", color: "#7a1f33" }}>
                      F
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="brand-name">{form.title}</div>
                      <div className="brand-cat">{form.description || "No description"}</div>
                    </div>
                  </div>
                  <div className="campaign-pills">
                    <span className="pill pill-cat">Sent: {form.sentTo?.length || 0}</span>
                    <span className="pill pill-budget">Replies: {form.submissions?.length || 0}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button
                      className="collab-action-btn outline"
                      style={{ flex: 1, fontSize: 12 }}
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(form._id); }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submissions Panel */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {!activeFormId ? (
              <div style={{ padding: 40, textAlign: "center", color: "#8a7a7e", fontSize: 14 }}>
                Select a form to view submissions
              </div>
            ) : subsLoading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#8a7a7e" }}>
                Loading submissions...
              </div>
            ) : (
              <>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(122,31,51,0.08)", background: "#fdf6f3" }}>
                  <div className="settings-title" style={{ fontSize: 16 }}>{activeForm?.title}</div>
                  <div className="settings-sub">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</div>
                </div>

                {submissions.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#8a7a7e", fontSize: 14 }}>
                    No submissions yet — form has been sent to {activeForm?.sentTo?.length || 0} creator(s)
                  </div>
                ) : (
                  <div style={{ padding: 16 }}>
                    {submissions.map((sub, i) => (
                      <div key={i} className="settings-section" style={{ marginBottom: 14 }}>
                        <div className="settings-section-header">
                          <div className="settings-section-icon">👤</div>
                          <div>
                            <div className="settings-section-title">
                              {sub.creatorId?.name || "Creator"}
                            </div>
                            <div className="settings-section-desc">
                              {sub.creatorId?.email} · {new Date(sub.submittedAt).toLocaleDateString("en-IN")}
                              {sub.autoFilled && (
                                <span className="form-autofill-tag" style={{ marginLeft: 8 }}>⚡ Auto-filled</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: "12px 20px 16px" }}>
                          {Object.entries(sub.answers || {}).map(([key, val]) => (
                            <div key={key} className="settings-row" style={{ padding: "8px 0", borderBottom: "1px solid rgba(122,31,51,0.06)" }}>
                              <div className="settings-row-label" style={{ fontSize: 12, color: "#8a7a7e", flex: 1 }}>
                                {key.replace("ft_", "").replace(/_/g, " ")}
                              </div>
                              <div style={{ fontSize: 13, color: "#2a1a1f", fontWeight: 500 }}>
                                {Array.isArray(val) ? val.join(", ") : String(val)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="right-sb">
        <div className="right-card">
          <div className="right-title">Form Stats</div>
          <div className="score-factors">
            <div className="factor-row">
              <div className="factor-dot" style={{ background: "#7a1f33" }} />
              <div className="factor-label">Total Forms</div>
              <div className="factor-val">{forms.length}</div>
            </div>
            <div className="factor-row">
              <div className="factor-dot" style={{ background: "#c87a4a" }} />
              <div className="factor-label">Total Sent</div>
              <div className="factor-val">{forms.reduce((a, f) => a + (f.sentTo?.length || 0), 0)}</div>
            </div>
            <div className="factor-row">
              <div className="factor-dot" style={{ background: "#2f8f53" }} />
              <div className="factor-label">Total Replies</div>
              <div className="factor-val">{forms.reduce((a, f) => a + (f.submissions?.length || 0), 0)}</div>
            </div>
          </div>
        </div>

        <div className="right-card">
          <div className="right-title">Quick Actions</div>
          <button className="view-all-btn" onClick={() => navigate("/brand-forms/create")} style={{ marginBottom: 8 }}>
            + Create New Form
          </button>
          <button className="view-all-btn" onClick={() => navigate("/brand-dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Delete Form?</div>
              <button className="notif-close-btn" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: "#4a3438" }}>
                This will permanently delete the form and all its submissions. This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-outline-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button
                className="settings-danger-btn"
                style={{ padding: "9px 20px" }}
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}