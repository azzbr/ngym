"use client";

import { useEffect, useState } from "react";
import { getTodayHours } from "@/lib/branchHours";
import { formatPhone } from "@/lib/utils";
import type { HoursSlideProps } from "../contracts";

/**
 * Today's hours per timing section with a live OPEN NOW / CLOSED badge.
 * Recomputes every 60s so the badge flips without a reload — kiosks run
 * for days. Pending-data branches (no timings) show the phone instead.
 */
export default function HoursSlide({ branch }: HoursSlideProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const rows = getTodayHours(branch, now);

  return (
    <div className="flex h-full w-full flex-col justify-center p-10 md:p-16">
      <p
        className="font-montserrat text-xl font-bold uppercase tracking-[0.35em] text-[#CC1A1A]"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        Today
      </p>
      <h2
        className="mt-2 uppercase leading-none text-white"
        style={{
          fontFamily: "var(--font-bebas, sans-serif)",
          fontSize: "clamp(4rem, 14vh, 12rem)",
        }}
      >
        {branch.shortName}
      </h2>

      {rows.length > 0 ? (
        <div className="mt-12">
          {rows.map((row, i) => (
            <div
              key={`${row.sectionLabel}-${i}`}
              className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t-2 border-white/15 py-8"
            >
              <div>
                <p
                  className="font-montserrat text-2xl font-bold uppercase tracking-[0.2em] text-white/60"
                  style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                >
                  {row.sectionLabel}
                </p>
                <p
                  className="mt-2 text-4xl md:text-5xl leading-none text-white"
                  style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
                >
                  {row.openDisplay} — {row.closeDisplay}
                </p>
              </div>
              <span
                className={`font-montserrat text-2xl font-bold uppercase tracking-[0.12em] px-4 py-2 text-white ${
                  row.isOpen ? "bg-[#1A7A3C]" : "bg-[#CC1A1A]"
                }`}
                style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
              >
                {row.isOpen ? "Open Now" : "Closed"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 border-t-2 border-white/15 pt-10">
          <p
            className="font-montserrat text-2xl font-bold uppercase tracking-[0.2em] text-white/60"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Call to confirm hours
          </p>
          <p
            className="mt-4 leading-none text-white"
            style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "clamp(3.5rem, 12vh, 10rem)",
            }}
          >
            {formatPhone(branch.contact.phone)}
          </p>
        </div>
      )}
    </div>
  );
}
