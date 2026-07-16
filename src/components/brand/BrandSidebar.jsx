// PASTE PATH: src/components/brand/BrandSidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Compass,
  MessageCircle,
  Bell,
  BarChart2,
  Settings,
} from "lucide-react";
import "../../styles/dashboard.css";

const BRAND_NAV_ITEMS = [
  { icon: Home, label: "Home", path: "/brand-dashboard" },
  { icon: ClipboardList, label: "Forms", path: "/brand-forms" },
  { icon: Compass, label: "Discover", path: "/brand-discover" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: BarChart2, label: "Analytics", path: "/brand-analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function BrandSidebar({ onOpenNotifications, notifUnreadCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="left-sb">
      <div className="logo-block">
        <div className="logo-icon">✦</div>
        <div className="logo-text">
          <span className="logo-gold">Influ</span>
          <span className="logo-white">ency</span>
        </div>
      </div>

      {BRAND_NAV_ITEMS.map((item) => {
        const isNotif = item.label === "Notifications";
        const badgeValue = isNotif
          ? (notifUnreadCount > 0 ? notifUnreadCount : null)
          : null;

        return (
          <div
            key={item.label}
            className={`nav-item ${!isNotif && location.pathname === item.path ? "active" : ""}`}
            onClick={() =>
              isNotif
                ? onOpenNotifications && onOpenNotifications()
                : navigate(item.path)
            }
          >
            <span className="nav-icon-wrap">
              <item.icon size={18} strokeWidth={1.8} />
            </span>
            <span className="nav-label">{item.label}</span>
            {badgeValue && <span className="nav-badge">{badgeValue}</span>}
          </div>
        );
      })}

      <div className="spacer" />

      <div className="trust-card">
        <div className="trust-ring-wrap">
          <div className="brand-trust-icon">✦</div>
          <div className="trust-meta">
            <div className="trust-score-big" style={{ fontSize: 18 }}>Brand</div>
            <div className="trust-label">Account</div>
          </div>
        </div>
        <div className="badge-row">
          <span className="badge badge-elite">Verified Brand</span>
          <span className="badge badge-level">Pro</span>
        </div>
        <div className="trust-user">
          {user?.name || "Brand"}<br />
          <span className="trust-handle">{user?.email || ""}</span>
        </div>
      </div>
    </div>
  );
}