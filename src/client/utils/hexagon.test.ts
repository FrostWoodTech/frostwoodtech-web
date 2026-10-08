import { describe, expect, it } from "vitest";
import {
  hexagonPoints,
  regularHexagonPath,
  roundedPolygonPath,
} from "@/client/utils/hexagon";

const numbersIn = (path: string) =>
  (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe("hexagonPoints", () => {
  it("returns a pointy-top hexagon filling the box", () => {
    expect(hexagonPoints(0, 0, 100, 200)).toEqual([
      [50, 0],
      [100, 50],
      [100, 150],
      [50, 200],
      [0, 150],
      [0, 50],
    ]);
  });

  it("honours the box offset", () => {
    const [top, , , bottom] = hexagonPoints(10, 20, 100, 200);
    expect(top).toEqual([60, 20]);
    expect(bottom).toEqual([60, 220]);
  });
});

describe("roundedPolygonPath", () => {
  const hexagon = hexagonPoints(0, 0, 100, 200);

  it("draws a sharp closed polygon when the radius is 0", () => {
    expect(roundedPolygonPath(hexagon, 0)).toBe(
      "M 50 0 L 100 50 L 100 150 L 50 200 L 0 150 L 0 50 Z",
    );
  });

  it("rounds every corner with one curve and closes the path", () => {
    const path = roundedPolygonPath(hexagon, 10);
    expect(path.startsWith("M ")).toBe(true);
    expect(path.endsWith(" Z")).toBe(true);
    expect(path.match(/Q/g)).toHaveLength(6);
  });

  it("caps a huge radius so the path stays inside the shape's box", () => {
    const values = numbersIn(roundedPolygonPath(hexagon, 10_000));
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...values)).toBeLessThanOrEqual(200);
  });

  it("returns nothing for fewer than three points", () => {
    expect(roundedPolygonPath([[0, 0]], 5)).toBe("");
  });
});

describe("regularHexagonPath", () => {
  it("centres a regular hexagon on the given point", () => {
    const path = regularHexagonPath(200, 200, 100, 0);
    expect(path.startsWith("M 200 100 ")).toBe(true);
    expect(path).toContain("L 200 300");
    const xs = numbersIn(path).filter((_, i) => i % 2 === 0);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(
      100 * Math.sqrt(3),
      3,
    );
  });

  it("treats a negative corner as sharp", () => {
    expect(regularHexagonPath(0, 0, 10, -4)).toBe(
      regularHexagonPath(0, 0, 10, 0),
    );
  });
});
