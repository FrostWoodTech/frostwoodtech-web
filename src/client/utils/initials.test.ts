import { describe, expect, it } from "vitest";
import { initialsOf } from "@/client/utils/initials";

describe("initialsOf", () => {
  it("takes the first letter of the first two words, uppercased", () => {
    expect(initialsOf("maya reynolds")).toBe("MR");
    expect(initialsOf("Ana Sofia Martins")).toBe("AS");
  });

  it("handles a single name and extra whitespace", () => {
    expect(initialsOf("  Priya  ")).toBe("P");
    expect(initialsOf("Tom   B.")).toBe("TB");
  });

  it("falls back to a question mark for a blank name", () => {
    expect(initialsOf("")).toBe("?");
    expect(initialsOf("   ")).toBe("?");
  });
});
