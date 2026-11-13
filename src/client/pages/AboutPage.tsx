import {
  MissionVisionSection,
  StorySection,
  TeamSection,
} from "@/client/components/about-page/AboutSections";
import StackSection from "@/client/components/about-page/StackSection";
import ClosingCta from "@/client/components/site/ClosingCta";
import {
  PageHero,
  ResultsSection,
  WhyUsSection,
} from "@/client/components/site/sections";
import { ABOUT_HERO } from "@/client/data/site";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export default function AboutPage() {
  useDocumentTitle("About | FrostWoodTech");

  return (
    <>
      <PageHero {...ABOUT_HERO} />
      <StorySection />
      <MissionVisionSection />
      <TeamSection />
      <StackSection />
      <WhyUsSection />
      <ResultsSection />
      <ClosingCta />
    </>
  );
}
