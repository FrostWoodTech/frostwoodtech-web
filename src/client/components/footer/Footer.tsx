import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { FOOTER_DATA } from "@/client/data/footer";
import { SOCIAL_LINKS } from "@/client/data/navigation";
import { usePrefersReducedMotion } from "@/client/hooks/usePrefersReducedMotion";
import SnowflakeIcon from "@/client/components/ui/SnowflakeIcon";
import Logo from "../header/Logo";

const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2";

const ROUND_BUTTON = `flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-white text-slate transition-colors duration-200 hover:border-ink hover:text-ink ${FOCUS_RING}`;

interface FooterLinkProps {
  readonly href: string;
  readonly label: string;
  readonly className: string;
  readonly children?: React.ReactNode;
}

/** Router link for app paths; a plain anchor for `#` placeholders and other sites (new tab). */
function FooterLink({ href, label, className, children }: FooterLinkProps) {
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
        {children}
      </a>
    );
  }
  if (href === "#") {
    return (
      <a href={href} className={className}>
        {label}
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {label}
      {children}
    </Link>
  );
}

export default function Footer() {
  const reducedMotion = usePrefersReducedMotion();
  const backToTop = () =>
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });

  return (
    <footer className="relative overflow-hidden border-t border-rule bg-linear-to-b from-snow to-ice-wash">
      {/* The 60° frost-cut lines, fading in towards the bottom. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent_0_26px,rgb(125_183_255/0.1)_26px_27px)] [mask-image:linear-gradient(to_bottom,transparent,black)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)] lg:gap-16">
          <div>
            <Logo />
            <p className="mt-8 font-display text-[34px] leading-[1.02] tracking-[-0.03em] text-ink sm:text-[44px]">
              <span className="block">{FOOTER_DATA.headlineLead}</span>
              <em className="block text-blue">
                {FOOTER_DATA.headlineEmphasis}
              </em>
            </p>

            <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-rule bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-ink">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="service-pulse absolute inset-0 rounded-full bg-blue/40" />
                <span className="relative h-2 w-2 rounded-full bg-blue" />
              </span>
              {FOOTER_DATA.status}
            </p>

            <a
              href={`mailto:${FOOTER_DATA.email}`}
              className={`group mt-5 flex w-fit items-center gap-2 rounded-lg font-display text-[26px] tracking-[-0.02em] text-ink transition-colors duration-200 hover:text-blue sm:text-[30px] ${FOCUS_RING}`}
            >
              {FOOTER_DATA.email}
              <ArrowUpRight
                size={22}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3"
          >
            {FOOTER_DATA.linkGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-[13px] font-bold tracking-[0.015em] text-ink">
                  {group.title}
                </h2>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink
                        href={link.href}
                        label={link.label}
                        className={`group inline-flex items-center gap-1 rounded text-[15px] text-slate transition-colors duration-200 hover:text-ink ${FOCUS_RING}`}
                      >
                        <ArrowUpRight
                          size={14}
                          aria-hidden="true"
                          className="-translate-x-1 opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-rule py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
            <p className="text-[13.5px] text-slate">{FOOTER_DATA.copyright}</p>
            <ul className="flex gap-5">
              {FOOTER_DATA.legalLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    href={link.href}
                    label={link.label}
                    className={`rounded text-[13.5px] text-slate transition-colors duration-200 hover:text-ink ${FOCUS_RING}`}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.platform}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className={ROUND_BUTTON}
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              );
            })}
            <button
              type="button"
              onClick={backToTop}
              className={`ml-2 inline-flex h-10 items-center gap-2 rounded-full border border-rule bg-white px-4 text-[13.5px] font-semibold text-ink transition-colors duration-200 hover:border-ink ${FOCUS_RING}`}
            >
              Back to top
              <ArrowUp size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* The giant frosted wordmark; its lower edge is cropped by the footer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mx-auto max-w-7xl px-4 select-none sm:px-6 lg:px-8"
      >
        <p className="-mb-[0.2em] bg-linear-to-b from-ice/60 to-ice/0 bg-clip-text text-center font-display text-[clamp(64px,16.5vw,220px)] leading-[0.8] tracking-[-0.05em] whitespace-nowrap text-transparent">
          FrostWoodTech
        </p>
        <SnowflakeIcon
          variant="branched"
          size={120}
          strokeWidth={0.7}
          className="absolute top-0 right-[4%] hidden -translate-y-1/3 text-ice/40 sm:block"
        />
      </div>
    </footer>
  );
}
