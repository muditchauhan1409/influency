const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { uploadPost } = require("../config/cloudinary");
const { createPost, getFeed, getUserPosts, deletePost } = require("../controllers/postController");

router.post("/", protect, uploadPost.single("image"), createPost);
router.get("/feed", protect, getFeed);
router.get("/user/:userId", protect, getUserPosts);
router.delete("/:id", protect, deletePost);

module.exports = router;
