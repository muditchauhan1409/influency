const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  signup,
  verifySignupOtp,
  login,
  verifyLoginOtp,
  resendOtp,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const signupRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["creator", "brand"]).withMessage("Role must be creator or brand"),
];

const loginRules = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const otpRules = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("otp").notEmpty().withMessage("OTP is required"),
];

// Signup flow (2 steps)
router.post("/signup", signupRules, signup);              // sends OTP
router.post("/verify-signup-otp", otpRules, verifySignupOtp); // creates account + logs in

// Login flow (2 steps)
router.post("/login", loginRules, login);                 // checks password, sends OTP
router.post("/verify-login-otp", otpRules, verifyLoginOtp); // verifies OTP, logs in

// Common
router.post("/resend-otp", resendOtp);
router.get("/me", protect, getMe);

module.exports = router;