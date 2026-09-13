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
import SortableProductRow from "@/admin/components/products/SortableProductRow";
import {
  useProducts,
  useReorderProducts,
  useUpdateProduct,
} from "@/admin/hooks/useProducts";
import { productKeys } from "@/admin/hooks/queryKeys";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type {
  AdminProduct,
  PagedResult,
  ProductWriteRequest,
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
function toWriteRequest(product: AdminProduct): ProductWriteRequest {
  return {
    name: product.name,
    slug: product.slug,
    tagline: product.tagline,
    description: product.description,
    priceDetails: product.priceDetails,
    productUrl: product.productUrl,
    isPublished: product.isPublished,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    showOnAgency: product.showOnAgency,
    featuredOnAgency: product.featuredOnAgency,
    showOnPersonal: product.showOnPersonal,
    featuredOnPersonal: product.featuredOnPersonal,
  };
}

function sortOrderFor(product: AdminProduct, site: Site): number {
  return site === "agency"
    ? product.agencySortOrder
    : product.personalSortOrder;
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

  // Published only; `includeHidden` so products not yet shown on this site can be turned on here.
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
  } = useProducts(queryParams);
  const reorderProductsMutation = useReorderProducts();
  const updateProductMutation = useUpdateProduct();

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

    const fromIndex = rows.findIndex((product) => product.id === active.id);
    const toIndex = rows.findIndex((product) => product.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = arrayMove([...rows], fromIndex, toIndex);
    const items = next.map((product, at) => ({
      id: product.id,
      sortOrder: at,
    }));

    const queryKey = productKeys.list(queryParams);
    const previous =
      queryClient.getQueryData<PagedResult<AdminProduct>>(queryKey);

    queryClient.setQueryData<PagedResult<AdminProduct> | undefined>(
      queryKey,
      (old) =>
        old && {
          ...old,
          items: next.map((product, at) =>
            site === "agency"
              ? { ...product, agencySortOrder: items[at].sortOrder }
              : { ...product, personalSortOrder: items[at].sortOrder },
          ),
        },
    );

    try {
      await reorderProductsMutation.mutateAsync({ site, items });
      toast.success("Order updated.");
    } catch (cause) {
      queryClient.setQueryData(queryKey, previous);
      toast.error(toErrorMessage(cause));
    }
  }

  /** Patches every cached list (both columns hold the same products) so a toggle doesn't flicker back before the refetch. */
  function patchProductInCaches(
    productId: string,
    patch: Partial<AdminProduct>,
  ) {
    queryClient.setQueriesData<PagedResult<AdminProduct>>(
      { queryKey: productKeys.lists() },
      (old) =>
        old && {
          ...old,
          items: old.items.map((item) =>
            item.id === productId ? { ...item, ...patch } : item,
          ),
        },
    );
  }

  async function toggleFeatured(product: AdminProduct, targetSite: Site) {
    setTogglingId(product.id);
    const patch: Partial<AdminProduct> =
      targetSite === "agency"
        ? { featuredOnAgency: !product.featuredOnAgency }
        : { featuredOnPersonal: !product.featuredOnPersonal };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminProduct>>(
      {
        queryKey: productKeys.lists(),
      },
    );
    patchProductInCaches(product.id, patch);

    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        body: { ...toWriteRequest(product), ...patch },
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

  async function toggleShow(product: AdminProduct, targetSite: Site) {
    setTogglingId(product.id);
    const patch: Partial<AdminProduct> =
      targetSite === "agency"
        ? {
            showOnAgency: !product.showOnAgency,
            // Hiding also un-features.
            featuredOnAgency: product.showOnAgency
              ? false
              : product.featuredOnAgency,
          }
        : {
            showOnPersonal: !product.showOnPersonal,
            featuredOnPersonal: product.showOnPersonal
              ? false
              : product.featuredOnPersonal,
          };

    const previousLists = queryClient.getQueriesData<PagedResult<AdminProduct>>(
      {
        queryKey: productKeys.lists(),
      },
    );
    patchProductInCaches(product.id, patch);

    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        body: { ...toWriteRequest(product), ...patch },
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
            Showing the first {COLUMN_PAGE_SIZE} published products on this
            site.
          </p>
        )}
      </div>
      <DataTableShell
        error={error}
        isLoading={isLoading}
        isEmpty={rows.length === 0}
        emptyTitle="No published products"
        emptyDescription="Publish a product from its editor to arrange and show it here."
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rows.map((product) => product.id)}
            strategy={verticalListSortingStrategy}
          >
            {rows.map((product) => (
              <SortableProductRow
                key={product.id}
                product={product}
                site={site}
                isTogglingShow={
                  togglingId === product.id && updateProductMutation.isPending
                }
                isTogglingFeatured={
                  togglingId === product.id && updateProductMutation.isPending
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

/** Reorder and show/feature products per site — one sortable column per site. */
export default function ProductOrderPage() {
  return (
    <div>
      <BackLink to="/admin/products">Products</BackLink>

      <PageHeader
        title="Reorder & visibility"
        description="Only published products are shown. Drag by the handle to set each site's order, and use the icons to show or feature one on that site."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SiteColumn site="agency" title="Agency site" />
        <SiteColumn site="personal" title="Personal site" />
      </div>
    </div>
  );
}
