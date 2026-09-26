import {
  AxiosError,
  AxiosHeaders,
  CanceledError,
  type AxiosResponse,
} from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ApiError, { isCanceled, toErrorMessage } from "@/admin/api/ApiError";

const SERVER = "Something went wrong on our end. Please try again in a moment.";
const CONNECTION =
  "Could not reach the server. Please check your connection and try again.";
const REQUEST = "That request couldn't be completed. Please try again.";
const GENERIC = "Something went wrong. Please try again.";

function axiosErrorWithStatus(status: number): AxiosError {
  const response = {
    status,
    statusText: "",
    data: {},
    headers: {},
    config: { headers: new AxiosHeaders() },
  } as AxiosResponse;
  return new AxiosError(
    "Request failed",
    "ERR_BAD_RESPONSE",
    undefined,
    undefined,
    response,
  );
}

describe("ApiError", () => {
  it("copies the code from the problem", () => {
    const error = new ApiError(409, "Slug taken.", {
      detail: "Slug taken.",
      code: "conflict",
    });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
    expect(error.status).toBe(409);
    expect(error.code).toBe("conflict");
    expect(error.message).toBe("Slug taken.");
  });

  it.each([
    [401, "invalid_token", true],
    [401, "unauthenticated", true],
    [401, "invalid_credentials", false],
    [401, undefined, false],
    [403, "invalid_token", false],
  ])(
    "isAuthExpired for status %i and code %j is %j",
    (status, code, expected) => {
      expect(
        new ApiError(status, "x", code ? { code } : undefined).isAuthExpired,
      ).toBe(expected);
    },
  );
});

describe("isCanceled", () => {
  it("recognises axios cancellations only", () => {
    expect(isCanceled(new CanceledError())).toBe(true);
    expect(isCanceled(new Error("nope"))).toBe(false);
  });
});

describe("toErrorMessage", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("hides network failures behind a connection message", () => {
    expect(toErrorMessage(new ApiError(0, "raw"))).toBe(CONNECTION);
  });

  it("hides server errors even when they carry a detail", () => {
    expect(
      toErrorMessage(
        new ApiError(500, "Stack trace", { detail: "Stack trace" }),
      ),
    ).toBe(SERVER);
    expect(toErrorMessage(new ApiError(503, "x"))).toBe(SERVER);
  });

  it("surfaces the API's user-facing detail or title for client errors", () => {
    expect(
      toErrorMessage(
        new ApiError(400, "Name is required.", { detail: "Name is required." }),
      ),
    ).toBe("Name is required.");
    expect(
      toErrorMessage(new ApiError(404, "Not Found", { title: "Not Found" })),
    ).toBe("Not Found");
  });

  it("uses a generic message for a client error without a problem body", () => {
    expect(toErrorMessage(new ApiError(400, "Bad Request"))).toBe(REQUEST);
  });

  it("handles raw axios errors", () => {
    expect(toErrorMessage(new AxiosError("Network Error", "ERR_NETWORK"))).toBe(
      CONNECTION,
    );
    expect(toErrorMessage(axiosErrorWithStatus(502))).toBe(SERVER);
    expect(toErrorMessage(axiosErrorWithStatus(422))).toBe(REQUEST);
  });

  it("never leaks arbitrary error text", () => {
    expect(toErrorMessage(new TypeError("undefined is not a function"))).toBe(
      GENERIC,
    );
    expect(toErrorMessage("a string")).toBe(GENERIC);
    expect(toErrorMessage(undefined)).toBe(GENERIC);
  });

  it("logs the technical detail to the console", () => {
    toErrorMessage(new ApiError(500, "x"));
    expect(console.error).toHaveBeenCalled();
  });
});
