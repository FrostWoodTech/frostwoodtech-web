import { describe, expect, it } from "vitest";
import { daysUntil, isWithinWindow } from "./promo";

const WINDOW = {
  startsAt: "2026-11-01T00:00:00",
  endsAt: "2027-01-01T00:00:00",
};

describe("isWithinWindow", () => {
  it("is true inside the window, including its start", () => {
    expect(isWithinWindow(WINDOW, new Date("2026-11-01T00:00:00"))).toBe(true);
    expect(isWithinWindow(WINDOW, new Date("2026-12-31T23:59:59"))).toBe(true);
  });

  it("is false before the start and from the end onwards", () => {
    expect(isWithinWindow(WINDOW, new Date("2026-10-31T23:59:59"))).toBe(false);
    expect(isWithinWindow(WINDOW, new Date("2027-01-01T00:00:00"))).toBe(false);
  });
});

describe("daysUntil", () => {
  it("rounds part days up", () => {
    expect(daysUntil(WINDOW.endsAt, new Date("2026-12-31T23:00:00"))).toBe(1);
    expect(daysUntil(WINDOW.endsAt, new Date("2026-12-30T00:00:00"))).toBe(2);
  });

  it("is 0 once the end has passed", () => {
    expect(daysUntil(WINDOW.endsAt, new Date("2027-01-01T00:00:00"))).toBe(0);
    expect(daysUntil(WINDOW.endsAt, new Date("2027-02-01T00:00:00"))).toBe(0);
  });
});
