import { X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/client/data/navigation";
import Logo from "./Logo";

interface MobileNavProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-snow px-4 pt-3 sm:px-6 sm:pt-4 lg:hidden">
      <div className="flex h-16 shrink-0 items-center justify-between rounded-full border border-rule bg-white pr-2.5 pl-5 sm:pl-6">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <nav
        className="flex flex-1 flex-col overflow-y-auto px-2 pt-6 pb-8"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `border-b border-rule py-4 text-2xl font-semibold tracking-[-0.02em] transition-colors duration-200 ${
                  isActive ? "text-blue" : "text-ink hover:text-blue"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-white text-slate transition-colors duration-200 hover:text-ink"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        <Link
          to="/contact"
          onClick={onClose}
          className="mt-auto flex h-14 items-center justify-center rounded-full bg-ink text-base font-semibold text-white transition-colors duration-200 hover:bg-blue"
        >
          Talk to us
        </Link>
      </nav>
    </div>
  );
}
