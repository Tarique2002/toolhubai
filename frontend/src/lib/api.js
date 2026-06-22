import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 180000, // 3 minutes — covers Render cold-start (~60s) + heavy AI tasks
});

/**
 * Ping the backend to wake it up from Render's free-tier sleep.
 * Call this once on app load. Returns true if alive, false if down.
 */
export async function pingBackend() {
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 90000 });
    return true;
  } catch {
    return false;
  }
}

export default api;
