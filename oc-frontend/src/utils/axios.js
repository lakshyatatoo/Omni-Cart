import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "", 
});

// Automatically inject Authorization header before every request
api.interceptors.request.use(
  (config) => {
    // If the caller set _skipAuth, don't inject any token
    if (config._skipAuth) return config;

    // If no explicit Authorization header was provided, inject the default token
    const explicitHeader =
      config.headers?.Authorization || config.headers?.authorization;
    if (!explicitHeader) {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
