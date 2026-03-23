import axios from "axios";
import i18n from "../i18n";

/**
 * Pre-configured Axios instance for API communication.
 * Includes base URL from environment variables and enables cross-site credentials.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/**
 * Global request interceptor.
 * - Injects the Bearer token from localStorage if available.
 * - Sets the 'Accept-Language' header based on the current i18next language.
 */
api.interceptors.request.use((config) => {
  // Retrieve the stored JWT token
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Ensure the backend receives the correct language for localized responses/errors
  config.headers["Accept-Language"] = i18n.language;

  return config;
});
