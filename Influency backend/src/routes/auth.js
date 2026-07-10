const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { signup, login, getMe } = require("../controllers/authController");
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

router.post("/signup", signupRules, signup);
router.post("/login", loginRules, login);
router.get("/me", protect, getMe);

module.exports = router;
