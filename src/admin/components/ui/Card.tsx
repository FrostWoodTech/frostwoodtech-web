type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  /** `none` for full-bleed children such as tables. */
  readonly padding?: CardPadding;
}

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  padding = "lg",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-surface-900 border border-border-subtle shadow-card ${PADDING_CLASSES[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
