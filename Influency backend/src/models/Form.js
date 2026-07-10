// PASTE PATH: src/models/Form.js
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "select", "multiselect", "textarea"],
    required: true,
  },
  label: { type: String, required: true },
  options: [String], // select/multiselect ke liye
  required: { type: Boolean, default: true },
  profileField: { type: String, default: null }, // creator profile ka kaunsa field auto-fill karega
});

const FormSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "active", "closed"],
      default: "active",
    },

    // Fixed template questions (hamesha same)
    includeFixedTemplate: { type: Boolean, default: true },

    // Custom questions (brand ke apne)
    customQuestions: [QuestionSchema],

    // Jinhe form bheja gaya
    sentTo: [
      {
        creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        sentAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "submitted"],
          default: "pending",
        },
      },
    ],

    // Submissions
    submissions: [
      {
        creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        submittedAt: { type: Date, default: Date.now },
        answers: mongoose.Schema.Types.Mixed, // { questionId: answer }
        autoFilled: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);