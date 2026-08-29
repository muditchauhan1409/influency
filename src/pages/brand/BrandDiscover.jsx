// PASTE PATH: src/pages/brand/BrandDiscover.jsx
import { NICHE_FILTERS, useDiscover } from "../../scripts/discover";
import BrandSidebar from "../../components/brand/BrandSidebar";
import "../../styles/dashboard.css";
import "../../styles/discover.css";

export default function BrandDiscover({ onOpenNotifications, notifUnreadCount }) {
  const {
    query,
    setQuery,
    activeNiche,
    setActiveNiche,
    filteredCreators,
    sendFollowRequest,
    loading,
  } = useDiscover();

  return (
    <div className="inf-wrap discover-wrap">

      {/* LEFT SIDEBAR */}
      <BrandSidebar onOpenNotifications={onOpenNotifications} notifUnreadCount={notifUnreadCount} />

      {/* MAIN CONTENT */}
      <div className="discover-main">

        <div className="discover-header">
          <div className="discover-title">Find Creators</div>
          <div className="discover-sub">Discover creators to collaborate with</div>
        </div>

        <div className="discover-search-row">
          <input
            className="discover-search"
            placeholder="Search creators by name or handle..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="discover-filters">
          {NICHE_FILTERS.map((niche) => (
            <button
              key={niche}
              className={`discover-filter-pill ${activeNiche === niche ? "active" : ""}`}
              onClick={() => setActiveNiche(niche)}
            >
              {niche}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="discover-empty">Loading creators…</p>
        ) : (
          <div className="discover-grid">
            {filteredCreators.map((c) => (
              <div className="discover-card" key={c.id}>
                <div className="discover-card-avatar" style={{ background: c.bg }}>
                  {c.avatarUrl
                    ? <img src={c.avatarUrl} alt={c.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    : c.emoji}
                </div>
                <div className="discover-card-name">{c.name}</div>
                <div className="discover-card-handle">{c.handle}</div>
                <span className="discover-card-niche">{c.niche}</span>
                <div className="discover-card-stats">
                  <div>
                    <p className="discover-stat-val">{c.followers}</p>
                    <p className="discover-stat-lbl">Followers</p>
                  </div>
                  <div className="discover-stat-divider" />
                  <div>
                    <p className="discover-stat-val discover-trust-val">{c.trust}</p>
                    <p className="discover-stat-lbl">Trust</p>
                  </div>
                </div>
                {c.isFollowing ? (
                  <button className="discover-connect-btn" disabled style={{ opacity: 0.6 }}>✓ Following</button>
                ) : c.requestSent ? (
                  <button className="discover-connect-btn" disabled style={{ opacity: 0.6 }}>Requested</button>
                ) : (
                  <button className="discover-connect-btn" onClick={() => sendFollowRequest(c.id)}>+ Connect</button>
                )}
              </div>
            ))}
            {filteredCreators.length === 0 && (
              <p className="discover-empty">No creators match your search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}