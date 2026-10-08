import { useEffect, useRef, useState } from "react";
import { STATEMENT_DATA } from "@/client/data/statement";
import SnowflakeBadge from "./SnowflakeBadge";

/** A centred brand line between sections; it rises in once, the first time it scrolls into view. */
export default function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-in-view={inView ? "" : undefined}
      className="statement relative isolate overflow-hidden px-4 pt-4 pb-24 sm:px-6 lg:pb-32"
    >
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-10 h-105 w-[min(1100px,130%)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,var(--color-ice-wash),transparent_70%)]"
      />

      <div className="mx-auto max-w-5xl text-center">
        <div
          aria-hidden="true"
          className="statement-reveal flex items-center justify-center gap-4"
        >
          <span className="h-px w-20 bg-linear-to-r from-transparent to-ice" />
          <SnowflakeBadge />
          <span className="h-px w-20 bg-linear-to-l from-transparent to-ice" />
        </div>

        <h2 className="mt-9 font-display text-[44px] leading-[1.02] tracking-[-0.04em] text-ink sm:text-[56px] md:text-[72px] lg:text-[92px]">
          <span className="statement-reveal block">
            {STATEMENT_DATA.lead}{" "}
            <span className="statement-glint">{STATEMENT_DATA.emphasis}</span>,
          </span>
          <span
            className="statement-reveal block"
            style={{ animationDelay: "120ms" }}
          >
            {STATEMENT_DATA.lineTwo}
          </span>
        </h2>

        <p
          className="statement-reveal mx-auto mt-8 max-w-xl text-base leading-8 text-slate sm:text-lg"
          style={{ animationDelay: "240ms" }}
        >
          {STATEMENT_DATA.description}
        </p>
      </div>
    </section>
  );
}
