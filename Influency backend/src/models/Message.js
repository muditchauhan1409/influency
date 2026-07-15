// PASTE PATH: src/models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    // Conversation key: sorted user IDs joined by "_"
    conversationId: { type: String, required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Helper: generate consistent conversationId from two user IDs
MessageSchema.statics.getConversationId = function (idA, idB) {
  return [idA.toString(), idB.toString()].sort().join("_");
};

module.exports = mongoose.model("Message", MessageSchema);