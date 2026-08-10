// PASTE PATH: src/components/brand/BrandPostCreate.jsx
import { useRef } from "react";
import { useBrandPost, NICHE_OPTIONS } from "../../scripts/feed";
import "../../styles/settings.css";
import "../../styles/userProfile.css";

export default function BrandPostCreate({ onPostCreated }) {
  const fileRef = useRef();
  const {
    title, setTitle,
    description, setDescription,
    budget, setBudget,
    niches, toggleNiche,
    imagePreview, handleImageChange,
    loading, error, success,
    handleSubmit,
  } = useBrandPost();

  const handleCreate = async () => {
    await handleSubmit();
    if (onPostCreated) onPostCreated();
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="trend-section-title" style={{ marginBottom: 16 }}>
        Create Collab Post
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          className="settings-input"
          style={{ width: "100%", boxSizing: "border-box" }}
          placeholder="Campaign title (e.g. Summer Cafe Collab)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="settings-input"
          style={{ width: "100%", boxSizing: "border-box", minHeight: 80, resize: "vertical" }}
          placeholder="Describe what you're looking for..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="settings-input"
          style={{ width: "100%", boxSizing: "border-box" }}
          placeholder="Budget (e.g. ₹50,000)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        {/* Niche Tags */}
        <div>
          <div className="settings-row-label" style={{ marginBottom: 8 }}>
            Target Niches
          </div>
          <div className="chip-grid">
            {NICHE_OPTIONS.map((n) => (
              <button
                key={n}
                className={`chip ${niches.includes(n) ? "chip-active" : ""}`}
                onClick={() => toggleNiche(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        

        {/* Image Upload */}
        <div>
          <div className="settings-row-label" style={{ marginBottom: 8 }}>
            Campaign Image (optional)
          </div>
          {imagePreview ? (
            <div style={{ position: "relative", width: "100%", borderRadius: 12, overflow: "hidden" }}>
              <img src={imagePreview} alt="preview"
                style={{ width: "100%", height: 180, objectFit: "cover" }} />
              <button
                onClick={() => handleImageChange(null)}
                style={{
                  position: "absolute", top: 8, right: 8,
                  background: "rgba(0,0,0,0.5)", color: "#fff",
                  border: "none", borderRadius: "50%",
                  width: 28, height: 28, cursor: "pointer", fontSize: 14,
                }}
              >✕</button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: "2px dashed rgba(122,31,51,0.2)",
                borderRadius: 12, padding: "20px",
                textAlign: "center", cursor: "pointer",
                color: "#8a7a7e", fontSize: 13,
              }}
            >
              Click to upload image
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImageChange(e.target.files[0])}
          />
        </div>

        {error && <p className="field-error">{error}</p>}
        {success && (
          <p style={{ color: "#2f8f53", fontSize: 13 }}>✓ Post created successfully!</p>
        )}

        <button
          className="btn-primary-sm"
          onClick={handleCreate}
          disabled={loading}
          style={{ padding: "11px 0", width: "100%", fontSize: 14 }}
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </div>
  );
}