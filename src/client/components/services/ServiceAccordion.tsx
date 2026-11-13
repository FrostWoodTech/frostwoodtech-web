import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import {
  Section,
  SectionLabel,
  TwoLineHeading,
} from "@/client/components/site/ui";
import { motion } from "motion/react";
import AccordionItem from "@/client/components/motion/Accordion";
import { Stagger, StaggerItem } from "@/client/components/motion/Reveal";
import {
  fadeUpItem,
  staggerContainer,
} from "@/client/components/motion/presets";
import { HOME_SERVICES_INTRO } from "@/client/data/site";
import { useServices } from "@/client/hooks/useServices";
import { toErrorMessage } from "@/client/services/ApiError";
import { markdownBullets, pad } from "@/client/utils/text";

/** Home "What we do": every service as a numbered row that opens to show what's inside. */
export default function ServiceAccordion() {
  const { data, isPending, error } = useServices({ pageSize: 20 });
  const services = data?.items ?? [];

  return (
    <Section labelledBy="services-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel>{HOME_SERVICES_INTRO.label}</SectionLabel>
          <TwoLineHeading
            id="services-heading"
            lineOne={HOME_SERVICES_INTRO.lineOne}
            lineTwo={HOME_SERVICES_INTRO.lineTwo}
            className="mt-8"
          />
        </div>
        {services.length > 0 && (
          <p className="text-[14.5px] text-slate">{HOME_SERVICES_INTRO.hint}</p>
        )}
      </div>

      <div className="mt-14 border-t border-ink lg:mt-20">
        {isPending &&
          [0, 1, 2, 3].map((row) => (
            <div key={row} className="border-b border-rule py-9">
              <div className="h-10 w-2/3 animate-pulse rounded-md bg-mist" />
            </div>
          ))}

        {error && (
          <p role="alert" className="py-9 text-[15px] text-danger-500">
            {toErrorMessage(error)}
          </p>
        )}

        <Stagger stagger={0.07}>
          {services.map((service, index) => {
            const includes = markdownBullets(service.capabilities).slice(0, 5);
            return (
              <StaggerItem key={service.id}>
                <AccordionItem
                  defaultOpen={index === 0}
                  className="border-b border-rule"
                  buttonClassName="rounded-md"
                  summary={(open) => (
                    <span className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-4 py-8 sm:grid-cols-[5rem_minmax(0,1fr)_auto] lg:py-10">
                      <span className="text-[14px] font-bold text-blue">
                        {pad(index)}
                      </span>
                      <span
                        className={`font-display text-[30px] leading-[1.05] tracking-[-0.04em] transition duration-500 group-hover:translate-x-2 sm:text-[44px] lg:text-[60px] ${open ? "text-blue" : "text-ink group-hover:text-blue"}`}
                      >
                        {service.name}
                      </span>
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full border transition duration-300 lg:h-14 lg:w-14 ${
                          open
                            ? "rotate-45 border-blue bg-blue text-white"
                            : "border-ink/15 text-ink group-hover:border-ink"
                        }`}
                      >
                        <Plus size={20} aria-hidden="true" />
                      </span>
                    </span>
                  )}
                >
                  <div className="grid gap-10 pb-12 sm:pl-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                    <div>
                      <p className="max-w-lg text-[17px] leading-8 text-slate">
                        {service.deck ?? service.shortDescription}
                      </p>
                      <Link
                        to={`/services#${service.slug}`}
                        className="group/link mt-8 inline-flex items-center gap-2 rounded-md text-[15px] font-bold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
                      >
                        <span className="border-b-2 border-blue pb-0.5">
                          Explore {service.name.toLowerCase()}
                        </span>
                        <ArrowUpRight
                          size={18}
                          aria-hidden="true"
                          className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        />
                      </Link>
                    </div>

                    {includes.length > 0 && (
                      <motion.ul
                        variants={staggerContainer(0.05, 0.15)}
                        initial="hidden"
                        animate="show"
                        className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule"
                      >
                        {includes.map((item) => (
                          <motion.li
                            key={item}
                            variants={fadeUpItem}
                            className="flex items-center justify-between gap-4 bg-white px-5 py-4 text-[15px] font-medium text-ink"
                          >
                            {item}
                            <ArrowUpRight
                              size={16}
                              aria-hidden="true"
                              className="shrink-0 text-blue"
                            />
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </div>
                </AccordionItem>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
