"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import type { Branch } from "@/lib/branches";
import BranchCard from "@/components/ui/BranchCard";

const FILTERS = ["All", "Mixed", "Ladies"] as const;
type Filter = (typeof FILTERS)[number];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function BranchesFilter({ branches }: { branches: Branch[] }) {
  const [active, setActive] = useState<Filter>("All");

  const filtered = branches.filter((b) => {
    if (active === "All") return true;
    if (active === "Mixed") return b.type === "mixed";
    return b.type === "ladies";
  });

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-3 mb-10 justify-center">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`font-montserrat font-bold text-xs uppercase tracking-[0.12em] px-6 py-3 transition-colors ${
              active === f
                ? "bg-[#CC1A1A] text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {f}
            <span className="ml-2 text-[10px] opacity-60">
              {f === "All"
                ? branches.length
                : f === "Mixed"
                ? branches.filter((b) => b.type === "mixed").length
                : branches.filter((b) => b.type === "ladies").length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        key={active}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {filtered.map((branch) => (
          <motion.div key={branch.id} variants={cardVariants}>
            <BranchCard branch={branch} />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
