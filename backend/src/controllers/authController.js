// PASTE PATH: src/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// JWT token generate karne wala helper
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Response mein token + user data bhejne wala helper
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      handle: user.handle,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      trustScore: user.trustScore,
      onboardingStep: user.onboardingStep,
      isEmailVerified: user.isEmailVerified,
    },
  });
};

// @route   POST /api/auth/signup
// @desc    Naya user register karo
// @access  Public
const signup = async (req, res) => {
  // Validation errors check karo
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { name, email, password, role } = req.body;

    // Email already registered hai?
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Handle auto-generate karo (@name123 format)
    const baseHandle = "@" + name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 999);

    const user = await User.create({
      name,
      email,
      password,
      role: role || "creator",
      handle: baseHandle,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

// @route   POST /api/auth/login
// @desc    User login karo
// @access  Public
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { email, password } = req.body;

    // User dhundo (password bhi select karo — schema mein select:false tha)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Password match karo
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

// @route   GET /api/auth/me
// @desc    Current logged-in user ka data lo
// @access  Private (JWT required)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { signup, login, getMe };