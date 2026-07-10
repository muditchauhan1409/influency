const ACTIVE_CAMPAIGNS = [
  {
    id: 1, icon: "👟", name: "Summer Drop",
    meta: "Fashion · 8 creators", amount: "₹1.2L",
    progress: 72, status: "Active", statusClass: "s-active",
    bg: "#FEF3E2"
  },
  {
    id: 2, icon: "🏃", name: "Run With Nike",
    meta: "Fitness · 5 creators", amount: "₹86K",
    progress: 45, status: "In Review", statusClass: "s-review",
    bg: "#EEF2FF"
  },
  {
    id: 3, icon: "🌿", name: "Sustainable Style",
    meta: "Lifestyle · 3 creators", amount: "₹60K",
    progress: 20, status: "Pending", statusClass: "s-pending",
    bg: "#F0FDF4"
  },
];

const SUGGESTED_CREATORS = [
  { name: "Aria Chen",    cat: "Fashion · 2.4M followers",  trust: 94, emoji: "👗", bg: "linear-gradient(135deg,#3d1a2e,#651B36)" },
  { name: "Kai Nakamura", cat: "Fitness · 620K followers",  trust: 83, emoji: "💪", bg: "linear-gradient(135deg,#1a1a0a,#2a2a10)" },
  { name: "Zoe Williams", cat: "Travel · 1.7M followers",   trust: 91, emoji: "✈️", bg: "linear-gradient(135deg,#0a1a3d,#0e1e40)" },
  { name: "Sofia Lopes",  cat: "Beauty · 3.1M followers",   trust: 96, emoji: "💄", bg: "linear-gradient(135deg,#2d0a1a,#3d0e20)" },
];

const RECENT_ACTIVITY = [
  { dot: "#166534", text: <><strong>@ariastyle</strong> submitted content for Summer Drop</>, time: "2m" },
  { dot: "#651B36", text: <><strong>@kai.fit</strong> accepted your campaign invite</>,        time: "1h" },
  { dot: "#92400e", text: <>3 new applications for <strong>Run With Nike</strong></>,          time: "3h" },
  { dot: "#D4A373", text: <><strong>Sofia Lopes</strong> left a 5★ review</>,                 time: "5h" },
];

const DEADLINES = [
  { day: "11", mon: "JUL", title: "Summer Drop",      sub: "Content submission due",  status: "2 days",  cls: "s-active"  },
  { day: "18", mon: "JUL", title: "Run With Nike",    sub: "Campaign goes live",      status: "9 days",  cls: "s-review"  },
  { day: "25", mon: "JUL", title: "Sustainable Style",sub: "Final review & sign-off", status: "16 days", cls: "s-pending" },
];

const MESSAGES = [
  { name: "@ariastyle",  preview: "Sent the draft reel for your review...", time: "2m",  unread: true  },
  { name: "@kai.fit",    preview: "Ready to go live on Friday!",            time: "1h",  unread: true  },
  { name: "@zoetravel",  preview: "Love the brief, let's make it happen",   time: "3h",  unread: false },
  { name: "@marcofood",  preview: "Can we discuss the deliverables?",       time: "1d",  unread: false },
];

const TRENDS = [
  { name: "Streetwear",     val: "+41%" },
  { name: "Fitness Drops",  val: "+28%" },
  { name: "Sustainability", val: "+35%" },
  { name: "Reels Collabs",  val: "+52%" },
];

