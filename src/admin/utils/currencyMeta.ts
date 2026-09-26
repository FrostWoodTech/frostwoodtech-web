import type { SelectOption } from "@/admin/components/ui";

/** Currency names and symbols from `Intl`, memoised at module level. */

/** Safari gained `supportedValuesOf` in 15.4; the form falls back to free text without it. */
export const CURRENCY_PICKER_SUPPORTED =
  typeof Intl.supportedValuesOf === "function";

let codes: readonly string[] | null = null;

function supportedCodes(): readonly string[] {
  if (codes) return codes;

  try {
    codes = CURRENCY_PICKER_SUPPORTED ? Intl.supportedValuesOf("currency") : [];
  } catch {
    codes = [];
  }

  return codes;
}

/** `formatToParts` isolates the symbol from digits and locale spacing. */
function symbolPart(
  code: string,
  currencyDisplay: "symbol" | "narrowSymbol",
): string | null {
  try {
    return (
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        currencyDisplay,
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? null
    );
  } catch {
    return null;
  }
}

let sharedNarrowSymbols: ReadonlySet<string> | null = null;

/** Narrow symbols shared by several currencies (e.g. "$"); those fall back to the unambiguous symbol. */
function ambiguousNarrowSymbols(): ReadonlySet<string> {
  if (sharedNarrowSymbols) return sharedNarrowSymbols;

  const seen = new Map<string, number>();

  for (const code of supportedCodes()) {
    const narrow = symbolPart(code, "narrowSymbol");
    if (narrow) seen.set(narrow, (seen.get(narrow) ?? 0) + 1);
  }

  sharedNarrowSymbols = new Set(
    [...seen.entries()]
      .filter(([, count]) => count > 1)
      .map(([symbol]) => symbol),
  );

  return sharedNarrowSymbols;
}

/** "Sri Lankan Rupee" for `LKR`; the code itself when Intl has no name for it. */
export function currencyName(code: string): string {
  const normalized = code.trim().toUpperCase();

  try {
    const name = new Intl.DisplayNames(undefined, {
      type: "currency",
    }).of(normalized);

    return name ?? normalized;
  } catch {
    return normalized;
  }
}

/** "Rs" for `LKR`, "A$" for `AUD` — see {@link ambiguousNarrowSymbols}. */
export function currencySymbol(code: string): string {
  const normalized = code.trim().toUpperCase();

  const narrow = symbolPart(normalized, "narrowSymbol");
  if (narrow && !ambiguousNarrowSymbols().has(narrow)) {
    return narrow;
  }

  return symbolPart(normalized, "symbol") ?? narrow ?? normalized;
}

let options: readonly SelectOption[] | null = null;

/** Labels like `LKR — Sri Lankan Rupee`, so the picker filters by code and name. */
export function currencyCodeOptions(): readonly SelectOption[] {
  if (options) return options;

  options = supportedCodes().map((code) => ({
    value: code,
    label: `${code} — ${currencyName(code)}`,
  }));

  return options;
}
