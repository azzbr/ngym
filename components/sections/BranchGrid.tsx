"use client";

import { motion, type Variants } from "framer-motion";
import { getAllBranches } from "@/lib/branches";
import BranchCard from "@/components/ui/BranchCard";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function BranchGrid() {
  const branches = getAllBranches();

  return (
    <section className="bg-[#0D0D0D] py-24">
      <div className="max-w-site mx-auto px-4 md:px-8">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
          variants={headingVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <SectionHeading
            eyebrow="Our Locations"
            title="Find Your"
            redWord="Branch"
            subtitle="Every Al Nakheel Premium location is a full-scale premium facility. Pick the one closest to you."
          />
          <CTAButton label="All Branches" href="/branches" variant="secondary" className="shrink-0" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {branches.map((branch) => (
            <motion.div key={branch.id} variants={cardVariants}>
              <BranchCard branch={branch} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
