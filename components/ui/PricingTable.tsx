import type { Membership } from "@/lib/branches";
import { Check } from "lucide-react";

interface Props {
  memberships: Membership[];
  light?: boolean;
}

export default function PricingTable({ memberships, light = false }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {memberships.map((m) => {
        const highlighted = m.highlighted;
        return (
          <div
            key={m.tier}
            className={`relative flex flex-col border transition-all duration-300 hover:-translate-y-1 ${
              highlighted
                ? "border-[#CC1A1A] bg-[#CC1A1A]"
                : light
                ? "border-[#E5E5E5] bg-white hover:border-[#CC1A1A]"
                : "border-white/10 bg-[#2A2A2A] hover:border-[#CC1A1A]"
            }`}
          >
            {highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#0D0D0D] text-white text-[10px] font-montserrat font-bold uppercase tracking-wider px-3 py-1">
                  Best Value
                </span>
              </div>
            )}

            <div className="p-6 flex flex-col gap-4 flex-1">
              <div>
                <p
                  className={`font-montserrat font-bold text-xs uppercase tracking-[0.15em] mb-2 ${
                    highlighted ? "text-white/80" : light ? "text-[#6B6B6B]" : "text-white/60"
                  }`}
                  style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                >
                  {m.tier}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`font-bebas text-5xl leading-none ${
                      highlighted ? "text-white" : light ? "text-[#0D0D0D]" : "text-white"
                    }`}
                    style={{ fontFamily: "var(--font-bebas, cursive)" }}
                  >
                    {m.priceFrom}
                  </span>
                  <span
                    className={`font-montserrat font-bold text-sm ${
                      highlighted ? "text-white/80" : light ? "text-[#6B6B6B]" : "text-white/60"
                    }`}
                  >
                    BD
                  </span>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    highlighted ? "text-white/70" : light ? "text-[#6B6B6B]" : "text-white/40"
                  }`}
                >
                  {m.duration}
                </p>
              </div>

              {m.note && (
                <div className="flex items-center gap-2">
                  <Check size={14} className={highlighted ? "text-white" : "text-[#CC1A1A]"} />
                  <span
                    className={`text-xs ${
                      highlighted ? "text-white/80" : light ? "text-[#6B6B6B]" : "text-white/60"
                    }`}
                  >
                    {m.note}
                  </span>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <a
                href="/contact"
                className={`block text-center text-xs font-montserrat font-bold uppercase tracking-wider py-3 transition-colors ${
                  highlighted
                    ? "bg-white text-[#CC1A1A] hover:bg-white/90"
                    : "bg-[#CC1A1A] text-white hover:bg-[#AA1414]"
                }`}
                style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
              >
                Get Started
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
