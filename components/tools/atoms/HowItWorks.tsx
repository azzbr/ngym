"use client";

import { ChevronDown } from "lucide-react";

interface Props {
  body: string;
  formula: string;
  source: string;
}

/** Collapsible "How is this calculated?" — native <details> for free a11y. */
export default function HowItWorks({ body, formula, source }: Props) {
  return (
    <details className="group border border-[#E5E5E5] bg-white">
      <summary
        className="flex items-center justify-between gap-3 px-5 py-4 select-none font-montserrat font-bold text-xs uppercase tracking-[0.12em] text-[#0D0D0D]"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        How is this calculated?
        <ChevronDown size={16} className="text-[#CC1A1A] transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="px-5 pb-5 border-t border-[#E5E5E5] pt-4">
        <p className="text-sm text-[#0D0D0D] leading-relaxed">{body}</p>
        <p className="mt-3 bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3 text-xs text-[#0D0D0D] font-mono leading-relaxed">
          {formula}
        </p>
        <p className="mt-3 text-xs text-[#6B6B6B]">
          Source: <span className="font-semibold">{source}</span>
        </p>
      </div>
    </details>
  );
}
