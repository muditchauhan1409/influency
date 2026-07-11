// PASTE PATH: src/pages/Discover.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../scripts/dashboard";
import { NICHE_FILTERS, useDiscover } from "../../scripts/discover";
import "../../styles/dashboard.css";
import "../../styles/discover.css";

export default function Discover({ onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    view,
    setView,
    query,
    setQuery,
    activeNiche,
    setActiveNiche,
    filteredCreators,
    filteredBrands,
  } = useDiscover();

  return (
    <div className="inf-wrap discover-wrap">

      {/* LEFT SIDEBAR — same as dashboard */}
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
          <div className="discover-title">Discover</div>
          <div className="discover-sub">Find creators and brands to collaborate with</div>
        </div>

        <div className="discover-toggle">
          <button
            className={`discover-toggle-btn ${view === "creators" ? "active" : ""}`}
            onClick={() => setView("creators")}
          >
            Creators
          </button>
          <button
            className={`discover-toggle-btn ${view === "brands" ? "active" : ""}`}
            onClick={() => setView("brands")}
          >
            Brands
          </button>
        </div>

        <div className="discover-search-row">
          <input
            className="discover-search"
            placeholder={view === "creators" ? "Search creators by name or handle..." : "Search brands by name or category..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {view === "creators" && (
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
        )}

        {view === "creators" ? (
          <div className="discover-grid">
            {filteredCreators.map((c) => (
              <div className="discover-card" key={c.id}>
                <div className="discover-card-avatar" style={{ background: c.bg }}>
                  {c.emoji}
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
                <button className="discover-connect-btn">+ Connect</button>
              </div>
            ))}
            {filteredCreators.length === 0 && (
              <p className="discover-empty">No creators match your search.</p>
            )}
          </div>
        ) : (
          <div className="discover-grid">
            {filteredBrands.map((b) => (
              <div className="discover-card discover-brand-card" key={b.id}>
                <div className="discover-card-avatar discover-brand-logo" style={{ background: b.bg }}>
                  {b.initials}
                </div>
                <div className="discover-card-name">{b.name}</div>
                <div className="discover-card-handle">{b.category}</div>
                <div className="discover-card-stats">
                  <div>
                    <p className="discover-stat-val">{b.budget}</p>
                    <p className="discover-stat-lbl">Avg Budget</p>
                  </div>
                  <div className="discover-stat-divider" />
                  <div>
                    <p className="discover-stat-val">{b.openCampaigns}</p>
                    <p className="discover-stat-lbl">Open Campaigns</p>
                  </div>
                </div>
                <button className="discover-connect-btn">View Campaigns</button>
              </div>
            ))}
            {filteredBrands.length === 0 && (
              <p className="discover-empty">No brands match your search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}