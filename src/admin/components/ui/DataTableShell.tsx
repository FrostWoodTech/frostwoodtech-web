import type { LucideIcon } from "lucide-react";
import Alert from "./Alert";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

interface DataTableShellProps {
  readonly isLoading: boolean;
  /** A refetch is in flight (placeholder data holds old rows); shown as loading, not stale rows. */
  readonly isFetching?: boolean;
  readonly isEmpty: boolean;
  readonly error?: string | null;
  readonly emptyTitle: string;
  readonly emptyDescription?: string;
  readonly emptyIcon?: LucideIcon;
  readonly emptyAction?: React.ReactNode;
  readonly children: React.ReactNode;
}

/**
 * Loading / error / empty / loaded states around a list table. The error renders above the
 * table, so a failed refetch keeps the rows visible.
 */
export default function DataTableShell({
  isLoading,
  isFetching,
  isEmpty,
  error,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyAction,
  children,
}: DataTableShellProps) {
  return (
    <>
      {error && (
        <div className="p-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {isLoading || isFetching ? (
        <LoadingState />
      ) : isEmpty ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      ) : (
        children
      )}
    </>
  );
}
