import type { PointerEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";
import { EASE, VIEWPORT } from "@/client/components/motion/presets";

type Tone = "light" | "dark";

const LABEL_TONE: Record<Tone, string> = {
  light: "text-ink",
  dark: "text-white",
};

const LABEL_INDEX_TONE: Record<Tone, string> = {
  light: "text-blue",
  dark: "text-blue-soft",
};

/** Small uppercase label above a section heading, optionally numbered ("01 — Services"). */
export function SectionLabel({
  children,
  index,
  tone = "light",
}: {
  readonly children: ReactNode;
  readonly index?: string;
  readonly tone?: Tone;
}) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE }}
      className={`flex items-center gap-3 text-[12px] font-bold tracking-[0.16em] uppercase ${LABEL_TONE[tone]}`}
    >
      {index && <span className={LABEL_INDEX_TONE[tone]}>{index}</span>}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className="h-px w-8 origin-left bg-current opacity-30"
      />
      {children}
    </motion.p>
  );
}

type HeadingSize = "hero" | "section" | "compact";

const HEADING_SIZE: Record<HeadingSize, string> = {
  hero: "text-[48px] leading-[0.98] tracking-[-0.045em] sm:text-[76px] lg:text-[104px] xl:text-[120px]",
  section:
    "text-[38px] leading-[1.02] tracking-[-0.04em] sm:text-[52px] lg:text-[68px]",
  compact:
    "text-[32px] leading-[1.05] tracking-[-0.035em] sm:text-[40px] lg:text-[48px]",
};

const HEADING_TONE: Record<Tone, { one: string; two: string }> = {
  light: { one: "text-ink", two: "text-text-muted" },
  dark: { one: "text-white", two: "text-white/55" },
};

const lineVariants: Variants = {
  hidden: { y: "110%" },
  show: (delay: number) => ({
    y: "0%",
    transition: { duration: 1.05, ease: EASE, delay },
  }),
};

/**
 * One headline line sliding up from behind a mask. The wrapper triggers the reveal: the line
 * itself starts clipped, so an in-view check on it would never fire.
 */
export function MaskLine({
  children,
  className = "",
  delay = 0,
  onLoad = false,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  /** Animate on mount (the hero) instead of on scroll. */
  readonly onLoad?: boolean;
}) {
  return (
    <motion.span
      className="-my-[0.08em] block overflow-hidden py-[0.08em]"
      initial="hidden"
      {...(onLoad
        ? { animate: "show" }
        : { whileInView: "show", viewport: VIEWPORT })}
    >
      <motion.span
        className={`block ${className}`}
        variants={lineVariants}
        custom={delay}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/** The two-line headline: a statement, then a quieter second line, each sliding up in turn. */
export function TwoLineHeading({
  as: Tag = "h2",
  lineOne,
  lineTwo,
  size = "section",
  tone = "light",
  className = "",
  id,
}: {
  readonly as?: "h1" | "h2";
  readonly lineOne: string;
  readonly lineTwo: string;
  readonly size?: HeadingSize;
  readonly tone?: Tone;
  readonly className?: string;
  readonly id?: string;
}) {
  return (
    <Tag id={id} className={`font-display ${HEADING_SIZE[size]} ${className}`}>
      <MaskLine className={HEADING_TONE[tone].one}>{lineOne}</MaskLine>
      <MaskLine className={HEADING_TONE[tone].two} delay={0.12}>
        {lineTwo}
      </MaskLine>
    </Tag>
  );
}

/**
 * Pointer-follow ("magnetic") offset for a button: it leans a little toward the cursor and
 * springs back on leave. Mouse only, and off for reduced motion.
 */
function useMagnetic(strength = 0.22) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 260, damping: 18, mass: 0.4 };
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  return {
    style: { x: springX, y: springY },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (reduced || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
      y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    },
    onPointerLeave: () => {
      x.set(0);
      y.set(0);
    },
  };
}

/** Wraps any inline content (e.g. a custom button) in the magnetic effect. */
export function Magnetic({
  children,
  className = "",
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  const magnetic = useMagnetic();
  return (
    <motion.span className={`inline-block ${className}`} {...magnetic}>
      {children}
    </motion.span>
  );
}

const MotionLink = motion.create(Link);

type PillVariant = "primary" | "dark" | "light" | "outline" | "outlineLight";

const PILL_VARIANT: Record<PillVariant, string> = {
  primary:
    "bg-blue text-white hover:bg-ink focus-visible:ring-blue focus-visible:ring-offset-white",
  dark: "bg-ink text-white hover:bg-blue focus-visible:ring-blue focus-visible:ring-offset-white",
  light:
    "bg-white text-ink hover:bg-blue hover:text-white focus-visible:ring-white focus-visible:ring-offset-ink",
  outline:
    "border border-ink/20 text-ink hover:border-ink focus-visible:ring-blue focus-visible:ring-offset-white",
  outlineLight:
    "border border-white/30 text-white hover:border-white focus-visible:ring-white focus-visible:ring-offset-ink",
};

/** Rounded, magnetic call-to-action link with the ↗ arrow. External hrefs open in a new tab. */
export function PillLink({
  href,
  children,
  variant = "primary",
  arrow = true,
  className = "",
  onClick,
}: {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: PillVariant;
  readonly arrow?: boolean;
  readonly className?: string;
  readonly onClick?: () => void;
}) {
  const magnetic = useMagnetic();
  const classes = `group inline-flex h-13 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${PILL_VARIANT[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowUpRight
          size={18}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-45"
        />
      )}
    </>
  );

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <motion.a
        href={href}
        className={classes}
        onClick={onClick}
        {...magnetic}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <MotionLink to={href} className={classes} onClick={onClick} {...magnetic}>
      {content}
    </MotionLink>
  );
}

/** Standard section wrapper: full-bleed background, contained content. */
export function Section({
  children,
  className = "",
  innerClassName = "",
  id,
  labelledBy,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly innerClassName?: string;
  readonly id?: string;
  readonly labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`py-24 lg:py-36 ${className}`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
