import countries from "world-countries";
import type { SelectOption } from "@/admin/components/ui";

const NAME_BY_CODE = new Map(
  countries.map((country) => [country.cca2, country.name.common]),
);

export const COUNTRY_OPTIONS: readonly SelectOption[] = [
  ...NAME_BY_CODE.entries(),
]
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label));

export function countryNameFor(code: string): string {
  return NAME_BY_CODE.get(code) ?? "";
}
