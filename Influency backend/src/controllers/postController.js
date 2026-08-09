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

// @route   GET /api/posts/:postId
// @desc    Single campaign ka full detail lo (creator tap karega toh yeh call hoga)
// @access  Private
const getPostDetail = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("brandId", "name avatarUrl avatar email");
    if (!post) return res.status(404).json({ success: false, message: "Campaign not found" });

    const myApplication = post.applicants.find(
      (a) => a.creatorId.toString() === req.user._id.toString()
    );

    res.json({
      success: true,
      post: {
        ...post.toObject(),
        myStatus: myApplication ? myApplication.status : null,
        liked: post.likes.some((id) => id.toString() === req.user._id.toString()),
      },
    });
  } catch (err) {
    console.error("Get post detail error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/posts/my-applications
// @desc    Creator ke saare applied campaigns, status ke saath (Active/Pending/Completed)
// @access  Private (Creator)
const getMyApplications = async (req, res) => {
  try {
    const posts = await Post.find({ "applicants.creatorId": req.user._id })
      .populate("brandId", "name avatarUrl avatar")
      .sort({ createdAt: -1 });

    const applications = posts.map((post) => {
      const app = post.applicants.find(
        (a) => a.creatorId.toString() === req.user._id.toString()
      );
      return {
        _id: post._id,
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl,
        budget: post.budget,
        niches: post.niches,
        brand: post.brandId,
        appliedAt: app.appliedAt,
        status: app.status, // pending | accepted | rejected | completed
      };
    });

    res.json({ success: true, applications });
  } catch (err) {
    console.error("My applications error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/posts/:postId/applicants
// @desc    Brand apne campaign ke applicants dekhe
// @access  Private (Brand only)
const getPostApplicants = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("applicants.creatorId", "name email avatarUrl avatar niches trustScore");
    if (!post) return res.status(404).json({ success: false, message: "Campaign not found" });
    if (post.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    res.json({ success: true, applicants: post.applicants });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   PATCH /api/posts/:postId/applicants/:creatorId
// @desc    Brand applicant ko confirm/reject/complete kare
// @access  Private (Brand only)
const updateApplicantStatus = async (req, res) => {
  try {
    const { status } = req.body; // "accepted" | "rejected" | "completed"
    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: "Campaign not found" });
    if (post.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const applicant = post.applicants.find(
      (a) => a.creatorId.toString() === req.params.creatorId
    );
    if (!applicant) return res.status(404).json({ success: false, message: "Applicant not found" });

    // completed sirf accepted se hi ho sakta hai
    if (status === "completed" && applicant.status !== "accepted") {
      return res.status(400).json({ success: false, message: "Only accepted collaborations can be marked completed" });
    }

    applicant.status = status;
    await post.save();

    res.json({ success: true, message: `Applicant marked as ${status}` });
  } catch (err) {
    console.error("Update applicant status error:", err);
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
  getPostDetail,
  getMyApplications,
  getPostApplicants,
  updateApplicantStatus,
};

