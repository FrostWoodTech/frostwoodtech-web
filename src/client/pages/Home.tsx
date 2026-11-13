import Hero from "@/client/components/hero/Hero";
import ServiceAccordion from "@/client/components/services/ServiceAccordion";
import ProjectsTeaser from "@/client/components/showcase/ProjectsTeaser";
import { ChristmasOfferBand } from "@/client/components/promo/ChristmasOffer";
import ClosingCta from "@/client/components/site/ClosingCta";
import Marquee from "@/client/components/motion/Marquee";
import {
  ProcessSection,
  ResultsSection,
  TestimonialsSection,
  WhyUsSection,
} from "@/client/components/site/sections";
import { useHome } from "@/client/hooks/useHome";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export default function Home() {
  useDocumentTitle("FrostWoodTech | Websites, apps & business software");
  const { data: home } = useHome();

  return (
    <>
      <Hero />
      <Marquee />
      <ServiceAccordion />
      <ChristmasOfferBand />
      <ProjectsTeaser />
      <ProcessSection />
      <WhyUsSection />
      <ResultsSection />
      <TestimonialsSection reviews={home?.featuredReviews} />
      <ClosingCta />
    </>
  );
}
