import { describe, expect, it } from "vitest";
import type { PriceType, UserStatus } from "@/admin/types";
import {
  contactBudgetRangeLabel,
  contactStatusLabel,
  formatDate,
  formatDelivery,
  formatPrice,
  initialsOf,
  priceTypeLabel,
  roleLabel,
  slugify,
  statusLabel,
} from "@/admin/utils/format";

describe("slugify", () => {
  it.each([
    ["Hello World", "hello-world"],
    ["  Trim me  ", "trim-me"],
    ["React & TypeScript!", "react-typescript"],
    ["--Already--dashed--", "already-dashed"],
    ["Café Menü", "caf-men"],
    ["!!!", ""],
  ])("%j -> %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe("initialsOf", () => {
  it("uses first and last name initials", () => {
    expect(initialsOf("ada", "lovelace", "ada@example.com")).toBe("AL");
  });

  it("uses a single available name initial", () => {
    expect(initialsOf("ada", undefined, "x@example.com")).toBe("A");
    expect(initialsOf("", "lovelace")).toBe("L");
  });

  it("falls back to the email, then to '?'", () => {
    expect(initialsOf(undefined, undefined, "zed@example.com")).toBe("Z");
    expect(initialsOf()).toBe("?");
    expect(initialsOf("", "", "")).toBe("?");
  });
});

describe("formatDate", () => {
  it("returns a dash for missing or invalid values", () => {
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("")).toBe("—");
    expect(formatDate("not a date")).toBe("—");
  });

  it("formats a valid ISO date", () => {
    const formatted = formatDate("2026-03-04T10:30:00Z");
    expect(formatted).not.toBe("—");
    expect(formatted).toMatch(/2026/);
  });
});

describe("formatPrice", () => {
  const plan = (priceType: PriceType, priceAmount?: number) => ({
    priceType,
    priceAmount,
    currency: "USD",
  });

  it("shows 'Contact us' when there is no amount", () => {
    expect(formatPrice(plan("custom"))).toBe("Contact us");
    expect(formatPrice(plan("fixed"))).toBe("Contact us");
  });

  it("formats each price type", () => {
    expect(formatPrice(plan("fixed", 500))).toBe(
      `USD ${(500).toLocaleString()}`,
    );
    expect(formatPrice(plan("starting_from", 500))).toMatch(/^From USD 500$/);
    expect(formatPrice(plan("hourly", 40))).toBe("USD 40/hr");
    expect(formatPrice(plan("monthly", 99))).toBe("USD 99/mo");
  });

  it("keeps a zero amount instead of treating it as absent", () => {
    expect(formatPrice(plan("fixed", 0))).toBe("USD 0");
  });

  it("caps fractional digits at two", () => {
    const expected = (12.345).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    expect(formatPrice(plan("fixed", 12.345))).toBe(`USD ${expected}`);
  });
});

describe("formatDelivery", () => {
  it("shows the text or a dash", () => {
    expect(formatDelivery({ deliveryText: "2–3 weeks" })).toBe("2–3 weeks");
    expect(formatDelivery({})).toBe("—");
  });
});

describe("labels", () => {
  it("maps known values", () => {
    expect(roleLabel("super_admin")).toBe("Super admin");
    expect(statusLabel("email_verification_required")).toBe(
      "Awaiting email verification",
    );
    expect(priceTypeLabel("starting_from")).toBe("Starting from");
    expect(contactStatusLabel("spam")).toBe("Spam");
    expect(contactBudgetRangeLabel("one_to_five_k")).toBe("$1k–$5k");
  });

  it("falls back to the raw value for one the API added later", () => {
    expect(statusLabel("suspended" as UserStatus)).toBe("suspended");
  });
});
