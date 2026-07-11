require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { setupSocket } = require("./src/socket");

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

setupSocket(io);
app.set("io", io);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Influency API running on http://localhost:${PORT}`);
  });
});
