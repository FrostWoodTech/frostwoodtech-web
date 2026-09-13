interface StickyBarProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

/** Sticky Save bar for long forms. Its negative margins must match `AdminLayout`'s `<main>` padding. */
export default function StickyBar({
  children,
  className = "",
}: StickyBarProps) {
  return (
    <div
      className={`sticky bottom-0 z-20 mt-8 -mx-5 md:-mx-10 px-5 md:px-10 py-4 bg-surface-950/90 backdrop-blur-md border-t border-border-subtle ${className}`}
    >
      {children}
    </div>
  );
}
