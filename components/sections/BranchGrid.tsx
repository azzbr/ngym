import { getAllBranches } from "@/lib/branches";
import BranchCard from "@/components/ui/BranchCard";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";

export default function BranchGrid() {
  const branches = getAllBranches();

  return (
    <section className="bg-[#0D0D0D] py-24">
      <div className="max-w-site mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <SectionHeading
            eyebrow="Our Locations"
            title="Find Your"
            redWord="Branch"
            subtitle="Every Al Nakheel Premium location is a full-scale premium facility. Pick the one closest to you."
          />
          <CTAButton label="All Branches" href="/branches" variant="secondary" className="shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      </div>
    </section>
  );
}
