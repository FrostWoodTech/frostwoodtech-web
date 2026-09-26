import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableProjectRow from "@/admin/components/projects/SortableProjectRow";
import {
  useProjects,
  useReorderProjects,
  useUpdateProject,
} from "@/admin/hooks/useProjects";
import { projectKeys } from "@/admin/hooks/queryKeys";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type {
  AdminProject,
  PagedResult,
  ProjectWriteRequest,
  Site,
} from "@/admin/types";
import {
  BackLink,
  Card,
  DataTableShell,
  PageHeader,
} from "@/admin/components/ui";

// High enough that a column never needs pagination.
const COLUMN_PAGE_SIZE = 100;

/** PUT is a full replacement, so a toggle from this screen still has to send every field. */
function toWriteRequest(project: AdminProject): ProjectWriteRequest {
  return {
    title: project.title,
    slug: project.slug,
    year: project.year,
    shortDescription: project.shortDescription,
    description: project.description,
    websiteUrl: project.websiteUrl,
    problem: project.problem,
    solution: project.solution,
    whatWeDelivered: project.whatWeDelivered,
    proof: project.proof,
    clientName: project.clientName,
    isPublished: project.isPublished,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
    showOnAgency: project.showOnAgency,
    featuredOnAgency: project.featuredOnAgency,
    showOnPersonal: project.showOnPersonal,
    featuredOnPersonal: project.featuredOnPersonal,
    tagIds: project.tags.map((tag) => tag.id),
  };
}

function sortOrderFor(project: AdminProject, site: Site): number {
  return site === "agency"
    ? project.agencySortOrder
    : project.personalSortOrder;
}

interface SiteColumnProps {
  readonly site: Site;
  readonly title: string;
}

/** One site's sortable column, with its own query and `DndContext`. */
function SiteColumn({ site, title }: SiteColumnProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Published only; `includeHidden` so projects not yet shown on this site can be turned on here.
  const queryParams = {
    site,
    isPublished: true,
    includeHidden: true,
    pageSize: COLUMN_PAGE_SIZE,
  };
  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useProjects(queryParams);
  const reorderProjectsMutation = useReorderProjects();
  const updateProjectMutation = useUpdateProject();

  const error = queryError ? toErrorMessage(queryError) : null;
  // The API list isn't in this site's sort order, so re-sort client side.
  const rows = [...(result?.items ?? [])].sort(
    (a, b) => sortOrderFor(a, site) - sortOrderFor(b, site),
  );
  const atCap = (result?.total ?? 0) > COLUMN_PAGE_SIZE;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  /** Writes the new order to the cache optimistically; rolls back on failure. */
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = rows.findIndex((project) => project.id === active.id);
    const toIndex = rows.findIndex((project) => project.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = arrayMove([...rows], fromIndex, toIndex);
    const items = next.map((project, at) => ({
      id: project.id,
      sortOrder: at,
    }));

    const queryKey = projectKeys.list(queryParams);
    const previous =
      queryClient.getQueryData<PagedResult<AdminProject>>(queryKey);

    queryClient.setQueryData<PagedResult<AdminProject> | undefined>(
      queryKey,
      (old) =>
        old && {
          ...old,
          items: next.map((project, at) =>
            site === "agency"
              ? { ...project, agencySortOrder: items[at].sortOrder }
              : { ...project, personalSortOrder: items[at].sortOrder },
          ),
        },
    );

    try {
      await reorderProjectsMutation.mutateAsync({ site, items });
      toast.success("Order updated.");
    } catch (cause) {
      queryClient.setQueryData(queryKey, previous);
      toast.error(toErrorMessage(cause));
    }
  }

  /** Patches every cached list (both columns hold the same projects) so a toggle doesn't flicker back before the refetch. */
  function patchProjectInCaches(
    projectId: string,
    patch: Partial<AdminProject>,
  ) {
    queryClient.setQueriesData<PagedResult<AdminProject>>(
      { queryKey: projectKeys.lists() },
      (old) =>
        old && {
          ...old,
          items: old.items.map((item) =>
            item.id === projectId ? { ...item, ...patch } : item,
          ),
        },
    );
  }

  async function toggleFeatured(project: AdminProject, targetSite: Site) {
    setTogglingId(project.id);
    const patch: Partial<AdminProject> =
      targetSite === "agency"
        ? { featuredOnAgency: !project.featuredOnAgency }
        : { featuredOnPersonal: !project.featuredOnPersonal };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminProject>>(
      {
        queryKey: projectKeys.lists(),
      },
    );
    patchProjectInCaches(project.id, patch);

    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        body: { ...toWriteRequest(project), ...patch },
      });
      toast.success("Featured updated.");
    } catch (cause) {
      previousLists.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      toast.error(toErrorMessage(cause));
    } finally {
      setTogglingId(null);
    }
  }

  async function toggleShow(project: AdminProject, targetSite: Site) {
    setTogglingId(project.id);
    const patch: Partial<AdminProject> =
      targetSite === "agency"
        ? {
            showOnAgency: !project.showOnAgency,
            // Hiding also un-features.
            featuredOnAgency: project.showOnAgency
              ? false
              : project.featuredOnAgency,
          }
        : {
            showOnPersonal: !project.showOnPersonal,
            featuredOnPersonal: project.showOnPersonal
              ? false
              : project.featuredOnPersonal,
          };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminProject>>(
      {
        queryKey: projectKeys.lists(),
      },
    );
    patchProjectInCaches(project.id, patch);

    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        body: { ...toWriteRequest(project), ...patch },
      });
      toast.success("Visibility updated.");
    } catch (cause) {
      previousLists.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      toast.error(toErrorMessage(cause));
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="border-b border-border-subtle px-6 py-4">
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        {atCap && (
          <p className="mt-1 text-xs text-text-muted">
            Showing the first {COLUMN_PAGE_SIZE} published projects on this
            site.
          </p>
        )}
      </div>
      {/* Spinner on initial load only — every toggle refetches, and `isFetching` would flicker. */}
      <DataTableShell
        error={error}
        isLoading={isLoading}
        isEmpty={rows.length === 0}
        emptyTitle="No published projects"
        emptyDescription="Publish a project from its editor to arrange and show it here."
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rows.map((project) => project.id)}
            strategy={verticalListSortingStrategy}
          >
            {rows.map((project) => (
              <SortableProjectRow
                key={project.id}
                project={project}
                site={site}
                isTogglingShow={
                  togglingId === project.id && updateProjectMutation.isPending
                }
                isTogglingFeatured={
                  togglingId === project.id && updateProjectMutation.isPending
                }
                onToggleShow={toggleShow}
                onToggleFeatured={toggleFeatured}
              />
            ))}
          </SortableContext>
        </DndContext>
      </DataTableShell>
    </Card>
  );
}

/** Reorder and show/feature projects per site — one sortable column per site. */
export default function ProjectOrderPage() {
  return (
    <div>
      <BackLink to="/admin/projects">Projects</BackLink>

      <PageHeader
        title="Reorder & visibility"
        description="Only published projects are shown. Drag by the handle to set each site's order, and use the icons to show or feature one on that site."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SiteColumn site="agency" title="Agency site" />
        <SiteColumn site="personal" title="Personal site" />
      </div>
    </div>
  );
}
