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
import SortableServiceRow from "@/admin/components/services/SortableServiceRow";
import {
  useReorderServices,
  useServices,
  useUpdateService,
} from "@/admin/hooks/useServices";
import { serviceKeys } from "@/admin/hooks/queryKeys";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type {
  AdminService,
  PagedResult,
  ServiceWriteRequest,
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
function toWriteRequest(service: AdminService): ServiceWriteRequest {
  return {
    name: service.name,
    slug: service.slug,
    shortDescription: service.shortDescription,
    eyebrow: service.eyebrow,
    headline: service.headline,
    deck: service.deck,
    whoThisIsFor: service.whoThisIsFor,
    outcomes: service.outcomes,
    capabilities: service.capabilities,
    inDepth: service.inDepth,
    primaryCtaLabel: service.primaryCtaLabel,
    primaryCtaUrl: service.primaryCtaUrl,
    secondaryCtaLabel: service.secondaryCtaLabel,
    secondaryCtaUrl: service.secondaryCtaUrl,
    iconObjectKey: service.iconObjectKey,
    iconUrl: service.iconUrl,
    iconWidth: service.iconWidth,
    iconHeight: service.iconHeight,
    iconAltText: service.iconAltText,
    heroImageObjectKey: service.heroImageObjectKey,
    heroImageUrl: service.heroImageUrl,
    heroImageWidth: service.heroImageWidth,
    heroImageHeight: service.heroImageHeight,
    heroImageAltText: service.heroImageAltText,
    depthImageObjectKey: service.depthImageObjectKey,
    depthImageUrl: service.depthImageUrl,
    depthImageWidth: service.depthImageWidth,
    depthImageHeight: service.depthImageHeight,
    depthImageAltText: service.depthImageAltText,
    projectIds: service.projects.map((project) => project.id),
    seoTitle: service.seoTitle,
    seoDescription: service.seoDescription,
    isPublished: service.isPublished,
    showOnAgency: service.showOnAgency,
    featuredOnAgency: service.featuredOnAgency,
    agencySortOrder: service.agencySortOrder,
    showOnPersonal: service.showOnPersonal,
    featuredOnPersonal: service.featuredOnPersonal,
    personalSortOrder: service.personalSortOrder,
  };
}

function sortOrderFor(service: AdminService, site: Site): number {
  return site === "agency"
    ? service.agencySortOrder
    : service.personalSortOrder;
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

  // Published only; `includeHidden` so services not yet shown on this site can be turned on here.
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
  } = useServices(queryParams);
  const reorderServicesMutation = useReorderServices();
  const updateServiceMutation = useUpdateService();

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

    const fromIndex = rows.findIndex((service) => service.id === active.id);
    const toIndex = rows.findIndex((service) => service.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = arrayMove([...rows], fromIndex, toIndex);
    const items = next.map((service, at) => ({
      id: service.id,
      sortOrder: at,
    }));

    const queryKey = serviceKeys.list(queryParams);
    const previous =
      queryClient.getQueryData<PagedResult<AdminService>>(queryKey);

    queryClient.setQueryData<PagedResult<AdminService> | undefined>(
      queryKey,
      (old) =>
        old && {
          ...old,
          items: next.map((service, at) =>
            site === "agency"
              ? { ...service, agencySortOrder: items[at].sortOrder }
              : { ...service, personalSortOrder: items[at].sortOrder },
          ),
        },
    );

    try {
      await reorderServicesMutation.mutateAsync({ site, items });
      toast.success("Order updated.");
    } catch (cause) {
      queryClient.setQueryData(queryKey, previous);
      toast.error(toErrorMessage(cause));
    }
  }

  /** Patches every cached list (both columns hold the same services) so a toggle doesn't flicker back before the refetch. */
  function patchServiceInCaches(
    serviceId: string,
    patch: Partial<AdminService>,
  ) {
    queryClient.setQueriesData<PagedResult<AdminService>>(
      { queryKey: serviceKeys.lists() },
      (old) =>
        old && {
          ...old,
          items: old.items.map((item) =>
            item.id === serviceId ? { ...item, ...patch } : item,
          ),
        },
    );
  }

  async function toggleFeatured(service: AdminService, targetSite: Site) {
    setTogglingId(service.id);
    const patch: Partial<AdminService> =
      targetSite === "agency"
        ? { featuredOnAgency: !service.featuredOnAgency }
        : { featuredOnPersonal: !service.featuredOnPersonal };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminService>>(
      {
        queryKey: serviceKeys.lists(),
      },
    );
    patchServiceInCaches(service.id, patch);

    try {
      await updateServiceMutation.mutateAsync({
        id: service.id,
        body: { ...toWriteRequest(service), ...patch },
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

  async function toggleShow(service: AdminService, targetSite: Site) {
    setTogglingId(service.id);
    const patch: Partial<AdminService> =
      targetSite === "agency"
        ? {
            showOnAgency: !service.showOnAgency,
            // Hiding also un-features.
            featuredOnAgency: service.showOnAgency
              ? false
              : service.featuredOnAgency,
          }
        : {
            showOnPersonal: !service.showOnPersonal,
            featuredOnPersonal: service.showOnPersonal
              ? false
              : service.featuredOnPersonal,
          };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminService>>(
      {
        queryKey: serviceKeys.lists(),
      },
    );
    patchServiceInCaches(service.id, patch);

    try {
      await updateServiceMutation.mutateAsync({
        id: service.id,
        body: { ...toWriteRequest(service), ...patch },
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
            Showing the first {COLUMN_PAGE_SIZE} published services on this
            site.
          </p>
        )}
      </div>
      {/* Spinner on initial load only — every toggle refetches, and `isFetching` would flicker. */}
      <DataTableShell
        error={error}
        isLoading={isLoading}
        isEmpty={rows.length === 0}
        emptyTitle="No published services"
        emptyDescription="Publish a service from the Services list to arrange and show it here."
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rows.map((service) => service.id)}
            strategy={verticalListSortingStrategy}
          >
            {rows.map((service) => (
              <SortableServiceRow
                key={service.id}
                service={service}
                site={site}
                isTogglingShow={
                  togglingId === service.id && updateServiceMutation.isPending
                }
                isTogglingFeatured={
                  togglingId === service.id && updateServiceMutation.isPending
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

/** Reorder and show/feature services per site — one sortable column per site. */
export default function ServiceOrderPage() {
  return (
    <div>
      <BackLink to="/admin/services">Services</BackLink>

      <PageHeader
        title="Reorder & visibility"
        description="Only published services are shown. Drag by the handle to set each site's order, and use the icons to show or feature one on that site."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SiteColumn site="agency" title="Agency site" />
        <SiteColumn site="personal" title="Personal site" />
      </div>
    </div>
  );
}
