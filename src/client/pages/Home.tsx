import Hero from "@/client/components/hero/Hero";
import TrustedBy from "@/client/components/trusted-by/TrustedBy";
import PartneringSection from "@/client/components/partnering/PartneringSection";
import Services from "@/client/components/services/Services";
import Metrics from "@/client/components/metrics/Metrics";
import BrandStatement from "@/client/components/statement/BrandStatement";
import ProductShowcase from "@/client/components/products/ProductShowcase";
import PricingTeaser from "@/client/components/pricing/PricingTeaser";
import ReviewWall from "@/client/components/testimonial/ReviewWall";
import SnowCta from "@/client/components/cta/SnowCta";
import { HOME_METRICS } from "@/client/data/hero";
import { useHome } from "@/client/hooks/useHome";
import { useProducts } from "@/client/hooks/useProducts";

export default function Home() {
  const { data: home } = useHome();
  const { data: products } = useProducts({ featured: true, pageSize: 3 });

  return (
    <>
      <Hero />
      <TrustedBy />
      <PartneringSection />
      <Metrics metrics={HOME_METRICS} />
      <Services services={home?.featuredServices} />
      <BrandStatement />
      <ProductShowcase products={products} />
      <PricingTeaser />
      <ReviewWall reviews={home?.featuredReviews} />
      <SnowCta />
    </>
  );
}
