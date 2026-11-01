import { Link } from "react-router-dom";
import { useRoleSelect } from "../../scripts/roleSelect";
import {
  Sparkles, Star, Video, Building2,
  Briefcase, BarChart3, Search, Megaphone,
  CheckCircle2, TrendingUp, Handshake,
} from "lucide-react";

export default function MobileRoleSelect() {
  const { role, setRole, handleContinue } = useRoleSelect();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fdf6f3",
      display: "flex",
      flexDirection: "column",
      padding: "24px 20px 40px",
      fontFamily: "Arial, sans-serif"
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: "#7a1f33", display: "flex",
          alignItems: "center", justifyContent: "center", color: "#fff"
        }}>
          <Sparkles size={16} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#2a1a1f" }}>Influency</span>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: i === 0 ? "#7a1f33" : "#e0d0d3"
          }} />
        ))}
      </div>

      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "#f3e9ea", color: "#7a1f33",
          display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: 12
        }}>
          <Sparkles size={20} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#2a1a1f", margin: "0 0 6px" }}>
          Who are you?
        </h2>
        <p style={{ fontSize: 14, color: "#8a7a7e", margin: 0 }}>
          Choose your role to personalize your Influency experience.
        </p>
      </div>

      {/* Creator Option */}
      <div
        onClick={() => setRole("creator")}
        style={{
          border: `2px solid ${role === "creator" ? "#7a1f33" : "#ece2e3"}`,
          borderRadius: 16,
          padding: "16px",
          marginBottom: 14,
          background: role === "creator" ? "#fdf6f3" : "#fff",
          cursor: "pointer"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "#f3e3df", color: "#7a1f33",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <Video size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: "#2a1a1f" }}>I'm a Creator</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 8px",
                borderRadius: 20, background: "#f3e3df", color: "#7a1f33"
              }}>Most Popular</span>
            </div>
            <p style={{ fontSize: 13, color: "#8a7a7e", margin: 0, lineHeight: 1.5 }}>
              Build your portfolio, grow your trust score, land premium brand deals.
            </p>
          </div>
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            border: `2px solid ${role === "creator" ? "#7a1f33" : "#d9c9cb"}`,
            background: role === "creator" ? "#7a1f33" : "transparent",
            flexShrink: 0
          }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { icon: <Briefcase size={12} />, label: "Portfolio" },
            { icon: <Star size={12} />, label: "Trust Score" },
            { icon: <Handshake size={12} />, label: "Collabs" },
            { icon: <BarChart3 size={12} />, label: "Analytics" },
          ].map(p => (
            <span key={p.label} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, fontWeight: 500, color: "#6a5a5e",
              background: "#f6efef", padding: "4px 10px", borderRadius: 20
            }}>
              {p.icon} {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* Brand Option */}
      <div
        onClick={() => setRole("brand")}
        style={{
          border: `2px solid ${role === "brand" ? "#7a1f33" : "#ece2e3"}`,
          borderRadius: 16,
          padding: "16px",
          marginBottom: 24,
          background: role === "brand" ? "#fdf6f3" : "#fff",
          cursor: "pointer"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "#f3e3df", color: "#7a1f33",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <Building2 size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: "#2a1a1f" }}>I'm a Brand</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 8px",
                borderRadius: 20, background: "#f0e9ea", color: "#6a5a5e"
              }}>For Business</span>
            </div>
            <p style={{ fontSize: 13, color: "#8a7a7e", margin: 0, lineHeight: 1.5 }}>
              Discover verified creators, launch campaigns, and track ROI in one place.
            </p>
          </div>
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            border: `2px solid ${role === "brand" ? "#7a1f33" : "#d9c9cb"}`,
            background: role === "brand" ? "#7a1f33" : "transparent",
            flexShrink: 0
          }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { icon: <Search size={12} />, label: "AI Matching" },
            { icon: <Megaphone size={12} />, label: "Campaigns" },
            { icon: <CheckCircle2 size={12} />, label: "Verified" },
            { icon: <TrendingUp size={12} />, label: "ROI" },
          ].map(p => (
            <span key={p.label} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, fontWeight: 500, color: "#6a5a5e",
              background: "#f6efef", padding: "4px 10px", borderRadius: 20
            }}>
              {p.icon} {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        style={{
          width: "100%", padding: "16px",
          background: "#7a1f33", color: "#fff",
          border: "none", borderRadius: 14,
          fontSize: 16, fontWeight: 600,
          cursor: "pointer", marginBottom: 16
        }}
      >
        Continue
      </button>

      <p style={{ textAlign: "center", fontSize: 14, color: "#8a7a7e", margin: 0 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#7a1f33", fontWeight: 600 }}>Sign In</Link>
      </p>
    </div>
  );
}