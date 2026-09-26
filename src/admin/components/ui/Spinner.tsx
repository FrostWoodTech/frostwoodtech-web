interface SpinnerProps {
  readonly className?: string;
  readonly label?: string;
}

/** Admin copy of the client `Spinner`, kept on admin tokens. */
export default function Spinner({
  className = "h-5 w-5",
  label = "Loading",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin ${className}`}
    />
  );
}
