import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import type { Branch } from "@/lib/branches";

interface Props {
  branch: Branch;
}

export default function BranchCard({ branch }: Props) {
  const firstSection = branch.timings[0];
  const weekdayTiming = firstSection?.days[0];

  return (
    <Link
      href={`/branches/${branch.slug}`}
      className="group block bg-[#F5F4F2] border-l-4 border-transparent hover:border-[#CC1A1A] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image placeholder */}
      <div className="aspect-[3/2] bg-[#2A2A2A] overflow-hidden relative">
        {branch.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={branch.heroImage}
            alt={branch.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="font-bebas text-6xl text-white/10 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-bebas, cursive)" }}
            >
              {branch.shortName}
            </span>
          </div>
        )}
        {branch.isNew && (
          <span className="absolute top-4 left-4 bg-[#CC1A1A] text-white text-xs font-montserrat font-bold uppercase tracking-wider px-3 py-1">
            New
          </span>
        )}
        {branch.comingSoon && (
          <span className="absolute top-4 left-4 bg-[#0D0D0D] text-white text-xs font-montserrat font-bold uppercase tracking-wider px-3 py-1">
            Coming Soon
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="font-montserrat font-black text-xl uppercase tracking-[0.05em] text-[#0D0D0D] mb-1"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          {branch.shortName}
        </h3>
        <div className="flex items-center gap-1.5 text-[#6B6B6B] text-sm mb-4">
          <MapPin size={14} className="text-[#CC1A1A]" />
          <span>{branch.locationLabel}</span>
        </div>

        {weekdayTiming && (
          <div className="flex items-center gap-1.5 text-[#6B6B6B] text-sm mb-5">
            <Clock size={14} className="text-[#CC1A1A]" />
            <span>
              {firstSection.label}: {weekdayTiming.open} – {weekdayTiming.close}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#0D0D0D]">
            From BD {Math.min(...branch.memberships.map((m) => m.priceFrom))} / mo
          </span>
          <ArrowRight
            size={18}
            className="text-[#CC1A1A] group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
}
