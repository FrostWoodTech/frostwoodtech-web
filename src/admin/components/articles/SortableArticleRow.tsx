import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Star } from "lucide-react";
import type { AdminArticle, Site } from "@/admin/types";
import { IconButton } from "@/admin/components/ui";

interface SortableArticleRowProps {
  readonly article: AdminArticle;
  /** The column's site; both toggles act on this site only. */
  readonly site: Site;
  readonly isTogglingShow: boolean;
  readonly isTogglingFeatured: boolean;
  readonly onToggleShow: (article: AdminArticle, site: Site) => void;
  readonly onToggleFeatured: (article: AdminArticle, site: Site) => void;
}

/**
 * A row in a site's reorder column. A flex row, not `Table`/`TD`, whose padding is too wide
 * for a half-width column. Only the grip handle starts a drag.
 */
export default function SortableArticleRow({
  article,
  site,
  isTogglingShow,
  isTogglingFeatured,
  onToggleShow,
  onToggleFeatured,
}: SortableArticleRowProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article.id });

  const shown =
    site === "agency" ? article.showOnAgency : article.showOnPersonal;
  const featured =
    site === "agency" ? article.featuredOnAgency : article.featuredOnPersonal;

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
        aria-label={`Reorder “${article.title}”`}
        className="shrink-0 cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
        {article.title}
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton
          icon={
            shown ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />
          }
          label={
            shown
              ? `Hide “${article.title}” on this site`
              : `Show “${article.title}” on this site`
          }
          onClick={() => onToggleShow(article, site)}
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
              ? `Unfeature “${article.title}” on this site`
              : `Feature “${article.title}” on this site`
          }
          onClick={() => onToggleFeatured(article, site)}
          disabled={isTogglingFeatured || !shown}
          className={`h-7 w-7 ${featured ? "text-warning-400 hover:text-warning-300" : ""}`}
        />
      </div>
    </div>
  );
}
