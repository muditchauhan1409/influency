// PASTE PATH: src/server.js  (Influency backend)
// Run: npm install ws
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// ── Middleware ──
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

// ── Routes ──
app.use("/api/auth", require("./routes/auth"));
app.use("/api/forms", require("./routes/forms"));
app.use("/api/follow", require("./routes/follow"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/notifications", require("./routes/notifications"));
const collabRoutes = require("./routes/collab");
app.use("/api/collab", collabRoutes);

// ── MongoDB ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ── WebSocket Server ──
const wss = new WebSocket.Server({ server });
const Message = require("./models/Message");
const User = require("./models/User");
const Notification = require("./models/Notification");
const { pushNotification, setClients } = require("./utils/notify");


// Map: userId (string) → WebSocket
const clients = new Map();
setClients(clients);



wss.on("connection", (ws) => {
  let userId = null;
  

  ws.on("message", async (raw) => {
    let data;
    try { data = JSON.parse(raw); } catch { return; }

    // ── AUTH ── First message must be { type: "auth", token: "..." }
    if (data.type === "auth") {
      try {
        const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
        userId = decoded.id;
        clients.set(userId, ws);
        ws.send(JSON.stringify({ type: "auth_ok", userId }));
        console.log(`WS: user ${userId} connected`);
      } catch {
        ws.send(JSON.stringify({ type: "auth_error", message: "Invalid token" }));
        ws.close();
      }
      return;
    }

    if (!userId) {
      ws.send(JSON.stringify({ type: "error", message: "Not authenticated" }));
      return;
    }

    // ── SEND MESSAGE ──
    if (data.type === "message") {
      const { receiverId, text } = data;
      if (!receiverId || !text?.trim()) return;

      try {
        // Check mutual connection
        const me = await User.findById(userId).populate("followingArr followersArr", "_id");
        const other = await User.findById(receiverId).populate("followingArr followersArr", "_id");
        if (!other) return;

        const meFollowsOther = me.followingArr?.map(String).includes(receiverId);
        const otherFollowsMe = other.followingArr?.map(String).includes(userId);
        if (!meFollowsOther || !otherFollowsMe) {
          ws.send(JSON.stringify({ type: "error", message: "Not mutually connected" }));
          return;
        }

        const conversationId = Message.getConversationId(userId, receiverId);
        const saved = await Message.create({
          conversationId,
          sender: userId,
          receiver: receiverId,
          text: text.trim(),
        });

        const payload = {
          type: "message",
          _id: saved._id,
          conversationId,
          sender: userId,
          receiver: receiverId,
          text: saved.text,
          createdAt: saved.createdAt,
        };

        // Send to receiver if online
        const receiverWs = clients.get(receiverId);
        if (receiverWs?.readyState === WebSocket.OPEN) {
          receiverWs.send(JSON.stringify(payload));
        }
                pushNotification(receiverId, {
          type: "message",
          title: `${me.username || me.name} sent you a message`,
          desc: saved.text.length > 60 ? saved.text.slice(0, 60) + "…" : saved.text,
          relatedId: saved._id,
        }).catch((e) => console.error("Notify error:", e));

        // Echo back to sender (confirmation)
        ws.send(JSON.stringify({ ...payload, type: "message_sent" }));
      } catch (err) {
        console.error("WS message error:", err);
      }
    }

    // ── TYPING INDICATOR ──
    if (data.type === "typing") {
      const receiverWs = clients.get(data.receiverId);
      if (receiverWs?.readyState === WebSocket.OPEN) {
        receiverWs.send(JSON.stringify({ type: "typing", from: userId }));
      }
    }
  });

  ws.on("close", () => {
    if (userId) {
      clients.delete(userId);
      console.log(`WS: user ${userId} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server + WS running on port ${PORT}`));