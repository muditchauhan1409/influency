// PASTE PATH: src/controllers/userController.js
const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");

// @route   GET /api/users/dashboard
// @desc    Creator dashboard data lo
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      dashboard: {
        name: user.name,
        handle: user.handle,
        avatarUrl: user.avatarUrl,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        role: user.role,
        trustScore: user.trustScore,
        followers: user.followers,
        following: user.following,
        campaignsCompleted: user.campaignsCompleted,
        rating: user.rating,
        niches: user.niches,
        isEmailVerified: user.isEmailVerified,
        onboardingStep: user.onboardingStep,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   PUT /api/users/profile
// @desc    Profile update karo
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, niches, handle } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location) updateData.location = location;
    if (niches) updateData.niches = Array.isArray(niches) ? niches : niches.split(",");
    if (handle) updateData.handle = handle;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/users/avatar
// @desc    Profile picture upload karo (Cloudinary)
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // Old avatar delete karo Cloudinary se
    const user = await User.findById(req.user._id);
    if (user.avatarUrl) {
      const publicId = user.avatarUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`influency/avatars/${publicId}`);
    }

    // Naya URL save karo
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: req.file.path },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      avatarUrl: req.file.path,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/users/:userId
// @desc    Kisi bhi user ka public profile dekho
// @access  Private
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("name handle avatarUrl bio location niches trustScore followers campaignsCompleted rating role");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getDashboardData, updateProfile, uploadAvatar, getPublicProfile };