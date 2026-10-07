import { describe, expect, it } from "vitest";
import { hexToLinearRgb } from "@/client/utils/color";

describe("hexToLinearRgb", () => {
  it("maps white and black to the ends of the range", () => {
    expect(hexToLinearRgb("#ffffff")).toEqual([1, 1, 1]);
    expect(hexToLinearRgb("#000000")).toEqual([0, 0, 0]);
  });

  it("expands shorthand and ignores case, the hash and whitespace", () => {
    expect(hexToLinearRgb("#fff")).toEqual(hexToLinearRgb("#FFFFFF"));
    expect(hexToLinearRgb(" 7db7ff ")).toEqual(hexToLinearRgb("#7DB7FF"));
  });

  it("applies the sRGB curve rather than a plain divide", () => {
    const [r, g, b] = hexToLinearRgb("#7DB7FF");
    expect(r).toBeCloseTo(0.2051, 3);
    expect(g).toBeCloseTo(0.4735, 3);
    expect(b).toBe(1);
  });

  it("uses the linear segment for very dark channels", () => {
    expect(hexToLinearRgb("#0a0a0a")[0]).toBeCloseTo(10 / 255 / 12.92, 6);
  });

  it("rejects malformed input", () => {
    expect(() => hexToLinearRgb("#12345")).toThrow(/Invalid hex colour/);
    expect(() => hexToLinearRgb("blue")).toThrow(/Invalid hex colour/);
  });
});
