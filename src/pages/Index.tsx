
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { CtaSection } from "@/components/home/CtaSection";
import { Layout } from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <FeatureSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;
