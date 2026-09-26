import { Check, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import type { ApiPricingPlan } from "@/client/types";
import useCurrency from "@/client/context/useCurrency";
import { formatPlanPrice } from "@/client/utils/pricing";

interface PricingCardProps {
  readonly plan: ApiPricingPlan;
}

const DEFAULT_CTA_LABEL = "Get a quote";
const DEFAULT_CTA_URL = "/contact";

export default function PricingCard({ plan }: PricingCardProps) {
  const { isPopular } = plan;
  const { currency } = useCurrency();
  const price = formatPlanPrice(plan, currency);

  const ctaLabel = plan.ctaLabel ?? DEFAULT_CTA_LABEL;
  const ctaUrl = plan.ctaUrl ?? DEFAULT_CTA_URL;
  const ctaClasses = `relative z-2 mt-auto rounded-xl py-3.5 text-center text-[14.5px] font-bold transition-all duration-200 ${
    isPopular
      ? "bg-panel-btn text-panel-btn-ink hover:-translate-y-0.5"
      : "border border-card-br bg-surface-900 text-text-primary hover:border-hair-strong"
  }`;
  const features = [...plan.features].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div
      className={`relative flex flex-col gap-5 overflow-hidden rounded-[20px] border p-8 ${
        isPopular
          ? "fw-panel fw-grain border-panel-br shadow-panel lg:z-10 lg:scale-105"
          : "border-card-br bg-card shadow-card"
      }`}
    >
      <div className="relative z-2">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-xs font-bold tracking-[0.1em] uppercase ${
              isPopular ? "text-panel-ink-2" : "text-text-muted"
            }`}
          >
            {plan.name}
          </span>
          {isPopular && (
            <span className="shrink-0 rounded-full bg-amber px-3 py-1 text-[11px] font-extrabold tracking-[0.05em] text-amber-ink">
              MOST POPULAR
            </span>
          )}
        </div>

        <div className="mt-3.5 flex flex-wrap items-baseline gap-2">
          {price.prefix && (
            <span
              className={`text-[13.5px] ${
                isPopular ? "text-panel-ink-2" : "text-text-muted"
              }`}
            >
              {price.prefix}
            </span>
          )}
          <span
            className={`font-display text-[44px] leading-none font-medium tabular-nums ${
              isPopular ? "text-panel-ink" : "text-text-primary"
            }`}
          >
            {price.amount ?? "Contact us"}
          </span>
          {price.suffix && (
            <span
              className={`text-[13.5px] ${
                isPopular ? "text-panel-ink-2" : "text-text-muted"
              }`}
            >
              {price.suffix}
            </span>
          )}
        </div>

        {plan.tagline && (
          <p
            className={`mt-3 text-[14.5px] font-semibold ${
              isPopular ? "text-panel-ink" : "text-text-primary"
            }`}
          >
            {plan.tagline}
          </p>
        )}

        <p
          className={`mt-2 text-[14.5px] leading-[1.6] ${
            isPopular ? "text-panel-ink-2" : "text-text-secondary"
          }`}
        >
          {plan.description}
        </p>

        {plan.deliveryText && (
          <p
            className={`mt-2.5 text-[13px] ${
              isPopular ? "text-panel-ink-2" : "text-text-muted"
            }`}
          >
            Delivery: {plan.deliveryText}
          </p>
        )}
      </div>

      {features.length > 0 && (
        <>
          <div
            aria-hidden="true"
            className={`relative z-2 h-px ${
              isPopular ? "bg-panel-chip-br" : "bg-hair"
            }`}
          />

          <ul className="relative z-2 flex flex-col gap-3">
            {features.map((feature) => {
              const Icon = feature.isIncluded ? Check : Minus;
              return (
                <li
                  key={feature.id}
                  className={`flex items-center gap-2.5 text-[14.5px] ${
                    feature.isIncluded
                      ? isPopular
                        ? "text-panel-ink"
                        : "text-text-primary"
                      : "text-text-muted line-through"
                  }`}
                >
                  <Icon
                    size={16}
                    aria-hidden="true"
                    className={`shrink-0 ${
                      isPopular ? "text-panel-ink" : "text-primary-400"
                    }`}
                  />
                  <span className="sr-only">
                    {feature.isIncluded ? "Included:" : "Not included:"}
                  </span>
                  {feature.text}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/^https?:\/\//i.test(ctaUrl) ? (
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={ctaClasses}
        >
          {ctaLabel}
        </a>
      ) : (
        <Link to={ctaUrl} className={ctaClasses}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
