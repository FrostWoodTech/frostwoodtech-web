import { HERO_DATA } from "@/client/data/hero";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8 lg:pt-28">
      <p className="text-[13px] font-bold tracking-[0.015em] text-blue">
        {HERO_DATA.kicker}
      </p>

      {/* Sizes are tuned so each line fits one row at its breakpoint (line 2 ≈ 5.6em wide). */}
      <h1 className="mt-7 font-display text-[56px] leading-[0.87] tracking-[-0.052em] text-ink sm:text-[96px] md:text-[112px] lg:text-[140px]">
        {HERO_DATA.headlineFirstLine}
        <br />
        {HERO_DATA.headlineLead}
        <em>{HERO_DATA.headlineEmphasis}</em>
        {HERO_DATA.headlineTail}
      </h1>

      <div className="mt-11 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:gap-20">
        <p className="max-w-[510px] text-base leading-8 text-slate sm:text-lg">
          {HERO_DATA.description}
        </p>

        <aside className="border-l border-ice pb-1 pl-5">
          <p className="text-lg leading-7 font-semibold tracking-[-0.03em] text-ink">
            &ldquo;{HERO_DATA.quote}&rdquo;
          </p>
          <p className="mt-4 text-sm leading-6 text-slate">
            {HERO_DATA.quoteNote}
          </p>
        </aside>
      </div>
    </section>
  );
}
