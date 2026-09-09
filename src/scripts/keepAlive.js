// src/scripts/keepAlive.js
export const keepAliveBackend = () => {
  setInterval(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .catch(() => {}); // silently ignore errors
  }, 10 * 60 * 1000); // har 10 minute mein ping
};