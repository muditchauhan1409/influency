const Post  = require("../models/Post");
const Collab = require("../models/Collab");
const User  = require("../models/User");
const { pushNotification } = require("../utils/notify");

// ── Creator applies to a post ──
// POST /api/collab/apply/:postId
const applyToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const creatorId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.status === "closed") return res.status(400).json({ success: false, message: "Campaign is closed" });

    const alreadyApplied = post.applicants.find(
      (a) => a.creatorId.toString() === creatorId.toString()
    );
    if (alreadyApplied) return res.status(409).json({ success: false, message: "Already applied" });

    post.applicants.push({ creatorId, status: "pending" });
    await post.save();
        pushNotification(post.brandId, {
      type: "campaign",
      title: `New applicant for "${post.title}"`,
      desc: `${req.user.username || req.user.name} applied to your campaign`,
      relatedId: post._id,
    }).catch((e) => console.error("Notify error:", e));

    res.json({ success: true, message: "Applied successfully" });
  } catch (err) {
    console.error("applyToPost error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Brand sees all applicants for a post ──
// GET /api/collab/applicants/:postId
const getApplicants = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("applicants.creatorId", "name username avatar avatarUrl bio role");

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.brandId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not your post" });

    res.json({ success: true, applicants: post.applicants });
  } catch (err) {
    console.error("getApplicants error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Brand accepts a creator ──
// POST /api/collab/brand-accept/:postId/:creatorId
const brandAccept = async (req, res) => {
  try {
    const { postId, creatorId } = req.params;
    const brandId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.brandId.toString() !== brandId.toString())
      return res.status(403).json({ success: false, message: "Not your post" });

    // Update applicant status in Post
    const applicant = post.applicants.find(
      (a) => a.creatorId.toString() === creatorId
    );
    if (!applicant) return res.status(404).json({ success: false, message: "Applicant not found" });

    applicant.status = "accepted";
    await post.save();

    // Create Collab entry — goes to creator's Pending
    const existing = await Collab.findOne({ postId, creatorId });
    if (!existing) {
      await Collab.create({ postId, brandId, creatorId, status: "brand_accepted", brandAcceptedAt: new Date() });
    }
        pushNotification(creatorId, {
      type: "campaign",
      title: "You've been accepted!",
      desc: `A brand accepted you for "${post.title}"`,
      relatedId: post._id,
    }).catch((e) => console.error("Notify error:", e));

    res.json({ success: true, message: "Creator accepted, waiting for creator confirmation" });
  } catch (err) {
    console.error("brandAccept error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Creator accepts the collab (Pending → Active) ──
// POST /api/collab/creator-accept/:collabId
const creatorAccept = async (req, res) => {
  try {
    const collab = await Collab.findById(req.params.collabId);
    if (!collab) return res.status(404).json({ success: false, message: "Collab not found" });
    if (collab.creatorId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not your collab" });
    if (collab.status !== "brand_accepted")
      return res.status(400).json({ success: false, message: "Cannot accept at this stage" });

    collab.status = "active";
    collab.creatorAcceptedAt = new Date();
    await collab.save();
        pushNotification(collab.brandId, {
      type: "campaign",
      title: "Creator confirmed the collab",
      desc: "The collab is now active",
      relatedId: collab._id,
    }).catch((e) => console.error("Notify error:", e));

    res.json({ success: true, message: "Collab is now Active!" });
  } catch (err) {
    console.error("creatorAccept error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Creator declines the collab ──
// POST /api/collab/creator-decline/:collabId
const creatorDecline = async (req, res) => {
  try {
    const collab = await Collab.findById(req.params.collabId);
    if (!collab) return res.status(404).json({ success: false, message: "Collab not found" });
    if (collab.creatorId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not your collab" });

    collab.status = "declined";
    await collab.save();
        pushNotification(collab.brandId, {
      type: "campaign",
      title: "Creator declined the collab",
      desc: "",
      relatedId: collab._id,
    }).catch((e) => console.error("Notify error:", e));

    res.json({ success: true, message: "Collab declined" });
  } catch (err) {
    console.error("creatorDecline error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Creator submits work (Active → Submitted) ──
// POST /api/collab/submit/:collabId
const submitWork = async (req, res) => {
  try {
    const { submissionUrl, submissionNote } = req.body;
    const collab = await Collab.findById(req.params.collabId);
    if (!collab) return res.status(404).json({ success: false, message: "Collab not found" });
    if (collab.creatorId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not your collab" });
    if (collab.status !== "active")
      return res.status(400).json({ success: false, message: "Collab must be active to submit" });

    collab.status = "submitted";
    collab.submissionUrl = submissionUrl || null;
    collab.submissionNote = submissionNote || null;
    collab.submittedAt = new Date();
    await collab.save();
        pushNotification(collab.brandId, {
      type: "campaign",
      title: "Creator submitted work",
      desc: submissionNote || "Review the submission",
      relatedId: collab._id,
    }).catch((e) => console.error("Notify error:", e));

    res.json({ success: true, message: "Work submitted! Waiting for brand approval." });
  } catch (err) {
    console.error("submitWork error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Brand approves submission (Submitted → Completed) ──
// POST /api/collab/approve/:collabId
const approveWork = async (req, res) => {
  try {
    const { feedback } = req.body;
    const collab = await Collab.findById(req.params.collabId);
    if (!collab) return res.status(404).json({ success: false, message: "Collab not found" });
    if (collab.brandId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not your collab" });
    if (collab.status !== "submitted")
      return res.status(400).json({ success: false, message: "No submission to approve" });

    collab.status = "completed";
    collab.brandFeedback = feedback || null;
    collab.completedAt = new Date();
    await collab.save();
        pushNotification(collab.creatorId, {
      type: "campaign",
      title: "Your submission was approved!",
      desc: feedback || "Collab marked completed",
      relatedId: collab._id,
    }).catch((e) => console.error("Notify error:", e));

    res.json({ success: true, message: "Collab completed!" });
  } catch (err) {
    console.error("approveWork error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Creator: get my collabs (for Collaborations page) ──
// GET /api/collab/my
const getMyCollabs = async (req, res) => {
  try {
    const collabs = await Collab.find({ creatorId: req.user._id })
      .populate("postId", "title budget niches")
      .populate("brandId", "name username avatar avatarUrl")
      .sort({ updatedAt: -1 });

    // Map to frontend-friendly format
    const mapped = collabs.map((c) => ({
      _id: c._id,
      status: c.status,           // brand_accepted | active | submitted | completed | declined
      post:   c.postId,
      brand:  c.brandId,
      submissionUrl:  c.submissionUrl,
      submissionNote: c.submissionNote,
      brandFeedback:  c.brandFeedback,
      brandAcceptedAt:   c.brandAcceptedAt,
      creatorAcceptedAt: c.creatorAcceptedAt,
      submittedAt:       c.submittedAt,
      completedAt:       c.completedAt,
    }));

    res.json({ success: true, collabs: mapped });
  } catch (err) {
    console.error("getMyCollabs error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Brand: get all collabs for their posts ──
// GET /api/collab/brand
const getBrandCollabs = async (req, res) => {
  try {
    const collabs = await Collab.find({ brandId: req.user._id })
      .populate("postId", "title budget niches")
      .populate("creatorId", "name username avatar avatarUrl")
      .sort({ updatedAt: -1 });

    res.json({ success: true, collabs });
  } catch (err) {
    console.error("getBrandCollabs error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  applyToPost,
  getApplicants,
  brandAccept,
  creatorAccept,
  creatorDecline,
  submitWork,
  approveWork,
  getMyCollabs,
  getBrandCollabs,
};