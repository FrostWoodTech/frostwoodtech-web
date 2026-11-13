import { useRef } from "react";
import { Check } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { MaskLine, PillLink, SectionLabel } from "@/client/components/site/ui";
import { EASE } from "@/client/components/motion/presets";
import { HOME_HERO, PRIMARY_CTA } from "@/client/data/site";

const PROMISES = ["Fixed price", "Weekly demos", "Fully managed"] as const;

/** Entrance timings (seconds after load), so the hero plays as one sequence. */
const T = { badge: 0.1, lineOne: 0.15, lineTwo: 0.3, rule: 0.65, body: 0.75 };

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // The headline drifts up and dims a little as the hero scrolls away.
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);

  return (
    <section ref={ref} className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28 lg:pb-24">
        <motion.div
          {...fadeUp(T.badge)}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <SectionLabel>{HOME_HERO.eyebrow}</SectionLabel>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-rule px-3.5 py-1.5 text-[13px] font-semibold text-ink">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="service-pulse absolute inset-0 rounded-full bg-success-400/60" />
              <span className="relative h-2 w-2 rounded-full bg-success-400" />
            </span>
            Taking new projects
          </p>
        </motion.div>

        <motion.h1
          style={{ y: headlineY, opacity: headlineOpacity }}
          className="mt-10 font-display text-[50px] leading-[0.95] tracking-[-0.05em] sm:text-[84px] lg:text-[124px] xl:text-[140px]"
        >
          <MaskLine onLoad delay={T.lineOne} className="text-ink">
            {HOME_HERO.lineOne}
          </MaskLine>
          <MaskLine onLoad delay={T.lineTwo} className="text-blue">
            {HOME_HERO.lineTwo}
          </MaskLine>
        </motion.h1>

        <div className="relative mt-12 pt-10 lg:mt-16">
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: T.rule }}
            className="absolute inset-x-0 top-0 h-px origin-left bg-rule"
          />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-20">
            <motion.p
              {...fadeUp(T.body)}
              className="max-w-xl text-lg leading-8 text-slate"
            >
              {HOME_HERO.description}
            </motion.p>
            <motion.div
              {...fadeUp(T.body + 0.1)}
              className="flex flex-wrap gap-3"
            >
              <PillLink href={PRIMARY_CTA.href} variant="dark">
                {PRIMARY_CTA.label}
              </PillLink>
              <PillLink
                href={HOME_HERO.secondary.href}
                variant="outline"
                arrow={false}
              >
                {HOME_HERO.secondary.label}
              </PillLink>
            </motion.div>
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[14.5px] font-semibold text-ink">
          {PROMISES.map((promise, index) => (
            <motion.li
              key={promise}
              {...fadeUp(T.body + 0.25 + index * 0.08)}
              className="flex items-center gap-2"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue text-white">
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              </span>
              {promise}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
