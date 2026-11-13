import { motion } from "motion/react";
import { EASE, VIEWPORT } from "@/client/components/motion/presets";
import type { Project, ProjectImage } from "@/client/types";

const TONES = [
  {
    panel: "bg-ink text-white",
    tag: "bg-white/10",
    ghost: "text-white/[0.07]",
  },
  { panel: "bg-blue text-white", tag: "bg-white/15", ghost: "text-white/10" },
  { panel: "bg-mist text-ink", tag: "bg-white", ghost: "text-ink/[0.06]" },
] as const;

/** Unfolds from a slightly inset frame the first time it scrolls into view. */
const unfold = {
  initial: { clipPath: "inset(8% 6% 8% 6%)", opacity: 0 },
  whileInView: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
  viewport: VIEWPORT,
  transition: { duration: 1.2, ease: EASE },
} as const;

/** The screenshot unfolds into view; the frame matches the image ratio so nothing is cropped. */
function ScreenshotVisual({
  image,
  className,
}: {
  readonly image: ProjectImage;
  readonly className: string;
}) {
  return (
    <motion.div
      {...unfold}
      className={`relative overflow-hidden border border-rule bg-mist ${className}`}
    >
      <img
        src={image.url}
        alt={image.altText}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </motion.div>
  );
}

/** Stand-in for projects without a screenshot: the name set large in one of three tones. */
function TypographicVisual({
  project,
  className,
}: {
  readonly project: Project;
  readonly className: string;
}) {
  const tone = TONES[project.index % TONES.length];
  return (
    <motion.div
      aria-hidden="true"
      {...unfold}
      className={`relative flex flex-col justify-between overflow-hidden border border-rule p-7 sm:p-9 ${tone.panel} ${className}`}
    >
      <span
        className={`pointer-events-none absolute -right-[0.06em] -bottom-[0.22em] font-display text-[clamp(120px,22vw,300px)] leading-none tracking-[-0.06em] whitespace-nowrap select-none ${tone.ghost}`}
      >
        {project.title}
      </span>
      <div className="relative flex flex-wrap gap-2">
        {project.categories.map((category) => (
          <span
            key={category}
            className={`rounded-full px-3 py-1 text-[12px] font-bold ${tone.tag}`}
          >
            {category}
          </span>
        ))}
      </div>
      <div className="relative">
        <span className="block text-[13px] font-bold opacity-70">
          {project.year}
        </span>
        <span className="mt-2 block font-display text-[40px] leading-none tracking-[-0.045em] transition-transform duration-500 group-hover:-translate-y-1 sm:text-[56px]">
          {project.title}
        </span>
      </div>
    </motion.div>
  );
}

/** The project's primary screenshot, or a typographic panel when it has none. */
export default function ProjectVisual({
  project,
  className = "",
}: {
  readonly project: Project;
  readonly className?: string;
}) {
  const image =
    project.images?.find((img) => img.isPrimary) ?? project.images?.[0];

  return image ? (
    <ScreenshotVisual image={image} className={className} />
  ) : (
    <TypographicVisual project={project} className={className} />
  );
}
