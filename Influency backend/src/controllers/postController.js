// PASTE PATH: src/controllers/postController.js
const Post = require("../models/Post");
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Post image ke liye alag storage
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "influency/posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 630, crop: "fill" }],
  },
});

const uploadPostImage = multer({ storage: postStorage }).single("image");

// @route   POST /api/posts/create
// @desc    Brand post create kare
// @access  Private (Brand only)
const createPost = async (req, res) => {
  try {
    const { title, description, budget, niches } = req.body;

    if (!title) return res.status(400).json({ success: false, message: "Title required" });
    if (!niches || niches.length === 0) {
      return res.status(400).json({ success: false, message: "At least one niche required" });
    }

    const post = await Post.create({
      brandId: req.user._id,
      title,
      description,
      budget,
      niches: Array.isArray(niches) ? niches : JSON.parse(niches),
      imageUrl: req.file?.path || null,
    });

    await post.populate("brandId", "name avatarUrl avatar email");

    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/posts/feed
// @desc    Creator ka matched feed — niches ke basis pe
// @access  Private (Creator only)
const getFeed = async (req, res) => {
  try {
    const creator = await User.findById(req.user._id);
    const creatorNiches = creator.niches || [];

    let posts;

    if (creatorNiches.length === 0) {
      // Agar creator ke niches set nahi hain — sab posts dikho
      posts = await Post.find({ status: "active" })
        .populate("brandId", "name avatarUrl avatar email")
        .sort({ createdAt: -1 })
        .limit(20);
    } else {
      // Partial match — koi bhi ek niche common ho
      posts = await Post.find({
        status: "active",
        niches: { $in: creatorNiches },
      })
        .populate("brandId", "name avatarUrl avatar email")
        .sort({ createdAt: -1 })
        .limit(20);
    }

    // Har post ke saath match score add karo
    const postsWithScore = posts.map((post) => {
      const matchingNiches = post.niches.filter((n) => creatorNiches.includes(n));
      const matchScore = Math.round((matchingNiches.length / post.niches.length) * 100);
      return {
        ...post.toObject(),
        matchScore,
        matchingNiches,
      };
    });

    // Match score ke hisaab se sort
    postsWithScore.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, posts: postsWithScore, creatorNiches });
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/posts/brand
// @desc    Brand ke apne sab posts
// @access  Private (Brand only)
const getBrandPosts = async (req, res) => {
  try {
    const posts = await Post.find({ brandId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/posts/:postId/apply
// @desc    Creator post pe apply kare
// @access  Private (Creator only)
const applyToPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const alreadyApplied = post.applicants.find(
      (a) => a.creatorId.toString() === req.user._id.toString()
    );
    if (alreadyApplied) {
      return res.status(409).json({ success: false, message: "Already applied" });
    }

    post.applicants.push({ creatorId: req.user._id });
    await post.save();

    res.json({ success: true, message: "Applied successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/posts/:postId/like
// @desc    Creator post like/unlike kare
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const liked = post.likes.includes(req.user._id);
    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();

    res.json({ success: true, liked: !liked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   DELETE /api/posts/:postId
// @desc    Brand post delete kare
// @access  Private (Brand only)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (post.imageUrl) {
      const publicId = post.imageUrl.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createPost,
  getFeed,
  getBrandPosts,
  applyToPost,
  toggleLike,
  deletePost,
  uploadPostImage,
};