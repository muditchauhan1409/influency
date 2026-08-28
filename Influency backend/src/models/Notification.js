const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["follow_request", "follow_accept", "message", "campaign", "system"], required: true },
  title: { type: String, required: true },
  desc: { type: String, default: "" },
  relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);