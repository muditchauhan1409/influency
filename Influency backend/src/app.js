const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const {
  authLimiter,
  generalLimiter,
} = require("./middleware/rateLimiter");

// Purana code replace karo:
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      process.env.CLIENT_URL,
    ].filter(Boolean);
    
    if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Influency API is running" });
});

// Routes — sab ek jagah
const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/form");
const userRoutes = require("./routes/users");
const followRoutes = require("./routes/follow");
const messageRoutes = require("./routes/messages");
const postRoutes = require("./routes/posts");  // ← sirf ek baar
const socialPostRoutes = require("./routes/socialPosts");
const collabRoutes    = require("./routes/collab"); 
const notificationRoutes = require("./routes/notifications");
const analyticsRoutes = require("./routes/analytics");

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/forms", generalLimiter, formRoutes);
app.use("/api/users", generalLimiter, userRoutes);
app.use("/api/follow", generalLimiter, followRoutes);
app.use("/api/messages", generalLimiter, messageRoutes);
app.use("/api/posts", generalLimiter, postRoutes);  // ← rate limiter bhi add kiya
app.use("/api/social-posts", socialPostRoutes);
app.use("/api/collab",       generalLimiter, collabRoutes);
app.use("/api/notifications", generalLimiter, notificationRoutes);
app.use("/api/brand", require("./routes/brand"));
app.use("/api/analytics", generalLimiter, analyticsRoutes);
// app.js mein
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;