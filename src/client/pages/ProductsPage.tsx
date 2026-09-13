import { useProducts } from "@/client/hooks/useProducts";
import { toErrorMessage } from "@/client/services/ApiError";
import ProductGrid from "@/client/components/products-page/ProductGrid";
import Eyebrow from "@/client/components/ui/Eyebrow";
import PanelCTA from "@/client/components/ui/PanelCTA";
import Spinner from "@/client/components/ui/Spinner";

export default function ProductsPage() {
  const { data: products = [], isLoading, isError, error } = useProducts();

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-200 w-312 -translate-x-1/2 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-105 -left-80 h-200 w-200 fw-amb-2"
      />

      <div className="relative z-2 mx-auto max-w-7xl px-4 pt-23 pb-26 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow align="center" tone="ice" className="mb-5">
            Products
          </Eyebrow>
          <h1 className="font-display text-[42px] leading-[1.06] font-medium tracking-[-0.018em] text-text-primary sm:text-[56px] lg:text-[66px]">
            Things we&apos;ve built.
          </h1>
          <p className="mt-5.5 text-[17px] leading-[1.62] text-text-secondary sm:text-[18.5px]">
            A short lineup of products we designed, built and still use
            ourselves.
          </p>
        </div>

        <div className="mt-16">
          {isLoading && (
            <div className="flex justify-center py-24 text-text-muted">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {isError && (
            <div className="py-20 text-center text-danger-400">
              {toErrorMessage(error)}
            </div>
          )}

          {!isLoading && !isError && <ProductGrid products={products} />}
        </div>

        <div className="mt-22">
          <PanelCTA
            title="Want to know more?"
            description="Reach out and we'll walk you through what's coming next."
            primaryLabel="Contact us"
            primaryHref="/contact"
          />
        </div>
      </div>
    </div>
  );
}
