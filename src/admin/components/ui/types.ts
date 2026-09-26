/** Admin variant types — intentionally separate from the client's `ButtonVariant`/`ButtonSize`. */

export type AdminButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "subtle" | "danger";

export type AdminButtonSize = "xs" | "sm" | "md" | "lg";

export type AdminBadgeTone =
  "neutral" | "brand" | "success" | "warning" | "danger" | "info";

export type AdminBadgeVariant = "solid" | "soft" | "outline";

/** Shared by buttons and fields so they line up. */
export type AdminFieldSize = "sm" | "md";
