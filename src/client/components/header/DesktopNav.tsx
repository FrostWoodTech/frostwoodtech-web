import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/client/data/navigation";

export default function DesktopNav() {
  return (
    <nav
      className="hidden items-center gap-5 lg:flex xl:gap-8"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/"}
          className="rounded-sm text-[15px] font-medium whitespace-nowrap text-ink transition-colors duration-200 hover:text-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-4"
        >
          {({ isActive }) => (
            <span className="relative inline-block">
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-ink"
                />
              )}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
