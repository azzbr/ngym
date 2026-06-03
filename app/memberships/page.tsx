"use client";

import { useState } from "react";
import { getAllBranches } from "@/lib/branches";
import SectionHeading from "@/components/ui/SectionHeading";
import PricingTable from "@/components/ui/PricingTable";
import QuoteBanner from "@/components/sections/QuoteBanner";

const branches = getAllBranches();

export default function MembershipsPage() {
  const [activeBranch, setActiveBranch] = useState(0);
  const branch = branches[activeBranch];

  return (
    <>
      {/* Header */}
      <section className="bg-[#0D0D0D] pt-36 pb-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <SectionHeading
            eyebrow="Memberships"
            title="Choose Your"
            redWord="Plan"
            subtitle="Flexible memberships across all Al Nakheel Premium branches. The more you commit, the more you save."
            alignment="center"
          />
        </div>
      </section>

      {/* Branch selector */}
      <section className="bg-[#F5F4F2] py-20">
        <div className="max-w-site mx-auto px-4 md:px-8">
          <div className="flex gap-3 mb-10">
            {branches.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setActiveBranch(i)}
                className={`font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3 transition-colors ${
                  activeBranch === i
                    ? "bg-[#CC1A1A] text-white"
                    : "bg-[#E5E5E5] text-[#6B6B6B] hover:bg-[#CC1A1A] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
              >
                {b.shortName}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <SectionHeading
              eyebrow={branch.locationLabel}
              title={branch.shortName}
              redWord="Pricing"
              light
            />
          </div>

          <PricingTable memberships={branch.memberships} light />

          <p className="mt-8 text-[#6B6B6B] text-sm">
            All prices are in Bahraini Dinar (BHD). Prices shown are starting rates — contact the
            branch for full details and any ongoing promotions.
          </p>
        </div>
      </section>

      <QuoteBanner />

      {/* FAQ */}
      <section className="bg-[#0D0D0D] py-20">
        <div className="max-w-site mx-auto px-4 md:px-8 max-w-2xl">
          <SectionHeading eyebrow="FAQ" title="Common" redWord="Questions" />
          <div className="mt-10 flex flex-col divide-y divide-white/10">
            {[
              {
                q: "Can I use my membership at any branch?",
                a: "Memberships are currently branch-specific. Contact us to ask about cross-branch access options.",
              },
              {
                q: "Is there a joining fee?",
                a: "Contact your nearest branch for current joining fee information and any active promotions.",
              },
              {
                q: "Do you offer couples memberships?",
                a: "Yes — select branches offer couples annual memberships. Contact your nearest branch for current couples pricing.",
              },
              {
                q: "What are your opening hours on Fridays?",
                a: "Most branches open at 8:00 AM on Fridays. Contact your specific branch to confirm exact Friday hours.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-6">
                <h3 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider mb-2">
                  {q}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
