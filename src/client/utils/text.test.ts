import { describe, expect, it } from "vitest";
import { markdownBullets, pad } from "./text";

describe("pad", () => {
  it("is one-based and two digits", () => {
    expect(pad(0)).toBe("01");
    expect(pad(9)).toBe("10");
  });
});

describe("markdownBullets", () => {
  it("returns an empty list for missing input", () => {
    expect(markdownBullets(undefined)).toEqual([]);
    expect(markdownBullets("")).toEqual([]);
  });

  it("keeps bullet items, strips bold markers and skips other lines", () => {
    const md =
      "Intro line\n- **Design** that fits\n* Second item\n\n-not a bullet\n-   ";
    expect(markdownBullets(md)).toEqual(["Design that fits", "Second item"]);
  });
});
