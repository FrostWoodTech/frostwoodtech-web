import { Link, Outlet } from "react-router-dom";
import Alert from "@/admin/components/ui/Alert";
import useAuth from "@/admin/context/useAuth";

/** Hides super-admin-only routes from regular admins. Assumes an auth guard ran higher up. */
export default function RequireSuperAdmin() {
  const { user } = useAuth();

  if (user?.role !== "super_admin") {
    return (
      <div className="max-w-md">
        <Alert>Only the super admin can manage users.</Alert>
        <Link
          to="/admin"
          className="mt-6 inline-block text-sm font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <Outlet />;
}
