import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { HOME_CTA } from "@/client/data/cta";

/** Home closing call to action: a solid navy panel. */
export default function ClosingCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
      <div className="rounded-2xl bg-ink px-6 py-16 sm:px-12 sm:py-20 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 lg:px-16">
        <div>
          <p className="text-[13px] font-semibold tracking-[0.08em] text-white/70 uppercase">
            {HOME_CTA.eyebrow}
          </p>

          <h2 className="mt-6 max-w-3xl font-display text-[36px] leading-[1.08] tracking-[-0.03em] text-white sm:text-[48px] lg:text-[56px]">
            {HOME_CTA.titleLead} {HOME_CTA.titleEmphasis}
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            {HOME_CTA.description}
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[14px] font-medium text-white/80">
            {HOME_CTA.promises.map((promise) => (
              <li key={promise} className="flex items-center gap-2">
                <Check
                  size={15}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="text-white"
                />
                {promise}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 lg:mt-0 lg:flex-col">
          <Link
            to={HOME_CTA.primary.href}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-7 text-[15px] font-semibold text-ink transition-colors duration-200 hover:bg-ice-wash focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
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
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/30 px-7 text-[15px] font-semibold text-white transition-colors duration-200 hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {HOME_CTA.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
