const rateLimit = require("express-rate-limit");

// Strict limit for auth routes (login, signup, forgot-password) — per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

// Looser limit for general authenticated actions (follow, messages, etc.)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

module.exports = { authLimiter, generalLimiter };