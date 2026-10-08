import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PLACEHOLDER_REVIEWS,
  REVIEWS_WALL_HEADER,
} from "@/client/data/reviews";
import type { ApiReview } from "@/client/types";
import { initialsOf } from "@/client/utils/initials";
import ReviewWallCard from "./ReviewWallCard";

const FEATURED_COUNT = 5;

interface ReviewWallProps {
  /** Undefined while loading or when the home call fails. */
  readonly reviews?: readonly ApiReview[];
}

/**
 * Home "Client reviews": the first review large, the next four in two columns, the second of
 * which steps down on desktop so the wall reads as staggered.
 */
export default function ReviewWall({ reviews }: ReviewWallProps) {
  const shown = reviews?.length
    ? reviews.slice(0, FEATURED_COUNT)
    : PLACEHOLDER_REVIEWS;
  const [featured, ...rest] = shown;
  const columns = [rest.slice(0, 2), rest.slice(2, 4)];

  return (
    <section
      aria-labelledby="reviews-heading"
      className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32"
    >
      <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.015em] text-blue">
            <span aria-hidden="true" className="h-px w-8 bg-blue" />
            {REVIEWS_WALL_HEADER.eyebrow}
          </p>
          <h2
            id="reviews-heading"
            className="mt-6 font-display text-[46px] leading-[0.96] tracking-[-0.04em] text-ink sm:text-[64px] lg:text-[76px]"
          >
            <span className="block">{REVIEWS_WALL_HEADER.titleLead}</span>
            <em className="block text-blue">
              {REVIEWS_WALL_HEADER.titleEmphasis}
            </em>
          </h2>
        </div>

        <div className="lg:pb-2">
          <p className="max-w-115 text-base leading-8 text-slate sm:text-lg">
            {REVIEWS_WALL_HEADER.description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link
              to="/reviews"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
            >
              See all reviews
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <span aria-hidden="true" className="flex">
              {shown.map((review, index) => (
                <span
                  key={review.id}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-snow text-[11px] font-bold ${
                    index % 2 === 0
                      ? "bg-blue text-white"
                      : "bg-ice-wash text-blue"
                  } ${index > 0 ? "-ml-2.5" : ""}`}
                >
                  {initialsOf(review.name)}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured && (
          <ReviewWallCard
            review={featured}
            variant="featured"
            className="sm:col-span-2 lg:col-span-1"
          />
        )}
        {columns.map(
          (column, index) =>
            column.length > 0 && (
              <div
                key={index}
                className={`flex flex-col gap-5 ${index === 1 ? "lg:pt-16" : ""}`}
              >
                {column.map((review) => (
                  <ReviewWallCard
                    key={review.id}
                    review={review}
                    variant="compact"
                    className="flex-1"
                  />
                ))}
              </div>
            ),
        )}
      </div>
    </section>
  );
}
