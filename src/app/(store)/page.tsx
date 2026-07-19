import { HeroSection } from "@/components/store/hero-section";
import { CategoryShowcase } from "@/components/store/category-showcase";
import { AboutBanner } from "@/components/store/about-banner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <AboutBanner />
    </>
  );
}
