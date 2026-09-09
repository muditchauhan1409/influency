// PASTE PATH: src/config/api.js
// Central place for the backend base URL — used everywhere instead of hardcoding.

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// If you also open a raw WebSocket (not through socket.io) for notifications,
// derive the ws/wss URL from the same env var so it flips automatically in prod:
export const WS_URL = API_URL.replace(/^http/, "ws").replace(/\/api$/, "");