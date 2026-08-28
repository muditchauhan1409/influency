// PASTE PATH: server/routes/brand.js
// Mount in server/index.js as: app.use("/api/brand", require("./routes/brand"));

const express = require("express");
const router = express.Router();
const BrandProfile = require("../models/BrandProfile"); // model below
const { protect } = require("../middleware/auth");    // your existing JWT middleware

/* ─────────────────────────────────────────
   GET /api/brand/profile
   Returns the logged-in brand's profile.
   Creates a blank one if first time.
───────────────────────────────────────── */
router.get("/profile", protect, async (req, res) => {
  try {
    let profile = await BrandProfile.findOne({ userId: req.user.id });

    if (!profile) {
      // Auto-create empty profile on first load
      profile = await BrandProfile.create({
        userId: req.user.id,
        companyName: "",
        handle: "",
        tagline: "",
        logoUrl: "",
        logoEmoji: "🏢",
        website: "",
        industry: [],
        companySize: "startup",
        budgetRange: "small",
        targetPlatforms: [],
        campaignTypes: [],
        description: "",
        location: "Mumbai, IN",
        trustScore: 0,
      });
    }

    res.json(profile);
  } catch (err) {
    console.error("[GET /api/brand/profile]", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ─────────────────────────────────────────
   PUT /api/brand/profile
   Full-update of the brand profile fields.
───────────────────────────────────────── */
router.put("/profile", protect, async (req, res) => {
  const ALLOWED_FIELDS = [
    "companyName", "handle", "tagline", "logoUrl", "logoEmoji",
    "website", "industry", "companySize", "budgetRange",
    "targetPlatforms", "campaignTypes", "description", "location",
  ];

  // Whitelist — never let frontend overwrite userId or trustScore
  const updates = {};
  ALLOWED_FIELDS.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  try {
    const profile = await BrandProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    console.error("[PUT /api/brand/profile]", err);
    res.status(500).json({ error: "Save failed" });
  }
});

/* ─────────────────────────────────────────
   POST /api/brand/profile/logo
   Upload logo (multipart). Uses same pattern
   as creator avatar — wire to your S3/Cloudinary.
───────────────────────────────────────── */
router.post("/profile/logo", protect, async (req, res) => {
  // TODO: plug in your existing upload middleware (multer + S3/Cloudinary)
  // Example: upload.single("logo") middleware, then:
  // const logoUrl = req.file.location; // S3
  // await BrandProfile.findOneAndUpdate({ userId: req.user.id }, { logoUrl });
  res.status(501).json({ message: "Logo upload — wire to your storage middleware" });
});

module.exports = router;