import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import FeaturedServiceCard from "./FeaturedServiceCard";
import { PLACEHOLDER_SERVICES, SERVICES_HEADER } from "@/client/data/services";
import { mapApiServiceToService } from "@/client/lib/mappers";
import type { ApiService, Service } from "@/client/types";

const FEATURED_COUNT = 4;

/** Bento rhythm on desktop: wide, narrow / narrow, wide. */
const isWide = (index: number) => index % 4 === 0 || index % 4 === 3;

interface ServicesProps {
  /** Undefined while loading or when the home call fails. */
  readonly services?: readonly ApiService[];
}

export default function Services({ services }: ServicesProps) {
  const shown: readonly Service[] = services?.length
    ? services.slice(0, FEATURED_COUNT).map(mapApiServiceToService)
    : PLACEHOLDER_SERVICES;

  return (
    <section
      aria-labelledby="services-heading"
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mb-14 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.015em] text-blue">
            <span aria-hidden="true" className="h-px w-8 bg-blue" />
            {SERVICES_HEADER.eyebrow}
          </p>
          <h2
            id="services-heading"
            className="mt-6 font-display text-[46px] leading-[0.96] tracking-[-0.04em] text-ink sm:text-[64px] lg:text-[76px]"
          >
            <span className="block">{SERVICES_HEADER.titleLead}</span>
            <em className="block text-blue">{SERVICES_HEADER.titleEmphasis}</em>
          </h2>
        </div>

        <div className="lg:pb-2">
          <p className="max-w-115 text-base leading-8 text-slate sm:text-lg">
            {SERVICES_HEADER.description}
          </p>
          <Link
            to="/services"
            className="group mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
          >
            See all services
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((service, index) => (
          <FeaturedServiceCard
            key={service.id}
            index={index}
            wide={isWide(index)}
            service={service}
          />
        ))}
      </div>
    </section>
  );
}
