"use client";

import type { ReactNode } from "react";

interface Props {
  /** Pre-formatted headline number, e.g. "24.7". */
  value: string;
  unit?: string;
  /** Category label, e.g. "Normal". */
  label?: string;
  /** Band color for the label chip. */
  labelColor?: string;
  /** One-line plain-language interpretation. */
  interpretation?: string;
  /** Small print, e.g. "Uses male reference equations." */
  note?: string;
  /** Usually a <ScaleBar/>. */
  children?: ReactNode;
}

/** Big number → category label → interpretation → scale bar. */
export default function ResultCard({
  value,
  unit,
  label,
  labelColor = "#0D0D0D",
  interpretation,
  note,
  children,
}: Props) {
  return (
    <div className="bg-white border border-[#E5E5E5] border-l-4 border-l-[#CC1A1A] p-6 md:p-8" role="status">
      <div className="flex items-end gap-3 flex-wrap">
        <span
          className="text-6xl md:text-7xl leading-none text-[#0D0D0D]"
          style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-lg font-semibold text-[#6B6B6B] pb-1 uppercase tracking-wide">{unit}</span>
        )}
        {label && (
          <span
            className="ml-auto font-montserrat font-bold text-xs uppercase tracking-[0.12em] text-white px-3 py-1.5"
            style={{ backgroundColor: labelColor, fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {label}
          </span>
        )}
      </div>
      {interpretation && <p className="mt-4 text-sm text-[#0D0D0D] leading-relaxed">{interpretation}</p>}
      {children && <div className="mt-6">{children}</div>}
      {note && <p className="mt-4 text-xs text-[#6B6B6B]">{note}</p>}
    </div>
  );
}
