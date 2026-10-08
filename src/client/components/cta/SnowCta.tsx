import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import SnowflakeIcon, {
  type SnowflakeVariant,
} from "@/client/components/ui/SnowflakeIcon";
import { HOME_CTA } from "@/client/data/cta";

type Depth = "far" | "mid" | "near";

const DEPTH_CLASSES: Record<Depth, string> = {
  far: "text-ice/50 blur-[1px]",
  mid: "text-ice/80",
  near: "text-blue/50",
};

/**
 * The falling flakes: left %, top %, size px, duration s, delay s, sideways drift px, depth,
 * shape. Kept mostly to the outer thirds so the text stays clean.
 */
const FLAKES: readonly (readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  Depth,
  SnowflakeVariant,
])[] = [
  [4, 12, 18, 11, 0, 14, "mid", "branched"],
  [11, 46, 10, 9, 2.5, -10, "far", "simple"],
  [7, 74, 24, 13, 5, 16, "near", "star"],
  [18, 22, 12, 10, 1.5, 12, "far", "star"],
  [22, 62, 16, 12, 7, -14, "mid", "simple"],
  [26, 8, 9, 9.5, 4, 8, "far", "branched"],
  [15, 88, 11, 10.5, 3, 10, "far", "simple"],
  [36, 4, 8, 11, 6, -8, "far", "simple"],
  [62, 90, 9, 12, 1, 8, "far", "star"],
  [74, 14, 14, 10, 3.5, -12, "mid", "simple"],
  [80, 52, 22, 13.5, 0.5, 16, "near", "branched"],
  [86, 28, 10, 9, 6.5, 10, "far", "star"],
  [92, 70, 16, 11.5, 2, -14, "mid", "star"],
  [96, 10, 12, 10, 8, -10, "far", "simple"],
  [70, 78, 11, 9.5, 4.5, 12, "far", "branched"],
  [88, 90, 9, 12.5, 7.5, -8, "far", "simple"],
  [30, 84, 13, 11, 9, 12, "mid", "branched"],
  [66, 4, 10, 10.5, 5.5, 10, "far", "branched"],
];

/** Home closing call to action: a frosted panel with snow drifting through it. */
export default function SnowCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
      <div className="relative isolate overflow-hidden rounded-[36px] border border-rule bg-linear-to-br from-ice-wash via-mist to-snow px-6 py-20 text-center shadow-[0_40px_90px_-60px_rgb(36_100_165/0.55)] sm:px-10 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          {/* The services, products and reviews frost recipe, plus a glow behind the text. */}
          <span className="absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent_0_26px,rgb(125_183_255/0.1)_26px_27px)]" />
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgb(255_255_255/0.95),transparent_50%)]" />
          <span className="absolute top-1/2 left-1/2 h-105 w-[min(820px,120%)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(125_183_255/0.28),transparent_65%)]" />

          <SnowflakeIcon
            variant="branched"
            size={230}
            strokeWidth={0.55}
            className="cta-crystal absolute -top-20 -left-20 text-ice/35"
          />
          <SnowflakeIcon
            variant="star"
            size={270}
            strokeWidth={0.5}
            className="cta-crystal absolute -right-24 -bottom-24 text-ice/30"
            style={{ animationDirection: "reverse" }}
          />

          {FLAKES.map(
            ([left, top, size, duration, delay, sway, depth, variant]) => (
              <span
                key={`${left}-${top}`}
                className="cta-flake absolute"
                style={
                  {
                    left: `${left}%`,
                    top: `${top}%`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    "--sway": `${sway}px`,
                  } as CSSProperties
                }
              >
                <SnowflakeIcon
                  variant={variant}
                  size={size}
                  strokeWidth={size < 12 ? 2.2 : 1.6}
                  className={DEPTH_CLASSES[depth]}
                />
              </span>
            ),
          )}
        </div>

        <p className="inline-flex items-center gap-2 rounded-full border border-rule bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-ink backdrop-blur-md">
          <SnowflakeIcon size={14} strokeWidth={2} className="text-blue" />
          {HOME_CTA.eyebrow}
        </p>

        <h2 className="mx-auto mt-8 max-w-4xl font-display text-[46px] leading-[0.96] tracking-[-0.04em] text-ink sm:text-[64px] lg:text-[76px]">
          <span className="block">{HOME_CTA.titleLead}</span>
          <em className="block text-blue">{HOME_CTA.titleEmphasis}</em>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate sm:text-lg">
          {HOME_CTA.description}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to={HOME_CTA.primary.href}
            className="group inline-flex h-13 items-center gap-2 rounded-full bg-ink px-7 text-[15.5px] font-semibold text-white shadow-[0_14px_30px_-14px_rgb(21_40_64/0.6)] transition-colors duration-200 hover:bg-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
          >
            {HOME_CTA.primary.label}
            <ArrowRight
              size={17}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            to={HOME_CTA.secondary.href}
            className="inline-flex h-13 items-center rounded-full border border-rule bg-white/90 px-7 text-[15.5px] font-semibold text-ink transition-colors duration-200 hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
          >
            {HOME_CTA.secondary.label}
          </Link>
        </div>

        <ul className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[14px] font-medium text-slate">
          {HOME_CTA.promises.map((promise) => (
            <li key={promise} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue shadow-[0_0_0_1px_var(--color-rule)]">
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              </span>
              {promise}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
