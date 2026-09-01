const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ["signup", "login"], required: true },
  // for signup: store pending user data until otp is verified
  payload: { type: mongoose.Schema.Types.Mixed, default: null },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // 5 min auto-delete
});

module.exports = mongoose.model("Otp", OtpSchema);