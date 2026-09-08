// PASTE PATH: src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SocialSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    icon: { type: String, default: "" },
    handle: { type: String, default: "" },
    followers: { type: String, default: "" },
    connected: { type: Boolean, default: false },
  },
  { _id: false }
);

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
    handle: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: "👩‍🎨",
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    trustScore: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    campaignsCompleted: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    niches: {
      type: [String],
      default: [],
    },
    followersArr: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    followingArr: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    followRequests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    // ==== Extended profile fields ====
    contentCategories: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: ["open", "booked", "unavailable", "closed"],
      default: "open",
    },
    bookedUntil: {
      type: String,
      default: "",
    },
    radius: {
      type: String,
      default: "50",
    },
    responseTime: {
      type: String,
      default: "Within a day",
    },
    rateMin: {
      type: Number,
      default: 0,
    },
    rateMax: {
      type: Number,
      default: 0,
    },
    socials: {
      type: [SocialSchema],
      default: [],
    },

    googleId: { type: String, sparse: true },
    instagramId: { type: String, sparse: true },
    onboardingStep: {
      type: Number,
      default: 1,
    },

    // ==== Settings ====
    darkMode: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      enum: ["English", "Hindi", "Marathi"],
      default: "English",
    },
    notifications: {
      campaignMatches: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      trustScoreUpdates: { type: Boolean, default: true },
      platformAnnouncements: { type: Boolean, default: false },
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["Everyone", "Verified Brands Only", "Private"],
        default: "Everyone",
      },
      analyticsSharing: { type: Boolean, default: true },
      twoFactorEnabled: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

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