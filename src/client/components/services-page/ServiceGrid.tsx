import ServiceCard from "@/client/components/services/ServiceCard";
import Spinner from "@/client/components/ui/Spinner";
import { useServices } from "@/client/hooks/useServices";
import { mapApiServiceToService } from "@/client/lib/mappers";
import { toErrorMessage } from "@/client/services/ApiError";

const PAGE_SIZE = 100;

export default function ServiceGrid() {
  const {
    data: result,
    isPending,
    isError,
    error,
  } = useServices({
    pageSize: PAGE_SIZE,
  });

  if (isPending) {
    return (
      <div className="flex justify-center py-16 text-text-muted">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-danger-400">
        {toErrorMessage(error)}
      </div>
    );
  }

  if (result.items.length === 0) {
    return (
      <p className="py-16 text-center text-text-secondary">
        Our services are being updated — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
      {result.items.map((service) => (
        <ServiceCard
          key={service.id}
          service={mapApiServiceToService(service)}
        />
      ))}
    </div>
  );
}
