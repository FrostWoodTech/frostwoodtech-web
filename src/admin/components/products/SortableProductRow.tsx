import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Star } from "lucide-react";
import type { AdminProduct, Site } from "@/admin/types";
import { IconButton } from "@/admin/components/ui";

interface SortableProductRowProps {
  readonly product: AdminProduct;
  /** The column's site; both toggles act on this site only. */
  readonly site: Site;
  readonly isTogglingShow: boolean;
  readonly isTogglingFeatured: boolean;
  readonly onToggleShow: (product: AdminProduct, site: Site) => void;
  readonly onToggleFeatured: (product: AdminProduct, site: Site) => void;
}

/** A row in a site's reorder column. Only the grip handle starts a drag. */
export default function SortableProductRow({
  product,
  site,
  isTogglingShow,
  isTogglingFeatured,
  onToggleShow,
  onToggleFeatured,
}: SortableProductRowProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const shown =
    site === "agency" ? product.showOnAgency : product.showOnPersonal;
  const featured =
    site === "agency" ? product.featuredOnAgency : product.featuredOnPersonal;

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
        aria-label={`Reorder “${product.name}”`}
        className="shrink-0 cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
        {product.name}
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton
          icon={
            shown ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />
          }
          label={
            shown
              ? `Hide “${product.name}” on this site`
              : `Show “${product.name}” on this site`
          }
          onClick={() => onToggleShow(product, site)}
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
              ? `Unfeature “${product.name}” on this site`
              : `Feature “${product.name}” on this site`
          }
          onClick={() => onToggleFeatured(product, site)}
          disabled={isTogglingFeatured || !shown}
          className={`h-7 w-7 ${featured ? "text-warning-400 hover:text-warning-300" : ""}`}
        />
      </div>
    </div>
  );
}
