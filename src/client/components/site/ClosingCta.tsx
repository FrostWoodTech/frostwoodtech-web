import { CLOSING_CTA, PRIMARY_CTA, SITE } from "@/client/data/site";
import { PillLink, SectionLabel, TwoLineHeading } from "./ui";
import { pad } from "@/client/utils/text";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/client/components/motion/Reveal";

const CONTACT_ROWS = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  ...SITE.phones.map((phone) => ({
    label: "WhatsApp",
    value: phone.display,
    href: phone.whatsapp,
  })),
  { label: "Response", value: SITE.responseTime },
] as const;

/** Closing call to action on every page but Contact; it runs straight into the dark footer. */
export default function ClosingCta() {
  return (
    <section
      aria-labelledby="closing-cta-heading"
      className="bg-ink pt-24 pb-20 text-white lg:pt-36 lg:pb-28"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-20 lg:px-8">
        <div>
          <SectionLabel tone="dark">{CLOSING_CTA.label}</SectionLabel>
          <TwoLineHeading
            id="closing-cta-heading"
            lineOne={CLOSING_CTA.lineOne}
            lineTwo={CLOSING_CTA.lineTwo}
            size="hero"
            tone="dark"
            className="mt-8"
          />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
              {CLOSING_CTA.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <PillLink href={PRIMARY_CTA.href} variant="primary">
                {PRIMARY_CTA.label}
              </PillLink>
              <PillLink
                href={CLOSING_CTA.secondary.href}
                variant="outlineLight"
                arrow={false}
              >
                {CLOSING_CTA.secondary.label}
              </PillLink>
            </div>
          </Reveal>
        </div>

        <Stagger as="dl" stagger={0.1} className="border-t border-white/15">
          {CONTACT_ROWS.map((row, index) => (
            <StaggerItem
              key={row.value}
              className="grid grid-cols-[2.5rem_6.5rem_minmax(0,1fr)] items-baseline gap-2 border-b border-white/15 py-5"
            >
              <span className="text-[12px] font-bold text-blue-soft">
                {pad(index)}
              </span>
              <dt className="text-[13px] font-semibold tracking-[0.08em] text-white/55 uppercase">
                {row.label}
              </dt>
              <dd className="truncate text-[16px] font-semibold">
                {"href" in row ? (
                  <a
                    href={row.href}
                    className="rounded transition-colors hover:text-blue-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    {...(row.href.startsWith("http") && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
