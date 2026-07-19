// PASTE PATH: src/pages/brand/BrandDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBrandDashboard, useBrandCollabs } from "../../scripts/brandDashboard";
import BrandSidebar from "../../components/brand/BrandSidebar";
import BrandPostCreate from "../../components/brand/BrandPostCreate";
import "../../styles/dashboard.css";
import "../../styles/brandDashboard.css";
import "../../styles/collaborations.css";
import "../../styles/settings.css";

const TOP_CREATORS = [
  { initials: "AR", name: "Aria Chen", sub: "Fashion · 2.4M · Trust 94", bg: "linear-gradient(135deg,#3d1424,#1a0810)" },
  { initials: "ZW", name: "Zoe Williams", sub: "Travel · 1.7M · Trust 91", bg: "linear-gradient(135deg,#0a1020,#1e2840)" },
  { initials: "KN", name: "Kai Nakamura", sub: "Fitness · 620K · Trust 88", bg: "linear-gradient(135deg,#0a1a08,#1a3014)" },
];

const COLLAB_TABS = ["Active", "Pending", "Completed", "Forms"];

const COLLAB_STATUS_TAB = {
  active:         "Active",
  brand_accepted: "Active",   // brand accepted, waiting creator
  submitted:      "Pending",  // creator submitted, waiting brand approval
  completed:      "Completed",
  declined:       null,
};

