// PASTE PATH: src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["creator", "brand"],
      default: "creator",
    },

    // ── Username (primary display key, unique) ──
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9_.]{3,30}$/, "Username: 3-30 chars, only letters/numbers/._"],
    },

    handle: { type: String, unique: true, sparse: true, trim: true },
    avatar: { type: String, default: "👩‍🎨" },
    avatarUrl: { type: String, default: null },
    bio: { type: String, maxlength: [300, "Bio cannot exceed 300 characters"], default: "" },
    location: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
    campaignsCompleted: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    niches: { type: [String], default: [] },
    googleId: { type: String, sparse: true },
    instagramId: { type: String, sparse: true },
    onboardingStep: { type: Number, default: 1 },

    // ── Follow system ──
    followersArr: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followingArr: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Incoming follow requests (pending)
    followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Extra profile fields
    rateMin: { type: Number, default: 0 },
    rateMax: { type: Number, default: 0 },
    availability: { type: String, default: "open" },
    responseTime: { type: String, default: "Within a day" },
  },
  { timestamps: true }
);

// Virtual counts (always fresh from arrays)
UserSchema.virtual("followersCount").get(function () {
  return this.followersArr?.length || 0;
});
UserSchema.virtual("followingCount").get(function () {
  return this.followingArr?.length || 0;
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);