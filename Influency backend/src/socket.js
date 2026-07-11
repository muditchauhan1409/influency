const onlineUsers = new Map();

function setupSocket(io) {
  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
    });

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });

    // ← Yeh add karo
    socket.on("sendMessage", ({ conversationId, message }) => {
      io.to(conversationId).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      if (socket.userId) onlineUsers.delete(socket.userId);
    });
  });
}

module.exports = { setupSocket, onlineUsers };