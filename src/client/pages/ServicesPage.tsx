import ServiceBlocks from "@/client/components/services-page/ServiceBlocks";
import ClosingCta from "@/client/components/site/ClosingCta";
import { ChristmasOfferBand } from "@/client/components/promo/ChristmasOffer";
import {
  FaqSection,
  PageHero,
  ProcessSection,
} from "@/client/components/site/sections";
import { SERVICES_HERO } from "@/client/data/site";
import { useFaqs } from "@/client/hooks/useFaqs";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export default function ServicesPage() {
  useDocumentTitle("Services | FrostWoodTech");
  const { data: faqs } = useFaqs();

  return (
    <>
      <PageHero {...SERVICES_HERO} />
      <ServiceBlocks />
      <ChristmasOfferBand />
      <ProcessSection />
      <FaqSection faqs={faqs} />
      <ClosingCta />
    </>
  );
}
