// PASTE PATH: src/routes/users.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const {
  getDashboardData,
  updateProfile,
  uploadAvatar,
  getPublicProfile,
  searchUsers,
} = require("../controllers/userController");

router.get("/dashboard", protect, getDashboardData);
router.put("/profile", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.get("/search", protect, searchUsers);
router.get("/:userId", protect, getPublicProfile);

module.exports = router;