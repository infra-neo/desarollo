import axios from "axios";
import Auth from "../services/auth";

// Custom event for authentication failures
export const AUTH_EVENTS = {
  AUTH_FAILED: "auth:failed",
};

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This allows sending and receiving cookies in cross-origin requests
});

// Flag to prevent multiple refresh attempts in parallel
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

// Process the failed queue (either resolve or reject all pending requests)
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Helper function to notify authentication failure
const notifyAuthFailure = () => {
  // Dispatch a custom event that AuthContext can listen for and handle logout
  const authFailedEvent = new CustomEvent(AUTH_EVENTS.AUTH_FAILED);
  window.dispatchEvent(authFailedEvent);
};

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await Auth.refreshToken();

        if (refreshResponse && refreshResponse.authenticated) {
          // Token refresh successful, process the queue and retry the original request
          processQueue(null);
          isRefreshing = false;
          return api(originalRequest);
        } else {
          // Token refresh failed, notify AuthContext to handle logout
          processQueue(new Error("Refresh token failed"));
          isRefreshing = false;
          console.error(
            "Error 401: Sesión expirada o inválida. Redirigiendo..."
          );
          notifyAuthFailure();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Error during refresh, notify AuthContext to handle logout
        processQueue(refreshError as Error);
        isRefreshing = false;
        console.error("Error al refrescar el token. Redirigiendo...");
        notifyAuthFailure();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
