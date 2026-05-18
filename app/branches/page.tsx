import { Metadata } from "next";
import { getAllBranches } from "@/lib/branches";
import BranchCard from "@/components/ui/BranchCard";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Our Branches",
  description:
    "Find your nearest Al Nakheel Premium gym in Bahrain. Al Liwan, Bahrain Bay, and more locations.",
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
          subtitle="Each branch is a full-scale premium facility. All the equipment, trainers, and classes you need."
          alignment="center"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      </div>
    </div>
  );
}
