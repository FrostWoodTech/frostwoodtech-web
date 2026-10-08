import { useEffect, useState, type FocusEvent } from "react";
import { Pause, Play } from "lucide-react";
import { PARTNERING_DATA } from "@/client/data/partnering";
import { usePrefersReducedMotion } from "@/client/hooks/usePrefersReducedMotion";
import FrostCard from "./FrostCard";
import IceSnowflake from "./IceSnowflake";

const ROTATE_MS = 4000;

/**
 * One per gap between the snowflake's arms, in item order; add a position when adding an item.
 * Staggered on purpose, and nudged so the arm tips stay visible beside the cards.
 */
const CARD_POSITIONS = [
  "-left-[5%] top-[14%]",
  "right-0 top-[27%]",
  "left-0 bottom-[25%]",
  "-right-[3%] bottom-[11%]",
] as const;

export default function PartneringSection() {
  const { eyebrow, items } = PARTNERING_DATA;
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [userPicked, setUserPicked] = useState(false);
  const rotating = !reducedMotion && !stopped && !hovering && !keyboardFocus;

  // Re-armed on every change of `active`, so a manual pick also restarts the 4s wait.
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(
      () => setActive((index) => (index + 1) % items.length),
      ROTATE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [rotating, active, items.length]);

  const select = (index: number) => {
    setActive(index);
    setUserPicked(true);
  };

  // Only keyboard focus pauses: a mouse click leaves focus on the card, which would stall it.
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setKeyboardFocus(false);
    }
  };

  const item = items[active];

  return (
    <section
      aria-labelledby="partnering-heading"
      className="overflow-hidden py-24 lg:py-32"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:px-8">
        <div className="min-w-0">
          <div className="relative mx-auto max-w-[560px] lg:py-4">
            <IceSnowflake />
            {items.map((entry, index) => (
              <FrostCard
                key={entry.id}
                item={entry}
                active={index === active}
                onSelect={() => select(index)}
                className={`absolute hidden w-52 lg:flex ${CARD_POSITIONS[index] ?? ""}`}
              />
            ))}
          </div>

          {/* Below lg the cards leave the hexagon and become a row of chips that scrolls on its own. */}
          <div className="-mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-6 py-3[scrollbar-width:none] sm:-mx-6 sm:px-6 lg:hidden">
            {items.map((entry, index) => (
              <FrostCard
                key={entry.id}
                item={entry}
                active={index === active}
                onSelect={() => select(index)}
                className="flex shrink-0 snap-start"
              />
            ))}
          </div>
        </div>

        <div>
          <h2
            id="partnering-heading"
            className="text-[13px] font-bold tracking-[0.015em] text-blue"
          >
            {eyebrow}
          </h2>

          {/* Announced only after the visitor picks an item, not on every automatic turn. */}
          <div
            aria-live={userPicked && !rotating ? "polite" : "off"}
            className="mt-6 min-h-[13rem] sm:min-h-[12rem]"
          >
            <div key={item.id} className="ice-text-in">
              <h3 className="font-display text-[40px] leading-[1.02] tracking-[-0.03em] text-ink sm:text-[52px] lg:text-[56px]">
                {item.title}
              </h3>
              <p className="mt-5 max-w-[520px] text-base leading-8 text-slate sm:text-lg">
                {item.description}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2.5">
            {items.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => select(index)}
                aria-label={`Show: ${entry.title}`}
                aria-current={index === active || undefined}
                className="group flex h-6 items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    index === active
                      ? "w-10 bg-ice shadow-[0_0_12px_rgb(125_183_255/0.8)]"
                      : "w-6 bg-rule group-hover:bg-ice/60"
                  }`}
                />
              </button>
            ))}

            {!reducedMotion && (
              <button
                type="button"
                onClick={() => setStopped((value) => !value)}
                aria-label={stopped ? "Resume rotating" : "Pause rotating"}
                className="ml-3 flex h-8 w-8 items-center justify-center rounded-full text-slate transition-colors hover:bg-mist hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              >
                {stopped ? (
                  <Play size={14} aria-hidden="true" />
                ) : (
                  <Pause size={14} aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
