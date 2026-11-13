import ProjectList from "@/client/components/projects-page/ProjectList";
import { ChristmasOfferBand } from "@/client/components/promo/ChristmasOffer";
import ClosingCta from "@/client/components/site/ClosingCta";
import { PageHero } from "@/client/components/site/sections";
import { PROJECTS_HERO } from "@/client/data/site";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export default function ProjectsPage() {
  useDocumentTitle("Projects | FrostWoodTech");

  return (
    <>
      <PageHero {...PROJECTS_HERO} />
      <ProjectList />
      <ChristmasOfferBand />
      <ClosingCta />
    </>
  );
}
