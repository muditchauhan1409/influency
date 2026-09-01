const User = require("../models/User");
const Otp = require("../models/Otp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { sendOtpMail } = require("../utils/mailer");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      handle: user.handle,
      username: user.username,
      avatar: user.avatar,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      trustScore: user.trustScore,
      onboardingStep: user.onboardingStep,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    },
  });
};

// ---------------- SIGNUP: STEP 1 - validate + send OTP (no user created yet) ----------------
const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  try {
    const { name, email, password, role, username } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    let finalUsername;
    if (username && username.trim()) {
      const clean = username.toLowerCase().trim();
      if (!/^[a-z0-9_.]{3,30}$/.test(clean)) {
        return res.status(400).json({
          success: false,
          message: "Username must be 3-30 characters (letters, numbers, . and _ only)",
        });
      }
      const taken = await User.findOne({ username: clean });
      if (taken) {
        return res.status(409).json({ success: false, message: "Username already taken" });
      }
      finalUsername = clean;
    } else {
      const randomSuffix = Math.floor(Math.random() * 999);
      finalUsername = name.toLowerCase().replace(/\s+/g, "_") + randomSuffix;
    }

    const randomSuffix2 = Math.floor(Math.random() * 999);
    const baseHandle = "@" + name.toLowerCase().replace(/\s+/g, "") + randomSuffix2;

    // hash password ourselves since user isn't created yet (pre-save hook won't run)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOtp();
    await Otp.deleteMany({ email, purpose: "signup" });
    await Otp.create({
      email,
      otp,
      purpose: "signup",
      payload: {
        name,
        email,
        password: hashedPassword,
        role: role || "creator",
        handle: baseHandle,
        username: finalUsername,
      },
    });

    await sendOtpMail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete signup.",
      email,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

// ---------------- SIGNUP: STEP 2 - verify OTP, create user, login ----------------
const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const record = await Otp.findOne({ email, otp, purpose: "signup" });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const { name, password, role, handle, username } = record.payload;

    const existing = await User.findOne({ email });
    if (existing) {
      await Otp.deleteMany({ email, purpose: "signup" });
      return res.status(409).json({ success: false, message: "Account already exists, please login" });
    }

    // password is already hashed in step 1 (signup) — skip the pre-save re-hash
    // by overriding isModified('password') to false just for this save
    const user = new User({
      name,
      email,
      password,
      role,
      handle,
      username,
      isEmailVerified: true,
    });
    const originalIsModified = user.isModified.bind(user);
    user.isModified = (path) => (path === "password" ? false : originalIsModified(path));

    const created = [await user.save()];

    await Otp.deleteMany({ email, purpose: "signup" });

    sendTokenResponse(created[0], 201, res);
  } catch (err) {
    console.error("Verify signup OTP error:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

// ---------------- LOGIN: STEP 1 - check credentials, send OTP ----------------
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
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const otp = generateOtp();
    await Otp.deleteMany({ email, purpose: "login" });
    await Otp.create({ email, otp, purpose: "login" });
    await sendOtpMail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete login.",
      email,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

// ---------------- LOGIN: STEP 2 - verify OTP, issue token ----------------
const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const record = await Otp.findOne({ email, otp, purpose: "login" });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await Otp.deleteMany({ email, purpose: "login" });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Verify login OTP error:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

// ---------------- Resend OTP (works for both signup/login) ----------------
const resendOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email || !["signup", "login"].includes(purpose)) {
      return res.status(400).json({ success: false, message: "Email and valid purpose are required" });
    }

    const existingOtp = await Otp.findOne({ email, purpose });
    if (!existingOtp) {
      return res.status(400).json({ success: false, message: "No pending request found, please start again" });
    }

    const otp = generateOtp();
    existingOtp.otp = otp;
    existingOtp.createdAt = new Date();
    await existingOtp.save();

    await sendOtpMail(email, otp);

    res.status(200).json({ success: true, message: "OTP resent to your email" });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  signup,
  verifySignupOtp,
  login,
  verifyLoginOtp,
  resendOtp,
  getMe,
};