export default function BrandDashboard({ onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const { forms, loading, user, handleCreateForm, handleViewForm, fetchForms } = useBrandDashboard();
  const {
    collabs, collabsLoading,
    applicants, applicantsLoading, fetchApplicants,
    brandAccept, brandReject,
    approveWork,
    approveModal, setApproveModal,
    approveFeedback, setApproveFeedback,
    approveLoading,
  } = useBrandCollabs();

  const [activeTab, setActiveTab] = useState("Home");
  const [collabTab, setCollabTab] = useState("Active");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlTab = searchParams.get("tab");
    if (urlTab === "collaborations") setActiveTab("Collaborations");
    else if (!urlTab) setActiveTab("Home");
  }, [location.search]);

  // Send form modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState("");
  const [sendError, setSendError] = useState("");

  // Applicants modal
  const [applicantsPostId, setApplicantsPostId] = useState(null);

  const handleSendForm = async () => {
    if (!selectedFormId || !creatorEmail.trim()) {
      setSendError("Please select a form and enter creator email.");
      return;
    }
    setSending(true);
    setSendError(""); setSendMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/forms/${selectedFormId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ creatorEmail }),
      });
      const data = await res.json();
      if (!res.ok) setSendError(data.message || "Failed to send form.");
      else { setSendMsg(data.message); setCreatorEmail(""); setSelectedFormId(""); fetchForms(); }
    } catch { setSendError("Cannot connect to server."); }
    finally { setSending(false); }
  };

  const openApplicants = (postId) => {
    setApplicantsPostId(postId);
    fetchApplicants(postId);
  };

  const totalSubmissions = forms.reduce((acc, f) => acc + (f.submissions?.length || 0), 0);
  const totalSent = forms.reduce((acc, f) => acc + (f.sentTo?.length || 0), 0);

  // Collab counts
  const collabCounts = {
    Active:    collabs.filter(c => COLLAB_STATUS_TAB[c.status] === "Active").length,
    Pending:   collabs.filter(c => COLLAB_STATUS_TAB[c.status] === "Pending").length,
    Completed: collabs.filter(c => COLLAB_STATUS_TAB[c.status] === "Completed").length,
    Forms:     forms.filter(f => f.status === "pending").length,
  };

  const filteredCollabs = collabs.filter(c => COLLAB_STATUS_TAB[c.status] === collabTab);

  return (
    <div className="inf-wrap">

      <BrandSidebar onOpenNotifications={onOpenNotifications} notifUnreadCount={notifUnreadCount} />

      {/* ── MAIN FEED ── */}
      <div className="feed">

        

        {/* ════════════════ HOME TAB ════════════════ */}
        {activeTab === "Home" && (
          <>
            {/* Campaign Post Create */}
            <BrandPostCreate onPostCreated={() => {}} />

            {/* Brand Profile Card */}
            <div className="card">
              <div className="profile-card-cover brand-cover">
                <span className="badge badge-verified-g cover-badge">✓ Verified Brand</span>
              </div>
              <div className="profile-card-body">
                <div className="profile-top-row">
                  <div className="profile-avatar brand-avatar">
                    {user?.name?.[0] || "B"}
                    <div className="verify-dot">✓</div>
                  </div>
                  <div className="badge-row">
                    <span className="badge badge-elite">Verified Brand</span>
                    <span className="badge badge-level">Pro Plan</span>
                  </div>
                </div>
                <div className="profile-name-block">
                  <div className="profile-name">{user?.name || "Brand Account"}</div>
                  <div className="profile-sub">{user?.email}</div>
                </div>
                <div className="profile-stats">
                  {[
                    [forms.length, "Forms"],
                    [totalSent, "Sent"],
                    [totalSubmissions, "Responses"],
                    ["91%", "Match Rate"],
                  ].map(([num, lbl], i) => (
                    <div key={lbl} style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                      {i > 0 && <div className="stat-divider" />}
                      <div className="profile-stat">
                        <div className="stat-num">{num}</div>
                        <div className="stat-lbl">{lbl}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="btn-row">
                  <button className="btn-primary-sm" onClick={handleCreateForm}>+ Create Form</button>
                  <button className="btn-outline-sm" onClick={() => navigate("/brand-discover")}>Find Creators</button>
                </div>
              </div>
            </div>

            {/* Recommended Creators */}
            <div className="card">
              <div className="post-card-inner">
                <div className="trend-section-title">Recommended Creators</div>
                {TOP_CREATORS.map((c) => (
                  <div className="creator-sugg" key={c.name} style={{ marginBottom: 12 }}>
                    <div className="sugg-ava" style={{ background: c.bg, color: "#fff", fontSize: 13, fontWeight: 700 }}>
                      {c.initials}
                    </div>
                    <div>
                      <div className="sugg-name">{c.name}</div>
                      <div className="sugg-sub">{c.sub}</div>
                    </div>
                    <button className="sugg-connect" onClick={() => { setSendMsg(""); setSendError(""); setShowSendModal(true); }}>
                      Send Form
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════════════════ DISCOVER TAB ════════════════ */}
        {activeTab === "Discover" && (
          <div className="card">
            <div className="trend-section-title" style={{ marginBottom: 20 }}>Discover Creators</div>
            {TOP_CREATORS.map((c) => (
              <div className="creator-sugg" key={c.name} style={{ marginBottom: 16 }}>
                <div className="sugg-ava" style={{ background: c.bg, color: "#fff", fontSize: 13, fontWeight: 700 }}>
                  {c.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="sugg-name">{c.name}</div>
                  <div className="sugg-sub">{c.sub}</div>
                </div>
                <button className="sugg-connect" onClick={() => { setSendMsg(""); setSendError(""); setShowSendModal(true); }}>
                  Send Form
                </button>
              </div>
            ))}
            <button className="btn-primary-sm" style={{ width: "100%", marginTop: 8 }}
              onClick={() => navigate("/brand-discover")}>
              View All Creators →
            </button>
          </div>
        )}

        {/* ════════════════ COLLABORATIONS TAB ════════════════ */}
        {activeTab === "Collaborations" && (
          <>
            {/* Collab Sub-tabs */}
            <div className="collab-tabs">
              {COLLAB_TABS.map(tab => (
                <button
                  key={tab}
                  className={`collab-tab ${collabTab === tab ? "active" : ""}`}
                  onClick={() => setCollabTab(tab)}
                >
                  {tab}
                  {collabCounts[tab] > 0 && (
                    <span className="collab-tab-count">{collabCounts[tab]}</span>
                  )}
                </button>
              ))}
            </div>

            {/* ── FORMS sub-tab ── */}
            {collabTab === "Forms" && (
              <div className="collab-list">
                {loading ? (
                  <p className="discover-empty">Loading forms...</p>
                ) : forms.length === 0 ? (
                  <div className="discover-empty">
                    No forms yet —
                    <button className="collab-action-btn primary" style={{ marginLeft: 8 }} onClick={handleCreateForm}>
                      + Create Form
                    </button>
                  </div>
                ) : (
                  forms.map(form => (
                    <div className="collab-card" key={form._id}>
                      <div className="collab-card-logo"
                        style={{ background: "linear-gradient(135deg,#7a1f33,#c87a4a)", color: "#fff" }}>
                        F
                      </div>
                      <div className="collab-card-info">
                        <div className="collab-card-top">
                          <div className="collab-card-brand">{form.title}</div>
                          <span className={`collab-status-tag ${form.status === "active" ? "active" : "pending"}`}>
                            {form.status}
                          </span>
                        </div>
                        <div className="collab-card-campaign">{form.description || "No description"}</div>
                        <div className="collab-card-meta">
                          <span>Sent: {form.sentTo?.length || 0}</span>
                          <span className="collab-dot">•</span>
                          <span>Responses: {form.submissions?.length || 0}</span>
                          <span className="collab-dot">•</span>
                          <span>{new Date(form.createdAt).toLocaleDateString("en-IN")}</span>
                        </div>
                      </div>
                      <div className="collab-card-actions">
                        <button className="collab-action-btn primary"
                          onClick={() => { setSelectedFormId(form._id); setSendMsg(""); setSendError(""); setShowSendModal(true); }}>
                          Send →
                        </button>
                        <button className="collab-action-btn outline"
                          onClick={() => handleViewForm(form._id)}>
                          Responses
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <button className="collab-action-btn primary" style={{ alignSelf: "flex-start" }}
                  onClick={handleCreateForm}>
                  + New Form
                </button>
              </div>
            )}

            {/* ── Active / Pending / Completed sub-tabs ── */}
            {collabTab !== "Forms" && (
              <div className="collab-list">
                {collabsLoading ? (
                  <p className="discover-empty">Loading collaborations...</p>
                ) : filteredCollabs.length === 0 ? (
                  <div className="discover-empty">
                    {collabTab === "Active"
                      ? "No active collaborations yet."
                      : collabTab === "Pending"
                      ? "No submissions waiting for your approval."
                      : "No completed collaborations yet."}
                  </div>
                ) : (
                  filteredCollabs.map(c => (
                    <div className="collab-card" key={c._id}>
                      <div className="collab-card-logo"
                        style={{ background: "linear-gradient(135deg,#7a1f33,#c87a4a)", color: "#fff" }}>
                        {(c.creator?.name || "C").substring(0, 2).toUpperCase()}
                      </div>
                      <div className="collab-card-info">
                        <div className="collab-card-top">
                          <div className="collab-card-brand">{c.creator?.name || "Creator"}</div>
                          <span className={`collab-status-tag ${collabTab.toLowerCase()}`}>
                            {collabTab}
                          </span>
                        </div>
                        <div className="collab-card-campaign">
                          {c.post?.title || "Campaign"}
                        </div>
                        <div className="collab-card-meta">
                          <span>@{c.creator?.username || "—"}</span>
                          <span className="collab-dot">•</span>
                          <span>{c.post?.budget || "—"}</span>
                          {c.submittedAt && (
                            <>
                              <span className="collab-dot">•</span>
                              <span>Submitted: {new Date(c.submittedAt).toLocaleDateString("en-IN")}</span>
                            </>
                          )}
                        </div>

                        {/* Submission link if available */}
                        {c.submissionUrl && (
                          <div className="collab-card-meta" style={{ marginTop: 4 }}>
                            <span>📎 Work:</span>
                            <a href={c.submissionUrl} target="_blank" rel="noreferrer"
                              style={{ color: "#7a1f33", textDecoration: "underline", fontSize: 13 }}>
                              View Submission
                            </a>
                            {c.submissionNote && (
                              <span style={{ fontStyle: "italic" }}>— "{c.submissionNote}"</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="collab-card-actions">
                        {/* Brand accepted, creator hasn't responded yet */}
                        {c.status === "brand_accepted" && (
                          <button className="collab-action-btn outline" disabled>
                            Awaiting Creator
                          </button>
                        )}

                        {/* Creator submitted work — brand needs to approve */}
                        {c.status === "submitted" && (
                          <button className="collab-action-btn primary"
                            onClick={() => setApproveModal(c._id)}>
                            Approve Work
                          </button>
                        )}

                        {/* Active collab */}
                        {c.status === "active" && (
                          <button className="collab-action-btn outline" disabled>
                            In Progress
                          </button>
                        )}

                        {/* Completed */}
                        {c.status === "completed" && (
                          <button className="collab-action-btn outline">View Summary</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="right-sb">
        <div className="right-card">
          <div className="right-title">Campaign Overview</div>
          <div className="score-ring-big">
            <div className="score-ring-svg-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#lg-brand)" strokeWidth="10"
                  strokeDasharray="314" strokeDashoffset="80"
                  strokeLinecap="round" transform="rotate(-90 60 60)" />
                <defs>
                  <linearGradient id="lg-brand" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c87a4a" />
                    <stop offset="100%" stopColor="#7a1f33" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="score-overlay">
                <div className="score-ring-val">{totalSubmissions}</div>
                <div className="score-ring-lbl">Responses</div>
              </div>
            </div>
          </div>
          <div className="score-factors">
            {[
              { label: "Forms Created", val: forms.length, color: "#7a1f33" },
              { label: "Forms Sent", val: totalSent, color: "#c87a4a" },
              { label: "Responses", val: totalSubmissions, color: "#2f8f53" },
            ].map((f) => (
              <div className="factor-row" key={f.label}>
                <div className="factor-dot" style={{ background: f.color }} />
                <div className="factor-label">{f.label}</div>
                <div className="factor-val">{f.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="right-card">
          <div className="right-title">Top Matches</div>
          {TOP_CREATORS.map((c) => (
            <div className="match-item" key={c.name}>
              <div className="match-logo" style={{ background: c.bg, color: "#fff", fontSize: 11, fontWeight: 700 }}>
                {c.initials}
              </div>
              <div>
                <div className="match-name">{c.name}</div>
                <div className="match-cat">{c.sub.split("·")[0].trim()}</div>
              </div>
              <div className="match-pct pct-98">94%</div>
            </div>
          ))}
        </div>

        <div className="ai-cta-card">
          <div className="ai-cta-title">Creator Outreach</div>
          <div className="ai-cta-sub">Create a form and send it to matched creators — their profile data auto-fills your questions.</div>
          <button className="ai-cta-btn" onClick={handleCreateForm}>+ Create Form</button>
        </div>
      </div>

      {/* ── SEND FORM MODAL ── */}
      {showSendModal && (
        <div className="modal-backdrop" onClick={() => setShowSendModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Send Form to Creator</div>
              <button className="notif-close-btn" onClick={() => setShowSendModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="settings-row-label" style={{ marginBottom: 6 }}>Select Form</p>
              <select className="settings-select" style={{ width: "100%", marginBottom: 16 }}
                value={selectedFormId} onChange={(e) => setSelectedFormId(e.target.value)}>
                <option value="">-- Select a form --</option>
                {forms.map((f) => <option key={f._id} value={f._id}>{f.title}</option>)}
              </select>
              <p className="settings-row-label" style={{ marginBottom: 6 }}>Creator Email</p>
              <input className="settings-input" style={{ width: "100%", boxSizing: "border-box", marginBottom: 16 }}
                type="email" placeholder="e.g. creator@gmail.com"
                value={creatorEmail} onChange={(e) => setCreatorEmail(e.target.value)} />
              {sendError && <p className="field-error">{sendError}</p>}
              {sendMsg && <p style={{ color: "#2f8f53", fontSize: 13 }}>✓ {sendMsg}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn-outline-sm" onClick={() => setShowSendModal(false)}>Cancel</button>
              <button className="btn-primary-sm" onClick={handleSendForm} disabled={sending}
                style={{ padding: "10px 24px" }}>
                {sending ? "Sending..." : "Send Form"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPROVE WORK MODAL ── */}
      {approveModal && (
        <div className="modal-backdrop" onClick={() => setApproveModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Approve Submission</div>
              <button className="notif-close-btn" onClick={() => setApproveModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="settings-row-label" style={{ marginBottom: 6 }}>Feedback for Creator (optional)</p>
              <textarea className="settings-input" rows={3}
                style={{ width: "100%", boxSizing: "border-box", resize: "none" }}
                placeholder="Great work! The content was exactly what we needed..."
                value={approveFeedback} onChange={(e) => setApproveFeedback(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn-outline-sm" onClick={() => setApproveModal(null)}>Cancel</button>
              <button className="btn-primary-sm" onClick={() => approveWork(approveModal)}
                disabled={approveLoading} style={{ padding: "10px 24px" }}>
                {approveLoading ? "Approving..." : "✓ Approve & Complete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}