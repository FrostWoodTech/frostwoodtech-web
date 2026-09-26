interface PageHeaderProps {
  readonly title: string;
  readonly description?: React.ReactNode;
  readonly actions?: React.ReactNode;
  readonly className?: string;
}

export default function PageHeader({
  title,
  description,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5 ${className}`}
    >
      <div className="min-w-0">
        <h1 className="admin-display text-xl md:text-2xl leading-tight text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
