import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { CategoryGrid } from "@/components/marketing/CategoryGrid";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TrustSignals } from "@/components/marketing/TrustSignals";
import { CTABandPhoto } from "@/components/marketing/CTABandPhoto";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CategoryGrid />
        <HowItWorks />
        <TrustSignals />
        <CTABandPhoto />
        <FAQAccordion />
      </main>
      <Footer />
    </>
  );
}
