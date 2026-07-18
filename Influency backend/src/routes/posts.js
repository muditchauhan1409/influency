// PASTE PATH: src/routes/posts.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createPost,
  getFeed,
  getBrandPosts,
  applyToPost,
  toggleLike,
  deletePost,
  uploadPostImage,
} = require("../controllers/postController");

router.post("/create", protect, uploadPostImage, createPost);
router.get("/feed", protect, getFeed);
router.get("/brand", protect, getBrandPosts);
router.post("/:postId/apply", protect, applyToPost);
router.post("/:postId/like", protect, toggleLike);
router.delete("/:postId", protect, deletePost);

module.exports = router;