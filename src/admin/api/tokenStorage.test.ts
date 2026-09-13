import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAccessToken,
  getActiveAccessToken,
  setAccessToken,
} from "@/admin/api/tokenStorage";

const NOW = new Date("2026-06-15T12:00:00Z").getTime();

function expiresIn(ms: number): string {
  return new Date(NOW + ms).toISOString();
}

describe("tokenStorage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    clearAccessToken();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null when no token is stored", () => {
    expect(getActiveAccessToken()).toBeNull();
  });

  it("returns a token that is comfortably valid", () => {
    setAccessToken({ accessToken: "abc", expiresAt: expiresIn(15 * 60_000) });
    expect(getActiveAccessToken()).toBe("abc");
  });

  it("returns null once cleared", () => {
    setAccessToken({ accessToken: "abc", expiresAt: expiresIn(15 * 60_000) });
    clearAccessToken();
    expect(getActiveAccessToken()).toBeNull();
  });

  it("treats a token inside the 30 second leeway as already expired", () => {
    setAccessToken({ accessToken: "abc", expiresAt: expiresIn(30_000) });
    expect(getActiveAccessToken()).toBeNull();

    setAccessToken({ accessToken: "abc", expiresAt: expiresIn(30_001) });
    expect(getActiveAccessToken()).toBe("abc");
  });

  it("stops returning the token as time passes", () => {
    setAccessToken({ accessToken: "abc", expiresAt: expiresIn(60_000) });
    expect(getActiveAccessToken()).toBe("abc");
    vi.advanceTimersByTime(30_000);
    expect(getActiveAccessToken()).toBeNull();
  });

  it("returns null for an unparseable expiry", () => {
    setAccessToken({ accessToken: "abc", expiresAt: "not-a-date" });
    expect(getActiveAccessToken()).toBeNull();
  });
});
