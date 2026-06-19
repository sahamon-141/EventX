// 📍 File: client/src/api.js

/**
 * Centralized API configuration.
 * It uses the VITE_API_URL environment variable if available,
 * otherwise it defaults to the local development server URL.
 */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default API;
