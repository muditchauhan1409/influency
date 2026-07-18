const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const {
  authLimiter,
  generalLimiter,
} = require("./middleware/rateLimiter");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
  ],
  credentials: true,
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

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/forms", generalLimiter, formRoutes);
app.use("/api/users", generalLimiter, userRoutes);
app.use("/api/follow", generalLimiter, followRoutes);
app.use("/api/messages", generalLimiter, messageRoutes);
app.use("/api/posts", generalLimiter, postRoutes);  // ← rate limiter bhi add kiya

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;