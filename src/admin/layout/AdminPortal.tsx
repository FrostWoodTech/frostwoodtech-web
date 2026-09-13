import { createPortal } from "react-dom";

interface AdminPortalProps {
  readonly children: React.ReactNode;
}

/**
 * Portals to `document.body` inside a `display: contents` admin-theme wrapper. Use this instead of
 * `createPortal` in admin code, or the overlay picks up the visitor's client theme.
 */
export default function AdminPortal({ children }: AdminPortalProps) {
  return createPortal(
    <div data-theme="admin-light" className="contents">
      {children}
    </div>,
    document.body,
  );
}
