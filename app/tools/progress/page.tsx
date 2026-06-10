import { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import ProgressClient from "@/components/tools/progress/ProgressClient";

export const metadata: Metadata = {
  title: "My Progress — Streaks, Weight Log & PRs",
  description:
    "Track your gym streak, log your weight against your plan, and keep your personal records — free, private, stored on your device. By Al Nakheel Premium, Bahrain.",
};

export default function ProgressPage() {
  return (
    <>
      <section className="bg-[#0D0D0D] pt-36 pb-16">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading
            as="h1"
            eyebrow="Fitness Tools"
            title="My"
            redWord="Progress"
            subtitle="Your streak, your weight curve, your records — saved privately on this device. Show up, log it, don't break the chain."
            alignment="center"
          />
        </div>
      </section>
      <section className="bg-[#F5F4F2]">
        <ProgressClient />
      </section>
    </>
  );
}
