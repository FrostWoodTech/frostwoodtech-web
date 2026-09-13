import { ArrowRight, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import Button from "@/client/components/ui/Button";
import Eyebrow from "@/client/components/ui/Eyebrow";
import PanelCTA from "@/client/components/ui/PanelCTA";
import Spinner from "@/client/components/ui/Spinner";
import PricingCard from "@/client/components/pricing/PricingCard";
import ServiceCard from "@/client/components/services/ServiceCard";
import FaqSection from "@/client/components/services-page/FaqSection";
import { useService } from "@/client/hooks/useService";
import { useServices } from "@/client/hooks/useServices";
import { useServicePricingPlans } from "@/client/hooks/usePricingPlans";
import { mapApiFaqToFaq, mapApiServiceToService } from "@/client/lib/mappers";
import useTheme from "@/client/context/useTheme";
import ApiError, { toErrorMessage } from "@/client/services/ApiError";
import type { ApiService } from "@/client/types";

/** Renders a CMS markdown bullet list as a checklist. */
function ChecklistCard({
  eyebrow,
  title,
  markdown,
  theme,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly markdown: string;
  readonly theme: "light" | "dark";
}) {
  return (
    <div className="rounded-[22px] border border-card-br bg-card p-8 shadow-card sm:p-10">
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2 className="mb-6 font-display text-[24px] font-medium tracking-[-0.018em] text-text-primary sm:text-[28px]">
        {title}
      </h2>
      <div data-color-mode={theme} className="fw-prose fw-prose-checklist">
        <MDEditor.Markdown
          source={markdown}
          style={{ backgroundColor: "transparent", color: "inherit" }}
        />
      </div>
    </div>
  );
}

function ServiceDetail({
  service,
  theme,
}: {
  readonly service: ApiService;
  readonly theme: "light" | "dark";
}) {
  const { data: otherServices } = useServices({ pageSize: 4 });
  const { data: plans = [] } = useServicePricingPlans(service.id);

  const headline = service.headline ?? service.name;
  const deck = service.deck ?? service.shortDescription;
  const primaryCta =
    service.primaryCtaLabel && service.primaryCtaUrl
      ? { label: service.primaryCtaLabel, url: service.primaryCtaUrl }
      : { label: "Book a discovery call", url: "/contact" };
  const secondaryCta =
    service.secondaryCtaLabel && service.secondaryCtaUrl
      ? { label: service.secondaryCtaLabel, url: service.secondaryCtaUrl }
      : { label: "See related work", url: "/work" };

  const relatedServices = (otherServices?.items ?? [])
    .filter((other) => other.id !== service.id)
    .slice(0, 3);

  return (
    <>
      <div className="mt-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          {service.eyebrow && (
            <Eyebrow className="mb-5">{service.eyebrow}</Eyebrow>
          )}
          <h1 className="font-display text-[38px] leading-[1.06] font-medium tracking-[-0.018em] text-text-primary sm:text-[48px] lg:text-[58px]">
            {headline}
          </h1>
          <p className="mt-5.5 text-[17px] leading-[1.65] text-text-secondary sm:text-[18.5px]">
            {deck}
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Button
              href={primaryCta.url}
              size="lg"
              icon={<ArrowRight size={16} aria-hidden="true" />}
            >
              {primaryCta.label}
            </Button>
            <Button href={secondaryCta.url} variant="secondary" size="lg">
              {secondaryCta.label}
            </Button>
          </div>
        </div>

        <div className="relative h-110 overflow-hidden rounded-[22px] fw-media border border-hair shadow-card">
          {service.heroImageUrl ? (
            <img
              src={service.heroImageUrl}
              alt={service.heroImageAltText ?? ""}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      </div>

      {(service.whoThisIsFor || service.outcomes) && (
        <div className="mt-26 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {service.whoThisIsFor && (
            <ChecklistCard
              eyebrow="Who this is for"
              title="If this sounds familiar, you are in the right place"
              markdown={service.whoThisIsFor}
              theme={theme}
            />
          )}
          {service.outcomes && (
            <ChecklistCard
              eyebrow="What you walk away with"
              title="Results that show up in the business"
              markdown={service.outcomes}
              theme={theme}
            />
          )}
        </div>
      )}

      {service.inDepth && (
        <div className="mt-24 grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-4">In depth</Eyebrow>
            <div data-color-mode={theme} className="fw-prose">
              <MDEditor.Markdown
                source={service.inDepth}
                style={{ backgroundColor: "transparent", color: "inherit" }}
              />
            </div>
          </div>
          {service.depthImageUrl && (
            <div className="overflow-hidden rounded-[22px] border border-hair fw-media shadow-card">
              <img
                src={service.depthImageUrl}
                alt={service.depthImageAltText ?? ""}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {service.capabilities && (
        <div className="mt-24">
          <Eyebrow tone="ice" className="mb-4.5">
            What you get
          </Eyebrow>
          <h2 className="mb-10 font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
            Capabilities
          </h2>
          <div data-color-mode={theme} className="fw-prose fw-prose-checklist">
            <MDEditor.Markdown
              source={service.capabilities}
              style={{ backgroundColor: "transparent", color: "inherit" }}
            />
          </div>
        </div>
      )}

      {service.projects && service.projects.length > 0 && (
        <div className="mt-24">
          <Eyebrow tone="ice" className="mb-4.5">
            Real work
          </Eyebrow>
          <h2 className="mb-10 font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
            Projects that show the difference
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.projects.map((project) => (
              <Link
                key={project.id}
                to={`/work/${project.slug}`}
                className="group flex flex-col overflow-hidden rounded-[18px] border border-card-br bg-card shadow-card transition-colors duration-200 hover:border-hair-strong"
              >
                {project.imageUrl && (
                  <div className="aspect-video overflow-hidden fw-media">
                    <img
                      src={project.imageUrl}
                      alt={project.imageAltText ?? ""}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <span className="text-[13px] text-text-muted">
                    {project.year}
                  </span>
                  <h3 className="font-display text-[19px] font-medium tracking-[-0.018em] text-text-primary">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 text-[14px] leading-[1.6] text-text-secondary">
                    {project.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {plans.length > 0 && (
        <div className="mt-24">
          <div className="mx-auto mb-11 max-w-xl text-center">
            <h2 className="font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
              What it costs
            </h2>
            <p className="mt-3.5 text-[16.5px] leading-relaxed text-text-secondary">
              Every route starts with a free scoping call and ends with a
              fixed-price proposal.
            </p>
          </div>

          <div
            className={`mx-auto grid grid-cols-1 items-stretch gap-5 ${
              plans.length === 1
                ? "max-w-md"
                : plans.length === 2
                  ? "max-w-4xl md:grid-cols-2"
                  : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>

          <p className="mt-8 text-center text-[14px] text-text-muted">
            <Link to="/pricing" className="font-semibold hover:underline">
              See all pricing
            </Link>
          </p>
        </div>
      )}

      {relatedServices.length > 0 && (
        <div className="mt-24">
          <Eyebrow className="mb-4.5">More services</Eyebrow>
          <h2 className="mb-10 font-display text-[28px] font-medium tracking-[-0.018em] text-text-primary">
            Other ways I can help
          </h2>
          <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3">
            {relatedServices.map((other) => (
              <ServiceCard
                key={other.id}
                service={mapApiServiceToService(other)}
              />
            ))}
          </div>
        </div>
      )}

      {service.faqs && service.faqs.length > 0 && (
        <div className="mt-26">
          <FaqSection faqs={service.faqs.map(mapApiFaqToFaq)} />
        </div>
      )}
    </>
  );
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isPending, isError, error } = useService(slug);
  const { theme } = useTheme();

  if (isPending) {
    return (
      <div className="flex justify-center pt-48 pb-24 text-text-muted">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !service) {
    const notFound =
      !isError || (error instanceof ApiError && error.status === 404);

    return (
      <div className="mx-auto max-w-7xl px-4 py-40 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-[40px] font-medium text-text-primary">
          {notFound ? "Service not found" : "Something went wrong"}
        </h1>
        <p className="mt-4 text-text-secondary">
          {notFound
            ? "That service does not exist — here is everything we do."
            : toErrorMessage(error)}
        </p>
        <Button href="/services" className="mt-8">
          View all services
        </Button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/3 h-200 w-300 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-100 -left-80 h-200 w-200 fw-amb-2"
      />

      <div className="relative z-2 mx-auto max-w-7xl px-4 pt-8 pb-26 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2.5 text-[13.5px] text-text-muted"
        >
          <Link to="/services" className="hover:text-text-primary">
            Services
          </Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="font-semibold text-text-primary">
            {service.headline ?? service.name}
          </span>
        </nav>

        <ServiceDetail service={service} theme={theme} />

        <div className="mt-24">
          <PanelCTA
            title="Have a project in mind?"
            description="Thirty minutes, no pitch deck. You will leave with a scope, a timeline and a number."
            primaryLabel="Book a discovery call"
            primaryHref="/contact"
          />
        </div>
      </div>
    </div>
  );
}
