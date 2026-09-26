import { useParams, Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import { useProduct } from "@/client/hooks/useProduct";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { toErrorMessage } from "@/client/services/ApiError";
import useTheme from "@/client/context/useTheme";
import Spinner from "@/client/components/ui/Spinner";
import Button from "@/client/components/ui/Button";
import Eyebrow from "@/client/components/ui/Eyebrow";
import PanelCTA from "@/client/components/ui/PanelCTA";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError, error } = useProduct(slug);
  const { theme } = useTheme();

  useDocumentTitle(product ? product.name : "Loading Product…");

  if (isLoading) {
    return (
      <div className="flex justify-center pt-48 pb-24 text-text-muted">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="pt-48 pb-24 text-center">
        <p className="mb-6 text-danger-400">
          {error ? toErrorMessage(error) : "We couldn't find that product."}
        </p>
        <Button
          href="/products"
          variant="outline"
          icon={<ArrowLeft size={16} />}
          iconPosition="left"
        >
          Back to products
        </Button>
      </div>
    );
  }

  const gallery = product.images;

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-200 w-325 -translate-x-1/2 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-112 -left-80 h-200 w-200 fw-amb-2"
      />

      <div className="relative z-2 mx-auto max-w-7xl px-4 pt-8 pb-26 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2.5 text-[13.5px] text-text-muted"
        >
          <Link to="/products" className="hover:text-text-primary">
            Products
          </Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="line-clamp-1 font-semibold text-text-primary">
            {product.name}
          </span>
        </nav>

        <header className="mx-auto mt-11 max-w-3xl text-center">
          <h1 className="font-display text-[34px] leading-[1.09] font-medium tracking-[-0.018em] text-text-primary sm:text-[46px] lg:text-[58px]">
            {product.name}
          </h1>

          <p className="mt-6 text-lg leading-[1.6] text-text-secondary sm:text-xl">
            {product.tagline}
          </p>
        </header>

        {gallery[0] && (
          <div className="mt-13 overflow-hidden rounded-3xl border border-hair fw-media shadow-card">
            <img
              src={gallery[0].url}
              alt={gallery[0].altText}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <div className="mt-19 grid grid-cols-1 gap-15 lg:grid-cols-3">
          <div className="flex flex-col gap-11 lg:col-span-2">
            {product.description && (
              <div data-color-mode={theme} className="fw-prose">
                <MDEditor.Markdown
                  source={product.description}
                  style={{ backgroundColor: "transparent", color: "inherit" }}
                />
              </div>
            )}

            {gallery.length > 1 && (
              <div>
                <Eyebrow className="mb-4">Gallery</Eyebrow>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {gallery.slice(1).map((image) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-2xl border border-hair fw-media"
                    >
                      <img
                        src={image.url}
                        alt={image.altText}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col gap-5 rounded-[18px] border border-card-br bg-card p-7 shadow-card">
              {product.priceDetails && (
                <>
                  <div>
                    <div className="text-[11.5px] font-bold tracking-[0.1em] text-text-muted">
                      PRICING
                    </div>
                    <div
                      data-color-mode={theme}
                      className="fw-prose mt-2 text-[15.5px] text-text-primary"
                    >
                      <MDEditor.Markdown
                        source={product.priceDetails}
                        style={{
                          backgroundColor: "transparent",
                          color: "inherit",
                        }}
                      />
                    </div>
                  </div>
                  {product.productUrl && (
                    <div aria-hidden="true" className="h-px bg-hair" />
                  )}
                </>
              )}

              {product.productUrl && (
                <Button
                  href={product.productUrl}
                  icon={<ArrowUpRight size={16} />}
                  iconPosition="right"
                  className="w-full justify-center"
                >
                  Visit product
                </Button>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-20">
          <PanelCTA
            title="Building something like this?"
            description="Tell us what you're working on. You'll get a scoped proposal and a fixed price within three working days."
            primaryLabel="Start a project"
            primaryHref="/contact"
            secondaryLabel="More products"
            secondaryHref="/products"
          />
        </div>
      </div>
    </div>
  );
}
