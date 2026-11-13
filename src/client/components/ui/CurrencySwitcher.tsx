import { ChevronDown } from "lucide-react";
import useCurrency from "@/client/context/useCurrency";

interface CurrencySwitcherProps {
  /** Shown before the select; hidden along with it when there's nothing to switch. */
  readonly label?: string;
  readonly className?: string;
}

/** Overrides the currency guessed from the visitor's locale. */
export default function CurrencySwitcher({
  label,
  className = "",
}: CurrencySwitcherProps) {
  const { currency, currencies, setCurrency } = useCurrency();

  if (currencies.length < 2) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && <span className="text-sm text-text-secondary">{label}</span>}

      <div className="relative">
        <select
          value={currency.code}
          onChange={(event) => setCurrency(event.target.value)}
          aria-label="Display currency"
          title="Display currency"
          className="h-10 cursor-pointer appearance-none rounded-full border border-rule bg-white pr-9 pl-4 text-sm font-semibold text-ink transition-colors duration-200 hover:border-hair-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
        >
          {currencies.map((item) => (
            <option key={item.code} value={item.code}>
              {item.code}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-slate"
        />
      </div>
    </div>
  );
}
