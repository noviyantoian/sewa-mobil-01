import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { LogoStrip } from "@/components/marketing/LogoStrip";
import { Categories } from "@/components/marketing/Categories";
import { FeaturedCars } from "@/components/marketing/FeaturedCars";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { ModeCompare } from "@/components/marketing/ModeCompare";
import { TrustSection } from "@/components/marketing/TrustSection";
import { Testimonials } from "@/components/marketing/Testimonials";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { CTABand } from "@/components/marketing/CTABand";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LogoStrip />
        <Categories />
        <FeaturedCars />
        <HowItWorks />
        <ModeCompare />
        <TrustSection />
        <Testimonials />
        <FAQAccordion />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
