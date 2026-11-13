import EnquiryForm from "@/client/components/contact/EnquiryForm";
import { FaqSection, PageHero } from "@/client/components/site/sections";
import { SectionLabel } from "@/client/components/site/ui";
import { CONTACT_HERO, NEXT_STEPS, SITE } from "@/client/data/site";
import { useFaqs } from "@/client/hooks/useFaqs";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { pad } from "@/client/utils/text";
import { Stagger, StaggerItem } from "@/client/components/motion/Reveal";

const CHANNELS = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  ...SITE.phones.map((phone) => ({
    label: "WhatsApp",
    value: phone.display,
    href: phone.whatsapp,
  })),
  { label: "Response time", value: SITE.responseTime },
] as const;

export default function ContactPage() {
  useDocumentTitle("Contact | FrostWoodTech");
  const { data: faqs } = useFaqs();

  return (
    <>
      <PageHero {...CONTACT_HERO} />

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14 lg:px-8">
          <EnquiryForm />

          <aside aria-label="Other ways to reach us">
            <Stagger stagger={0.1} delay={0.2} className="flex flex-col gap-4">
              {CHANNELS.map((channel, index) => (
                <StaggerItem
                  key={channel.value}
                  className="rounded-[24px] bg-mist p-7"
                >
                  <p className="text-[12px] font-bold tracking-[0.16em] uppercase">
                    <span className="text-blue">{pad(index)}</span>
                    <span className="text-text-muted"> · {channel.label}</span>
                  </p>
                  {"href" in channel ? (
                    <a
                      href={channel.href}
                      className="mt-4 block truncate rounded text-[20px] font-bold tracking-[-0.02em] text-ink transition-colors hover:text-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
                      {...(channel.href.startsWith("http") && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <p className="mt-4 text-[20px] font-bold tracking-[-0.02em] text-ink">
                      {channel.value}
                    </p>
                  )}
                </StaggerItem>
              ))}
            </Stagger>
          </aside>
        </div>
      </section>

      <section
        aria-labelledby="next-steps-heading"
        className="bg-ink py-24 text-white lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel tone="dark">{NEXT_STEPS.label}</SectionLabel>
          <h2 id="next-steps-heading" className="sr-only">
            {NEXT_STEPS.label}
          </h2>
          <Stagger
            as="ol"
            stagger={0.12}
            className="mt-12 grid gap-10 md:grid-cols-3"
          >
            {NEXT_STEPS.steps.map((step, index) => (
              <StaggerItem
                as="li"
                key={step.title}
                className="border-t border-white/20 pt-8"
              >
                <span className="font-display text-[56px] leading-none tracking-[-0.04em] text-blue-soft">
                  {pad(index)}
                </span>
                <h3 className="mt-8 font-display text-[26px] leading-[1.15] tracking-[-0.03em]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15.5px] leading-7 text-white/65">
                  {step.description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <FaqSection faqs={faqs} />
    </>
  );
}
