import { Link } from "react-router-dom";
import type { Product } from "@/client/types";

interface ProductCardProps {
  readonly product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={product.href}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-card-br bg-card shadow-card transition-colors duration-300 hover:border-hair-strong"
    >
      <div className="relative h-45 overflow-hidden border-b border-hair fw-media">
        {product.imagePlaceholder ? (
          <img
            src={product.imagePlaceholder}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <svg
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full text-media-fg"
            aria-hidden="true"
          >
            <g
              opacity="0.5"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.3"
            >
              <rect x="60" y="25" width="280" height="150" rx="12" />
              <path d="M60 65h280" />
              <path d="M60 150 Q160 105 250 135 T400 95" />
            </g>
          </svg>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="font-display text-[21px] leading-[1.24] font-medium tracking-[-0.018em] text-text-primary">
          {product.name}
        </h3>
        <p className="line-clamp-3 text-sm leading-[1.65] text-text-secondary">
          {product.tagline}
        </p>
      </div>
    </Link>
  );
}
