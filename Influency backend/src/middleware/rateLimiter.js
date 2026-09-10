const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }, // ← Render fix
  message: { success: false, message: "Too many attempts. Please try again later." },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }, // ← Render fix
  message: { success: false, message: "Too many requests. Please slow down." },
});

module.exports = { authLimiter, generalLimiter };