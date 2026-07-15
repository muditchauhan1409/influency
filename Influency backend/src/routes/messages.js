// PASTE PATH: src/routes/messages.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getConversations, getMessages, sendMessage, deleteMessage } = require("../controllers/messageController");

router.get("/conversations", protect, getConversations);
router.delete("/message/:messageId", protect, deleteMessage);  // ← before /:userId
router.get("/:userId", protect, getMessages);
router.post("/:userId", protect, sendMessage);

module.exports = router;