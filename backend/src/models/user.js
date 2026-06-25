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
      select: false, // password kabhi bhi query result mein nahi aayega
    },
    role: {
      type: String,
      enum: ["creator", "brand"],
      default: "creator",
    },
    handle: {
      type: String,
      unique: true,
      sparse: true, // null/undefined values pe unique enforce nahi hoga
      trim: true,
    },
    avatar: {
      type: String,
      default: "👩‍🎨",
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
    // OAuth ke liye (Google/Instagram — baad mein add karenge)
    googleId: { type: String, sparse: true },
    instagramId: { type: String, sparse: true },

    // Onboarding step tracker
    onboardingStep: {
      type: Number,
      default: 1, // 1=signup, 2=profile, 3=verify
    },
  },
  {
    timestamps: true, // createdAt, updatedAt automatically
  }
);

// Password save karne se pehle hash karo
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password compare method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);