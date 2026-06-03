import { Metadata } from "next";
import { getAllBranches } from "@/lib/branches";
import SectionHeading from "@/components/ui/SectionHeading";
import BranchesFilter from "@/components/ui/BranchesFilter";

export const metadata: Metadata = {
  title: "Our Branches",
  description:
    "Find your nearest Al Nakheel Premium gym in Bahrain. 8 locations island-wide — mixed and ladies-only facilities.",
};

export default function BranchesPage() {
  const branches = getAllBranches();

  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-32 pb-24">
      <div className="max-w-site mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="All Locations"
          title="Our"
          redWord="Branches"
          subtitle="8 premium facilities across Bahrain. Mixed and ladies-only options available island-wide."
          alignment="center"
        />
        <div className="mt-16">
          <BranchesFilter branches={branches} />
        </div>
      </div>
    </div>
  );
}
