import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Service } from "@/client/types";
import ServiceVisual from "./ServiceVisual";

interface FeaturedServiceCardProps {
  readonly service: Service;
  readonly index: number;
  /** Spans two columns on desktop, with the picture beside the text instead of above it. */
  readonly wide: boolean;
}

const LAYOUT_CLASSES: Record<
  "wide" | "narrow",
  { card: string; visual: string; body: string }
> = {
  wide: {
    card: "lg:col-span-2 lg:flex-row",
    visual: "h-56 lg:order-2 lg:h-auto lg:min-h-76 lg:flex-1",
    body: "lg:w-[44%] lg:flex-none lg:px-6 lg:py-6",
  },
  narrow: { card: "", visual: "h-56", body: "" },
};

/** Home-page service card: an illustration of the service, its name, a short line and chips. */
export default function FeaturedServiceCard({
  service,
  index,
  wide,
}: FeaturedServiceCardProps) {
  const layout = LAYOUT_CLASSES[wide ? "wide" : "narrow"];

  return (
    <Link
      to={service.href}
      className={`group relative flex flex-col gap-1 rounded-[28px] border border-rule bg-white p-2.5 shadow-[0_18px_40px_-30px_rgb(21_40_64/0.35)] transition duration-300 hover:border-ice/70 hover:shadow-[0_0_0_4px_rgb(125_183_255/0.14),0_28px_56px_-30px_rgb(36_100_165/0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 motion-safe:hover:-translate-y-1 ${layout.card}`}
    >
      <div
        className={`relative overflow-hidden rounded-[22px] border border-rule/70 bg-linear-to-br from-ice-wash via-mist to-snow ${layout.visual}`}
      >
        {/* Faint lines at the 60° frost-cut angle, and a soft light from the top-left. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent_0_26px,rgb(125_183_255/0.1)_26px_27px)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgb(255_255_255/0.95),transparent_55%)]"
        />
        <div className="absolute inset-0 p-4">
          <ServiceVisual service={service} />
        </div>
      </div>

      <div className={`flex flex-1 flex-col px-4.5 pt-4 pb-4.5 ${layout.body}`}>
        <span className="text-[12.5px] font-bold tracking-[0.06em] text-blue">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-2 font-display text-[32px] leading-[1.02] tracking-[-0.02em] text-ink lg:text-[36px]">
          {service.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-[15px] leading-[1.65] text-slate">
          {service.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          {service.highlights && (
            <ul className="flex flex-wrap gap-1.5">
              {service.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-full border border-rule bg-mist px-2.5 py-1 text-[12px] font-semibold text-slate"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          )}
          <span
            aria-hidden="true"
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rule text-ink transition duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white"
          >
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
