import type {
  AdminUser,
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleSignInRequest,
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResendVerificationResponse,
  SetPasswordRequest,
  VerifyEmailRequest,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

/** Returns no token: email verification and super admin approval come first. */
export async function register(payload: RegisterRequest): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(
    "/admin/auth/register",
    payload,
    { skipAuth: true },
  );
  return data;
}

/** Moves the account to `pending`; issues no token. */
export async function verifyEmail(
  payload: VerifyEmailRequest,
): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(
    "/admin/auth/verify-email",
    payload,
    { skipAuth: true },
  );
  return data;
}

/** Always a generic message (no account enumeration). */
export async function resendVerification(
  payload: ResendVerificationRequest,
): Promise<ResendVerificationResponse> {
  const { data } = await httpClient.post<ResendVerificationResponse>(
    "/admin/auth/resend-verification",
    payload,
    { skipAuth: true },
  );
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>(
    "/admin/auth/login",
    payload,
    { skipAuth: true },
  );
  return data;
}

export async function googleSignIn(
  payload: GoogleSignInRequest,
): Promise<AuthResponse> {
  const { data } = await httpClient.post<AuthResponse>(
    "/admin/auth/google",
    payload,
    { skipAuth: true },
  );
  return data;
}

/** Revokes and clears the refresh-token cookie. */
export async function logout(): Promise<void> {
  await httpClient.post("/admin/auth/logout", {}, { skipAuth: true });
}

/** Returns the user flat, unlike login/register. */
export async function getMe(signal?: AbortSignal): Promise<AdminUser> {
  const { data } = await httpClient.get<AdminUser>("/admin/auth/me", {
    signal,
  });
  return data;
}

export async function changePassword(
  payload: ChangePasswordRequest,
): Promise<void> {
  await httpClient.post("/admin/auth/change-password", payload);
}

/** Always a generic message (no account enumeration). */
export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const { data } = await httpClient.post<ForgotPasswordResponse>(
    "/admin/auth/forgot-password",
    payload,
    { skipAuth: true },
  );
  return data;
}

/** Redeems a reset or setup token. Issues no token and revokes existing sessions. */
export async function setPassword(
  payload: SetPasswordRequest,
): Promise<AdminUser> {
  const { data } = await httpClient.post<AdminUser>(
    "/admin/auth/set-password",
    payload,
    { skipAuth: true },
  );
  return data;
}
