import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:5115",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Use an interceptor to inject the token dynamically
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // Using optional chaining and nullish coalescing for cleaner logic
    return (
      data?.message ||
      data?.error ||
      data?.detail ||
      (error.response?.status === 401
        ? "Unauthorized access."
        : "Request failed.")
    );
  }

  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
};

export default api;
