require("dotenv").config();

const http = require("http");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const Message = require("./src/models/Message");
const { pushNotification, setClients } = require("./src/utils/notify");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// userId -> WebSocket
const clients = new Map();
setClients(clients);

wss.on("connection", (ws) => {
  console.log("🔌 WebSocket connected");

  ws.userId = null;

  ws.on("message", async (rawData) => {
    try {
      const data = JSON.parse(rawData.toString());

      // AUTH
      if (data.type === "auth") {
        const decoded = jwt.verify(
          data.token,
          process.env.JWT_SECRET
        );

        ws.userId = decoded.id.toString();

        clients.set(ws.userId, ws);

        ws.send(
          JSON.stringify({
            type: "auth_ok",
          })
        );

        console.log(`✅ WS authenticated: ${ws.userId}`);
        return;
      }

      // User must authenticate first
      if (!ws.userId) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Unauthorized",
          })
        );
        return;
      }

      // MESSAGE
      if (data.type === "message") {
        const conversationId = Message.getConversationId(
          ws.userId,
          data.receiverId
        );

        const message = await Message.create({
          conversationId,
          sender: ws.userId,
          receiver: data.receiverId,
          text: data.text,
        });

        const payload = {
          _id: message._id.toString(),
          sender: ws.userId,
          receiver: data.receiverId,
          text: message.text,
          createdAt: message.createdAt,
        };

        // Confirm sender
        ws.send(
          JSON.stringify({
            type: "message_sent",
            ...payload,
          })
        );

        // Send to receiver
        const receiverSocket = clients.get(
          data.receiverId.toString()
        );

                if (
          receiverSocket &&
          receiverSocket.readyState === WebSocket.OPEN
        ) {
          receiverSocket.send(
            JSON.stringify({
              type: "message",
              ...payload,
            })
          );
        }

        // ── Notification for receiver ──
        pushNotification(data.receiverId, {
          type: "message",
          title: "You have a new message",
          desc: message.text.length > 60 ? message.text.slice(0, 60) + "…" : message.text,
          relatedId: message._id,
        }).catch((e) => console.error("Notify error:", e));

        return;
      }

      // TYPING
      if (data.type === "typing") {
        const receiverSocket = clients.get(
          data.receiverId.toString()
        );

        if (
          receiverSocket &&
          receiverSocket.readyState === WebSocket.OPEN
        ) {
          receiverSocket.send(
            JSON.stringify({
              type: "typing",
              from: ws.userId,
            })
          );
        }
      }
    } catch (err) {
      console.error("❌ WebSocket error:", err.message);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: err.message,
          })
        );
      }
    }
  });

  ws.on("close", () => {
    if (ws.userId) {
      clients.delete(ws.userId);
      console.log(`❌ WS disconnected: ${ws.userId}`);
    }
  });
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(
      `🚀 Influency API + WebSocket running on http://localhost:${PORT}`
    );
  });
});