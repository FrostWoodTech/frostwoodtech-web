// @vitest-environment jsdom
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ApiError from "@/admin/api/ApiError";
import {
  clearAccessToken,
  getActiveAccessToken,
  setAccessToken,
} from "@/admin/api/tokenStorage";
import { AUTH_EXPIRED_EVENT, httpClient } from "@/admin/services/httpClient";

type Reply = { status: number; data?: unknown } | "network-error";

const FAR_FUTURE = "2999-01-01T00:00:00Z";

interface SeenRequest {
  readonly url?: string;
  /** Captured at send time — a retry mutates and resends the same config object. */
  readonly authorization?: string;
}

let requests: SeenRequest[] = [];

/** Answers requests in order; like real adapters, resolves 2xx and rejects the rest. */
function queueReplies(...replies: Reply[]): void {
  const adapter: AxiosAdapter = async (config) => {
    requests.push({ url: config.url, authorization: authHeaderOf(config) });
    const reply = replies.shift();
    if (!reply) throw new Error(`Unexpected request to ${config.url}`);

    if (reply === "network-error") {
      throw new AxiosError("Network Error", AxiosError.ERR_NETWORK, config);
    }

    const response: AxiosResponse = {
      status: reply.status,
      statusText: "",
      data: reply.data ?? {},
      headers: new AxiosHeaders(),
      config,
    };
    if (reply.status >= 200 && reply.status < 300) return response;
    throw new AxiosError(
      "Request failed",
      AxiosError.ERR_BAD_REQUEST,
      config,
      undefined,
      response,
    );
  };
  httpClient.defaults.adapter = adapter;
}

function authHeaderOf(config: InternalAxiosRequestConfig): string | undefined {
  return AxiosHeaders.from(config.headers).get("Authorization")?.toString();
}

const expiredToken = {
  status: 401,
  data: { code: "invalid_token", detail: "Token expired." },
};

function mockRefresh(outcome: "success" | "failure") {
  return vi.spyOn(axios, "post").mockImplementation(async () => {
    if (outcome === "failure")
      throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST");
    return { data: { accessToken: "fresh-token", expiresAt: FAR_FUTURE } };
  });
}

describe("httpClient", () => {
  beforeEach(() => {
    requests = [];
    clearAccessToken();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("request interceptor", () => {
    it("attaches the active bearer token", async () => {
      setAccessToken({ accessToken: "abc", expiresAt: FAR_FUTURE });
      queueReplies({ status: 200 });
      await httpClient.get("/admin/products");
      expect(requests[0].authorization).toBe("Bearer abc");
    });

    it("sends no token when skipAuth is set", async () => {
      setAccessToken({ accessToken: "abc", expiresAt: FAR_FUTURE });
      queueReplies({ status: 200 });
      await httpClient.post("/admin/auth/login", {}, { skipAuth: true });
      expect(requests[0].authorization).toBeUndefined();
    });

    it("sends no token when none is stored", async () => {
      queueReplies({ status: 200 });
      await httpClient.get("/admin/products");
      expect(requests[0].authorization).toBeUndefined();
    });
  });

  describe("error mapping", () => {
    it("turns a network failure into ApiError with status 0", async () => {
      queueReplies("network-error");
      const error = await httpClient.get("/x").catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(0);
    });

    it("uses the problem detail, then title, as the message", async () => {
      queueReplies(
        {
          status: 400,
          data: {
            detail: "Name is required.",
            title: "Bad Request",
            code: "validation",
          },
        },
        { status: 404, data: { title: "Not Found" } },
      );

      const detailed = (await httpClient
        .get("/a")
        .catch((e: unknown) => e)) as ApiError;
      expect(detailed).toBeInstanceOf(ApiError);
      expect(detailed.status).toBe(400);
      expect(detailed.message).toBe("Name is required.");
      expect(detailed.code).toBe("validation");

      const titled = (await httpClient
        .get("/b")
        .catch((e: unknown) => e)) as ApiError;
      expect(titled.message).toBe("Not Found");
    });

    it("does not try to refresh on a 401 that isn't an expired token", async () => {
      const refresh = mockRefresh("success");
      queueReplies({
        status: 401,
        data: { code: "invalid_credentials", detail: "Wrong password." },
      });
      const error = (await httpClient
        .post("/login")
        .catch((e: unknown) => e)) as ApiError;
      expect(error.message).toBe("Wrong password.");
      expect(refresh).not.toHaveBeenCalled();
    });
  });

  describe("token refresh", () => {
    it("refreshes an expired token and retries the request with the new one", async () => {
      setAccessToken({ accessToken: "stale-token", expiresAt: FAR_FUTURE });
      const refresh = mockRefresh("success");
      queueReplies(expiredToken, { status: 200, data: { ok: true } });

      const response = await httpClient.get("/admin/products");

      expect(response.data).toEqual({ ok: true });
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(refresh.mock.calls[0][0]).toMatch(/\/admin\/auth\/refresh$/);
      expect(requests).toHaveLength(2);
      expect(requests[0].authorization).toBe("Bearer stale-token");
      expect(requests[1].authorization).toBe("Bearer fresh-token");
      expect(getActiveAccessToken()).toBe("fresh-token");
    });

    it("shares one refresh call across concurrent expired requests", async () => {
      const refresh = mockRefresh("success");
      queueReplies(
        expiredToken,
        expiredToken,
        { status: 200 },
        { status: 200 },
      );

      await Promise.all([httpClient.get("/a"), httpClient.get("/b")]);

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(requests).toHaveLength(4);
    });

    it("clears the session and broadcasts when the refresh fails", async () => {
      setAccessToken({ accessToken: "stale-token", expiresAt: FAR_FUTURE });
      mockRefresh("failure");
      const onExpired = vi.fn();
      window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
      queueReplies(expiredToken);

      try {
        const error = (await httpClient
          .get("/a")
          .catch((e: unknown) => e)) as ApiError;
        expect(error).toBeInstanceOf(ApiError);
        expect(error.isAuthExpired).toBe(true);
        expect(getActiveAccessToken()).toBeNull();
        expect(onExpired).toHaveBeenCalledTimes(1);
      } finally {
        window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
      }
    });

    it("gives up instead of looping when the retried request is rejected again", async () => {
      const refresh = mockRefresh("success");
      const onExpired = vi.fn();
      window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
      queueReplies(expiredToken, expiredToken);

      try {
        const error = (await httpClient
          .get("/a")
          .catch((e: unknown) => e)) as ApiError;
        expect(error.status).toBe(401);
        expect(refresh).toHaveBeenCalledTimes(1);
        expect(requests).toHaveLength(2);
        expect(getActiveAccessToken()).toBeNull();
        expect(onExpired).toHaveBeenCalledTimes(1);
      } finally {
        window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
      }
    });
  });
});
