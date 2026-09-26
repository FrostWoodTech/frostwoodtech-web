import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AdminUser,
  AuthResponse,
  AuthStatus,
  LoginRequest,
  RegisterRequest,
} from "@/admin/types";
import * as authService from "@/admin/services/authService";
import { isCanceled } from "@/admin/api/ApiError";
import { AUTH_EXPIRED_EVENT } from "@/admin/services/httpClient";
import {
  useGoogleSignIn,
  useLogin,
  useRegister,
} from "@/admin/hooks/useAuthApi";
import { clearAccessToken, setAccessToken } from "@/admin/api/tokenStorage";
import {
  AuthContext,
  type AuthContextValue,
} from "@/admin/context/authContext";

interface AuthProviderProps {
  readonly children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  // Starts "loading" and asks /auth/me; httpClient refreshes from the httpOnly cookie on 401.
  const [status, setStatus] = useState<AuthStatus>("loading");

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleSignInMutation = useGoogleSignIn();

  const logout = useCallback(async () => {
    clearAccessToken();
    setUser(null);
    setStatus("unauthenticated");

    // Best-effort server-side revoke; the local session is already cleared.
    authService.logout().catch(() => {});
  }, []);

  useEffect(() => {
    if (status !== "loading") return;

    const controller = new AbortController();

    authService
      .getMe(controller.signal)
      .then((me) => {
        setUser(me);
        setStatus("authenticated");
      })
      .catch((error: unknown) => {
        if (isCanceled(error)) return;
        // Only the interceptor clears the token, so a network blip doesn't end the session.
        setUser(null);
        setStatus("unauthenticated");
      });

    return () => controller.abort();
    // Runs once: status only leaves "loading" and never returns to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fired by httpClient when a token refresh fails mid-session.
  useEffect(() => {
    function handleAuthExpired() {
      setUser(null);
      setStatus("unauthenticated");
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  function storeSession(response: AuthResponse) {
    setAccessToken({
      accessToken: response.accessToken,
      expiresAt: response.expiresAt,
    });
    setUser(response.user);
    setStatus("authenticated");
  }

  const login = useCallback(
    async (payload: LoginRequest) => {
      const response = await loginMutation.mutateAsync(payload);
      storeSession(response);
      return response.user;
    },
    [loginMutation],
  );

  // No token: new accounts need email verification and super admin approval first.
  const register = useCallback(
    (payload: RegisterRequest) => registerMutation.mutateAsync(payload),
    [registerMutation],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const response = await googleSignInMutation.mutateAsync({ idToken });
      storeSession(response);
      return response.user;
    },
    [googleSignInMutation],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, loginWithGoogle, logout }),
    [user, status, login, register, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
