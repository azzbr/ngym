import { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import QuoteBanner from "@/components/sections/QuoteBanner";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Al Nakheel Premium — Bahrain's leading premium fitness center. Our story, mission, and values.",
};

const values = [
  {
    title: "Premium",
    body: "Every facility, every piece of equipment, every interaction is held to the highest standard.",
  },
  {
    title: "Elite",
    body: "We serve Bahrain's most serious athletes and fitness enthusiasts with the tools they deserve.",
  },
  {
    title: "Inclusive",
    body: "One Fit For All. Dedicated ladies floors, mixed spaces, and programming for every level.",
  },
  {
    title: "Scale",
    body: "Vast, double-height gym floors with floor-to-ceiling glass. Space to train without limits.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0D0D0D] pt-36 pb-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading
            as="h1"
            eyebrow="Our Story"
            title="The Fitness Centre"
            redWord="of the Elite"
            subtitle="Al Nakheel Premium was built for those who refuse to settle. Every branch is a statement."
            alignment="center"
          />
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20">
        <div className="max-w-site mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              eyebrow="Mission"
              title="One Fit"
              redWord="For All"
              subtitle="We believe premium fitness should be accessible to everyone who is serious about their goals. That's why we've built multiple large-scale locations across Bahrain — so no matter where you are, Al Nakheel Premium is nearby."
              light
            />
            <div className="mt-8">
              <CTAButton label="Find a Branch" href="/branches" variant="primary" />
            </div>
          </div>
          <div className="aspect-square bg-[#F5F4F2] flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/showcase/higgsfield-2-goldenhour-notext-2560.webp"
              alt="Al Nakheel Premium Al Liwan branch entrance at golden hour"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F5F4F2] py-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="Values" title="What We" redWord="Stand For" light />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="bg-white border-l-4 border-[#CC1A1A] p-8"
              >
                <span
                  className="font-bebas text-5xl text-[#CC1A1A] leading-none block mb-3"
                  style={{ fontFamily: "var(--font-bebas, cursive)" }}
                >
                  0{i + 1}
                </span>
                <h3
                  className="font-montserrat font-black text-xl uppercase tracking-wider text-[#0D0D0D] mb-3"
                  style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                >
                  {v.title}
                </h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuoteBanner light />

      {/* CTA */}
      <section className="bg-[#0D0D0D] py-24">
        <div className="max-w-site mx-auto px-4 md:px-8 text-center flex flex-col items-center gap-6">
          <SectionHeading
            eyebrow="Get Started"
            title="Your Journey"
            redWord="Starts Here"
            alignment="center"
          />
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <CTAButton label="View Memberships" href="/memberships" variant="primary" />
            <CTAButton label="Contact Us" href="/contact" variant="secondary" />
          </div>
        </div>
      </section>
    </>
  );
}
