import type { AdminFieldSize } from "./types";

/** Class strings shared by `Input`, `Textarea` and `Select`. */

export const FIELD_BASE =
  "w-full rounded-lg bg-surface-900 text-sm text-text-primary " +
  "placeholder:text-text-muted border " +
  "transition-[border-color,box-shadow] duration-150 " +
  "focus:outline-none focus:ring-4 " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

/** Heights match `Button`'s `sm`/`md`, so toolbars line up on one baseline. */
export const FIELD_SIZE: Record<AdminFieldSize, string> = {
  sm: "h-9 px-3",
  md: "h-11 px-3.5",
};

export const FIELD_STATE = {
  default:
    "border-border-default hover:border-border-strong focus:border-primary-500 focus:ring-primary-500/12",
  error: "border-danger-500 focus:border-danger-500 focus:ring-danger-500/15",
} as const;

/** Micro-label, shared with the table header. */
export const FIELD_LABEL =
  "block mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary";

export const FIELD_ERROR = "mt-2 text-xs text-danger-500";

export const FIELD_HINT = "mt-1.5 text-xs text-text-muted";
