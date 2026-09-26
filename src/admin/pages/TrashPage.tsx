import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { useSearchParamState } from "@/shared/hooks/useSearchParamState";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  usePurgeTrashed,
  useRestoreTrashed,
  useTrash,
} from "@/admin/hooks/useTrash";
import { toErrorMessage } from "@/admin/api/ApiError";
import useAuth from "@/admin/context/useAuth";
import useToast from "@/admin/context/useToast";
import { TRASH_ENTITIES } from "@/admin/services/trashService";
import type { TrashedItem } from "@/admin/types";
import { formatDate } from "@/admin/utils/format";
import {
  Card,
  ConfirmDialog,
  DataTableShell,
  IconButton,
  Input,
  PageHeader,
  Pagination,
  TBody,
  TD,
  TH,
  THead,
  Table,
  TR,
  Toolbar,
} from "@/admin/components/ui";

const PAGE_SIZE = 20;

export default function TrashPage() {
  const toast = useToast();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [typeParam, setTypeParam] = useSearchParamState<string>(
    "type",
    TRASH_ENTITIES[0].id,
  );
  const entity =
    TRASH_ENTITIES.find((candidate) => candidate.id === typeParam) ??
    TRASH_ENTITIES[0];

  const [searchInput, setSearchInput] = useSearchParamState<string>("q", "");
  const search = useDebounce(searchInput);

  const [pageParam, setPageParam] = useSearchParamState<string>("page", "1");
  const page = Number(pageParam) || 1;
  const setPage = (next: number) => setPageParam(String(next));

  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [purgeTarget, setPurgeTarget] = useState<TrashedItem | null>(null);

  const {
    data: result,
    isPending: isLoading,
    isFetching,
    error: queryError,
  } = useTrash(entity.id, { search, page, pageSize: PAGE_SIZE });
  const restoreMutation = useRestoreTrashed(entity.id);
  const purgeMutation = usePurgeTrashed(entity.id);

  const error = queryError ? toErrorMessage(queryError) : null;
  const rows = result?.items ?? [];
  const totalCount = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  /** Step back when the last row of a later page leaves the list. */
  function stepBackIfPageEmptied() {
    if (rows.length === 1 && page > 1) setPage(page - 1);
  }

  function selectType(id: string) {
    setTypeParam(id);
    setPage(1);
  }

  async function handleRestore(item: TrashedItem) {
    setRestoringId(item.id);
    try {
      await restoreMutation.mutateAsync(item.id);
      toast.success(`“${item.label}” restored.`);
      stepBackIfPageEmptied();
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    } finally {
      setRestoringId(null);
    }
  }

  async function confirmPurge() {
    if (!purgeTarget) return;

    try {
      await purgeMutation.mutateAsync(purgeTarget.id);
      toast.success(`“${purgeTarget.label}” deleted permanently.`);
      setPurgeTarget(null);
      stepBackIfPageEmptied();
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  return (
    <div>
      <PageHeader
        title="Trash"
        description={
          isSuperAdmin
            ? "Restore deleted items, or delete them permanently."
            : "Restore deleted items. Only the super admin can delete permanently."
        }
      />

      <div
        role="group"
        aria-label="Content type"
        className="mb-5 flex flex-wrap gap-2"
      >
        {TRASH_ENTITIES.map((option) => {
          const isActive = option.id === entity.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectType(option.id)}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 ${
                isActive
                  ? "border-primary-200 bg-primary-50 text-primary-700"
                  : "border-border-subtle bg-surface-900 text-text-secondary hover:bg-surface-800 hover:text-text-primary"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <Toolbar>
        <Input
          fieldSize="sm"
          label="Search"
          placeholder="Name"
          value={searchInput}
          onChange={(event) => {
            setPage(1);
            setSearchInput(event.target.value);
          }}
          containerClassName="flex-1 max-w-sm"
        />
      </Toolbar>

      <Card padding="none" className="overflow-hidden">
        <DataTableShell
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          isEmpty={rows.length === 0}
          emptyTitle="Trash is empty"
          emptyDescription={
            search
              ? `No deleted ${entity.label.toLowerCase()} match this search.`
              : `No deleted ${entity.label.toLowerCase()}.`
          }
        >
          <Table>
            <THead>
              <TH>Name</TH>
              <TH>Deleted</TH>
              <TH>Deleted by</TH>
              <TH className="sr-only">Actions</TH>
            </THead>
            <TBody>
              {rows.map((item) => (
                <TR key={item.id}>
                  <TD className="max-w-sm">
                    <span className="block truncate font-medium text-text-primary">
                      {item.label}
                    </span>
                  </TD>
                  <TD variant="nowrap">{formatDate(item.deletedAt)}</TD>
                  <TD>{item.deletedByEmail ?? "—"}</TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={<RotateCcw className="h-4 w-4" />}
                        label={`Restore “${item.label}”`}
                        onClick={() => handleRestore(item)}
                        disabled={restoringId === item.id}
                      />
                      {isSuperAdmin && (
                        <IconButton
                          icon={<Trash2 className="h-4 w-4" />}
                          label={`Delete “${item.label}” permanently`}
                          onClick={() => setPurgeTarget(item)}
                          tone="danger"
                        />
                      )}
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
        open={purgeTarget !== null}
        title="Delete permanently"
        confirmLabel="Delete permanently"
        message={
          purgeTarget
            ? `Permanently delete “${purgeTarget.label}”? This can't be undone, and any files it owns are removed.`
            : ""
        }
        onConfirm={confirmPurge}
        onCancel={() => setPurgeTarget(null)}
        loading={purgeMutation.isPending}
      />
    </div>
  );
}
