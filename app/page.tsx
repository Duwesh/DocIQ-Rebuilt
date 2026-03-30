import { auth } from "@clerk/nextjs/server";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { StatsSection } from "@/components/landing/stats-section";
import { CtaSection } from "@/components/landing/cta-section";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col">
      <HeroSection userId={userId} />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CtaSection />
    </div>
  );
}
