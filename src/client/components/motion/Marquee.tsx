import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { MARQUEE_WORDS } from "@/client/data/site";

/** Keeps `value` inside [min, max) by wrapping around, so the track loops seamlessly. */
const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

const BASE_SPEED = 2.2; // percent of the track per second

/**
 * A full-bleed dark band of large words drifting sideways. Scrolling speeds it up and scrolling
 * back up reverses it; hovering pauses it, and it stands still for reduced motion.
 */
export default function Marquee() {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), {
    damping: 60,
    stiffness: 200,
  });
  // Gentle: a fast scroll (about 1000px/s) adds roughly 60% speed, and the spring smooths it out.
  const boost = useTransform(velocity, [0, 1000], [0, 0.6], { clamp: false });
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);
  const direction = useRef(-1);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduced || paused.current) return;
    const factor = boost.get();
    if (factor < 0) direction.current = 1;
    else if (factor > 0) direction.current = -1;
    let move = direction.current * BASE_SPEED * (delta / 1000);
    move += move * Math.abs(factor);
    baseX.set(baseX.get() + move);
  });

  const track = [...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <div
      className="overflow-hidden bg-ink py-8 text-white lg:py-10"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <p className="sr-only">What we build: {MARQUEE_WORDS.join(", ")}.</p>
      <motion.ul aria-hidden="true" style={{ x }} className="flex w-max">
        {track.map((word, index) => (
          <li
            key={`${word}-${index}`}
            className="flex items-center gap-10 pr-10 font-display text-[40px] leading-none tracking-[-0.04em] whitespace-nowrap lg:text-[64px]"
          >
            {word}
            <span className="h-3 w-3 rounded-full bg-blue lg:h-4 lg:w-4" />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
