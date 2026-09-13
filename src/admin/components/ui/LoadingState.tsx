import Spinner from "./Spinner";

interface LoadingStateProps {
  readonly label?: string;
}

/** One centred spinner for both first load and refetches. */
export default function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex items-center justify-center py-16"
    >
      <Spinner className="h-6 w-6 text-text-muted" />
    </div>
  );
}
