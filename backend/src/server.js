// PASTE PATH: server.js
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// MongoDB connect karo, phir server start karo
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Influency API running on http://localhost:${PORT}`);
  });
});