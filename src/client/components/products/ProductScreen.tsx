import { Lock } from "lucide-react";
import type { Product } from "@/client/types";
import ProductScreenDrawing from "./ProductScreenDrawing";
import { SCREEN_TOASTS } from "./screenToasts";

interface ProductScreenProps {
  readonly product: Product;
}

/**
 * A browser window showing the product: its first screenshot, else its placeholder drawing,
 * else its name on frost.
 */
export default function ProductScreen({ product }: ProductScreenProps) {
  const image = product.images[0];
  const toast =
    !image && product.screen ? SCREEN_TOASTS[product.screen] : undefined;
  const ToastIcon = toast?.icon;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-rule bg-white shadow-[0_34px_80px_-36px_rgb(21_40_64/0.5)]">
        <div className="flex h-10 items-center gap-3 border-b border-rule bg-snow px-4">
          <span className="flex w-12 shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rule" />
            <span className="h-2.5 w-2.5 rounded-full bg-rule" />
            <span className="h-2.5 w-2.5 rounded-full bg-rule" />
          </span>
          <span className="mx-auto flex h-6 max-w-[60%] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-mist px-3 text-[11px] text-slate">
            <Lock size={10} aria-hidden="true" className="shrink-0" />
            <span className="truncate">{product.name}</span>
          </span>
          <span className="w-12 shrink-0" />
        </div>

        <div className="aspect-[640/380]">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || `${product.name} screenshot`}
              loading="lazy"
              className="h-full w-full object-cover object-top"
            />
          ) : product.screen ? (
            <ProductScreenDrawing kind={product.screen} />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-ice-wash to-snow font-display text-[44px] text-ink">
              {product.name}
            </div>
          )}
        </div>
      </div>

      {toast && ToastIcon && (
        <div className="absolute top-[64%] -left-3 hidden items-center gap-3 rounded-2xl border border-rule bg-white/90 py-2.5 pr-5 pl-2.5 shadow-[0_18px_40px_-20px_rgb(21_40_64/0.45)] backdrop-blur-md transition-transform duration-500 ease-out sm:flex lg:-left-10 motion-safe:group-hover:-translate-y-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue text-white">
            <ToastIcon size={18} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[13.5px] leading-tight font-bold text-ink">
              {toast.title}
            </span>
            <span className="mt-0.5 block text-[12px] leading-tight text-slate">
              {toast.detail}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
