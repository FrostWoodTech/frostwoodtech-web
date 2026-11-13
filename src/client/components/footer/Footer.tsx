import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Logo from "@/client/components/header/Logo";
import { motion } from "motion/react";
import { PillLink } from "@/client/components/site/ui";
import { EASE, VIEWPORT } from "@/client/components/motion/presets";
import { NAV_LINKS, SITE } from "@/client/data/site";
import { usePrefersReducedMotion } from "@/client/hooks/usePrefersReducedMotion";

const FOCUS_RING =
  "rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

export default function Footer() {
  const reducedMotion = usePrefersReducedMotion();
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-7xl border-t border-white/10 px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))] lg:gap-12">
          <div>
            <Logo tone="dark" />
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/65">
              Web, SaaS, mobile and AI software for growing companies — built,
              shipped and looked after by one senior engineering team.
            </p>
            <PillLink
              href="/contact"
              variant="light"
              className="mt-8 h-11! px-5! text-[14px]!"
            >
              Get in touch
            </PillLink>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[12px] font-bold tracking-[0.16em] text-white/45 uppercase">
              Pages
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`text-[15px] text-white/80 transition-colors hover:text-white ${FOCUS_RING}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[12px] font-bold tracking-[0.16em] text-white/45 uppercase">
              Contact
            </h2>
            <ul className="mt-5 flex flex-col gap-3 text-[15px] text-white/80">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className={`transition-colors hover:text-white ${FOCUS_RING}`}
                >
                  {SITE.email}
                </a>
              </li>
              {SITE.phones.map((phone) => (
                <li key={phone.display}>
                  <a
                    href={phone.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${phone.display}`}
                    className={`transition-colors hover:text-white ${FOCUS_RING}`}
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
              <li className="text-white/55">
                Replies {SITE.responseTime.toLowerCase()}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 py-7 text-[13.5px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth",
              })
            }
            className={`inline-flex w-fit items-center gap-2 font-semibold text-white/80 transition-colors hover:text-white ${FOCUS_RING}`}
          >
            Back to top
            <ArrowUp size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* The oversized wordmark rises letter by letter; the footer's bottom edge crops it on purpose. */}
      <motion.p
        aria-hidden="true"
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        transition={{ staggerChildren: 0.045 }}
        className="-mb-[0.22em] text-center font-display text-[clamp(56px,15.5vw,230px)] leading-[0.85] tracking-[-0.06em] whitespace-nowrap text-white/[0.07] select-none"
      >
        {Array.from(SITE.name).map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={{
              hidden: { y: "45%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 1, ease: EASE },
              },
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.p>
    </footer>
  );
}
