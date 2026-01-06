import { Layout } from "@/components/layout/Layout";
import { HeroSection, FeaturesSection, TestimonialsSection, CTASection } from "@/components/home/HomeSections";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
