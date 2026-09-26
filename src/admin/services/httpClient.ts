import axios, { type InternalAxiosRequestConfig } from "axios";
import type { ApiProblem, AuthResponse } from "@/admin/types";
import ApiError from "@/admin/api/ApiError";
import {
  clearAccessToken,
  getActiveAccessToken,
  setAccessToken,
} from "@/admin/api/tokenStorage";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7060/api/cms"
).replace(/\/$/, "");

/** Dispatched on `window` when a refresh fails; `AuthProvider` signs the user out. */
export const AUTH_EXPIRED_EVENT = "client-admin:auth-expired";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Skip attaching the bearer token. */
    skipAuth?: boolean;
    /** Set once a request has been retried after a refresh. */
    _retry?: boolean;
  }
}

export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
  // Sends the httpOnly refresh-token cookie.
  withCredentials: true,
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.skipAuth) {
    const token = getActiveAccessToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Shared so concurrent 401s trigger a single refresh. Uses bare `axios` to avoid
// recursing through the interceptor.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post<AuthResponse>(
      `${BASE_URL}/admin/auth/refresh`,
      {},
      { headers: { Accept: "application/json" }, withCredentials: true },
    );
    setAccessToken({
      accessToken: data.accessToken,
      expiresAt: data.expiresAt,
    });
    return data.accessToken;
  } catch {
    return null;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (cause: unknown) => {
    if (axios.isCancel(cause)) throw cause;

    if (!axios.isAxiosError(cause)) throw cause;

    if (!cause.response) {
      throw new ApiError(
        0,
        "Could not reach the server. Please check your connection and try again.",
      );
    }

    const problem = cause.response.data as ApiProblem | undefined;
    const error = new ApiError(
      cause.response.status,
      problem?.detail ??
        problem?.title ??
        cause.response.statusText ??
        "Request failed.",
      problem,
    );

    if (error.isAuthExpired && cause.config && !cause.config._retry) {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        cause.config._retry = true;
        cause.config.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return httpClient(cause.config);
      }
    }

    if (error.isAuthExpired) {
      clearAccessToken();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    throw error;
  },
);
