// PASTE PATH: src/components/CollabSummaryModal.jsx

const AVATAR_BG = "linear-gradient(135deg,#7a1f33,#c87a4a)";

export default function CollabSummaryModal({ collab, onClose, viewerRole }) {
  if (!collab) return null;

  // Backend field names differ by source (creator-side is remapped, brand-side is raw populate)
  const post = collab.post || collab.postId || {};
  const brand = collab.brand || collab.brandId || {};
  const creator = collab.creator || collab.creatorId || {};
  const otherParty = viewerRole === "brand" ? creator : brand;
  const otherLabel = viewerRole === "brand" ? "Creator" : "Brand";
  const initials = (otherParty?.name || otherLabel).substring(0, 2).toUpperCase();

  const timeline = [
    { label: "Accepted by Brand", date: collab.brandAcceptedAt, done: !!collab.brandAcceptedAt },
    { label: "Confirmed by Creator", date: collab.creatorAcceptedAt, done: !!collab.creatorAcceptedAt },
    { label: "Work Submitted", date: collab.submittedAt, done: !!collab.submittedAt },
    { label: "Approved & Completed", date: collab.completedAt, done: !!collab.completedAt },
  ];

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

  const durationDays = (() => {
    if (!collab.brandAcceptedAt || !collab.completedAt) return null;
    const ms = new Date(collab.completedAt) - new Date(collab.brandAcceptedAt);
    return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
  })();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div className="modal-title">Collaboration Summary</div>
          <button className="notif-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: 520, overflowY: "auto" }}>

          {/* Campaign header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "4px 0 16px", borderBottom: "1px solid rgba(122,31,51,0.08)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: "rgba(122,31,51,0.08)", border: "1px solid rgba(122,31,51,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>
              📋
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: "#2a1a1f" }}>
                {post.title || "Campaign"}
              </div>
              {post.budget && (
                <div style={{ fontSize: 12.5, color: "#c87a4a", fontWeight: 600, marginTop: 2 }}>
                  {post.budget}
                </div>
              )}
            </div>
            <span className="settings-tag green" style={{ flexShrink: 0 }}>✓ Completed</span>
          </div>

          {/* Niches */}
          {post.niches?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px 0", borderBottom: "1px solid rgba(122,31,51,0.08)" }}>
              {post.niches.map((n) => (
                <span key={n} className="pill pill-cat">{n}</span>
              ))}
            </div>
          )}

          {/* Other party — actual creator/brand */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "16px 0", borderBottom: "1px solid rgba(122,31,51,0.08)",
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
              background: AVATAR_BG, color: "#fff", fontWeight: 700, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
              {otherParty?.avatarUrl ? (
                <img src={otherParty.avatarUrl} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : initials}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#2a1a1f" }}>
                {otherParty?.name || `Unknown ${otherLabel}`}
              </div>
              <div style={{ fontSize: 12, color: "#8a7a7e" }}>
                {otherParty?.username ? `@${otherParty.username}` : otherLabel}
              </div>
            </div>
            {durationDays && (
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#7a1f33" }}>{durationDays}d</div>
                <div style={{ fontSize: 10.5, color: "#8a7a7e" }}>to complete</div>
              </div>
            )}
          </div>

          {/* Timeline with connecting line */}
          <div style={{ padding: "18px 0" }}>
            <div className="settings-row-label" style={{ marginBottom: 14 }}>Timeline</div>
            <div style={{ position: "relative", paddingLeft: 4 }}>
              {timeline.map((t, i) => (
                <div key={t.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, position: "relative" }}>
                  {/* connecting line */}
                  {i < timeline.length - 1 && (
                    <div style={{
                      position: "absolute", left: 9, top: 22, width: 2, height: 32,
                      background: timeline[i + 1].done ? "#2f8f53" : "rgba(122,31,51,0.15)",
                    }} />
                  )}
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0, zIndex: 1,
                    background: t.done ? "#2f8f53" : "#fdf6f3",
                    border: t.done ? "none" : "1px solid rgba(122,31,51,0.2)",
                    color: t.done ? "#fff" : "#8a7a7e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {t.done ? "✓" : i + 1}
                  </div>
                  <div style={{ paddingBottom: i < timeline.length - 1 ? 26 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.done ? "#2a1a1f" : "#b0a0a4" }}>
                      {t.label}
                    </div>
                    {t.date ? (
                      <div style={{ fontSize: 11.5, color: "#8a7a7e", marginTop: 1 }}>{fmt(t.date)}</div>
                    ) : (
                      <div style={{ fontSize: 11.5, color: "#c9b8bc", marginTop: 1 }}>Not yet reached</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission */}
          {collab.submissionUrl && (
            <div style={{ padding: "16px 0", borderTop: "1px solid rgba(122,31,51,0.08)" }}>
              <div className="settings-row-label" style={{ marginBottom: 8 }}>Submitted Work</div>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#fdf6f3", border: "1px solid rgba(122,31,51,0.1)",
                borderRadius: 10, padding: "10px 12px",
              }}>
                <span style={{ fontSize: 14 }}>🔗</span>
                <a href={collab.submissionUrl} target="_blank" rel="noreferrer"
                  style={{ color: "#7a1f33", fontSize: 12.5, wordBreak: "break-all", flex: 1, fontWeight: 500 }}>
                  {collab.submissionUrl}
                </a>
              </div>
              {collab.submissionNote && (
                <p style={{ fontSize: 12.5, color: "#4a3438", marginTop: 8, fontStyle: "italic", lineHeight: 1.6 }}>
                  "{collab.submissionNote}"
                </p>
              )}
            </div>
          )}

          {/* Brand feedback */}
          {collab.brandFeedback && (
            <div style={{ padding: "16px 0", borderTop: "1px solid rgba(122,31,51,0.08)" }}>
              <div className="settings-row-label" style={{ marginBottom: 8 }}>Brand Feedback</div>
              <div style={{
                background: "rgba(47,143,83,0.06)", border: "1px solid rgba(47,143,83,0.15)",
                borderRadius: 10, padding: "12px 14px",
              }}>
                <p style={{ fontSize: 13, color: "#2a1a1f", lineHeight: 1.6, margin: 0 }}>
                  "{collab.brandFeedback}"
                </p>
              </div>
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