"use client";

import { useState } from "react";
import { waterIntake } from "@/lib/fitness/formulas";
import { fmt } from "@/lib/fitness/units";
import type { KioskToolProps } from "./contracts";

const MONTSERRAT = { fontFamily: "var(--font-montserrat, sans-serif)" } as const;
const BEBAS = { fontFamily: "var(--font-bebas, sans-serif)" } as const;

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CC1A1A] focus-visible:outline-offset-4";

function StepperRow({
  label,
  value,
  suffix,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-6 sm:gap-10" role="group" aria-label={label}>
      <p
        className="w-36 shrink-0 font-montserrat font-semibold uppercase tracking-[0.18em] text-xl text-white/60"
        style={MONTSERRAT}
      >
        {label}
      </p>
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
        className={`h-20 w-20 min-h-[80px] min-w-[80px] bg-white text-[#0D0D0D] font-bebas text-5xl leading-none disabled:opacity-40 ${FOCUS}`}
        style={BEBAS}
      >
        &minus;
      </button>
      <p
        className="flex-1 text-center font-bebas leading-none text-white"
        style={{ ...BEBAS, fontSize: "clamp(3rem,8vh,6rem)" }}
        aria-live="polite"
      >
        {value}
        <span className="ml-3 text-[0.35em] uppercase tracking-[0.15em] text-white/60">{suffix}</span>
      </p>
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
        className={`h-20 w-20 min-h-[80px] min-w-[80px] bg-white text-[#0D0D0D] font-bebas text-5xl leading-none disabled:opacity-40 ${FOCUS}`}
        style={BEBAS}
      >
        +
      </button>
    </div>
  );
}

/**
 * Kiosk water-intake tool. Shared in-gym screen: NO providers, no
 * persistence — plain local state only, giant sweaty-finger tap targets.
 */
export default function KioskWater({ onBack }: KioskToolProps) {
  const [weight, setWeight] = useState(80);
  const [minutes, setMinutes] = useState(30);

  const liters = waterIntake(weight, minutes) ?? 0;
  const glasses = Math.round((liters * 1000) / 250);

  return (
    <div className="flex h-full w-full flex-col gap-6 p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-6">
        <h1
          className="font-montserrat font-black uppercase tracking-[0.1em] text-2xl text-white"
          style={MONTSERRAT}
        >
          Water Intake
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

      {/* Steppers */}
      <div className="flex flex-col gap-6">
        <StepperRow
          label="Weight"
          value={weight}
          suffix="KG"
          min={30}
          max={300}
          step={5}
          onChange={setWeight}
        />
        <StepperRow
          label="Training"
          value={minutes}
          suffix="MIN / DAY"
          min={0}
          max={180}
          step={15}
          onChange={setMinutes}
        />
      </div>

      {/* Result fills the remaining height */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <p
          className="font-bebas leading-none text-white"
          style={{ ...BEBAS, fontSize: "clamp(4rem,14vh,12rem)" }}
          aria-live="polite"
        >
          {fmt(liters, 1)}
          <span className="sr-only"> liters of water per day</span>
        </p>
        <p
          className="mt-2 font-montserrat font-bold uppercase tracking-[0.2em] text-2xl text-[#CC1A1A]"
          style={MONTSERRAT}
        >
          Liters / Day
        </p>
        <p className="mt-4 text-2xl text-white/70">&asymp; {glasses} glasses (250 ml)</p>
      </div>
    </div>
  );
}
