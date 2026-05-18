"use client";

import { useState } from "react";
import type { TimingSection } from "@/lib/branches";

interface Props {
  timings: TimingSection[];
  light?: boolean;
}

export default function TimingsTable({ timings, light = false }: Props) {
  const [active, setActive] = useState(0);
  const section = timings[active];

  const bg = light ? "bg-white border-[#E5E5E5]" : "bg-[#2A2A2A] border-white/10";
  const headingColor = light ? "text-[#0D0D0D]" : "text-white";
  const rowEven = light ? "bg-[#F5F4F2]" : "bg-[#0D0D0D]/30";
  const textColor = light ? "text-[#0D0D0D]" : "text-white";
  const mutedColor = light ? "text-[#6B6B6B]" : "text-white/60";

  return (
    <div>
      {timings.length > 1 && (
        <div className="flex gap-2 mb-4">
          {timings.map((t, i) => (
            <button
              key={t.section}
              onClick={() => setActive(i)}
              className={`text-xs font-montserrat font-bold uppercase tracking-wider px-4 py-2 transition-colors ${
                active === i
                  ? "bg-[#CC1A1A] text-white"
                  : light
                  ? "bg-[#E5E5E5] text-[#6B6B6B] hover:bg-[#CC1A1A] hover:text-white"
                  : "bg-white/10 text-white/60 hover:bg-[#CC1A1A] hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className={`border ${bg} overflow-hidden`}>
        <div className={`px-4 py-3 border-b ${bg}`}>
          <span
            className={`font-montserrat font-bold text-xs uppercase tracking-wider ${headingColor}`}
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            {section.label} Hours
          </span>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {section.days.map((d, i) => (
              <tr key={d.day} className={i % 2 === 0 ? rowEven : ""}>
                <td className={`px-4 py-3 font-semibold ${textColor}`}>{d.day}</td>
                <td className={`px-4 py-3 text-right ${mutedColor}`}>
                  {d.open} – {d.close}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
