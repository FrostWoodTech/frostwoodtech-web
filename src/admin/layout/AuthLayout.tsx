import { Outlet } from "react-router-dom";
import Card from "@/admin/components/ui/Card";
import BrandMark from "./BrandMark";

/** Shell for signed-out screens. Avoid client `fw-*` gradients here — they follow the visitor's theme. */
export default function AuthLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,var(--color-primary-50),transparent_70%)]"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark size="lg" iconOnly />
          <h1 className="mt-5 admin-display text-[2rem] leading-[1.05] text-text-primary">
            Admin access
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            FrostWoodTech content management
          </p>
        </div>

        <Card>
          <Outlet />
        </Card>
      </div>
    </main>
  );
}
