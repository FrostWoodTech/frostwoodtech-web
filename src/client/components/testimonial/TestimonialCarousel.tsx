import { useState } from "react";
import Testimonial from "@/client/components/testimonial/Testimonial";
import Button from "@/client/components/ui/Button";
import SectionHeader from "@/client/components/ui/SectionHeader";
import { REVIEWS_HEADER } from "@/client/data/reviews";
import type { ApiReview } from "@/client/types";

interface TestimonialCarouselProps {
  readonly reviews: readonly ApiReview[];
}

export default function TestimonialCarousel({
  reviews,
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);

  if (reviews.length === 0) return null;

  const current = reviews[index % reviews.length];

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  const goNext = () => setIndex((prev) => (prev + 1) % reviews.length);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeader {...REVIEWS_HEADER} tone="forest" />

      <Testimonial
        testimonial={{
          id: current.id,
          quote: current.reviewText,
          name: current.name,
          role: current.position ?? current.country,
          initials: current.name.trim().charAt(0).toUpperCase(),
          rating: current.rating,
        }}
        onPrev={reviews.length > 1 ? goPrev : undefined}
        onNext={reviews.length > 1 ? goNext : undefined}
        className="px-0!"
      />

      <div className="mt-6 flex justify-center">
        <Button href="/reviews" variant="secondary" size="sm">
          See all reviews
        </Button>
      </div>
    </section>
  );
}
