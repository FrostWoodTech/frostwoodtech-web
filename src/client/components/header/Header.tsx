import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Send, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Logo from "./Logo";
import { PillLink } from "@/client/components/site/ui";
import { ChristmasOfferTopLine } from "@/client/components/promo/ChristmasOffer";
import {
  EASE,
  fadeUpItem,
  staggerContainer,
} from "@/client/components/motion/presets";
import { NAV_LINKS, PRIMARY_CTA, PROMO, SITE } from "@/client/data/site";
import { isWithinWindow } from "@/client/utils/promo";
import { pad } from "@/client/utils/text";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative rounded-md px-1 py-2 text-[15px] font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue ${
    isActive
      ? "text-ink"
      : "text-slate hover:text-ink after:absolute after:inset-x-1 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-blue/40 after:transition-transform after:duration-300 hover:after:scale-x-100"
  }`;

/** Scroll distance before the header starts hiding on the way down. */
const HIDE_AFTER = 240;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  // Hide while scrolling down, show again on the way up; React skips same-value updates.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > HIDE_AFTER);
    setScrolled(latest > 8);
  });

  // The full-screen menu locks page scroll and closes on Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-60 rounded-md bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <div
        className={
          isWithinWindow(PROMO)
            ? "promo-blend text-white"
            : "bg-ink text-white/75"
        }
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-center gap-4 px-4 text-[12.5px] font-medium sm:px-6 lg:px-8">
          <ChristmasOfferTopLine fallback={SITE.descriptor} />
        </div>
      </div>

      <motion.header
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`sticky top-0 z-40 border-b bg-white/85 backdrop-blur-md transition-[box-shadow,border-color] duration-300 ${
          scrolled
            ? "border-rule shadow-[0_10px_30px_-20px_rgb(11_18_32/0.35)]"
            : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
                className={navClass}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {/* One underline that glides to the current page. */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                        className="absolute inset-x-1 bottom-0.5 h-0.5 rounded-full bg-blue"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <PillLink
              href={PRIMARY_CTA.href}
              variant="dark"
              className="h-11! px-5! text-[14px]! whitespace-nowrap max-lg:hidden!"
            >
              {PRIMARY_CTA.label}
            </PillLink>
            <Link
              to={PRIMARY_CTA.href}
              aria-label={PRIMARY_CTA.label}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 lg:hidden"
            >
              <Send size={18} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue lg:hidden"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-50 flex flex-col bg-ink px-4 pb-10 text-white sm:px-6"
          >
            <div className="flex h-18 items-center justify-between">
              <Logo tone="dark" onClick={close} />
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                autoFocus
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <motion.nav
              aria-label="Main"
              variants={staggerContainer(0.07, 0.25)}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-col"
            >
              {NAV_LINKS.map((link, index) => (
                <motion.div key={link.href} variants={fadeUpItem}>
                  <NavLink
                    to={link.href}
                    end={link.href === "/"}
                    onClick={close}
                    className={({ isActive }) =>
                      `flex items-baseline gap-4 border-b border-white/10 py-5 font-display text-[40px] leading-none tracking-[-0.04em] focus:outline-none focus-visible:text-blue-soft ${isActive ? "text-white" : "text-white/60"}`
                    }
                  >
                    <span className="font-sans text-[13px] font-bold tracking-normal text-blue-soft">
                      {pad(index)}
                    </span>
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
              className="mt-auto"
            >
              <PillLink
                href={PRIMARY_CTA.href}
                variant="light"
                onClick={close}
                className="w-full"
              >
                {PRIMARY_CTA.label}
              </PillLink>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-5 block text-center text-[15px] text-white/70"
              >
                {SITE.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
