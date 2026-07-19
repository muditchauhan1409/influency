// PASTE PATH: src/routes/follow.js
const express = require("express");
const router = express.Router();
const { validate, schemas } = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const {
  searchUsers,
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  unfollowUser,
  getFollowRequests,
  getConnections,
  setUsername,
  discoverUsers,          // ← add this
} = require("../controllers/followController");

router.get("/search", protect, searchUsers);
router.put("/username", protect, setUsername);
router.get("/requests", protect, getFollowRequests);
router.get("/connections", protect, getConnections);
router.get("/discover", protect, discoverUsers);       // ← moved up, before /:targetId
router.post("/request/:targetId", protect, sendFollowRequest);
router.post("/accept/:requesterId", protect, acceptFollowRequest);
router.post("/reject/:requesterId", protect, rejectFollowRequest);
router.delete("/:targetId", protect, unfollowUser);

module.exports = router;