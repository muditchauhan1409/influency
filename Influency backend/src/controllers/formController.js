// PASTE PATH: src/controllers/formController.js
const Form = require("../models/Form");
const User = require("../models/User");

// Fixed template questions jo hamesha available hain
const FIXED_TEMPLATE_QUESTIONS = [
  { id: "ft_name", type: "text", label: "Full Name", profileField: "name", required: true },
  { id: "ft_location", type: "text", label: "Location", profileField: "location", required: true },
  { id: "ft_niches", type: "multiselect", label: "Your Niches", profileField: "niches", required: true,
    options: ["Fashion", "Beauty", "Lifestyle", "Food", "Travel", "Fitness", "Tech", "Gaming", "Art", "Clothing"] },
  { id: "ft_availability", type: "select", label: "Availability Status", profileField: "availability", required: true,
    options: ["open", "booked", "unavailable", "closed"] },
  { id: "ft_workstatus", type: "select", label: "Work Status", profileField: "responseTime", required: true,
    options: ["Within 1 hour", "Within a few hours", "Within a day", "Within a few days"] },
  { id: "ft_bio", type: "textarea", label: "About You", profileField: "bio", required: false },
  { id: "ft_rate_min", type: "text", label: "Minimum Rate (₹)", profileField: "rateMin", required: false },
  { id: "ft_rate_max", type: "text", label: "Maximum Rate (₹)", profileField: "rateMax", required: false },
];

// @route   POST /api/forms/create
// @desc    Brand form create karo
// @access  Private (Brand only)
const createForm = async (req, res) => {
  try {
    const { title, description, includeFixedTemplate, customQuestions } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Form title required" });
    }

    const form = await Form.create({
      brandId: req.user._id,
      title,
      description: description || "",
      includeFixedTemplate: includeFixedTemplate !== false,
      customQuestions: customQuestions || [],
    });

    res.status(201).json({ success: true, form });
  } catch (err) {
    console.error("Create form error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// @route   POST /api/forms/:formId/send
// @desc    Creator ko email se form bhejo
// @access  Private (Brand only)
const sendForm = async (req, res) => {
  try {
    const { creatorEmail } = req.body;
    const form = await Form.findById(req.params.formId);

    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    if (form.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Creator email se dhundo
    const creator = await User.findOne({ email: creatorEmail.toLowerCase() });
    if (!creator) {
      return res.status(404).json({ success: false, message: "No creator found with this email" });
    }
    if (creator.role !== "creator") {
      return res.status(400).json({ success: false, message: "This account is not a creator" });
    }

    // Already sent check
    const alreadySent = form.sentTo.find(
      (s) => s.creatorId.toString() === creator._id.toString()
    );
    if (alreadySent) {
      return res.status(409).json({ success: false, message: "Form already sent to this creator" });
    }

    form.sentTo.push({ creatorId: creator._id });
    await form.save();

    res.json({ success: true, message: `Form sent to ${creator.name} (${creator.email})` });
  } catch (err) {
    console.error("Send form error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/forms/my-forms
// @desc    Brand ke saare forms lo
// @access  Private
const getMyForms = async (req, res) => {
  try {
    const forms = await Form.find({ brandId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, forms });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/forms/received
// @desc    Creator ke received forms lo
// @access  Private
const getReceivedForms = async (req, res) => {
  try {
    const forms = await Form.find({
      "sentTo.creatorId": req.user._id,
    }).populate("brandId", "name email avatar");

    const formsWithStatus = forms.map((form) => {
      const sentInfo = form.sentTo.find(
        (s) => s.creatorId.toString() === req.user._id.toString()
      );
      const submission = form.submissions.find(
        (s) => s.creatorId.toString() === req.user._id.toString()
      );
      return {
        _id: form._id,
        title: form.title,
        description: form.description,
        brand: form.brandId,
        sentAt: sentInfo?.sentAt,
        status: submission ? "submitted" : sentInfo?.status || "pending", 
        submittedAt: submission?.submittedAt,
      };
    }).filter((f) => f.status !== "dismissed");

    res.json({ success: true, forms: formsWithStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/forms/:formId/fill
// @desc    Form + creator profile data auto-fill ke saath lo
// @access  Private (Creator)
const getFormToFill = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId).populate("brandId", "name avatar");
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });

    // Creator ka profile lo
    const creator = await User.findById(req.user._id);

    // Saare questions combine karo
    const allQuestions = [
      ...(form.includeFixedTemplate ? FIXED_TEMPLATE_QUESTIONS : []),
      ...form.customQuestions,
    ];

    // Auto-fill — profile data se answers fill karo
    const autoFilledAnswers = {};
    allQuestions.forEach((q) => {
      if (q.profileField && creator[q.profileField] !== undefined) {
        autoFilledAnswers[q.id] = creator[q.profileField];
      }
    });

    res.json({
      success: true,
      form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        brand: form.brandId,
        questions: allQuestions,
        autoFilledAnswers, // frontend mein directly use kar sakte ho
      },
    });
  } catch (err) {
    console.error("Get form error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/forms/:formId/submit
// @desc    Creator form submit karo (auto-filled ya manual)
// @access  Private (Creator)
const submitForm = async (req, res) => {
  try {
    const { answers, autoFilled } = req.body;
    const form = await Form.findById(req.params.formId);

    if (!form) return res.status(404).json({ success: false, message: "Form not found" });

    // Already submitted check
    const alreadySubmitted = form.submissions.find(
      (s) => s.creatorId.toString() === req.user._id.toString()
    );
    if (alreadySubmitted) {
      return res.status(409).json({ success: false, message: "Already submitted" });
    }

    // Submission add karo
    form.submissions.push({
      creatorId: req.user._id,
      answers,
      autoFilled: autoFilled || false,
    });

    // sentTo status update karo
    const sentEntry = form.sentTo.find(
      (s) => s.creatorId.toString() === req.user._id.toString()
    );
    if (sentEntry) sentEntry.status = "submitted";

    await form.save();

    res.json({ success: true, message: "Form submitted successfully" });
  } catch (err) {
    console.error("Submit form error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/forms/:formId/submissions
// @desc    Brand — form ki saari submissions dekho
// @access  Private (Brand only)
const getSubmissions = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId).populate(
      "submissions.creatorId",
      "name email avatar handle"
    );

    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    if (form.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, submissions: form.submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   DELETE /api/forms/:formId
// @desc    Brand apna form delete kare
// @access  Private (Brand only)
const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    if (form.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    await form.deleteOne();
    res.json({ success: true, message: "Form deleted" });
  } catch (err) {
    console.error("Delete form error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/forms/:formId/dismiss
// @desc    Creator form dismiss kare (inbox se hata de)
// @access  Private (Creator only)
const dismissForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });

    const sentEntry = form.sentTo.find(
      (s) => s.creatorId.toString() === req.user._id.toString()
    );
    if (!sentEntry) {
      return res.status(404).json({ success: false, message: "Form not found in your inbox" });
    }

    sentEntry.status = "dismissed";
    await form.save();

    res.json({ success: true, message: "Form dismissed" });
  } catch (err) {
    console.error("Dismiss form error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createForm, sendForm, getMyForms, getReceivedForms,
  getFormToFill, submitForm, getSubmissions,
  deleteForm, dismissForm,
  FIXED_TEMPLATE_QUESTIONS,
};