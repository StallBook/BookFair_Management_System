/*import axios from "axios";

// CRA-style env var (you set this earlier)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token (if present) to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: if token is bad/expired, bounce to signin
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("sb_token");
      // Only redirect if you're not already on /signin
      if (!window.location.pathname.includes("/signin")) {
        window.location.assign("/signin");
      }
    }
    return Promise.reject(err);
  }
);
*/

// src/lib/api.ts
import axios from "axios";

/**
 * Base URL for API. Works for both CRA and Vite-env styles.
 * Set REACT_APP_API_BASE (CRA) or VITE_API_BASE (Vite) in your env.
 */
export const API_BASE =
  (process.env.REACT_APP_API_BASE as string) ||
  (process.env.VITE_API_BASE as string) ||
  "http://localhost:5007";

/**
 * Shared axios instance used across the frontend.
 * It sets Content-Type and attaches Authorization header when token present.
 */
export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

/**
 * Utility to programmatically set/remove the token (useful in tests or custom flows).
 * This updates localStorage and also sets the default header on the axios instance.
 */
export function setAuthToken(token?: string | null) {
  if (token) {
    localStorage.setItem("sb_token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("sb_token");
    delete api.defaults.headers.common["Authorization"];
  }
}

// Attach token (if present) to all requests (keeps working if token updated with setAuthToken)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("sb_token");
    if (token) {
      // config.headers has a more specific type in axios; cast to any for assignment safety.
      // We avoid overwriting config.headers entirely (which can cause type mismatch),
      // instead ensure it's an object and set the Authorization field.
      if (!config.headers) {
        // assign typed empty headers object
        (config as any).headers = {};
      }
      (config as any).headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore localStorage access errors in SSR environments
  }
  return config;
});

/**
 * Global response handler:
 * - If 401 returned, clear token and redirect to /signin (unless already there).
 * - Re-throws error for per-call handling downstream.
 */
let alreadyRedirected = false;
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // Prevent redirect loop
      if (!alreadyRedirected) {
        alreadyRedirected = true;
        try {
          localStorage.removeItem("sb_token");
        } catch (e) {}
        // small timeout so UI updates (and tests won't race)
        setTimeout(() => {
          if (!window.location.pathname.includes("/signin")) {
            window.location.assign("/signin");
          } else {
            // reset flag if already on signin so future 401s still redirect if needed
            alreadyRedirected = false;
          }
        }, 80);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
