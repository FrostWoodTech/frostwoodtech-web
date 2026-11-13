import type { ReactNode } from "react";
import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUpItem, staggerContainer } from "./presets";

interface BaseProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: BaseProps & { readonly delay?: number; readonly y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

type ListTag = "div" | "ul" | "ol" | "dl";

/** Reveals its `StaggerItem` children one after another when it scrolls into view. */
export function Stagger({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delay = 0,
}: BaseProps & {
  readonly as?: ListTag;
  readonly stagger?: number;
  readonly delay?: number;
}) {
  const props = {
    className,
    variants: staggerContainer(stagger, delay),
    initial: "hidden",
    whileInView: "show",
    viewport: VIEWPORT,
  } as const;

  if (as === "ul") return <motion.ul {...props}>{children}</motion.ul>;
  if (as === "ol") return <motion.ol {...props}>{children}</motion.ol>;
  if (as === "dl") return <motion.dl {...props}>{children}</motion.dl>;
  return <motion.div {...props}>{children}</motion.div>;
}

/** One step of a `Stagger`; use `li` inside lists. */
export function StaggerItem({
  children,
  className,
  as = "div",
}: BaseProps & { readonly as?: "div" | "li" }) {
  if (as === "li") {
    return (
      <motion.li className={className} variants={fadeUpItem}>
        {children}
      </motion.li>
    );
  }
  return (
    <motion.div className={className} variants={fadeUpItem}>
      {children}
    </motion.div>
  );
}
