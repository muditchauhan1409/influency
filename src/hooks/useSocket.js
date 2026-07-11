import { useEffect } from "react";
import { socket } from "../scripts/socket";

export function useSocket(userId) {
  useEffect(() => {
    if (!userId) return;
    socket.connect();
    socket.emit("register", userId);

    return () => socket.disconnect();
  }, [userId]);

  return socket;
}