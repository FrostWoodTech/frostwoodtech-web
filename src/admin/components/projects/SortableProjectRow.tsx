import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Star } from "lucide-react";
import type { AdminProject, Site } from "@/admin/types";
import { IconButton } from "@/admin/components/ui";

interface SortableProjectRowProps {
  readonly project: AdminProject;
  /** The column's site; both toggles act on this site only. */
  readonly site: Site;
  readonly isTogglingShow: boolean;
  readonly isTogglingFeatured: boolean;
  readonly onToggleShow: (project: AdminProject, site: Site) => void;
  readonly onToggleFeatured: (project: AdminProject, site: Site) => void;
}

/** A row in a site's reorder column (see `SortableArticleRow`). Only the grip handle starts a drag. */
export default function SortableProjectRow({
  project,
  site,
  isTogglingShow,
  isTogglingFeatured,
  onToggleShow,
  onToggleFeatured,
}: SortableProjectRowProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const shown =
    site === "agency" ? project.showOnAgency : project.showOnPersonal;
  const featured =
    site === "agency" ? project.featuredOnAgency : project.featuredOnPersonal;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="flex items-center gap-2 border-b border-border-subtle/70 px-3 py-2.5 last:border-0 hover:bg-surface-800/50 transition-colors duration-150"
    >
      <button
        type="button"
        aria-label={`Reorder “${project.title}”`}
        className="shrink-0 cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
        {project.title}
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton
          icon={
            shown ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />
          }
          label={
            shown
              ? `Hide “${project.title}” on this site`
              : `Show “${project.title}” on this site`
          }
          onClick={() => onToggleShow(project, site)}
          disabled={isTogglingShow}
          className={`h-7 w-7 ${shown ? "text-primary-500 hover:text-primary-400" : ""}`}
        />
        <IconButton
          icon={
            <Star
              className="h-4 w-4"
              fill={featured ? "currentColor" : "none"}
            />
          }
          label={
            featured
              ? `Unfeature “${project.title}” on this site`
              : `Feature “${project.title}” on this site`
          }
          onClick={() => onToggleFeatured(project, site)}
          disabled={isTogglingFeatured || !shown}
          className={`h-7 w-7 ${featured ? "text-warning-400 hover:text-warning-300" : ""}`}
        />
      </div>
    </div>
  );
}
