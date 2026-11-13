import type { Variants } from "motion/react";

/** Long, soft deceleration used across the site (close to easeOutQuint). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Reveal once, a little before the element is fully on screen. */
export const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};
