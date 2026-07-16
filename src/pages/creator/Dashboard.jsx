import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS, CAMPAIGNS, BRAND_MATCHES, CREATORS, SCORE_FACTORS } from "../../scripts/dashboard";
import "../../styles/dashboard.css";
import { useDashboard } from "../../scripts/dashboard";
import { usePosts } from "../../scripts/posts";

export default function Dashboard({ darkMode, setDarkMode, onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, uploadAvatar, avatarUploading, avatarError } = useDashboard();
  const { posts, loading: postsLoading, posting, postError, createPost } = usePosts();

  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePost = async () => {
    const ok = await createPost({ caption, imageFile });
    if (ok) {
      setCaption("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

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
      <span className="nav-icon-wrap">
  {typeof item.icon === "string" ? item.icon : <item.icon size={18} strokeWidth={1.8} />}
</span>
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
              <div className="trust-score-big">92</div>
              <div className="trust-label">Trust Score</div>
            </div>
          </div>
          <div className="badge-row">
            <span className="badge badge-elite">⭐ Elite</span>
            <span className="badge badge-level">Lvl 7</span>
            <span className="badge badge-verified-g">✓ ID'd</span>
          </div>
          <div className="trust-user">
            Nikita Roy <span className="trust-handle">@nikitaroy</span><br />
            <span className="trust-pts">↑ +4 pts this week</span>
          </div>
        </div>
      </div>

      {/* FEED */}
      <div className="feed">

        {/* Profile Card */}
        <div className="card">
          <div className="profile-card-cover">
            <span className="badge badge-verified-g cover-badge">✓ Verified Creator</span>
          </div>
          <div className="profile-card-body">
            <div className="profile-top-row">
              <div className="profile-avatar" style={{ position: "relative", cursor: "pointer" }}
  onClick={() => document.getElementById("avatar-upload").click()}>
  {user?.avatarUrl ? (
    <img src={user.avatarUrl} alt="avatar"
      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
  ) : (
    <span style={{ fontSize: 26 }}>{user?.avatar || "👤"}</span>
  )}
  <div className="verify-dot">✓</div>
  <div style={{
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
    [user?.followers ? `${(user.followers / 1000).toFixed(0)}K` : "0", "Followers"],
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
      </div>
        </div>

        {/* Create Post Box */}
        <div className="card">
          <div className="post-box">
            <div className="post-box-inner">
              <div className="mini-avatar">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                ) : (user?.avatar || "👤")}
              </div>
              <input
                className="post-input"
                style={{ border: "none", outline: "none", background: "transparent", width: "100%", font: "inherit", color: "inherit" }}
                placeholder="What collaboration are you working on today?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            {imagePreview && (
              <div style={{ position: "relative", marginTop: 10 }}>
                <img src={imagePreview} alt="preview" style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 12 }} />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: "pointer" }}
                >✕</button>
              </div>
            )}

            {postError && <p style={{ color: "#a13b3b", fontSize: 12, marginTop: 6 }}>{postError}</p>}

            <div className="post-actions">
              <button className="post-action-btn col1" onClick={() => fileInputRef.current?.click()}>📷 Photo</button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
              <button className="post-action-btn col2" onClick={handlePost} disabled={posting}>
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>

        {/* Real Feed */}
        {postsLoading && (
          <div className="card" style={{ padding: 18, textAlign: "center", opacity: 0.6 }}>Loading posts...</div>
        )}

        {!postsLoading && posts.length === 0 && (
          <div className="card" style={{ padding: 18, textAlign: "center", opacity: 0.6 }}>No posts yet — share your first update!</div>
        )}

        {posts.map((p) => (
          <div className="card" key={p._id}>
            <div className="post-card-inner">
              <div className="post-head">
                <div className="post-ava" style={{ background: "linear-gradient(135deg,#0a1020,#1e2840)" }}>
                  {p.author?.avatarUrl ? (
                    <img src={p.author.avatarUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (p.author?.avatar || "👤")}
                </div>
                <div>
                  <div className="post-name">{p.author?.name || "Unknown"}</div>
                  <div className="post-meta">{p.author?.role === "brand" ? "Brand" : "Creator"}</div>
                </div>
                <div className="post-time">{timeAgo(p.createdAt)}</div>
              </div>

              {p.caption && <div className="post-text">{p.caption}</div>}

              {p.imageUrl && (
                <div className="post-img" style={{ padding: 0 }}>
                  <img src={p.imageUrl} alt="post" style={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 12 }} />
                </div>
              )}

              <div className="post-footer">
                <div className="react-btn">❤️ {p.likes?.length || 0}</div>
                <div className="react-btn">💬 0</div>
                <div className="react-btn">↗️ Share</div>
              </div>
            </div>
          </div>
        ))}

        {/* Trending */}
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

        {/* Trust Score Widget */}
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
        <div className="score-ring-val">92</div>
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

        {/* Brand Matches */}
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

        {/* Creators */}
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

        {/* AI Writer CTA */}
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