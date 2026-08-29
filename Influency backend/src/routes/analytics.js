const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getCreatorAnalytics, getBrandAnalytics } = require("../controllers/analyticsController");

router.get("/creator", protect, getCreatorAnalytics);
router.get("/brand", protect, getBrandAnalytics);

module.exports = router;