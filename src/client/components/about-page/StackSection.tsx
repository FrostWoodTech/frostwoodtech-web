import {
  Section,
  SectionLabel,
  TwoLineHeading,
} from "@/client/components/site/ui";
import { STACK, STACK_INTRO } from "@/client/data/stack";
import { pad } from "@/client/utils/text";
import { motion } from "motion/react";
import { Stagger, StaggerItem } from "@/client/components/motion/Reveal";
import {
  fadeUpItem,
  staggerContainer,
} from "@/client/components/motion/presets";

/** "Our stack" on a dark band: one numbered row per group, technologies as logo chips. */
export default function StackSection() {
  return (
    <Section className="bg-ink text-white" labelledBy="stack-heading">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-20">
        <div>
          <SectionLabel index="03" tone="dark">
            {STACK_INTRO.label}
          </SectionLabel>
          <TwoLineHeading
            id="stack-heading"
            lineOne={STACK_INTRO.lineOne}
            lineTwo={STACK_INTRO.lineTwo}
            tone="dark"
            className="mt-8"
          />
        </div>
        <p className="max-w-md text-[16.5px] leading-8 text-white/70">
          {STACK_INTRO.description}
        </p>
      </div>

      <Stagger
        stagger={0.08}
        className="mt-16 border-t border-white/20 lg:mt-20"
      >
        {STACK.map((group, index) => (
          <StaggerItem
            key={group.title}
            className="grid gap-5 border-b border-white/15 py-8 md:grid-cols-[16rem_minmax(0,1fr)] md:items-center md:gap-10"
          >
            <h3 className="flex items-baseline gap-4 text-[20px] font-bold tracking-[-0.02em]">
              <span className="text-[12px] font-bold tracking-normal text-blue-soft">
                {pad(index)}
              </span>
              {group.title}
            </h3>
            <motion.ul
              variants={staggerContainer(0.035, 0.1)}
              className="flex flex-wrap gap-2.5"
            >
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.name}
                    variants={fadeUpItem}
                    className="inline-flex h-11 items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 text-[14.5px] font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink"
                  >
                    <Icon size={17} aria-hidden="true" className="shrink-0" />
                    {item.name}
                  </motion.li>
                );
              })}
            </motion.ul>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
