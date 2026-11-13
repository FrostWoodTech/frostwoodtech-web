import {
  Section,
  SectionLabel,
  TwoLineHeading,
} from "@/client/components/site/ui";
import { Stagger, StaggerItem } from "@/client/components/motion/Reveal";
import { ABOUT_STORY, MISSION_VISION, TEAM } from "@/client/data/site";

export function StorySection() {
  return (
    <Section labelledBy="story-heading">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <SectionLabel index="01">{ABOUT_STORY.label}</SectionLabel>
          <h2
            id="story-heading"
            className="mt-8 font-display text-[36px] leading-[1.05] tracking-[-0.04em] text-ink sm:text-[48px] lg:text-[56px]"
          >
            {ABOUT_STORY.title}
          </h2>
        </div>
        <Stagger stagger={0.15} className="flex flex-col gap-6 lg:pt-16">
          {ABOUT_STORY.paragraphs.map((paragraph) => (
            <StaggerItem key={paragraph}>
              <p className="text-[17.5px] leading-8 text-slate">{paragraph}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

const CARD_TONE = [
  { card: "bg-ink text-white", label: "text-blue-soft", body: "text-white/70" },
  { card: "bg-blue text-white", label: "text-white", body: "text-white/90" },
] as const;

export function MissionVisionSection() {
  return (
    <Section className="pt-0! lg:pt-0!" labelledBy="mission-heading">
      <h2 id="mission-heading" className="sr-only">
        Mission and vision
      </h2>
      <Stagger stagger={0.15} className="grid gap-4 md:grid-cols-2">
        {MISSION_VISION.map((item, index) => {
          const tone = CARD_TONE[index % CARD_TONE.length];
          return (
            <StaggerItem key={item.label}>
              <article
                className={`flex h-full min-h-80 flex-col justify-between rounded-[28px] p-8 sm:p-12 ${tone.card}`}
              >
                <p
                  className={`text-[12px] font-bold tracking-[0.16em] uppercase ${tone.label}`}
                >
                  {item.label}
                </p>
                <div className="mt-16">
                  <h3 className="font-display text-[32px] leading-[1.08] tracking-[-0.035em] sm:text-[40px]">
                    {item.title}
                  </h3>
                  <p
                    className={`mt-5 max-w-md text-[16px] leading-7 ${tone.body}`}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

export function TeamSection() {
  return (
    <Section className="bg-mist" labelledBy="team-heading">
      <SectionLabel index="02">{TEAM.label}</SectionLabel>
      <TwoLineHeading
        id="team-heading"
        lineOne={TEAM.lineOne}
        lineTwo={TEAM.lineTwo}
        className="mt-8"
      />
      <Stagger
        as="ul"
        stagger={0.12}
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
      >
        {TEAM.members.map((member) => (
          <StaggerItem
            as="li"
            key={member.name}
            className="rounded-[28px] border border-rule bg-white p-8"
          >
            <span
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-ink font-display text-[28px] tracking-[-0.03em] text-white"
            >
              {member.initials}
            </span>
            <h3 className="mt-8 text-[22px] font-bold tracking-[-0.02em] text-ink">
              {member.name}
            </h3>
            <p className="mt-1 text-[14px] font-semibold text-blue">
              {member.role}
            </p>
            <p className="mt-4 text-[15.5px] leading-7 text-slate">
              {member.bio}
            </p>
          </StaggerItem>
        ))}
        <StaggerItem
          as="li"
          className="flex flex-col justify-between rounded-[28px] border border-dashed border-ink/25 p-8"
        >
          <span
            aria-hidden="true"
            className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-ink/30 font-display text-[32px] text-ink"
          >
            +
          </span>
          <div className="mt-8">
            <h3 className="text-[22px] font-bold tracking-[-0.02em] text-ink">
              Growing the team
            </h3>
            <p className="mt-4 text-[15.5px] leading-7 text-slate">
              Senior engineers who like owning their work. Say hello via the
              contact page.
            </p>
          </div>
        </StaggerItem>
      </Stagger>
    </Section>
  );
}
