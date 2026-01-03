"use client";

import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection, HowItWorksSection, TrustSection } from "@/components/sections/features-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CTASection } from "@/components/sections/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
