/** Styling-only table parts. `Table` scrolls horizontally inside its card. */

import { forwardRef } from "react";

interface TableProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm text-left ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { readonly children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-border-subtle bg-surface-800/60 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
        {children}
      </tr>
    </thead>
  );
}

interface CellProps {
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly align?: "left" | "right";
  readonly colSpan?: number;
}

export function TH({ children, className = "", align = "left" }: CellProps) {
  return (
    <th
      scope="col"
      className={`px-6 py-3.5 font-semibold whitespace-nowrap ${
        align === "right" ? "text-right" : ""
      } ${className}`}
    >
      {children}
    </th>
  );
}

export function TBody({ children }: { readonly children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

interface TRProps extends Omit<
  React.HTMLAttributes<HTMLTableRowElement>,
  "children"
> {
  readonly children: React.ReactNode;
}

/** Forwards ref and `<tr>` props so it can be a dnd-kit sortable row. */
export const TR = forwardRef<HTMLTableRowElement, TRProps>(function TR(
  { children, className = "", ...rest },
  ref,
) {
  return (
    <tr
      ref={ref}
      className={`border-b border-border-subtle/70 last:border-0 hover:bg-surface-800/50 transition-colors duration-150 ${className}`}
      {...rest}
    >
      {children}
    </tr>
  );
});

interface TDProps extends CellProps {
  /** `primary` marks the row's identifying cell. */
  readonly variant?: "default" | "primary" | "nowrap";
}

const TD_VARIANTS = {
  default: "text-text-secondary",
  primary: "text-text-primary font-medium",
  nowrap: "text-text-secondary whitespace-nowrap",
} as const;

export function TD({
  children,
  className = "",
  align = "left",
  variant = "default",
  colSpan,
}: TDProps) {
  return (
    <td
      colSpan={colSpan}
      className={`px-6 py-4 ${TD_VARIANTS[variant]} ${
        align === "right" ? "text-right" : ""
      } ${className}`}
    >
      {children}
    </td>
  );
}
