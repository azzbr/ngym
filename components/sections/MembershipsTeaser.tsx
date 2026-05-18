import { getAllBranches } from "@/lib/branches";
import SectionHeading from "@/components/ui/SectionHeading";
import PricingTable from "@/components/ui/PricingTable";
import CTAButton from "@/components/ui/CTAButton";

export default function MembershipsTeaser() {
  const branches = getAllBranches();
  const featured = branches[0]; // Al Liwan as default showcase

  return (
    <section className="bg-[#F5F4F2] py-24">
      <div className="max-w-site mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <SectionHeading
            eyebrow="Memberships"
            title="Invest in"
            redWord="Yourself"
            subtitle={`Flexible plans at ${featured.shortName}. Pricing varies by branch.`}
            light
          />
          <CTAButton
            label="All Pricing"
            href="/memberships"
            variant="secondary"
            className="shrink-0 !border-[#0D0D0D] !text-[#0D0D0D] hover:!bg-[#0D0D0D] hover:!text-white"
          />
        </div>

        <PricingTable memberships={featured.memberships} light />

        <p className="mt-6 text-[#6B6B6B] text-sm">
          * Prices shown are for {featured.shortName}. Visit{" "}
          <a href="/memberships" className="text-[#CC1A1A] underline underline-offset-2">
            memberships page
          </a>{" "}
          to compare all branches.
        </p>
      </div>
    </section>
  );
}
