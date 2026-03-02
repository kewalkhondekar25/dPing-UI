/// <reference types="vite/client" />
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // If not 401, or we've already retried this request, just reject
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) {
      processQueue(null);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until refresh is done
      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(
        `${API_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const tokens = res.data?.data?.tokens;
      const newAccessToken = tokens?.access_token;
      const newRefreshToken = tokens?.refresh_token;

      if (newAccessToken) {
        Cookies.set('access_token', newAccessToken, {
          path: '/',
          secure: true,
          sameSite: 'none',
        });
      }
      if (newRefreshToken) {
        Cookies.set('refresh_token', newRefreshToken, {
          path: '/',
          secure: true,
          sameSite: 'none',
        });
      }

      processQueue(newAccessToken || null);
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(null);
      // On refresh failure, clear cookies so user is logged out next navigation
      Cookies.remove('access_token', { path: '/', secure: true, sameSite: 'none' });
      Cookies.remove('refresh_token', { path: '/', secure: true, sameSite: 'none' });
      Cookies.remove('user', { path: '/', secure: true, sameSite: 'none' });
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
