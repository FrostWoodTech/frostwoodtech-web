import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProjectVisual from "@/client/components/projects-page/ProjectVisual";
import {
  PillLink,
  Section,
  SectionLabel,
  TwoLineHeading,
} from "@/client/components/site/ui";
import { HOME_PROJECTS_INTRO } from "@/client/data/site";
import { Stagger, StaggerItem } from "@/client/components/motion/Reveal";
import { useProjects } from "@/client/hooks/useProjects";

/** Home "Selected projects": up to three featured projects; hidden until there are some. */
export default function ProjectsTeaser() {
  const { data: projects = [] } = useProjects({ featured: true, pageSize: 3 });
  if (projects.length === 0) return null;

  return (
    <Section labelledBy="projects-teaser-heading">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <SectionLabel>{HOME_PROJECTS_INTRO.label}</SectionLabel>
          <TwoLineHeading
            id="projects-teaser-heading"
            lineOne={HOME_PROJECTS_INTRO.lineOne}
            lineTwo={HOME_PROJECTS_INTRO.lineTwo}
            className="mt-8"
          />
        </div>
        <PillLink href="/projects" variant="outline">
          All projects
        </PillLink>
      </div>

      <Stagger
        as="ul"
        stagger={0.12}
        className="mt-14 grid gap-8 md:grid-cols-3 lg:mt-20"
      >
        {projects.map((project) => (
          <StaggerItem as="li" key={project.id}>
            <Link
              to={`/projects#${project.slug}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-4"
            >
              <ProjectVisual project={project} className="aspect-[4/3]" />
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-[26px] leading-tight tracking-[-0.035em] text-ink transition-colors group-hover:text-blue">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-6 text-slate">
                    {project.tagline}
                  </p>
                </div>
                <ArrowUpRight
                  size={22}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
