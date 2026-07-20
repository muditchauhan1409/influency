// PASTE PATH: src/pages/creator/Dashboard.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS, CAMPAIGNS, BRAND_MATCHES, CREATORS, SCORE_FACTORS } from "../../scripts/dashboard";
import "../../styles/dashboard.css";
import { useDashboard } from "../../scripts/dashboard";
import { useFeed } from "../../scripts/feed";

export default function Dashboard({ darkMode, setDarkMode, onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, uploadAvatar, avatarUploading, avatarError } = useDashboard();
  const { posts, loading: feedLoading, applyToPost, toggleLike } = useFeed();

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

        {NAV_ITEMS.map((item) => {
  const isNotif = item.label === "Notifications";
  const badgeValue = isNotif
    ? (notifUnreadCount > 0 ? notifUnreadCount : null)
    : item.badge;
  const Icon = item.icon;
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
      <span className="nav-emoji">{Icon && <Icon size={18} />}</span>
      <span className="nav-label">{item.label}</span>
      {badgeValue && <span className="nav-badge">{badgeValue}</span>}
    </div>
  );
})}

        <div className="spacer" />

        <div className="trust-card">
          <div className="trust-ring-wrap">
            <svg className="ring-svg" width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="url(#lg1)" strokeWidth="5"
                strokeDasharray="126 141" strokeLinecap="round" />
              <defs>
                <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4A102A" />
                  <stop offset="100%" stopColor="#D4A373" />
                </linearGradient>
              </defs>
            </svg>
            <div className="trust-meta">
              <div className="trust-score-big">{user?.trustScore || 0}</div>
              <div className="trust-label">Trust Score</div>
            </div>
          </div>
          <div className="badge-row">
            <span className="badge badge-elite">⭐ Elite</span>
            <span className="badge badge-level">Lvl 7</span>
            <span className="badge badge-verified-g">✓ ID'd</span>
          </div>
          <div className="trust-user">
            {user?.name || "Creator"}{" "}
            <span className="trust-handle">{user?.handle || ""}</span><br />
            <span className="trust-pts">↑ +4 pts this week</span>
          </div>
        </div>
      </div>

      {/* FEED */}
      <div className="feed">

        {/* Profile Card */}
        <div className="card">
          <div className="profile-card-cover">
            <span className="badge badge-verified-g cover-badge">✓ Verified Creatorss</span>
          </div>
          <div className="profile-card-body">
            <div className="profile-top-row">
              <div
                className="profile-avatar"
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => document.getElementById("avatar-upload").click()}
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar"
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 26 }}>{user?.avatar || "👤"}</span>
                )}
                <div className="verify-dot">✓</div>
                <div
                  style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center",
                    justifyContent: "center", opacity: 0, transition: "opacity 0.2s",
                    fontSize: 18, color: "#fff",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                >
                  {avatarUploading ? "..." : "✎"}
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => uploadAvatar(e.target.files[0])}
                />
              </div>
              <div className="badge-row">
                <span className="badge badge-elite">⭐ Elite</span>
                <span className="badge badge-new">Lvl 7</span>
              </div>
            </div>

            <div className="profile-name-block">
              <div className="profile-name">{user?.name || "Creator"}</div>
              <div className="profile-sub">
                {user?.niches?.[0] || "Creator"} · {user?.location || "India"}
              </div>
            </div>

            <div className="profile-stats">
              {[
                [user?.followers || "0", "Followers"],
                [user?.campaignsCompleted || "0", "Campaigns"],
                [user?.rating ? `${user.rating}★` : "N/A", "Rating"],
                [user?.trustScore || "0", "Trust"],
              ].map(([num, lbl], i) => (
                <div key={lbl} style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                  {i > 0 && <div className="stat-divider" />}
                  <div className="profile-stat">
                    <div className="stat-num" style={lbl === "Trust" ? { color: "#22C55E" } : {}}>
                      {num}
                    </div>
                    <div className="stat-lbl">{lbl}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="btn-row">
              <button className="btn-primary-sm">👤 Connect</button>
              <button className="btn-primary-sm">✨ Collaborate</button>
              <button className="btn-outline-sm">💬 Message</button>
            </div>

            {avatarError && (
              <p style={{ color: "#d9534f", fontSize: 12, marginTop: 8 }}>{avatarError}</p>
            )}
          </div>
        </div>

        {/* MATCHED FEED — Brand posts by niche */}
        {feedLoading ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "#8a7a7e" }}>
            Loading your matched feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: "center", color: "#8a7a7e" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
            <div>No matched posts yet — update your niches in Profile to see relevant brand posts!</div>
          </div>
        ) : (
          posts.map((post) => (
            <div className="card" key={post._id}>
              <div className="post-card-inner">
                <div className="post-head">
                  <div className="post-ava" style={{ background: "linear-gradient(135deg,#7a1f33,#c87a4a)" }}>
                    {post.brandId?.avatarUrl ? (
                      <img src={post.brandId.avatarUrl} alt="brand"
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      post.brandId?.name?.[0] || "B"
                    )}
                  </div>
                  <div>
                    <div className="post-name">{post.brandId?.name || "Brand"}</div>
                    <div className="post-meta">
                      {post.niches?.join(" · ")}
                      {post.matchScore && (
                        <span className="badge badge-verified-g" style={{ marginLeft: 8, fontSize: 10 }}>
                          {post.matchScore}% match
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="post-time">
                    {new Date(post.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>

                <div className="post-text">
                  <strong style={{ color: "#2a1a1f" }}>{post.title}</strong>
                  {post.description && <><br />{post.description}</>}
                </div>

                {post.imageUrl && (
                  <div className="post-img">
                    <img src={post.imageUrl} alt={post.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {post.budget && (
                      <div className="post-img-label">Budget: {post.budget}</div>
                    )}
                  </div>
                )}

                {post.budget && !post.imageUrl && (
                  <div className="collab-banner">
                    <div className="collab-check">₹</div>
                    <div>
                      <div className="collab-title">Budget</div>
                      <div className="collab-sub">{post.budget}</div>
                    </div>
                  </div>
                )}

                <div className="post-footer">
                  <div className="react-btn" onClick={() => toggleLike(post._id)}>
                    {post.liked ? "❤️" : "🤍"} {post.likes?.length || 0}
                  </div>
                  <div className="react-btn">💬 Comment</div>
                  <div className="react-btn" onClick={async () => {
                    const res = await applyToPost(post._id);
                    alert(res.message);
                  }}>
                    ✨ Apply
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Trending Opportunities */}
        <div className="card trending-card">
          <div className="trend-section-title">
            🔥 Trending Opportunities <span className="hot-tag">HOT</span>
          </div>
          <div className="campaigns-list">
            {CAMPAIGNS.map((c) => (
              <div className="campaign-card" key={c.id}>
                <div className="campaign-head">
                  <div className="brand-logo" style={c.logoStyle}>
                    <img src={c.logo} alt={c.name} className="brand-logo-img" />
                  </div>
                  <div>
                    <div className="brand-name">{c.name}</div>
                    <div className="brand-cat">{c.cat}</div>
                  </div>
                  <button className="apply-btn">Apply →</button>
                </div>
                <div className="campaign-pills">
                  <span className="pill pill-budget">{c.budget}</span>
                  <span className="pill pill-cat">{c.tag}</span>
                  <span className="pill pill-dead">Closes in {c.closes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR */}
      <div className="right-sb">

        <div className="right-card">
          <div className="right-title">Your Trust Score</div>
          <div className="score-ring-big">
            <div className="score-ring-svg-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(122,31,51,0.12)" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#lg2)" strokeWidth="10"
                  strokeDasharray="314" strokeDashoffset="57"
                  strokeLinecap="round" transform="rotate(-90 60 60)" />
                <defs>
                  <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c87a4a" />
                    <stop offset="100%" stopColor="#7a1f33" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="score-overlay">
                <div className="score-ring-val">{user?.trustScore || 0}</div>
                <div className="score-ring-lbl">/ 100 · ELITE</div>
              </div>
            </div>
          </div>
          <div className="score-factors">
            {SCORE_FACTORS.map((f) => (
              <div className="factor-row" key={f.label}>
                <div className="factor-dot" style={{ background: f.color }} />
                <div className="factor-label">{f.label}</div>
                <div className="factor-val">{f.val}</div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="score-week">↑ +4 pts this week · Keep going!</div>
        </div>

        <div className="right-card">
          <div className="right-title">Brand Matches</div>
          {BRAND_MATCHES.map((b) => (
            <div className="match-item" key={b.id}>
              <div className="match-logo" style={b.logoStyle}>
                <img src={b.logo} alt={b.name} className="brand-logo-img" />
              </div>
              <div>
                <div className="match-name">{b.name}</div>
                <div className="match-cat">{b.cat}</div>
              </div>
              <div className={`match-pct ${b.cls}`}>{b.pct}%</div>
            </div>
          ))}
        </div>

        <div className="right-card">
          <div className="right-title">Creators to Connect</div>
          {CREATORS.map((c) => (
            <div className="creator-sugg" key={c.name}>
              <div className="sugg-ava" style={{ background: c.bg }}>{c.emoji}</div>
              <div>
                <div className="sugg-name">{c.name}</div>
                <div className="sugg-sub">{c.sub}</div>
              </div>
              <button className="sugg-connect">+ Connect</button>
            </div>
          ))}
        </div>

        <div className="ai-cta-card">
          <div style={{ fontSize: 18, marginBottom: 8 }}>🤖</div>
          <div className="ai-cta-title">AI Proposal Writer</div>
          <div className="ai-cta-sub">Generate tailored brand proposals in seconds. Personalised to each campaign.</div>
          <button className="ai-cta-btn">✨ Try AI Writer</button>
        </div>

      </div>
    </div>
  );
}