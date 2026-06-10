"use client";

import { useState } from "react";
import { hrZones, maxHeartRate } from "@/lib/fitness/formulas";
import { HR_ZONE_COLORS } from "@/lib/fitness/ratings";
import type { KioskToolProps } from "./contracts";

const MONTSERRAT = { fontFamily: "var(--font-montserrat, sans-serif)" } as const;
const BEBAS = { fontFamily: "var(--font-bebas, sans-serif)" } as const;

const MIN_AGE = 13;
const MAX_AGE = 100;

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CC1A1A] focus-visible:outline-offset-4";

/**
 * Kiosk heart-rate-zones tool. Shared in-gym screen: NO providers, no
 * persistence — plain local state only, giant sweaty-finger tap targets.
 */
export default function KioskHrZones({ onBack }: KioskToolProps) {
  const [age, setAge] = useState(30);

  const max = maxHeartRate("tanaka", age) ?? 0;
  const zones = hrZones(max) ?? [];

  return (
    <div className="flex h-full w-full flex-col gap-6 p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-6">
        <h1
          className="font-montserrat font-black uppercase tracking-[0.1em] text-2xl text-white"
          style={MONTSERRAT}
        >
          Heart Rate Zones
        </h1>
        <button
          type="button"
          onClick={onBack}
          className={`min-h-[80px] px-10 bg-[#CC1A1A] text-white font-bebas text-3xl tracking-[0.08em] ${FOCUS}`}
          style={BEBAS}
        >
          BACK
        </button>
      </div>

      {/* Age stepper */}
      <div className="flex items-center justify-center gap-8 sm:gap-12" role="group" aria-label="Your age">
        <button
          type="button"
          aria-label="Decrease age"
          disabled={age <= MIN_AGE}
          onClick={() => setAge((a) => Math.max(MIN_AGE, a - 1))}
          className={`h-20 w-20 min-h-[80px] min-w-[80px] bg-white text-[#0D0D0D] font-bebas text-5xl leading-none disabled:opacity-40 ${FOCUS}`}
          style={BEBAS}
        >
          &minus;
        </button>
        <div className="text-center">
          <p
            className="font-bebas leading-none text-white"
            style={{ ...BEBAS, fontSize: "clamp(4rem,12vh,9rem)" }}
            aria-live="polite"
          >
            {age}
            <span className="sr-only"> years old</span>
          </p>
          <p
            className="mt-1 font-montserrat font-semibold uppercase tracking-[0.2em] text-xl text-white/60"
            style={MONTSERRAT}
          >
            Age
          </p>
        </div>
        <button
          type="button"
          aria-label="Increase age"
          disabled={age >= MAX_AGE}
          onClick={() => setAge((a) => Math.min(MAX_AGE, a + 1))}
          className={`h-20 w-20 min-h-[80px] min-w-[80px] bg-white text-[#0D0D0D] font-bebas text-5xl leading-none disabled:opacity-40 ${FOCUS}`}
          style={BEBAS}
        >
          +
        </button>
      </div>

      <p className="text-center text-2xl text-white/70">
        Max HR &asymp; <span className="font-semibold text-white">{Math.round(max)}</span> bpm
        &nbsp;&middot;&nbsp; Tanaka formula (208 &minus; 0.7 &times; age)
      </p>

      {/* Five zones fill the remaining height */}
      <div className="flex min-h-0 flex-1 flex-col">
        {zones.map((z, i) => (
          <div
            key={z.zone}
            className="flex flex-1 items-center gap-6 border-b border-white/10 last:border-b-0"
          >
            <div
              className="w-3 self-stretch"
              style={{ backgroundColor: HR_ZONE_COLORS[i] }}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="font-montserrat font-bold text-2xl text-white" style={MONTSERRAT}>
                Z{z.zone} {z.name}
              </p>
              <p className="text-xl text-white/60">{z.description}</p>
            </div>
            <p className="font-bebas text-5xl leading-none text-white" style={BEBAS}>
              {z.bpmLow}&ndash;{z.bpmHigh}
              <span className="sr-only"> beats per minute</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
