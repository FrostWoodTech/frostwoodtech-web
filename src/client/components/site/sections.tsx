import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, UserRound } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Section, SectionLabel, TwoLineHeading } from "./ui";
import AccordionItem from "@/client/components/motion/Accordion";
import CountUp from "@/client/components/motion/CountUp";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/client/components/motion/Reveal";
import { EASE, VIEWPORT } from "@/client/components/motion/presets";
import {
  PROCESS,
  RESULTS,
  TESTIMONIALS_INTRO,
  WHY_US,
} from "@/client/data/site";
import type { ApiFaq, ApiReview } from "@/client/types";
import { pad } from "@/client/utils/text";

/** Hero for the inner pages: label, two-line headline and a short intro. */
export function PageHero({
  label,
  lineOne,
  lineTwo,
  description,
}: {
  readonly label: string;
  readonly lineOne: string;
  readonly lineTwo: string;
  readonly description: string;
}) {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 lg:px-8 lg:pt-28 lg:pb-28">
        <SectionLabel>{label}</SectionLabel>
        <TwoLineHeading
          as="h1"
          lineOne={lineOne}
          lineTwo={lineTwo}
          size="hero"
          className="mt-8"
        />
        <Reveal delay={0.35}>
          <p className="mt-10 max-w-2xl text-lg leading-8 text-slate">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** A rule that draws itself from left to right when it scrolls into view. */
function DrawnRule({ className }: { readonly className: string }) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE }}
      className={`block origin-left ${className}`}
    />
  );
}

