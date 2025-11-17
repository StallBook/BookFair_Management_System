import axios from "axios";

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
