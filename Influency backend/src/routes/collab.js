const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  applyToPost,
  getApplicants,
  brandAccept,
  creatorAccept,
  creatorDecline,
  submitWork,
  approveWork,
  getMyCollabs,
  getBrandCollabs,
} = require("../controllers/collabController");

router.post("/apply/:postId",              protect, applyToPost);
router.get("/applicants/:postId",          protect, getApplicants);
router.post("/brand-accept/:postId/:creatorId", protect, brandAccept);
router.post("/creator-accept/:collabId",   protect, creatorAccept);
router.post("/creator-decline/:collabId",  protect, creatorDecline);
router.post("/submit/:collabId",           protect, submitWork);
router.post("/approve/:collabId",          protect, approveWork);
router.get("/my",                          protect, getMyCollabs);
router.get("/brand",                       protect, getBrandCollabs);

module.exports = router;