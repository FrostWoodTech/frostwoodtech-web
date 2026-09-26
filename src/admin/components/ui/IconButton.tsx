interface IconButtonProps {
  readonly icon: React.ReactNode;
  /** Accessible name and tooltip. */
  readonly label: string;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly type?: "button" | "submit";
  readonly tone?: "default" | "danger";
  readonly className?: string;
}

const TONE_CLASSES = {
  default: "text-text-muted hover:text-text-primary hover:bg-surface-800",
  danger: "text-text-muted hover:text-danger-500 hover:bg-danger-50",
} as const;

export default function IconButton({
  icon,
  label,
  onClick,
  disabled = false,
  type = "button",
  tone = "default",
  className = "",
}: IconButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent ${TONE_CLASSES[tone]} ${className}`}
    >
      {icon}
    </button>
  );
}
