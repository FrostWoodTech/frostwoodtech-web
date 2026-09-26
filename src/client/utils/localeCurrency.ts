/** Guesses a currency from the browser locale's region (no geo-IP). Unlisted regions get USD. */
const REGION_CURRENCY: Readonly<Record<string, string>> = {
  LK: "LKR",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  NZ: "NZD",
  IN: "INR",
  SG: "SGD",
  AE: "AED",
  US: "USD",
};

/** `null` when the region is unknown; the caller checks the currency is active. */
export function currencyFromLocale(): string | null {
  const locale =
    typeof navigator === "undefined" ? undefined : navigator.language;

  if (!locale) return null;

  // `en-LK` → LK. Avoids Intl, which throws on malformed tags.
  const region = locale.split("-")[1]?.toUpperCase();
  if (!region) return null;

  return REGION_CURRENCY[region] ?? null;
}
