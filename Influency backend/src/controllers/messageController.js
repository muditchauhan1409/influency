// PASTE PATH: src/controllers/messageController.js
const Message = require("../models/Message");
const User = require("../models/User");

// ── Check if two users are mutually connected ──
const areMutuallyConnected = (userA, userB) => {
  const aIdStr = userA._id.toString();
  const bIdStr = userB._id.toString();
  const aFollowsB = userA.followingArr?.some((u) => u._id.toString() === bIdStr);
  const bFollowsA = userB.followingArr?.some((u) => u._id.toString() === aIdStr)
    || userA.followersArr?.some((u) => u._id.toString() === bIdStr);
  return aFollowsB && bFollowsA;
};

// ── Get all conversations for current user ──
// GET /api/messages/conversations
const getConversations = async (req, res) => {
  try {
    const me = await User.findById(req.user._id)
      .populate("followingArr", "username name avatar avatarUrl role followingArr followersArr")
      .populate("followersArr", "_id");

    const mutuals = me.followingArr.filter((u) =>
      me.followersArr.map((f) => f._id.toString()).includes(u._id.toString())
    );

    const conversations = await Promise.all(
      mutuals.map(async (other) => {
        const conversationId = Message.getConversationId(me._id, other._id);
        const lastMsg = await Message.findOne({ conversationId })
          .sort({ createdAt: -1 })
          .select("text sender createdAt read");
        const unread = await Message.countDocuments({
          conversationId,
          receiver: me._id,
          read: false,
        });
        return {
          userId: other._id,
          username: other.username,
          name: other.name,
          avatar: other.avatar,
          avatarUrl: other.avatarUrl,
          role: other.role,
          conversationId,
          lastMessage: lastMsg
            ? {
                text: lastMsg.text,
                fromMe: lastMsg.sender.toString() === me._id.toString(),
                time: lastMsg.createdAt,
              }
            : null,
          unread,
        };
      })
    );

    conversations.sort((a, b) => {
      const aT = a.lastMessage?.time || 0;
      const bT = b.lastMessage?.time || 0;
      return new Date(bT) - new Date(aT);
    });

    res.json({ success: true, conversations });
  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Get message history with a specific user ──
// GET /api/messages/:userId
const getMessages = async (req, res) => {
  try {
    const other = await User.findById(req.params.userId);
    if (!other) return res.status(404).json({ success: false, message: "User not found" });

    const conversationId = Message.getConversationId(req.user._id, other._id);
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .select("sender text createdAt read")
      .lean();

    await Message.updateMany(
      { conversationId, receiver: req.user._id, read: false },
      { read: true }
    );

    const myIdStr = req.user._id.toString();
    const messagesWithFromMe = messages.map((m) => ({
      ...m,
      fromMe: m.sender.toString() === myIdStr,
    }));

    res.json({ success: true, messages: messagesWithFromMe });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Send a message (REST fallback — WebSocket is primary) ──
// POST /api/messages/:userId
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: "Message cannot be empty" });

    const me = await User.findById(req.user._id)
      .populate("followingArr", "_id")
      .populate("followersArr", "_id");
    const other = await User.findById(req.params.userId)
      .populate("followingArr", "_id")
      .populate("followersArr", "_id");

    if (!other) return res.status(404).json({ success: false, message: "User not found" });

    console.log("ME followingArr:", me.followingArr);
    console.log("ME followersArr:", me.followersArr);
    console.log("OTHER followingArr:", other.followingArr);
    console.log("OTHER followersArr:", other.followersArr);

    if (!areMutuallyConnected(me, other)) {
      return res.status(403).json({ success: false, message: "You can only message mutual connections" });
    }

    const conversationId = Message.getConversationId(me._id, other._id);
    const message = await Message.create({
      conversationId,
      sender: me._id,
      receiver: other._id,
      text: text.trim(),
    });
     const { pushNotification } = require("../utils/notify");
    pushNotification(other._id, {
      type: "message",
      title: `${me.username || me.name} sent you a message`,
      desc: message.text.length > 60 ? message.text.slice(0, 60) + "…" : message.text,
      relatedId: message._id,
    }).catch((e) => console.error("Notify error:", e));

    res.status(201).json({ success: true, message });

  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Delete a message (only sender can delete) ──
// DELETE /api/messages/message/:messageId
const deleteMessage = async (req, res) => {
  try {
    const Message = require("../models/Message");
    const msg = await Message.findById(req.params.messageId);
    if (!msg) return res.status(404).json({ success: false, message: "Message not found" });
    if (msg.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Can only delete your own messages" });
    }
    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getConversations, getMessages, sendMessage, deleteMessage };