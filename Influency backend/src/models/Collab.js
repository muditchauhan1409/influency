const mongoose = require("mongoose");

const CollabSchema = new mongoose.Schema(
  {
    postId:     { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    brandId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creatorId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Flow: brand_accepted → active → submitted → completed
    status: {
      type: String,
      enum: ["brand_accepted", "active", "submitted", "completed", "declined"],
      default: "brand_accepted",
    },

    submissionUrl:  { type: String, default: null },  // creator ka kaam
    submissionNote: { type: String, default: null },
    brandFeedback:  { type: String, default: null },

    brandAcceptedAt:   { type: Date },
    creatorAcceptedAt: { type: Date },
    submittedAt:       { type: Date },
    completedAt:       { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collab", CollabSchema);