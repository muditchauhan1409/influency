// PASTE PATH: src/controllers/followController.js
const User = require("../models/User");
const { pushNotification } = require("../utils/notify");


// ── Search users by username ──
// GET /api/follow/search?q=username
const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) {
      return res.json({ success: true, users: [] });
    }
    const users = await User.find({
      username: { $regex: q, $options: "i" },
      _id: { $ne: req.user._id }, // exclude self
    })
      .select("username name avatar avatarUrl bio role followersArr followingArr")
      .limit(10);

    const me = req.user;
    const results = users.map((u) => ({
      _id: u._id,
      username: u.username,
      name: u.name,
      avatar: u.avatar,
      avatarUrl: u.avatarUrl,
      bio: u.bio,
      role: u.role,
      followersCount: u.followersArr?.length || 0,
      followingCount: u.followingArr?.length || 0,
      isFollowing: me.followingArr?.map(String).includes(u._id.toString()),
      isFollowedByThem: me.followersArr?.map(String).includes(u._id.toString()),
      requestSent: u.followRequests?.map(String).includes(me._id.toString()),
    }));

    res.json({ success: true, users: results });
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Send follow request ──
// POST /api/follow/request/:targetId
const sendFollowRequest = async (req, res) => {
  try {
    const target = await User.findById(req.params.targetId);
    if (!target) return res.status(404).json({ success: false, message: "User not found" });
    if (target._id.toString() === req.user._id.toString())
      return res.status(400).json({ success: false, message: "Cannot follow yourself" });

    const me = await User.findById(req.user._id);

    // Already following?
    if (me.followingArr?.map(String).includes(target._id.toString())) {
      return res.status(409).json({ success: false, message: "Already following" });
    }
    // Request already sent?
    if (target.followRequests?.map(String).includes(me._id.toString())) {
      return res.status(409).json({ success: false, message: "Request already sent" });
    }

    target.followRequests.push(me._id);
    await target.save();
        pushNotification(target._id, {
      type: "follow_request",
      title: `@${me.username || me.name} sent you a follow request`,
      desc: "",
      relatedId: me._id,
    }).catch((e) => console.error("Notify error:", e));

    res.json({ success: true, message: `Follow request sent to @${target.username}` });
  } catch (err) {
    console.error("Send follow request error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Accept follow request ──
// POST /api/follow/accept/:requesterId
const acceptFollowRequest = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    const requester = await User.findById(req.params.requesterId);
    if (!requester) return res.status(404).json({ success: false, message: "User not found" });

    // Remove from pending requests
    me.followRequests = me.followRequests.filter(
      (id) => id.toString() !== requester._id.toString()
    );

    // requester → me (already existing direction)
    if (!me.followersArr.map(String).includes(requester._id.toString())) {
      me.followersArr.push(requester._id);
    }
    if (!requester.followingArr.map(String).includes(me._id.toString())) {
      requester.followingArr.push(me._id);
    }

    // me → requester (auto follow-back, no search needed)
    if (!me.followingArr.map(String).includes(requester._id.toString())) {
      me.followingArr.push(requester._id);
    }
    if (!requester.followersArr.map(String).includes(me._id.toString())) {
      requester.followersArr.push(me._id);
    }

    await me.save();
    await requester.save();
        pushNotification(requester._id, {
      type: "follow_accept",
      title: `@${me.username || me.name} accepted your follow request`,
      desc: "You are now connected",
      relatedId: me._id,
    }).catch((e) => console.error("Notify error:", e));

    res.json({ success: true, message: `You and @${requester.username} are now connected` });
  } catch (err) {
    console.error("Accept follow request error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Reject follow request ──
// POST /api/follow/reject/:requesterId
const rejectFollowRequest = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    me.followRequests = me.followRequests.filter(
      (id) => id.toString() !== req.params.requesterId
    );
    await me.save();
    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    console.error("Reject follow request error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Unfollow ──
// DELETE /api/follow/:targetId
const unfollowUser = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    const target = await User.findById(req.params.targetId);
    if (!target) return res.status(404).json({ success: false, message: "User not found" });

    me.followingArr = me.followingArr.filter((id) => id.toString() !== target._id.toString());
    target.followersArr = target.followersArr.filter((id) => id.toString() !== me._id.toString());

    await me.save();
    await target.save();

    res.json({ success: true, message: "Unfollowed" });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Get my follow requests (incoming) ──
// GET /api/follow/requests
const getFollowRequests = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).populate(
      "followRequests",
      "username name avatar avatarUrl bio role"
    );
    res.json({ success: true, requests: me.followRequests || [] });
  } catch (err) {
    console.error("Get follow requests error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Get my followers + following lists ──
// GET /api/follow/connections
const getConnections = async (req, res) => {
  try {
    const me = await User.findById(req.user._id)
      .populate("followersArr", "username name avatar avatarUrl role")
      .populate("followingArr", "username name avatar avatarUrl role");

    res.json({
      success: true,
      followers: me.followersArr || [],
      following: me.followingArr || [],
    });
  } catch (err) {
    console.error("Get connections error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Set / update username ──
// PUT /api/follow/username
const setUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || username.length < 3) {
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    }
    const clean = username.toLowerCase().trim();
    if (!/^[a-z0-9_.]{3,30}$/.test(clean)) {
      return res.status(400).json({
        success: false,
        message: "Only letters, numbers, . and _ allowed (3-30 chars)",
      });
    }
    const exists = await User.findOne({ username: clean, _id: { $ne: req.user._id } });
    if (exists) {
      return res.status(409).json({ success: false, message: "Username already taken" });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username: clean },
      { new: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    console.error("Set username error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const discoverUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { role, niche, q } = req.query;

    const me = await User.findById(currentUserId).select("followingArr followersArr");
    const followingIds = (me.followingArr || []).map(String);
    const followersIds = (me.followersArr || []).map(String);

    const filter = {
      _id: { $nin: [currentUserId] },
    };

    if (role) filter.role = role;
    if (niche) filter.niches = niche;
    if (q && q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: "i" } },
        { username: { $regex: q.trim(), $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("name username avatar avatarUrl bio role niches followersArr trustScore followRequests")
      .limit(30)
      .lean();

    const results = users.map((u) => ({
      _id: u._id,
      name: u.name,
      username: u.username,
      avatar: u.avatar,
      avatarUrl: u.avatarUrl,
      bio: u.bio,
      role: u.role,
      niches: u.niches || [],
      followersCount: u.followersArr?.length || 0,
      trustScore: u.trustScore || 0,
      isFollowing: followingIds.includes(u._id.toString()),
      requestSent: (u.followRequests || []).map(String).includes(currentUserId.toString()),
    }));

    res.status(200).json({ success: true, users: results });
  } catch (error) {
    console.error("discoverUsers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  searchUsers,
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  unfollowUser,
  getFollowRequests,
  getConnections,
  setUsername,
  discoverUsers, 
};