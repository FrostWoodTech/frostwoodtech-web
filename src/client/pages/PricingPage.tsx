import Eyebrow from "@/client/components/ui/Eyebrow";
import PanelCTA from "@/client/components/ui/PanelCTA";
import Spinner from "@/client/components/ui/Spinner";
import PricingCard from "@/client/components/pricing/PricingCard";
import CurrencySwitcher from "@/client/components/ui/CurrencySwitcher";
import { useComboPricingPlans } from "@/client/hooks/usePricingPlans";
import { toErrorMessage } from "@/client/services/ApiError";
import { PRICING_FAQS } from "@/client/data/pricing";

export default function PricingPage() {
  const {
    data: plans = [],
    isPending,
    isError,
    error,
  } = useComboPricingPlans({
    pageSize: 100,
  });

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
            Transparent pricing
          </Eyebrow>
          <h1 className="font-display text-[42px] leading-[1.06] font-medium tracking-[-0.018em] text-text-primary sm:text-[56px] lg:text-[66px]">
            Investment that
            <br />
            pays off.
          </h1>
          <p className="mt-5.5 text-[17px] leading-[1.62] text-text-secondary sm:text-[18.5px]">
            Every engagement starts with a free scoping call and ends with a
            written, fixed-price proposal. These are the floors, not the
            invoices.
          </p>
        </div>

        {isPending && (
          <div className="flex justify-center py-24 text-text-muted">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {isError && (
          <div className="py-20 text-center text-danger-400">
            {toErrorMessage(error)}
          </div>
        )}

        {!isPending && !isError && plans.length === 0 && (
          <p className="py-20 text-center text-text-secondary">
            Pricing is being updated — get in touch for a quote.
          </p>
        )}

        {plans.length > 0 && (
          <>
            <CurrencySwitcher
              label="Prices shown in"
              className="mt-14 justify-end"
            />
            <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 lg:gap-9">
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          </>
        )}

        <div className="mt-22 grid grid-cols-1 gap-4.5 md:grid-cols-2">
          {PRICING_FAQS.map((faq) => (
            <div
              key={faq.id}
              className="rounded-2xl border border-card-br bg-card p-7.5 shadow-card"
            >
              <h3 className="text-[17px] font-bold text-text-primary">
                {faq.question}
              </h3>
              <p className="mt-2.5 text-[15.5px] leading-[1.7] text-text-secondary">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-22">
          <PanelCTA
            title="Get a real number."
            description="One call, one written proposal, one fixed price. Within three working days."
            primaryLabel="Request a proposal"
            primaryHref="/contact"
          />
        </div>
      </div>
    </div>
  );
}
