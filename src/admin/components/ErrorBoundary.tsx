import { Component, type ErrorInfo, type ReactNode } from "react";
import { Copy } from "lucide-react";
import Button from "@/admin/components/ui/Button";
import Alert from "@/admin/components/ui/Alert";

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
  readonly info: ErrorInfo | null;
  readonly timestamp: string;
}

/**
 * Shows the real render error (admins are technical). Async and event-handler
 * errors aren't caught here — they surface through ApiError and toasts.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    info: null,
    timestamp: "",
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error, timestamp: new Date().toISOString() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Admin error boundary:", error, info);
    this.setState({ info });
  }

  copyDetails = () => {
    const { error, info, timestamp } = this.state;
    const details = [
      `Time: ${timestamp}`,
      `Path: ${window.location.pathname}`,
      `Error: ${error?.message ?? "unknown"}`,
      error?.stack ?? "",
      info?.componentStack ?? "",
    ].join("\n\n");
    void navigator.clipboard.writeText(details);
  };

  render() {
    const { hasError, error, info, timestamp } = this.state;
    if (!hasError) return this.props.children;

    return (
      <div className="flex flex-col gap-4 py-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Something went wrong rendering this page
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {timestamp} — {window.location.pathname}
          </p>
        </div>

        <Alert variant="error">{error?.message ?? "Unknown error"}</Alert>

        <details className="rounded-lg border border-border-default bg-surface-900">
          <summary className="cursor-pointer select-none px-3.5 py-2.5 text-sm font-medium text-text-secondary">
            Stack trace
          </summary>
          <pre className="modal-scroll max-h-80 overflow-auto whitespace-pre-wrap break-words px-3.5 pb-3.5 text-xs text-text-muted">
            {error?.stack}
            {info?.componentStack ? `\n\n${info.componentStack}` : ""}
          </pre>
        </details>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <Button variant="secondary" href="/admin">
            Back to dashboard
          </Button>
          <Button
            variant="ghost"
            icon={<Copy className="h-4 w-4" />}
            iconPosition="left"
            onClick={this.copyDetails}
          >
            Copy error details
          </Button>
        </div>
      </div>
    );
  }
}
