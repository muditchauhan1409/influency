// PASTE PATH: src/routes/socialPosts.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createSocialPost,
  getSocialFeed,
  getUserSocialPosts,
  deleteSocialPost,
  uploadSocialImage,
} = require("../controllers/socialPostController");

router.post("/", protect, uploadSocialImage, createSocialPost);
router.get("/feed", protect, getSocialFeed);
router.get("/user/:userId", protect, getUserSocialPosts);
router.delete("/:id", protect, deleteSocialPost);

module.exports = router;