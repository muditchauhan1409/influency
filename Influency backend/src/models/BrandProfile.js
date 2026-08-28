// PASTE PATH: server/models/BrandProfile.js

const mongoose = require("mongoose");

const BrandProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,   // one profile per brand account
      index: true,
    },

    /* Identity */
    companyName:  { type: String, default: "" },
    handle:       { type: String, default: "" },
    tagline:      { type: String, default: "" },
    logoUrl:      { type: String, default: "" },
    logoEmoji:    { type: String, default: "🏢" },
    website:      { type: String, default: "" },
    description:  { type: String, default: "" },
    location:     { type: String, default: "Mumbai, IN" },

    /* Categorisation */
    industry:        { type: [String], default: [] },
    companySize:     { type: String, enum: ["startup", "small", "mid", "large", "enterprise"], default: "startup" },
    budgetRange:     { type: String, enum: ["micro", "small", "mid", "large", "enterprise"],   default: "small"   },
    targetPlatforms: { type: [String], default: [] },
    campaignTypes:   { type: [String], default: [] },

    /* Trust (calculated server-side, not editable by brand) */
    trustScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("BrandProfile", BrandProfileSchema);