export default function BrandFeed() {
  return (
    <div className="feed">

      {/* TOP NAV */}
      <div className="brand-topnav">
        <div className="brand-topnav-left">
          <h2>Good morning, Nike India 👋</h2>
          <p>Wednesday, 9 July 2026</p>
        </div>
        <div className="brand-topnav-right">
          <button className="brand-new-campaign-btn">
            ＋ New Campaign
          </button>
          <div className="brand-icon-btn">🔔</div>
          <div className="brand-icon-btn">🔍</div>
        </div>
      </div>

      {/* WELCOME CARD */}
      <div className="brand-welcome-card">
        <div className="bw-left">
          <div className="bw-logo">N</div>
          <div>
            <div className="bw-title">Welcome back, Nike India ✦</div>
            <div className="bw-sub">
              You have 12 pending applications and 3 active campaigns running.
            </div>
            <div className="bw-badges">
              <span className="bw-badge-verified">✓ Verified Brand</span>
              <span className="bw-badge-elite">⭐ Elite Status</span>
            </div>
          </div>
        </div>
        <div className="bw-right">
          <button className="bw-btn-outline">View Profile</button>
          <button className="bw-btn-gold">Find Creators</button>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="brand-quick-actions">
        <div className="brand-qa-card">
          <div className="brand-qa-icon">📣</div>
          <div className="brand-qa-label">Launch Campaign</div>
          <div className="brand-qa-sub">Create a new collab</div>
        </div>
        <div className="brand-qa-card">
          <div className="brand-qa-icon">🔍</div>
          <div className="brand-qa-label">Browse Creators</div>
          <div className="brand-qa-sub">AI-matched for you</div>
        </div>
        <div className="brand-qa-card">
          <div className="brand-qa-icon">📋</div>
          <div className="brand-qa-label">Review Applications</div>
          <div className="brand-qa-sub">12 awaiting review</div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="brand-stats-row">
        <div className="brand-stat-card">
          <div className="brand-stat-icon">📣</div>
          <div className="brand-stat-label">Active Campaigns</div>
          <div className="brand-stat-val">3</div>
          <div className="brand-stat-delta delta-up">↑ 1 added this month</div>
        </div>
        <div className="brand-stat-card">
          <div className="brand-stat-icon">💰</div>
          <div className="brand-stat-label">Campaign Budget</div>
          <div className="brand-stat-val">₹4.2L</div>
          <div className="brand-stat-delta delta-warn">68% utilized</div>
        </div>
        <div className="brand-stat-card">
          <div className="brand-stat-icon">👁️</div>
          <div className="brand-stat-label">Campaign Reach</div>
          <div className="brand-stat-val">8.4M</div>
          <div className="brand-stat-delta delta-up">↑ 23% vs last month</div>
        </div>
        <div className="brand-stat-card">
          <div className="brand-stat-icon">📈</div>
          <div className="brand-stat-label">ROI</div>
          <div className="brand-stat-val">3.8×</div>
          <div className="brand-stat-delta delta-up">₹10.87L returned</div>
        </div>
      </div>

      {/* ACTIVE CAMPAIGNS */}
      <div className="brand-feed-card">
        <div className="brand-section-head">
          <div className="brand-section-title">Active Campaigns</div>
          <button className="brand-section-link">Manage all →</button>
        </div>
        {ACTIVE_CAMPAIGNS.map((c) => (
          <div className="brand-campaign-card" key={c.id}>
            <div className="brand-camp-head">
              <div
                className="brand-camp-icon"
                style={{ background: c.bg }}
              >
                {c.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className="brand-camp-name">{c.name}</div>
                <div className="brand-camp-meta">{c.meta}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="brand-camp-amount">{c.amount}</div>
                <span className={`brand-camp-status ${c.statusClass}`}>
                  {c.status}
                </span>
              </div>
            </div>
            <div className="brand-prog-wrap">
              <div className="brand-prog-labels">
                <span className="brand-prog-lbl">Progress</span>
                <span className="brand-prog-pct">{c.progress}%</span>
              </div>
              <div className="brand-prog-track">
                <div
                  className="brand-prog-fill"
                  style={{ width: `${c.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SUGGESTED CREATORS */}
      <div className="brand-feed-card">
        <div className="brand-section-head">
          <div className="brand-section-title">Suggested Creators</div>
          <button className="brand-section-link">Browse all →</button>
        </div>
        <div className="brand-ai-notice">
          🤖 AI matched based on your campaign goals
        </div>
        {SUGGESTED_CREATORS.map((c) => (
          <div className="brand-creator-row" key={c.name}>
            <div
              className="brand-creator-ava"
              style={{ background: c.bg }}
            >
              {c.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div className="brand-creator-name">{c.name}</div>
              <div className="brand-creator-cat">{c.cat}</div>
            </div>
            <div className="brand-creator-score">{c.trust}</div>
            <button className="brand-invite-btn">Invite</button>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY + MESSAGES side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* RECENT ACTIVITY */}
        <div className="brand-feed-card" style={{ marginBottom: 0 }}>
          <div className="brand-section-head">
            <div className="brand-section-title">Recent Activity</div>
          </div>
          {RECENT_ACTIVITY.map((a, i) => (
            <div className="brand-act-item" key={i}>
              <div className="brand-act-dot" style={{ background: a.dot }} />
              <div className="brand-act-text">{a.text}</div>
              <div className="brand-act-time">{a.time}</div>
            </div>
          ))}
        </div>

        {/* MESSAGES */}
        <div className="brand-feed-card" style={{ marginBottom: 0 }}>
          <div className="brand-section-head">
            <div className="brand-section-title">Recent Messages</div>
            <button className="brand-section-link">View all →</button>
          </div>
          {MESSAGES.map((m, i) => (
            <div className="brand-msg-item" key={i}>
              <div className={m.unread ? "brand-msg-unread" : "brand-msg-read"} />
              <div style={{ flex: 1 }}>
                <div className="brand-msg-name">{m.name}</div>
                <div className="brand-msg-preview">{m.preview}</div>
              </div>
              <div className="brand-msg-time">{m.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DEADLINES + TRENDING side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* UPCOMING DEADLINES */}
        <div className="brand-feed-card" style={{ marginBottom: 0 }}>
          <div className="brand-section-head">
            <div className="brand-section-title">Upcoming Deadlines</div>
            <button className="brand-section-link">Calendar →</button>
          </div>
          {DEADLINES.map((d, i) => (
            <div className="brand-dl-item" key={i}>
              <div className="brand-dl-cal">
                <div className="brand-dl-day">{d.day}</div>
                <div className="brand-dl-mon">{d.mon}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="brand-dl-title">{d.title}</div>
                <div className="brand-dl-sub">{d.sub}</div>
              </div>
              <span className={`brand-camp-status ${d.cls}`}>{d.status}</span>
            </div>
          ))}
        </div>

        {/* TRENDING */}
        <div className="brand-feed-card" style={{ marginBottom: 0 }}>
          <div className="brand-section-head">
            <div className="brand-section-title">Trending in Your Category</div>
            <button className="brand-section-link">Explore →</button>
          </div>
          <div className="brand-trend-grid">
            {TRENDS.map((t) => (
              <div className="brand-trend-pill" key={t.name}>
                <div className="brand-trend-name">{t.name}</div>
                <div className="brand-trend-val">{t.val} ↑</div>
              </div>
            ))}
          </div>

          {/* CREATOR RESPONSES */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(74,16,42,0.06)" }}>
            <div className="brand-section-title" style={{ fontSize: 13, marginBottom: 10 }}>
              Creator Responses
            </div>
            <div className="brand-resp-grid">
              <div>
                <div className="brand-resp-val" style={{ color: "#166534" }}>35</div>
                <div className="brand-resp-lbl">Accepted</div>
              </div>
              <div>
                <div className="brand-resp-val" style={{ color: "#92400e" }}>12</div>
                <div className="brand-resp-lbl">Pending</div>
              </div>
              <div>
                <div className="brand-resp-val" style={{ color: "#8B7355" }}>5</div>
                <div className="brand-resp-lbl">Declined</div>
              </div>
            </div>
            <div className="brand-prog-track" style={{ marginTop: 8 }}>
              <div className="brand-prog-fill" style={{ width: "67%" }} />
            </div>
            <div style={{ fontSize: 10, color: "#8B7355", marginTop: 4, textAlign: "right" }}>
              67% acceptance rate
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}