// PASTE PATH: src/components/NavItem.jsx
// Reusable nav item — emoji string ya Lucide component dono handle karta hai

export default function NavItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  const isComponent = typeof Icon === "function" || (typeof Icon === "object" && Icon !== null);

  return (
    <div
      className={`nav-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-icon-wrap">
        {isComponent
          ? <Icon size={18} strokeWidth={1.8} />
          : <span className="nav-emoji">{Icon}</span>
        }
      </span>
      <span className="nav-label">{item.label}</span>
      {item.badge && <span className="nav-badge">{item.badge}</span>}
    </div>
  );
}