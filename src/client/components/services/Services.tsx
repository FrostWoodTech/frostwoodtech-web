import Eyebrow from "@/client/components/ui/Eyebrow";
import ServiceCard from "./ServiceCard";
import { SERVICES_HEADER } from "@/client/data/services";
import { mapApiServiceToService } from "@/client/lib/mappers";
import type { ApiService } from "@/client/types";

interface ServicesProps {
  readonly services: readonly ApiService[];
}

export default function Services({ services }: ServicesProps) {
  if (services.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-26 sm:px-6 lg:px-8">
      <div className="mb-11 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {SERVICES_HEADER.badge && (
            <Eyebrow className="mb-4.5">{SERVICES_HEADER.badge}</Eyebrow>
          )}
          <h2 className="font-display text-[36px] leading-[1.08] font-medium tracking-[-0.018em] whitespace-pre-line text-text-primary md:text-[50px]">
            {SERVICES_HEADER.title}
          </h2>
        </div>

        {SERVICES_HEADER.subtitle && (
          <p className="max-w-83 text-base leading-[1.65] text-text-secondary lg:mb-2">
            {SERVICES_HEADER.subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={mapApiServiceToService(service)}
          />
        ))}
      </div>
    </section>
  );
}
