// PASTE PATH: src/models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: null },
    budget: { type: String, default: "" },
    niches: { type: [String], required: true }, // ["Fashion", "Lifestyle"]
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    applicants: [
      {
        creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);