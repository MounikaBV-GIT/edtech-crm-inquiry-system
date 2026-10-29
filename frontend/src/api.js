import axios from "axios";

// 1. Grab the base URL or fallback to local
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// 2. Strip any trailing slashes to prevent double slashes
const cleanBaseUrl = rawBaseUrl.replace(/\/$/, "");

// 3. Ensure the base URL always ends with /api
const baseURL = cleanBaseUrl.endsWith("/api") ? cleanBaseUrl : `${cleanBaseUrl}/api`;

const api = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;