import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import BranchGrid from "@/components/sections/BranchGrid";
import QuoteBanner from "@/components/sections/QuoteBanner";
import MembershipsTeaser from "@/components/sections/MembershipsTeaser";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <BranchGrid />
      <QuoteBanner />
      <MembershipsTeaser />
    </>
  );
}
