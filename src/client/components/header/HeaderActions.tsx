import { Link } from "react-router-dom";
import ThemeSwitcher from "@/client/components/ui/ThemeSwitcher";
import CurrencySwitcher from "@/client/components/ui/CurrencySwitcher";

export default function HeaderActions() {
  return (
    // Switchers stay outside the `lg:` gate so they're reachable without opening the mobile menu.
    <div className="flex shrink-0 items-center gap-3">
      <CurrencySwitcher />
      <ThemeSwitcher />

      <Link
        to="/contact"
        className="hidden lg:inline-flex items-center rounded-xl fw-btn px-5 py-2.5 text-sm font-bold shadow-btn transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
      >
        Contact Us
      </Link>
    </div>
  );
}
