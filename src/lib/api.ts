import axios from "axios";

// =============================
// 1️⃣ CONFIGURE AXIOS INSTANCE
// =============================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050",
  timeout: 10000,
  withCredentials: true, // allow sending/receiving cookies (refresh_token)
});

// =============================
// 2️⃣ IN-MEMORY ACCESS TOKEN
// =============================
let accessToken: string | null = null;

// helper functions
export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

// =============================
// 3️⃣ REQUEST INTERCEPTOR
// =============================
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// 4️⃣ RESPONSE INTERCEPTOR (AUTO REFRESH)
// =============================
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onAccessTokenFetched(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for the refresh request to complete
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // =============================
        // 5️⃣ REFRESH TOKEN REQUEST
        // =============================
        const refreshUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050"}/auth/v1/refresh-token`;
        
        const { data } = await axios.post(
          refreshUrl,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);
        isRefreshing = false;
        onAccessTokenFetched(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError: unknown) {
        console.log((refreshError as { response?: unknown })?.response)
        isRefreshing = false;
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;