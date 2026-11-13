import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { PillLink } from "@/client/components/site/ui";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/client/components/motion/Reveal";
import { useServices } from "@/client/hooks/useServices";
import { toErrorMessage } from "@/client/services/ApiError";
import type { ApiService } from "@/client/types";
import { markdownBullets, pad } from "@/client/utils/text";

function BulletList({
  title,
  markdown,
}: {
  readonly title: string;
  readonly markdown?: string;
}) {
  const items = markdownBullets(markdown);
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="text-[12px] font-bold tracking-[0.16em] text-text-muted uppercase">
        {title}
      </h4>
      <ul className="mt-5 flex flex-col gap-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-[15.5px] leading-7 text-ink"
          >
            <Check
              size={18}
              strokeWidth={2.5}
              aria-hidden="true"
              className="mt-1 shrink-0 text-blue"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ServiceBlock({
  service,
  index,
  total,
}: {
  readonly service: ApiService;
  readonly index: number;
  readonly total: number;
}) {
  const included = markdownBullets(service.capabilities);

  return (
    <article
      id={service.slug}
      aria-labelledby={`${service.slug}-heading`}
      className="scroll-mt-28 border-t border-ink py-16 lg:py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-[13px] font-bold tracking-[0.12em] uppercase">
            <span className="text-blue">{pad(index)}</span>
            <span className="text-text-muted"> / {pad(total - 1)}</span>
            <span className="text-ink"> · {service.name}</span>
          </p>
          <h3
            id={`${service.slug}-heading`}
            className="mt-6 font-display text-[36px] leading-[1.04] tracking-[-0.04em] text-ink sm:text-[48px] lg:text-[56px]"
          >
            {service.headline ?? service.name}
          </h3>
          <p className="mt-6 max-w-lg text-[17px] leading-8 text-slate">
            {service.deck ?? service.shortDescription}
          </p>
          <PillLink
            href={service.primaryCtaUrl ?? "/contact"}
            variant="dark"
            className="mt-9"
          >
            {service.primaryCtaLabel ?? "Get a quote"}
          </PillLink>
        </div>

        <div className="flex flex-col gap-12">
          {included.length > 0 && (
            <div>
              <h4 className="text-[12px] font-bold tracking-[0.16em] text-text-muted uppercase">
                What&rsquo;s included
              </h4>
              <Stagger
                as="ul"
                stagger={0.07}
                className="mt-5 grid gap-3 sm:grid-cols-2"
              >
                {included.map((item, itemIndex) => (
                  <StaggerItem
                    as="li"
                    key={item}
                    className="group/card rounded-2xl border border-rule bg-white p-6 transition-colors duration-300 hover:border-ink hover:bg-ink"
                  >
                    <span className="text-[12px] font-bold text-blue transition-colors duration-300 group-hover/card:text-blue-soft">
                      {pad(itemIndex)}
                    </span>
                    <p className="mt-3 text-[16px] leading-7 font-semibold text-ink transition-colors duration-300 group-hover/card:text-white">
                      {item}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}

          <Reveal className="grid gap-10 rounded-[28px] bg-mist p-8 sm:grid-cols-2 sm:p-10">
            <BulletList title="Who it's for" markdown={service.whoThisIsFor} />
            <BulletList title="What you get" markdown={service.outcomes} />
          </Reveal>
        </div>
      </div>
    </article>
  );
}

/** Every service in full, with an index row of jump links at the top. */
export default function ServiceBlocks() {
  const { data, isPending, error } = useServices({ pageSize: 20 });
  const services = data?.items ?? [];
  const { hash } = useLocation();

  // Deep links from the Home accordion (`/services#websites`) land after the list renders.
  useEffect(() => {
    if (!hash || services.length === 0) return;
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, services.length]);

  return (
    <section aria-labelledby="service-list-heading" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="service-list-heading" className="sr-only">
          Our services
        </h2>

        {services.length > 0 && (
          <nav aria-label="Services" className="mb-16 flex flex-wrap gap-2.5">
            {services.map((service, index) => (
              <a
                key={service.id}
                href={`#${service.slug}`}
                className="inline-flex h-11 items-center gap-2.5 rounded-full border border-ink/15 px-5 text-[14.5px] font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              >
                <span className="text-[12px] font-bold opacity-50">
                  {pad(index)}
                </span>
                {service.name}
              </a>
            ))}
          </nav>
        )}

        {isPending && (
          <div className="h-96 animate-pulse rounded-[28px] bg-mist" />
        )}
        {error && (
          <p role="alert" className="text-[15px] text-danger-500">
            {toErrorMessage(error)}
          </p>
        )}

        {services.map((service, index) => (
          <ServiceBlock
            key={service.id}
            service={service}
            index={index}
            total={services.length}
          />
        ))}
      </div>
    </section>
  );
}
