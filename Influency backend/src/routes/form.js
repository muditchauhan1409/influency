// PASTE PATH: src/routes/forms.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createForm,
  sendForm,
  getMyForms,
  getReceivedForms,
  getFormToFill,
  submitForm,
  getSubmissions,
} = require("../controllers/formController");

router.post("/create", protect, createForm);
router.post("/:formId/send", protect, sendForm);
router.get("/my-forms", protect, getMyForms);
router.get("/received", protect, getReceivedForms);
router.get("/:formId/fill", protect, getFormToFill);
router.post("/:formId/submit", protect, submitForm);
router.get("/:formId/submissions", protect, getSubmissions);

module.exports = router;