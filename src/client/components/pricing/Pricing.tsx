import SectionHeader from "@/client/components/ui/SectionHeader";
import PricingCard from "./PricingCard";
import { PRICING_HEADER } from "@/client/data/pricing";
import type { ApiPricingPlan } from "@/client/types";

interface PricingProps {
  readonly plans: readonly ApiPricingPlan[];
}

export default function Pricing({ plans }: PricingProps) {
  if (plans.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-26 sm:px-6 lg:px-8">
      <SectionHeader {...PRICING_HEADER} tone="ice" />

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
