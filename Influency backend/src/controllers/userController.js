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
        _id: user._id,
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
        contentCategories: user.contentCategories,
        languages: user.languages,
        availability: user.availability,
        bookedUntil: user.bookedUntil,
        radius: user.radius,
        responseTime: user.responseTime,
        rateMin: user.rateMin,
        rateMax: user.rateMax,
        socials: user.socials,
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
// @desc    Profile update karo (real-time save from Edit Profile page)
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const {
      name, bio, location, niches, handle,
      contentCategories, languages, availability,
      bookedUntil, radius, responseTime,
      rateMin, rateMax, socials,
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (handle !== undefined) updateData.handle = handle;
    if (niches !== undefined) updateData.niches = Array.isArray(niches) ? niches : niches.split(",");
    if (contentCategories !== undefined) updateData.contentCategories = contentCategories;
    if (languages !== undefined) updateData.languages = languages;
    if (availability !== undefined) updateData.availability = availability;
    if (bookedUntil !== undefined) updateData.bookedUntil = bookedUntil;
    if (radius !== undefined) updateData.radius = radius;
    if (responseTime !== undefined) updateData.responseTime = responseTime;
    if (rateMin !== undefined) updateData.rateMin = rateMin;
    if (rateMax !== undefined) updateData.rateMax = rateMax;
    if (socials !== undefined) updateData.socials = socials;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    console.error("Update profile error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }
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

    const user = await User.findById(req.user._id);
    if (user.avatarUrl) {
      const publicId = user.avatarUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`influency/avatars/${publicId}`);
    }

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

// @route   GET /api/users/search?query=...
// @desc    Naam ya handle se users search karo
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length === 0) {
      return res.json({ success: true, users: [] });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { handle: { $regex: query, $options: "i" } },
      ],
    })
      .select("name handle avatarUrl avatar role trustScore niches")
      .limit(20);

    res.json({ success: true, users });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/users/:userId
// @desc    Kisi bhi user ka public profile dekho
// @access  Private
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/users/settings
// @desc    Current user ki settings lo (dark mode, language, notifications, privacy)
// @access  Private
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email username avatar location trustScore darkMode language notifications privacy"
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   PUT /api/users/settings
// @desc    Settings ka koi bhi subset update karo
// @access  Private
const updateSettings = async (req, res) => {
  try {
    const allowed = ["darkMode", "language", "notifications", "privacy"];
    const updateData = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select(
      "name email username avatar location trustScore darkMode language notifications privacy"
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getDashboardData,
  updateProfile,
  uploadAvatar,
  getPublicProfile,
  searchUsers,
  getSettings,
  updateSettings,
};