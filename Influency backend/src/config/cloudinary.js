// PASTE PATH: src/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Avatar uploads — square, face-cropped
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "influency/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
  },
});

const upload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Post image uploads — larger, no forced crop
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "influency/posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1080, crop: "limit" }],
  },
});

const uploadPost = multer({
  storage: postStorage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB max
});

module.exports = { cloudinary, upload, uploadPost };