import { Layout } from "@/components/layout/Layout";
import { HeroSection, FeaturesSection, NoticeBoardSection, TestimonialsSection, CTASection } from "@/components/home/HomeSections";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <NoticeBoardSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
