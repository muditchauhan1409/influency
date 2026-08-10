// PASTE PATH: src/components/CollabSummaryModal.jsx
export default function CollabSummaryModal({ collab, onClose, viewerRole }) {
  if (!collab) return null;

  const otherParty = viewerRole === "brand" ? collab.creator : collab.brand;
  const otherLabel = viewerRole === "brand" ? "Creator" : "Brand";

  const timeline = [
    { label: "Accepted by Brand", date: collab.brandAcceptedAt, done: !!collab.brandAcceptedAt },
    { label: "Confirmed by Creator", date: collab.creatorAcceptedAt, done: !!collab.creatorAcceptedAt },
    { label: "Work Submitted", date: collab.submittedAt, done: !!collab.submittedAt },
    { label: "Approved & Completed", date: collab.completedAt, done: !!collab.completedAt },
  ];

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <div className="modal-title">Collaboration Summary</div>
          <button className="notif-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: 480, overflowY: "auto" }}>
          {/* Campaign info */}
          <div className="settings-row" style={{ padding: "0 0 14px", borderBottom: "1px solid rgba(122,31,51,0.08)" }}>
            <div className="settings-row-icon" style={{ fontSize: 22 }}>📋</div>
            <div className="settings-row-info">
              <div className="settings-row-label" style={{ fontSize: 15 }}>
                {collab.post?.title || "Campaign"}
              </div>
              <div className="settings-row-sub">
                {collab.post?.niches?.join(" · ")} {collab.post?.budget && `· ${collab.post.budget}`}
              </div>
            </div>
            <span className="settings-tag green">✓ Completed</span>
          </div>

          {/* Other party */}
          <div className="settings-row" style={{ padding: "14px 0", borderBottom: "1px solid rgba(122,31,51,0.08)" }}>
            <div className="settings-row-icon">
              {otherParty?.avatarUrl ? (
                <img src={otherParty.avatarUrl} alt=""
                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
              ) : "👤"}
            </div>
            <div className="settings-row-info">
              <div className="settings-row-label">{otherParty?.name || otherLabel}</div>
              <div className="settings-row-sub">{otherLabel}</div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ padding: "16px 0" }}>
            <div className="settings-row-label" style={{ marginBottom: 12 }}>Timeline</div>
            {timeline.map((t, i) => (
              <div key={t.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < timeline.length - 1 ? 14 : 0 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: t.done ? "#2f8f53" : "rgba(122,31,51,0.1)",
                  color: t.done ? "#fff" : "#8a7a7e",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, marginTop: 1,
                }}>
                  {t.done ? "✓" : i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.done ? "#2a1a1f" : "#8a7a7e" }}>
                    {t.label}
                  </div>
                  {t.date && (
                    <div style={{ fontSize: 11.5, color: "#8a7a7e", marginTop: 1 }}>{fmt(t.date)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submission */}
          {collab.submissionUrl && (
            <div style={{ padding: "14px 0", borderTop: "1px solid rgba(122,31,51,0.08)" }}>
              <div className="settings-row-label" style={{ marginBottom: 6 }}>Submitted Work</div>
              <a href={collab.submissionUrl} target="_blank" rel="noreferrer"
                style={{ color: "#7a1f33", textDecoration: "underline", fontSize: 13, wordBreak: "break-all" }}>
                {collab.submissionUrl}
              </a>
              {collab.submissionNote && (
                <p style={{ fontSize: 12.5, color: "#4a3438", marginTop: 6, fontStyle: "italic" }}>
                  "{collab.submissionNote}"
                </p>
              )}
            </div>
          )}

          {/* Brand feedback */}
          {collab.brandFeedback && (
            <div style={{ padding: "14px 0", borderTop: "1px solid rgba(122,31,51,0.08)" }}>
              <div className="settings-row-label" style={{ marginBottom: 6 }}>Brand Feedback</div>
              <p style={{ fontSize: 13, color: "#2a1a1f", lineHeight: 1.6 }}>
                "{collab.brandFeedback}"
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-outline-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}