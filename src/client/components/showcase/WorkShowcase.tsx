import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECT_SCREENS, WORK_SHOWCASE_HEADER } from "@/client/data/showcase";
import { stripMarkdown } from "@/client/lib/mappers";
import type { Project } from "@/client/types";
import ProjectScreen from "./ProjectScreen";

const FEATURED_COUNT = 3;

const TAB_CLASSES: Record<"active" | "idle", string> = {
  active: "border-ink bg-ink text-white",
  idle: "border-rule bg-white/80 text-ink hover:border-ink",
};

const ROUND_BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-full border border-rule bg-white text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2";

const pad = (value: number) => String(value).padStart(2, "0");

interface WorkShowcaseProps {
  /** Undefined while loading or when the projects call fails. */
  readonly projects?: readonly Project[];
}

/** Home "Our work": the featured projects one at a time, switched with tabs or arrows. */
export default function WorkShowcase({ projects }: WorkShowcaseProps) {
  const shown = (projects ?? []).slice(0, FEATURED_COUNT);
  const [selected, setSelected] = useState(0);
  // Clamped so a shorter list arriving from the API never points past its end.
  const active = Math.min(selected, shown.length - 1);
  const project = shown[active];
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const show = (index: number, focusTab = false) => {
    const next = (index + shown.length) % shown.length;
    setSelected(next);
    if (focusTab) tabRefs.current[next]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const targets: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: shown.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    show(target, true);
  };

  if (!project) return null;

  return (
    <section
      aria-labelledby="work-heading"
      className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32"
    >
      <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.015em] text-blue">
            <span aria-hidden="true" className="h-px w-8 bg-blue" />
            {WORK_SHOWCASE_HEADER.eyebrow}
          </p>
          <h2
            id="work-heading"
            className="mt-6 font-display text-[46px] leading-[0.96] tracking-[-0.04em] text-ink sm:text-[64px] lg:text-[76px]"
          >
            <span className="block">{WORK_SHOWCASE_HEADER.titleLead}</span>
            <em className="block text-blue">
              {WORK_SHOWCASE_HEADER.titleEmphasis}
            </em>
          </h2>
        </div>

        <div className="lg:pb-2">
          <p className="max-w-115 text-base leading-8 text-slate sm:text-lg">
            {WORK_SHOWCASE_HEADER.description}
          </p>
          <Link
            to="/work"
            className="group mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
          >
            View all work
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-4xl border border-rule bg-linear-to-br from-ice-wash via-mist to-snow">
        {/* The service cards' frost recipe: 60° lines and a soft light from the top-left. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent_0_26px,rgb(125_183_255/0.1)_26px_27px)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgb(255_255_255/0.95),transparent_50%)]"
        />

        {/* DOM order (tabs, screen, text) is the mobile order; on desktop the screen moves right. */}
        <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-10 lg:p-12 lg:pr-0">
          <div
            role="tablist"
            aria-label={WORK_SHOWCASE_HEADER.eyebrow}
            className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 lg:col-start-1 lg:row-start-1"
          >
            {shown.map((entry, index) => (
              <button
                key={entry.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={index === active}
                aria-controls={`${baseId}-panel`}
                tabIndex={index === active ? 0 : -1}
                onClick={() => show(index)}
                onKeyDown={onTabKeyDown}
                className={`shrink-0 snap-start rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 ${TAB_CLASSES[index === active ? "active" : "idle"]}`}
              >
                {entry.title}
              </button>
            ))}
          </div>

          {/* On desktop the window runs past the stage's right edge, which crops it. */}
          <div className="group relative min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mr-24 lg:self-center">
            {shown.map((entry, index) => {
              const current = index === active;
              return (
                <div
                  key={entry.id}
                  aria-hidden={!current}
                  inert={!current}
                  className={`transition duration-500 ease-out ${
                    current
                      ? "relative opacity-100"
                      : "pointer-events-none absolute inset-x-0 top-0 opacity-0 motion-safe:translate-y-4"
                  }`}
                >
                  <ProjectScreen
                    project={entry}
                    screen={PROJECT_SCREENS[entry.slug]}
                  />
                </div>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${active}`}
            aria-live="polite"
            className="flex min-w-0 flex-col lg:col-start-1 lg:row-start-2"
          >
            <div key={project.id} className="ice-text-in">
              <p className="text-[13px] font-bold tracking-[0.06em] text-blue">
                {pad(active + 1)}{" "}
                <span className="text-slate">/ {pad(shown.length)}</span>
              </p>
              <h3 className="mt-4 font-display text-[48px] leading-[0.95] tracking-[-0.035em] text-ink sm:text-[60px]">
                {project.title}
              </h3>
              <p className="mt-3 font-display text-[24px] leading-[1.15] text-blue italic sm:text-[28px]">
                {project.tagline}
              </p>
              <p className="mt-5 line-clamp-4 text-base leading-[1.75] text-slate">
                {stripMarkdown(project.description)}
              </p>
              {project.categories.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.categories.map((category) => (
                    <li
                      key={category}
                      className="rounded-full border border-rule bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-ink"
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={project.href}
                  className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                >
                  View project
                </Link>
                {project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-1.5 rounded-full border border-rule bg-white px-6 text-[15px] font-semibold text-ink transition-colors duration-200 hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                  >
                    Visit website
                    <ArrowUpRight size={16} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 lg:mt-auto lg:pt-10">
              <button
                type="button"
                onClick={() => show(active - 1)}
                aria-label="Previous project"
                className={ROUND_BUTTON}
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => show(active + 1)}
                aria-label="Next project"
                className={ROUND_BUTTON}
              >
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <span aria-hidden="true" className="ml-3 flex items-center gap-2">
                {shown.map((entry, index) => (
                  <span
                    key={entry.id}
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      index === active ? "w-10 bg-blue" : "w-6 bg-rule"
                    }`}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
