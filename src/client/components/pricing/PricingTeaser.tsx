import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PRICING_PROMISES, PRICING_TEASER_HEADER } from "@/client/data/pricing";

/**
 * Column dividers per breakpoint, matching the stats strip: rows split by hairlines on phones,
 * a 2×2 grid on tablets, and four columns on desktop. One entry per promise.
 */
const COLUMN_CLASSES = [
  "border-b sm:border-r lg:border-b-0",
  "border-b lg:border-r lg:border-b-0",
  "border-b sm:border-r sm:border-b-0",
  "",
] as const;

/** Home pricing teaser: four plain promises in a hairline strip, linking to the full pricing page. */
export default function PricingTeaser() {
  return (
    <section
      aria-labelledby="pricing-teaser-heading"
      className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32"
    >
      <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.015em] text-blue">
            <span aria-hidden="true" className="h-px w-8 bg-blue" />
            {PRICING_TEASER_HEADER.eyebrow}
          </p>
          <h2
            id="pricing-teaser-heading"
            className="mt-6 font-display text-[46px] leading-[0.96] tracking-[-0.04em] text-ink sm:text-[64px] lg:text-[76px]"
          >
            <span className="block">{PRICING_TEASER_HEADER.titleLead}</span>
            <em className="block text-blue">
              {PRICING_TEASER_HEADER.titleEmphasis}
            </em>
          </h2>
        </div>

        <div className="lg:pb-2">
          <p className="max-w-115 text-base leading-8 text-slate sm:text-lg">
            {PRICING_TEASER_HEADER.description}
          </p>
          <Link
            to="/pricing"
            className="group mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
          >
            See pricing
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <ul className="grid grid-cols-1 border-y border-rule sm:grid-cols-2 lg:grid-cols-4">
        {PRICING_PROMISES.map((promise, index) => (
          <li
            key={promise.id}
            className={`border-rule px-1 py-9 sm:px-8 lg:py-11 ${COLUMN_CLASSES[index] ?? ""}`}
          >
            <p className="font-display text-[46px] leading-none tracking-[-0.02em] text-ink tabular-nums lg:text-[54px]">
              {promise.value}
              {promise.suffix && (
                <span className="text-blue">{promise.suffix}</span>
              )}
            </p>
            <p className="mt-5 text-[15px] font-bold text-ink">
              {promise.title}
            </p>
            <p className="mt-2 max-w-64 text-[14px] leading-[1.65] text-slate">
              {promise.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
