import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ArrowUpDown,
  ExternalLink,
  Globe,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useDeleteProduct,
  useProducts,
  useSetProductPublished,
} from "@/admin/hooks/useProducts";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import type { AdminProduct, Site } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTableShell,
  IconButton,
  Input,
  PageHeader,
  Pagination,
  Select,
  Toolbar,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
} from "@/admin/components/ui";

const PAGE_SIZE = 20;

/** `""` means "either site" — the API omits the filter entirely then. */
type SiteFilter = "" | Site;

/** `""` means "drafts and published"; the API takes a bool or nothing. */
type StatusFilter = "" | "published" | "draft";

const SITE_OPTIONS = [
  { value: "", label: "All sites" },
  { value: "agency", label: "Agency" },
  { value: "personal", label: "Personal" },
] as const;

const STATUS_OPTIONS = [
  { value: "", label: "All products" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
] as const;

function toIsPublished(status: StatusFilter): boolean | undefined {
  if (status === "published") return true;
  if (status === "draft") return false;
  return undefined;
}

/** One chip per site the product is shown on, marked when also featured. */
function visibilityBadges(product: AdminProduct) {
  const badges: { key: string; label: string; featured: boolean }[] = [];

  if (product.showOnAgency) {
    badges.push({
      key: "agency",
      label: product.featuredOnAgency ? "Agency ★" : "Agency",
      featured: product.featuredOnAgency,
    });
  }

  if (product.showOnPersonal) {
    badges.push({
      key: "personal",
      label: product.featuredOnPersonal ? "Personal ★" : "Personal",
      featured: product.featuredOnPersonal,
    });
  }

  return badges;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);
  const [site, setSite] = useSearchParamState<SiteFilter>("site", "");
  const [status, setStatus] = useSearchParamState<StatusFilter>("status", "");
  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setPageParam(String(next));
  };

  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const {
    data: result,
    isPending: isLoading,
    isFetching,
    error: queryError,
  } = useProducts({
    search,
    site: site || undefined,
    isPublished: toIsPublished(status),
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteProductMutation = useDeleteProduct();
  const setPublishedMutation = useSetProductPublished();

  const error = queryError ? toErrorMessage(queryError) : null;
  const rows = result?.items ?? [];

  async function togglePublished(target: AdminProduct) {
    setPublishingId(target.id);
    try {
      await setPublishedMutation.mutateAsync({
        id: target.id,
        isPublished: !target.isPublished,
      });
      toast.success(target.isPublished ? "Unpublished." : "Published.");
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setPublishingId(null);
    }
  }

  function askDelete(target: AdminProduct) {
    setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      await deleteProductMutation.mutateAsync(deleteTarget.id);
      toast.success("Product moved to trash.");
      setDeleteTarget(null);
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${total} ${total === 1 ? "product" : "products"} across both sites.`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              href="/admin/products/order"
              icon={<ArrowUpDown className="h-4 w-4" />}
              iconPosition="left"
            >
              Reorder & Visibility
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/admin/products/new")}
              icon={<Plus className="h-4 w-4" />}
              iconPosition="left"
            >
              New product
            </Button>
          </div>
        }
      />

      <Toolbar>
        <Input
          label="Search"
          fieldSize="sm"
          placeholder="Product name"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-xs"
        />

        <Select
          label="Site"
          fieldSize="sm"
          options={SITE_OPTIONS}
          value={site}
          onChange={(event) => {
            setPage(1);
            setSite(event.target.value as SiteFilter);
          }}
          containerClassName="w-40"
        />

        <Select
          label="Status"
          fieldSize="sm"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as StatusFilter);
          }}
          containerClassName="w-44"
        />
      </Toolbar>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          isEmpty={rows.length === 0}
          emptyIcon={Package}
          emptyTitle="No products found"
          emptyDescription="No products match these filters. Try clearing the search or switching site."
        >
          <Table>
            <THead>
              <TH>Name</TH>
              <TH>Status</TH>
              <TH>Visibility</TH>
              <TH>Updated</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <TBody>
              {rows.map((item) => (
                <TR key={item.id}>
                  <TD variant="primary" className="max-w-xs">
                    <span className="flex items-center gap-2">
                      <span className="truncate">{item.name}</span>
                      <a
                        href={`/products/${item.slug}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`Open “${item.name}” on the public site`}
                        className="shrink-0 text-text-muted hover:text-primary-600 transition-colors"
                      >
                        <ExternalLink
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </a>
                    </span>
                    <span className="block text-text-muted text-xs font-normal truncate">
                      {item.slug}
                    </span>
                  </TD>
                  <TD>
                    <Badge tone={item.isPublished ? "success" : "neutral"}>
                      {item.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TD>
                  <TD>
                    {(() => {
                      const badges = visibilityBadges(item);
                      if (badges.length === 0) {
                        return <span className="text-text-muted">—</span>;
                      }
                      return (
                        <div className="flex flex-wrap items-center gap-2">
                          {badges.map(({ key, label, featured }) => (
                            <Badge
                              key={key}
                              tone={featured ? "brand" : "neutral"}
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                      );
                    })()}
                  </TD>
                  <TD variant="nowrap">{formatDate(item.updatedAt)}</TD>
                  <TD align="right">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={
                          item.isPublished ? (
                            <Globe className="h-4 w-4" />
                          ) : (
                            <Archive className="h-4 w-4" />
                          )
                        }
                        label={
                          item.isPublished
                            ? `Unpublish “${item.name}”`
                            : `Publish “${item.name}”`
                        }
                        onClick={() => togglePublished(item)}
                        disabled={publishingId === item.id}
                        className={
                          item.isPublished
                            ? "text-primary-500 hover:text-primary-400"
                            : ""
                        }
                      />
                      <IconButton
                        icon={<Pencil className="h-4 w-4" />}
                        label={`Edit “${item.name}”`}
                        onClick={() => navigate(`/admin/products/${item.id}`)}
                      />
                      <IconButton
                        icon={<Trash2 className="h-4 w-4" />}
                        label={`Delete “${item.name}”`}
                        tone="danger"
                        onClick={() => askDelete(item)}
                      />
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </DataTableShell>
      </Card>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(next) => setPage(next)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Move product to trash"
        confirmLabel="Move to trash"
        message={
          deleteTarget
            ? `Move “${deleteTarget.name}” to the trash? It disappears from both public sites straight away; restore it from Trash any time.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteProductMutation.isPending}
      />
    </div>
  );
}
