import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ErrorBoundary from "@/admin/components/ErrorBoundary";

/** CMS shell. The sidebar is fixed; `md:pl-68` on the content column reserves its width. */
export default function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-surface-950">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex min-h-screen flex-col md:pl-68">
        <Topbar onMenu={() => setNavOpen(true)} />

        <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
          {/* Keyed by path so leaving a crashed page resets the boundary. */}
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
