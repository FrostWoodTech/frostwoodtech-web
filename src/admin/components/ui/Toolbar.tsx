interface ToolbarProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

/** Filter row above a list. Use `fieldSize="sm"` on fields so they match `sm` buttons. */
export default function Toolbar({ children, className = "" }: ToolbarProps) {
  return (
    <div className={`flex flex-wrap items-end gap-3 mb-6 ${className}`}>
      {children}
    </div>
  );
}
