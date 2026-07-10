// PASTE PATH: src/pages/Collaborations.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../scripts/dashboard";
import { COLLAB_TABS, useCollaborations } from "../scripts/collaborations";
import "../styles/dashboard.css";
import "../styles/collaborations.css";
import "../styles/formInbox.css";

export default function Collaborations({ onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activeTab, setActiveTab, filtered, counts,
    forms, formsLoading,
    activeForm, formAnswers,
    updateAnswer, openForm, submitForm, closeForm,
    submitting, submitSuccess,
  } = useCollaborations();

  return (
    <div className="inf-wrap discover-wrap">

      {/* LEFT SIDEBAR */}
      <div className="left-sb">
        <div className="logo-block">
          <div className="logo-icon">✦</div>
          <div className="logo-text">
            <span className="logo-gold">Influ</span>
            <span className="logo-white">ency</span>
          </div>
        </div>

        {NAV_ITEMS.map((item) => {
          const isNotif = item.label === "Notifications";
          const badgeValue = isNotif
            ? (notifUnreadCount > 0 ? notifUnreadCount : null)
            : item.badge;
          return (
            <div
              key={item.label}
              className={`nav-item ${!isNotif && location.pathname === item.path ? "active" : ""}`}
              onClick={() =>
                isNotif
                  ? onOpenNotifications && onOpenNotifications()
                  : item.path && navigate(item.path)
              }
            >
              <span className="nav-emoji">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {badgeValue && <span className="nav-badge">{badgeValue}</span>}
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="discover-main">

        <div className="discover-header">
          <div className="discover-title">Collaborations</div>
          <div className="discover-sub">Track your brand partnerships and fill incoming forms</div>
        </div>

        <div className="collab-tabs">
          {COLLAB_TABS.map((tab) => (
            <button
              key={tab}
              className={`collab-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {counts[tab] > 0 && (
                <span className="collab-tab-count">{counts[tab]}</span>
              )}
            </button>
          ))}
        </div>

        {/* FORMS TAB */}
        {activeTab === "Forms" && (
          <div className="form-inbox">
            {formsLoading ? (
              <p className="discover-empty">Loading forms...</p>
            ) : submitSuccess ? (
              <div className="form-success">
                <div className="form-success-icon">✓</div>
                <div className="form-success-title">Form Submitted!</div>
                <div className="form-success-sub">Your response has been sent to the brand.</div>
                <button className="collab-action-btn primary" onClick={() => setActiveTab("Forms")}>
                  Back to Forms
                </button>
              </div>
            ) : activeForm ? (
              /* FORM FILL VIEW */
              <div className="form-fill-wrap">
                <div className="form-fill-header">
                  <button className="back-link" onClick={closeForm}>← Back</button>
                  <div>
                    <div className="form-fill-title">{activeForm.title}</div>
                    <div className="form-fill-brand">
                      From: {activeForm.brand?.name || "Brand"}
                    </div>
                  </div>
                  <div className="badge badge-verified-g">Auto-filled from profile</div>
                </div>

                <div className="form-fill-body">
                  {activeForm.questions.map((q) => (
                    <div className="form-field" key={q.id}>
                      <label className="form-field-label">
                        {q.label}
                        {q.required && <span className="form-required">*</span>}
                        {q.profileField && (
                          <span className="form-autofill-tag">⚡ Auto-filled</span>
                        )}
                      </label>

                      {q.type === "text" && (
                        <input
                          className="settings-input form-input"
                          value={formAnswers[q.id] || ""}
                          onChange={(e) => updateAnswer(q.id, e.target.value)}
                          placeholder={`Enter ${q.label.toLowerCase()}...`}
                        />
                      )}

                      {q.type === "textarea" && (
                        <textarea
                          className="settings-input form-input"
                          rows={3}
                          value={formAnswers[q.id] || ""}
                          onChange={(e) => updateAnswer(q.id, e.target.value)}
                          placeholder={`Enter ${q.label.toLowerCase()}...`}
                        />
                      )}

                      {q.type === "select" && (
                        <select
                          className="settings-select form-input"
                          value={formAnswers[q.id] || ""}
                          onChange={(e) => updateAnswer(q.id, e.target.value)}
                        >
                          <option value="">Select an option</option>
                          {q.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {q.type === "multiselect" && (
                        <div className="form-multiselect">
                          {q.options.map((opt) => {
                            const selected = Array.isArray(formAnswers[q.id])
                              ? formAnswers[q.id].includes(opt)
                              : false;
                            return (
                              <button
                                key={opt}
                                className={`chip ${selected ? "chip-active" : ""}`}
                                onClick={() => {
                                  const current = Array.isArray(formAnswers[q.id])
                                    ? formAnswers[q.id] : [];
                                  updateAnswer(
                                    q.id,
                                    selected
                                      ? current.filter((v) => v !== opt)
                                      : [...current, opt]
                                  );
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="form-fill-footer">
                  <button className="btn-outline-sm" onClick={closeForm}>Cancel</button>
                  <button
                    className="btn-primary-sm"
                    onClick={submitForm}
                    disabled={submitting}
                    style={{ padding: "10px 24px" }}
                  >
                    {submitting ? "Submitting..." : "Submit Form"}
                  </button>
                </div>
              </div>
            ) : (
              /* FORMS LIST */
              forms.length === 0 ? (
                <div className="discover-empty">
                  No forms received yet — brands will send forms here when they want to collaborate!
                </div>
              ) : (
                <div className="collab-list">
                  {forms.map((form) => (
                    <div className="collab-card" key={form._id}>
                      <div className="collab-card-logo"
                        style={{ background: "linear-gradient(135deg,#7a1f33,#c87a4a)", color: "#fff" }}>
                        {form.brand?.name?.[0] || "B"}
                      </div>
                      <div className="collab-card-info">
                        <div className="collab-card-top">
                          <div className="collab-card-brand">{form.title}</div>
                          <span className={`collab-status-tag ${form.status}`}>
                            {form.status === "pending" ? "Pending" : "Submitted"}
                          </span>
                        </div>
                        <div className="collab-card-campaign">
                          From: {form.brand?.name || "Brand"}
                        </div>
                        <div className="collab-card-meta">
                          <span>Received: {new Date(form.sentAt).toLocaleDateString("en-IN")}</span>
                          {form.status === "submitted" && (
                            <>
                              <span className="collab-dot">•</span>
                              <span className="collab-trust-earned">Submitted</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="collab-card-actions">
                        {form.status === "pending" ? (
                          <button
                            className="collab-action-btn primary"
                            onClick={() => openForm(form._id)}
                          >
                            Fill Form
                          </button>
                        ) : (
                          <button className="collab-action-btn outline" disabled>
                            Submitted
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* OTHER TABS */}
        {activeTab !== "Forms" && (
          <div className="collab-list">
            {filtered.map((c) => (
              <div className="collab-card" key={c.id}>
                <div className="collab-card-logo" style={{ background: c.bg }}>
                  {c.initials}
                </div>
                <div className="collab-card-info">
                  <div className="collab-card-top">
                    <div className="collab-card-brand">{c.brand}</div>
                    <span className={`collab-status-tag ${c.status.toLowerCase()}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="collab-card-campaign">{c.campaign}</div>
                  <div className="collab-card-meta">
                    <span>{c.budget}</span>
                    <span className="collab-dot">•</span>
                    <span>{c.deadline}</span>
                    {c.earnedTrust && (
                      <>
                        <span className="collab-dot">•</span>
                        <span className="collab-trust-earned">+{c.earnedTrust} trust pts earned</span>
                      </>
                    )}
                  </div>
                  {c.status === "Active" && (
                    <div className="collab-progress-bar">
                      <span style={{ width: `${c.progress}%` }} />
                    </div>
                  )}
                </div>
                <div className="collab-card-actions">
                  {c.status === "Active" && (
                    <button className="collab-action-btn primary">View Details</button>
                  )}
                  {c.status === "Pending" && (
                    <>
                      <button className="collab-action-btn primary">Accept</button>
                      <button className="collab-action-btn outline">Decline</button>
                    </>
                  )}
                  {c.status === "Completed" && (
                    <button className="collab-action-btn outline">View Summary</button>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="discover-empty">No {activeTab.toLowerCase()} collaborations yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}