/** The four-step process on a dark band. */
export function ProcessSection() {
  return (
    <Section className="bg-ink text-white" labelledBy="process-heading">
      <SectionLabel tone="dark">{PROCESS.label}</SectionLabel>
      <TwoLineHeading
        id="process-heading"
        lineOne={PROCESS.lineOne}
        lineTwo={PROCESS.lineTwo}
        tone="dark"
        className="mt-8"
      />
      <Stagger
        as="ol"
        stagger={0.12}
        className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
      >
        {PROCESS.steps.map((step, index) => (
          <StaggerItem as="li" key={step.title}>
            <DrawnRule className="h-px bg-white/25" />
            <span className="mt-8 block font-display text-[56px] leading-none tracking-[-0.04em] text-blue-soft">
              {pad(index)}
            </span>
            <h3 className="mt-8 text-[22px] font-bold tracking-[-0.02em]">
              {step.title}
            </h3>
            <p className="mt-3 text-[15.5px] leading-7 text-white/65">
              {step.description}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

/** Numbered reasons, each set against "the usual" way of doing it. */
export function WhyUsSection() {
  return (
    <Section labelledBy="why-heading">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel>{WHY_US.label}</SectionLabel>
          <TwoLineHeading
            id="why-heading"
            lineOne={WHY_US.lineOne}
            lineTwo={WHY_US.lineTwo}
            className="mt-8"
          />
        </div>

        <Stagger as="ol" stagger={0.1} className="border-t border-rule">
          {WHY_US.items.map((item, index) => (
            <StaggerItem
              as="li"
              key={item.title}
              className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b border-rule py-9 sm:grid-cols-[4.5rem_minmax(0,1fr)]"
            >
              <span className="font-display text-[28px] leading-none tracking-[-0.04em] text-blue">
                {pad(index)}
              </span>
              <div>
                {/* The strike-through draws itself across "the usual" once it's on screen. */}
                <motion.p
                  initial={{ backgroundSize: "0% 1px" }}
                  whileInView={{ backgroundSize: "100% 1px" }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
                  className="inline bg-[linear-gradient(currentColor,currentColor)] bg-[position:0_55%] bg-no-repeat text-[13.5px] text-text-muted"
                >
                  {item.usual}
                </motion.p>
                <h3 className="mt-3 font-display text-[26px] leading-[1.15] tracking-[-0.03em] text-ink sm:text-[30px]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15.5px] leading-7 text-slate">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/** Large headline numbers on the grey band, counting up as they appear. */
export function ResultsSection() {
  return (
    <Section className="bg-mist" labelledBy="results-heading">
      <SectionLabel>{RESULTS.label}</SectionLabel>
      <TwoLineHeading
        id="results-heading"
        lineOne={RESULTS.lineOne}
        lineTwo={RESULTS.lineTwo}
        className="mt-8"
      />
      <Stagger
        as="dl"
        stagger={0.12}
        className="mt-16 grid gap-10 sm:grid-cols-3 lg:mt-20"
      >
        {RESULTS.stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <DrawnRule className="h-0.5 bg-ink" />
            <dt className="sr-only">{stat.label}</dt>
            <dd className="pt-6">
              <CountUp
                value={stat.value}
                className="block font-display text-[72px] leading-none tracking-[-0.05em] text-ink tabular-nums lg:text-[104px]"
              />
              <span
                aria-hidden="true"
                className="mt-4 block text-[15.5px] font-medium text-slate"
              >
                {stat.label}
              </span>
            </dd>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

const slideVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 80 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -80 }),
};

/** One review at a time, sliding in the direction you move; hidden when there are none. */
export function TestimonialsSection({
  reviews,
}: {
  readonly reviews?: readonly ApiReview[];
}) {
  const [[index, direction], setPosition] = useState<[number, number]>([0, 0]);
  const items = reviews ?? [];
  if (items.length === 0) return null;

  const current = items[Math.min(index, items.length - 1)];
  const step = (delta: number) =>
    setPosition(([value]) => [
      (value + delta + items.length) % items.length,
      delta,
    ]);

  return (
    <Section labelledBy="testimonials-heading">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <SectionLabel>{TESTIMONIALS_INTRO.label}</SectionLabel>
          <TwoLineHeading
            id="testimonials-heading"
            lineOne={TESTIMONIALS_INTRO.lineOne}
            lineTwo={TESTIMONIALS_INTRO.lineTwo}
            className="mt-8"
          />
        </div>

        {items.length > 1 && (
          <Reveal className="flex items-center gap-4">
            <p className="text-[14px] font-bold text-ink tabular-nums">
              {pad(index)}
              <span className="text-text-muted">
                {" "}
                / {pad(items.length - 1)}
              </span>
            </p>
            <motion.button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous review"
              whileTap={{ scale: 0.9 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => step(1)}
              aria-label="Next review"
              whileTap={{ scale: 0.9 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </motion.button>
          </Reveal>
        )}
      </div>

      <Reveal className="mt-14 overflow-hidden rounded-[28px] bg-mist lg:mt-16">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.figure
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE }}
            aria-live="polite"
            className="p-8 sm:p-12 lg:p-16"
          >
            <span
              aria-hidden="true"
              className="block font-display text-[96px] leading-[0.6] text-blue"
            >
              &ldquo;
            </span>
            <blockquote className="mt-6 max-w-4xl font-display text-[24px] leading-[1.3] font-semibold tracking-[-0.025em] text-ink sm:text-[32px] lg:text-[38px]">
              {current.reviewText}
            </blockquote>
            {/* Reviews are anonymous on the site: a generic avatar, no name, role or company. */}
            <div aria-hidden="true" className="mt-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
                <UserRound size={22} strokeWidth={1.75} />
              </span>
            </div>
          </motion.figure>
        </AnimatePresence>
      </Reveal>
    </Section>
  );
}

/** FAQ list with smoothly opening answers; hidden when there are none. */
export function FaqSection({
  faqs,
  className = "",
}: {
  readonly faqs?: readonly ApiFaq[];
  readonly className?: string;
}) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Section className={className} labelledBy="faq-heading">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <SectionLabel>FAQ</SectionLabel>
          <TwoLineHeading
            id="faq-heading"
            lineOne="Questions,"
            lineTwo="answered."
            className="mt-8"
          />
        </div>
        <Stagger stagger={0.06} className="border-t border-rule">
          {faqs.map((faq) => (
            <StaggerItem key={faq.id}>
              <AccordionItem
                className="border-b border-rule"
                buttonClassName="rounded-md"
                summary={(open) => (
                  <span className="flex items-center justify-between gap-6 py-7 text-[19px] font-bold tracking-[-0.015em] text-ink">
                    {faq.question}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
                        open
                          ? "rotate-45 border-ink bg-ink text-white"
                          : "border-ink/15 group-hover:border-ink"
                      }`}
                    >
                      <Plus size={18} aria-hidden="true" />
                    </span>
                  </span>
                )}
              >
                <p className="max-w-2xl pr-16 pb-8 text-[16px] leading-8 text-slate">
                  {faq.answer}
                </p>
              </AccordionItem>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
