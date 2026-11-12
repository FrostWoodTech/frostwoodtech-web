import Hero from "@/client/components/hero/Hero";
import TrustedBy from "@/client/components/trusted-by/TrustedBy";
import PartneringSection from "@/client/components/partnering/PartneringSection";
import Services from "@/client/components/services/Services";
import Metrics from "@/client/components/metrics/Metrics";
import BrandStatement from "@/client/components/statement/BrandStatement";
import WorkShowcase from "@/client/components/showcase/WorkShowcase";
import PricingTeaser from "@/client/components/pricing/PricingTeaser";
import ReviewWall from "@/client/components/testimonial/ReviewWall";
import SnowCta from "@/client/components/cta/SnowCta";
import { HOME_METRICS } from "@/client/data/hero";
import { useHome } from "@/client/hooks/useHome";
import { useProjects } from "@/client/hooks/useProjects";

export default function Home() {
  const { data: home } = useHome();
  const { data: projects } = useProjects({ featured: true, pageSize: 3 });

  return (
    <>
      <Hero />
      <TrustedBy />
      <PartneringSection />
      <Metrics metrics={HOME_METRICS} />
      <Services services={home?.featuredServices} />
      <BrandStatement />
      <WorkShowcase projects={projects} />
      <PricingTeaser />
      <ReviewWall reviews={home?.featuredReviews} />
      <SnowCta />
    </>
  );
}
