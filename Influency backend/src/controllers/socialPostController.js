// PASTE PATH: src/controllers/socialPostController.js
const SocialPost = require("../models/SocialPost");
const { cloudinary } = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "influency/social-posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1080, crop: "limit" }],
  },
});

const uploadSocialImage = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
}).single("image");

// @route   POST /api/social-posts
// @desc    Naya social post banao (caption + optional image)
// @access  Private
const createSocialPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!caption?.trim() && !req.file) {
      return res.status(400).json({ success: false, message: "Post needs a caption or an image" });
    }

    const post = await SocialPost.create({
      author: req.user._id,
      caption: caption?.trim() || "",
      imageUrl: req.file ? req.file.path : null,
    });

    const populated = await post.populate("author", "name handle avatarUrl avatar role");

    res.status(201).json({ success: true, post: populated });
  } catch (err) {
    console.error("Create social post error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/social-posts/feed
// @desc    Sab social posts latest-first
// @access  Private
const getSocialFeed = async (req, res) => {
  try {
    const posts = await SocialPost.find({})
      .populate("author", "name handle avatarUrl avatar role")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, posts });
  } catch (err) {
    console.error("Social feed error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/social-posts/user/:userId
// @desc    Kisi ek user ke social posts (profile page)
// @access  Private
const getUserSocialPosts = async (req, res) => {
  try {
    const posts = await SocialPost.find({ author: req.params.userId })
      .populate("author", "name handle avatarUrl avatar role")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   DELETE /api/social-posts/:id
// @desc    Apna social post delete karo
// @access  Private
const deleteSocialPost = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    await post.deleteOne();
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createSocialPost,
  getSocialFeed,
  getUserSocialPosts,
  deleteSocialPost,
  uploadSocialImage,
};