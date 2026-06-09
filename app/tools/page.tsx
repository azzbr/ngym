import { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import ToolsHubClient from "@/components/tools/ToolsHubClient";

export const metadata: Metadata = {
  title: "Fitness Calculators & Tools",
  description:
    "16 free fitness calculators — BMI, body fat, BMR & TDEE, macros, one-rep max, heart-rate zones, VO₂ max and more. Metric & imperial. Built by Al Nakheel Premium, Bahrain's leading premium gym.",
};

export default function ToolsPage() {
  return (
    <>
      <section className="bg-[#0D0D0D] pt-36 pb-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading
            as="h1"
            eyebrow="Fitness Tools"
            title="Know Your"
            redWord="Numbers"
            subtitle="16 free calculators for body metrics, nutrition, strength and cardio. Set your profile once — every tool fills in automatically."
            alignment="center"
          />
        </div>
      </section>
      <section className="bg-[#F5F4F2]">
        <ToolsHubClient />
      </section>
    </>
  );
}
