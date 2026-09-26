/** In-memory access token only (lost on reload by design); the refresh token is an httpOnly cookie. */

interface AccessToken {
  readonly accessToken: string;
  readonly expiresAt: string;
}

/** The API uses ClockSkew = Zero, so a nearly expired token is treated as expired. */
const EXPIRY_LEEWAY_MS = 30_000;

let current: AccessToken | null = null;

export function setAccessToken(token: AccessToken): void {
  current = token;
}

export function clearAccessToken(): void {
  current = null;
}

export function getActiveAccessToken(): string | null {
  if (!current) return null;

  const expiresAt = Date.parse(current.expiresAt);
  if (Number.isNaN(expiresAt) || expiresAt - EXPIRY_LEEWAY_MS <= Date.now()) {
    return null;
  }

  return current.accessToken;
}
