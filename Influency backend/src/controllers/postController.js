// PASTE PATH: src/controllers/postController.js
const Post = require("../models/Post");

// @route   POST /api/posts
// @desc    Naya post banao (caption + optional image)
// @access  Private
const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!caption?.trim() && !req.file) {
      return res.status(400).json({ success: false, message: "Post needs a caption or an image" });
    }

    const post = await Post.create({
      author: req.user._id,
      caption: caption?.trim() || "",
      imageUrl: req.file ? req.file.path : null,
    });

    const populated = await post.populate("author", "name handle avatarUrl avatar role");

    res.status(201).json({ success: true, post: populated });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/posts/feed
// @desc    Sab posts latest-first (simple global feed)
// @access  Private
const getFeed = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name handle avatarUrl avatar role")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, posts });
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/posts/user/:userId
// @desc    Kisi ek user ke posts (profile page ke liye)
// @access  Private
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "name handle avatarUrl avatar role")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   DELETE /api/posts/:id
// @desc    Apna post delete karo
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
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

module.exports = { createPost, getFeed, getUserPosts, deletePost };