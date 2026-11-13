import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { EASE } from "./presets";

/**
 * Counts a stat such as "98%", "6 wk" or "5+" up from zero when it scrolls into view. The text
 * is updated through a ref, so the count doesn't re-render React; screen readers get the final
 * value from the visually hidden copy.
 */
export default function CountUp({
  value,
  className,
}: {
  readonly value: string;
  readonly className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();

  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const decimals = match?.[1].split(".")[1]?.length ?? 0;
  const hasMatch = match !== null;

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasMatch || !inView || reduced) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (latest) => {
        node.textContent = `${latest.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, target, suffix, decimals, hasMatch]);

  // Starts at zero (React never rewrites this constant text, so the count isn't reset on re-render);
  // with reduced motion the final value is shown as-is.
  const initial = hasMatch && !reduced ? `0${suffix}` : value;

  return (
    <span className={className}>
      <span aria-hidden="true" ref={ref}>
        {initial}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
