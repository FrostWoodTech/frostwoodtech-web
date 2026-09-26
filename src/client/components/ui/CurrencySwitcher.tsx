import { ChevronDown } from "lucide-react";
import useCurrency from "@/client/context/useCurrency";

interface CurrencySwitcherProps {
  readonly className?: string;
}

/** Overrides the currency guessed from the visitor's locale. */
export default function CurrencySwitcher({
  className = "",
}: CurrencySwitcherProps) {
  const { currency, currencies, setCurrency } = useCurrency();

  if (currencies.length < 2) return null;

  return (
    <div className={`relative ${className}`}>
      <select
        value={currency.code}
        onChange={(event) => setCurrency(event.target.value)}
        aria-label="Display currency"
        title="Display currency"
        className="h-11 cursor-pointer appearance-none rounded-xl border border-raise-br bg-raise pr-8 pl-3.5 text-sm font-bold text-text-secondary transition-colors duration-200 hover:border-hair-strong hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
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
        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-text-muted"
      />
    </div>
  );
}
