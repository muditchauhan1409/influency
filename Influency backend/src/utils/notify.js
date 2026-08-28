const Notification = require("../models/Notification");
const WebSocket = require("ws");

let clientsRef = null;

function setClients(map) {
  clientsRef = map;
}

async function pushNotification(receiverId, { type, title, desc, relatedId }) {
  const notif = await Notification.create({ user: receiverId, type, title, desc, relatedId });
  const ws = clientsRef?.get(receiverId.toString());
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "notification", notification: notif }));
  }
  return notif;
}

module.exports = { pushNotification, setClients };