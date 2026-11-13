import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useProjects } from "@/client/hooks/useProjects";
import { toErrorMessage } from "@/client/services/ApiError";
import ProjectCase from "./ProjectCase";

const ALL = "All projects";

/** The filter row and the project cases. Filtering is client-side on category tags. */
export default function ProjectList() {
  const {
    data: projects = [],
    isPending,
    error,
  } = useProjects({
    pageSize: 50,
  });
  const [filter, setFilter] = useState<string>(ALL);
  const { hash } = useLocation();

  const categories = useMemo(
    () => [...new Set(projects.flatMap((p) => p.categories))].sort(),
    [projects],
  );
  const shown =
    filter === ALL
      ? projects
      : projects.filter((p) => p.categories.includes(filter));

  // Deep links from the Home teaser (`/projects#aurora`) land after the list renders.
  useEffect(() => {
    if (!hash || projects.length === 0) return;
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, projects.length]);

  return (
    <section aria-label="Project list" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {categories.length > 1 && (
          <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
            <div
              role="group"
              aria-label="Filter by type"
              className="flex flex-wrap gap-2"
            >
              {[ALL, ...categories].map((category) => {
                const active = filter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFilter(category)}
                    aria-pressed={active}
                    className={`h-11 rounded-full border px-5 text-[14.5px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue ${
                      active
                        ? "border-ink bg-ink text-white"
                        : "border-ink/15 text-ink hover:border-ink"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
            <p
              aria-live="polite"
              className="text-[14px] font-bold text-ink tabular-nums"
            >
              {shown.length}
              <span className="text-text-muted"> of {projects.length}</span>
            </p>
          </div>
        )}

        {isPending && <div className="aspect-[2/1] animate-pulse bg-mist" />}
        {error && (
          <p role="alert" className="text-[15px] text-danger-500">
            {toErrorMessage(error)}
          </p>
        )}
        {!isPending && !error && projects.length === 0 && (
          <p className="bg-mist p-10 text-[16px] text-slate">
            New projects are on their way. Check back soon.
          </p>
        )}

        {shown.map((project, position) => (
          <ProjectCase
            key={`${filter}-${project.id}`}
            project={project}
            position={position}
            total={shown.length}
          />
        ))}
      </div>
    </section>
  );
}
