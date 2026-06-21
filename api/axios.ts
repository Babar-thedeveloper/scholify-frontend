import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Canceler,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BASE_URL && typeof window !== "undefined") {
  console.warn("[api] NEXT_PUBLIC_BACKEND_URL is not defined in .env");
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Track pending requests for debouncing/deduplication.
// Key: request signature. Value: cancel function.
const pendingRequests = new Map<string, Canceler>();

function getRequestKey(config: AxiosRequestConfig): string {
  const method = (config.method || "get").toLowerCase();
  const url = config.url || "";
  const params = config.params ? JSON.stringify(config.params) : "";
  const data = config.data ? JSON.stringify(config.data) : "";
  return `${method}:${url}:${params}:${data}`;
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const key = getRequestKey(config);

    // Cancel previous identical in-flight request (debounce/deduplication).
    if (pendingRequests.has(key)) {
      const cancel = pendingRequests.get(key);
      if (cancel) {
        cancel("Duplicate request cancelled");
      }
    }

    // Attach a cancel token to this request.
    config.cancelToken = new axios.CancelToken((cancel) => {
      pendingRequests.set(key, cancel);
    });

    // Attach auth token if available.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const key = getRequestKey(response.config);
    pendingRequests.delete(key);
    return response;
  },
  (error: AxiosError) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const config = error.config;
    if (config) {
      const key = getRequestKey(config);
      pendingRequests.delete(key);
    }

    // Global error handling.
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as { message?: string; error?: string };
      message = data?.message || data?.error || message;

      switch (status) {
        case 400:
          message = data?.message || "Bad request";
          break;
        case 401:
          message = "Unauthorized. Please log in again.";
          if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            // Let the app handle redirect; do not force navigation here.
          }
          break;
        case 403:
          message = "You don't have permission to perform this action.";
          break;
        case 404:
          message = "Requested resource not found.";
          break;
        case 422:
          message = data?.message || "Validation failed.";
          break;
        case 500:
          message = "Server error. Please try again later.";
          break;
        default:
          break;
      }
    } else if (error.request) {
      message = "Network error. Please check your internet connection.";
    }

    if (typeof window !== "undefined") {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
export { getRequestKey };
