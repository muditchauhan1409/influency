const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Get or create conversation between two users
router.post("/conversation", async (req, res) => {
  try {
    const { userA, userB } = req.body;

    let convo = await Conversation.findOne({
      participants: { $all: [userA, userB], $size: 2 },
    });

    if (!convo) {
      convo = await Conversation.create({ participants: [userA, userB] });
    }

    res.json({ success: true, data: convo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all conversations of a user
router.get("/conversations/:userId", async (req, res) => {
  const convos = await Conversation.find({ participants: req.params.userId })
    .populate("participants", "name handle avatar avatarUrl role")
    .sort({ lastMessageAt: -1 });
  res.json({ success: true, data: convos });
});

// Get messages of a conversation
router.get("/:conversationId", async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.conversationId }).sort({ createdAt: 1 });
  res.json({ success: true, data: messages });
});

// Send message
router.post("/", async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;
    const message = await Message.create({ conversationId, sender, text });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;