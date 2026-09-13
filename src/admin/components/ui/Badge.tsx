import type { AdminBadgeTone, AdminBadgeVariant } from "./types";

/** Admin status pill (don't reuse the client `Badge` — its tokens follow the visitor's theme). `tone` = meaning, `variant` = emphasis. */

/* Full class names, not interpolated — Tailwind only generates classes it can find verbatim. */
const TONE_CLASSES: Record<
  AdminBadgeVariant,
  Record<AdminBadgeTone, string>
> = {
  solid: {
    neutral: "bg-surface-700 text-text-primary",
    brand: "bg-primary-600 text-white",
    success: "bg-success-500 text-white",
    warning: "bg-warning-500 text-white",
    danger: "bg-danger-500 text-white",
    info: "bg-accent-500 text-white",
  },
  soft: {
    neutral: "bg-surface-800 text-text-secondary border border-border-subtle",
    brand: "bg-primary-50 text-primary-700 border border-primary-200",
    success: "bg-success-50 text-success-500 border border-success-400/30",
    warning: "bg-warning-50 text-warning-500 border border-warning-400/30",
    danger: "bg-danger-50 text-danger-500 border border-danger-400/30",
    info: "bg-accent-50 text-accent-600 border border-accent-200",
  },
  outline: {
    neutral: "text-text-secondary border border-border-default",
    brand: "text-primary-700 border border-primary-300",
    success: "text-success-500 border border-success-400/50",
    warning: "text-warning-500 border border-warning-400/50",
    danger: "text-danger-500 border border-danger-400/50",
    info: "text-accent-600 border border-accent-300",
  },
};

interface BadgeProps {
  readonly tone?: AdminBadgeTone;
  readonly variant?: AdminBadgeVariant;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export default function Badge({
  tone = "neutral",
  variant = "soft",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight whitespace-nowrap ${TONE_CLASSES[variant][tone]} ${className}`}
    >
      {children}
    </span>
  );
}
