import { Star } from "lucide-react";
import type { ApiReview } from "@/client/types";
import { initialsOf } from "@/client/utils/initials";

type Variant = "featured" | "compact";

interface ReviewWallCardProps {
  readonly review: ApiReview;
  readonly variant: Variant;
  readonly className?: string;
}

const VARIANT_CLASSES: Record<
  Variant,
  { card: string; quote: string; avatar: string }
> = {
  featured: {
    card: "rounded-[28px] bg-linear-to-br from-ice-wash via-mist to-snow p-8 sm:p-10",
    quote:
      "line-clamp-8 font-display text-[26px] leading-[1.22] tracking-[-0.015em] text-ink sm:text-[30px] lg:text-[32px]",
    avatar: "h-12 w-12 bg-blue text-white",
  },
  compact: {
    card: "rounded-3xl bg-white p-7 shadow-[0_18px_40px_-30px_rgb(21_40_64/0.35)] transition-colors duration-300 hover:border-ice",
    quote: "line-clamp-6 text-[15.5px] leading-[1.7] text-slate",
    avatar: "h-10 w-10 bg-ice-wash text-blue",
  },
};

/** One review on the Home wall: the large frosted quote, or a smaller white card. */
export default function ReviewWallCard({
  review,
  variant,
  className = "",
}: ReviewWallCardProps) {
  const styles = VARIANT_CLASSES[variant];
  const featured = variant === "featured";
  const detail = [review.position, review.country].filter(Boolean).join(" · ");

  return (
    <article
      className={`relative flex flex-col overflow-hidden border border-rule ${styles.card} ${className}`}
    >
      {featured && (
        <>
          {/* The service and product panels' frost recipe: 60° lines and top-left light. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent_0_26px,rgb(125_183_255/0.1)_26px_27px)]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgb(255_255_255/0.95),transparent_55%)]"
          />
          <span
            aria-hidden="true"
            className="relative -mb-6 block font-display text-[120px] leading-none text-blue/80"
          >
            &ldquo;
          </span>
        </>
      )}

      {!featured && <Stars rating={review.rating} className="relative" />}

      <blockquote
        className={`relative ${featured ? "" : "mt-5 mb-6"} ${styles.quote}`}
      >
        {featured ? review.reviewText : <>&ldquo;{review.reviewText}&rdquo;</>}
      </blockquote>

      {featured && (
        <Stars rating={review.rating} className="relative mt-8 mb-6" />
      )}

      <footer
        className={`relative mt-auto flex items-center gap-3 ${featured ? "" : "border-t border-rule pt-5"}`}
      >
        <span
          aria-hidden="true"
          className={`flex shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${styles.avatar}`}
        >
          {initialsOf(review.name)}
        </span>
        <div className="min-w-0">
          <cite className="block truncate text-[15px] font-bold text-ink not-italic">
            {review.name}
          </cite>
          {detail && (
            <span className="mt-0.5 block truncate text-[13px] text-slate">
              {detail}
            </span>
          )}
        </div>
      </footer>
    </article>
  );
}

function Stars({
  rating,
  className,
}: {
  readonly rating: number;
  readonly className: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={`flex gap-0.5 text-star ${className}`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          aria-hidden="true"
          className={index < rating ? "fill-current" : "text-rule"}
        />
      ))}
    </div>
  );
}
