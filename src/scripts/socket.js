import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
  withCredentials: true,
});

export function connectSocket(userId) {
  if (socket.connected) return;
  socket.connect();
  socket.emit("register", userId);
}