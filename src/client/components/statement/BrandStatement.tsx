import { useEffect, useRef, useState } from "react";
import { STATEMENT_DATA } from "@/client/data/statement";

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
      className="statement px-4 pt-4 pb-24 sm:px-6 lg:pb-32"
    >
      <div className="mx-auto max-w-5xl text-center">
        <span
          aria-hidden="true"
          className="statement-reveal mx-auto block h-0.5 w-12 bg-blue"
        />

        <h2 className="mt-9 font-display text-[36px] leading-[1.1] tracking-[-0.03em] text-ink sm:text-[48px] md:text-[56px] lg:text-[64px]">
          <span className="statement-reveal block">
            {STATEMENT_DATA.lead} <em>{STATEMENT_DATA.emphasis}</em>,
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
