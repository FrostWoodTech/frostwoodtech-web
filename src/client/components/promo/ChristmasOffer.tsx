import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Gift, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Magnetic } from "@/client/components/site/ui";
import { Stagger, StaggerItem } from "@/client/components/motion/Reveal";
import { EASE, VIEWPORT } from "@/client/components/motion/presets";
import { PROMO } from "@/client/data/site";
import { daysUntil, isWithinWindow } from "@/client/utils/promo";

const OFFER_HREF = "/contact";

const GOLD_BUTTON =
  "group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-gold px-7 text-[15px] font-bold text-gold-ink shadow-[0_14px_34px_-14px_rgb(226_194_124/0.7)] transition duration-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-festive-green";

/** Gold sparkles on the green band: position, size, and when each starts twinkling. */
const SPARKLES = [
  { className: "top-10 right-[6%]", size: 28, delay: 0 },
  { className: "bottom-8 left-[8%]", size: 18, delay: 0.8 },
  { className: "top-[18%] left-[4%]", size: 14, delay: 1.6 },
  { className: "bottom-[14%] right-[12%]", size: 16, delay: 2.2 },
] as const;

function daysLeftLabel() {
  const days = daysUntil(PROMO.endsAt);
  return days === 1 ? "Last day" : `${days} days left`;
}

/** The seasonal offer as a premium festive band; renders nothing outside its dates. */
export function ChristmasOfferBand() {
  if (!isWithinWindow(PROMO)) return null;

  return (
    <section
      aria-labelledby="offer-heading"
      className="promo-green relative isolate overflow-hidden text-white"
    >
      {/* A few gold sparkles on the green; the red card is the "gift". */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {SPARKLES.map((sparkle) => (
          <motion.span
            key={sparkle.className}
            className={`absolute text-gold ${sparkle.className}`}
            animate={{
              opacity: [0.35, 1, 0.35],
              scale: [0.85, 1.15, 0.85],
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 3.2,
              ease: "easeInOut",
              repeat: Infinity,
              delay: sparkle.delay,
            }}
          >
            <Sparkles size={sparkle.size} strokeWidth={1.25} />
          </motion.span>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1, ease: EASE }}
          className="promo-surface rounded-[32px] border border-gold/50 p-7 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55),inset_0_1px_0_rgb(255_255_255/0.12)] sm:p-12 lg:p-16"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-gold/50 bg-black/25 px-4 py-2 text-[12px] font-bold tracking-[0.18em] text-gold uppercase">
              <Gift size={14} aria-hidden="true" />
              {PROMO.season} · {PROMO.occasion}
            </p>
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-white">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="service-pulse absolute inset-0 rounded-full bg-gold/60" />
                <span className="relative h-2 w-2 rounded-full bg-gold" />
              </span>
              {PROMO.endsLabel} · {daysLeftLabel()}
            </p>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-20">
            <p aria-hidden="true" className="font-display leading-[0.82]">
              <motion.span
                initial={{ opacity: 0, scale: 0.6, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                viewport={VIEWPORT}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 16,
                  delay: 0.35,
                }}
                className="promo-gold block origin-left text-[120px] tracking-[-0.06em] sm:text-[170px] lg:text-[210px]"
              >
                15%
              </motion.span>
              <span className="mt-2 block text-[40px] tracking-[-0.04em] text-white sm:text-[56px]">
                off your project
              </span>
            </p>

            <div>
              <h2
                id="offer-heading"
                className="font-display text-[32px] leading-[1.1] tracking-[-0.035em] sm:text-[42px] lg:text-[48px]"
              >
                <span className="sr-only">
                  {PROMO.season}: {PROMO.discount}.{" "}
                </span>
                {PROMO.headline}
              </h2>
              <p className="mt-6 max-w-xl text-[17px] leading-8 text-white">
                {PROMO.description}
              </p>

              <Stagger
                as="ul"
                stagger={0.1}
                delay={0.4}
                className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[14.5px] font-semibold"
              >
                {PROMO.perks.map((perk) => (
                  <StaggerItem
                    as="li"
                    key={perk}
                    className="flex items-center gap-2"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-gold-ink">
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {perk}
                  </StaggerItem>
                ))}
              </Stagger>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Magnetic>
                  <Link to={OFFER_HREF} className={GOLD_BUTTON}>
                    {PROMO.cta}
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-45"
                    />
                  </Link>
                </Magnetic>
                <p className="max-w-xs text-[13px] leading-5 text-white/90">
                  {PROMO.terms}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** One-line offer for the top bar; falls back to `fallback` outside the offer dates. */
export function ChristmasOfferTopLine({
  fallback,
}: {
  readonly fallback: string;
}) {
  if (!isWithinWindow(PROMO)) return <p>{fallback}</p>;

  return (
    <Link
      to={OFFER_HREF}
      className="group inline-flex min-w-0 items-center gap-2 rounded text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <Gift size={14} aria-hidden="true" className="shrink-0 text-gold" />
      <span className="truncate">
        <span className="font-bold text-white">{PROMO.season}:</span>{" "}
        <span className="text-white">{PROMO.short}</span>
      </span>
      <ArrowUpRight
        size={14}
        aria-hidden="true"
        className="shrink-0 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}

/** Reminder above the enquiry form that the offer applies. */
export function ChristmasOfferNotice() {
  if (!isWithinWindow(PROMO)) return null;

  return (
    <p className="promo-surface mb-6 flex items-start gap-3 rounded-2xl border border-gold/30 px-5 py-4 text-[14.5px] leading-6 text-white">
      <Gift
        size={18}
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-gold"
      />
      <span>
        <span className="font-bold text-white">
          {PROMO.season} — {PROMO.discount}.
        </span>{" "}
        Enquiries sent now are marked for the offer. {PROMO.terms}
      </span>
    </p>
  );
}
