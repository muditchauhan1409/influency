const express = require("express");
const router = express.Router();
const FollowRequest = require("../models/FollowRequest");
const Follow = require("../models/Follow");
const { onlineUsers } = require("../socket");

// Send follow request
router.post("/request", async (req, res) => {
  try {
    const { from, to } = req.body;
    if (from === to) return res.status(400).json({ success: false, message: "Cannot follow yourself" });

    const existing = await FollowRequest.findOne({ from, to });
    if (existing) return res.status(400).json({ success: false, message: "Request already sent" });

    const request = await FollowRequest.create({ from, to });
    const populated = await request.populate("from", "name handle avatar avatarUrl role");

    const io = req.app.get("io");
    const targetSocketId = onlineUsers.get(to.toString());
    if (targetSocketId) io.to(targetSocketId).emit("newFollowRequest", populated);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get pending requests received by a user
router.get("/requests/:userId", async (req, res) => {
  try {
    const requests = await FollowRequest.find({ to: req.params.userId, status: "pending" })
      .populate("from", "name handle avatar avatarUrl role");
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Accept / reject
router.patch("/request/:id", async (req, res) => {
  try {
    const { status } = req.body; // "accepted" | "rejected"
    const request = await FollowRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Not found" });

    request.status = status;
    await request.save();

    if (status === "accepted") {
      await Follow.create({ follower: request.from, following: request.to });
    }

    const io = req.app.get("io");
    const senderSocketId = onlineUsers.get(request.from.toString());
    if (senderSocketId) io.to(senderSocketId).emit("followRequestUpdated", request);

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get followers/following list
router.get("/followers/:userId", async (req, res) => {
  const list = await Follow.find({ following: req.params.userId }).populate("follower", "name handle avatar avatarUrl role");
  res.json({ success: true, data: list });
});

router.get("/following/:userId", async (req, res) => {
  const list = await Follow.find({ follower: req.params.userId }).populate("following", "name handle avatar avatarUrl role");
  res.json({ success: true, data: list });
});

// Combined connections (accepted, either direction) — used to populate chat list
router.get("/connections/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const asFollower = await Follow.find({ follower: userId }).populate("following", "name handle avatar avatarUrl role");
    const asFollowing = await Follow.find({ following: userId }).populate("follower", "name handle avatar avatarUrl role");

    const seen = new Set();
    const connections = [];

    asFollower.forEach((f) => {
      const u = f.following;
      if (u && !seen.has(u._id.toString())) {
        seen.add(u._id.toString());
        connections.push(u);
      }
    });
    asFollowing.forEach((f) => {
      const u = f.follower;
      if (u && !seen.has(u._id.toString())) {
        seen.add(u._id.toString());
        connections.push(u);
      }
    });

    res.json({ success: true, data: connections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;