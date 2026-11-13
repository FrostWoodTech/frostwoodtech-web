import { ArrowUpRight } from "lucide-react";
import { PillLink } from "@/client/components/site/ui";
import type { Project } from "@/client/types";
import { markdownBullets, pad } from "@/client/utils/text";
import ProjectVisual from "./ProjectVisual";
import { Reveal } from "@/client/components/motion/Reveal";

/** One project in full on the Projects page; the visual alternates sides on desktop. */
export default function ProjectCase({
  project,
  position,
  total,
}: {
  readonly project: Project;
  /** Zero-based place in the currently shown list. */
  readonly position: number;
  readonly total: number;
}) {
  const delivered = markdownBullets(project.whatWeDelivered);
  const flipped = position % 2 === 1;

  return (
    <article
      id={project.slug}
      aria-labelledby={`${project.slug}-heading`}
      className="group fade-swap scroll-mt-28 border-t border-ink py-14 lg:py-20"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <ProjectVisual
          project={project}
          className={`aspect-[4/3] ${flipped ? "lg:order-2" : ""}`}
        />

        <Reveal delay={0.15}>
          <p className="text-[13px] font-bold tracking-[0.12em] uppercase">
            <span className="text-blue">{pad(position)}</span>
            <span className="text-text-muted">
              {" "}
              / {pad(total - 1)} · {project.year}
            </span>
          </p>
          {project.categories.length > 0 && (
            <p className="mt-3 text-[14px] font-semibold text-slate">
              {project.categories.join(" · ")}
            </p>
          )}

          <h2
            id={`${project.slug}-heading`}
            className="mt-6 font-display text-[44px] leading-none tracking-[-0.045em] text-ink sm:text-[60px]"
          >
            {project.title}
          </h2>
          <p className="mt-4 text-[20px] leading-8 font-semibold tracking-[-0.015em] text-ink">
            {project.tagline}
          </p>
          <p className="mt-4 text-[16.5px] leading-8 text-slate">
            {project.description}
          </p>

          {(project.problem || project.solution) && (
            <dl className="mt-9 grid gap-6 border-t border-rule pt-8 sm:grid-cols-2">
              {project.problem && (
                <div>
                  <dt className="text-[12px] font-bold tracking-[0.16em] text-text-muted uppercase">
                    The problem
                  </dt>
                  <dd className="mt-3 text-[15px] leading-7 text-ink">
                    {project.problem}
                  </dd>
                </div>
              )}
              {project.solution && (
                <div>
                  <dt className="text-[12px] font-bold tracking-[0.16em] text-text-muted uppercase">
                    What we built
                  </dt>
                  <dd className="mt-3 text-[15px] leading-7 text-ink">
                    {project.solution}
                  </dd>
                </div>
              )}
            </dl>
          )}

          {delivered.length > 0 && (
            <div className="mt-8">
              <h3 className="text-[12px] font-bold tracking-[0.16em] text-text-muted uppercase">
                What we delivered
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {delivered.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-rule px-3.5 py-1.5 text-[13.5px] font-semibold text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-6">
            {project.websiteUrl ? (
              <PillLink href={project.websiteUrl} variant="dark">
                Visit live site
              </PillLink>
            ) : (
              <PillLink href="/contact" variant="dark">
                Build something similar
              </PillLink>
            )}
            {project.technologies.length > 0 && (
              <p className="flex items-center gap-1.5 text-[13.5px] font-medium text-slate">
                <ArrowUpRight size={14} aria-hidden="true" />
                {project.technologies.join(", ")}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </article>
  );
}
