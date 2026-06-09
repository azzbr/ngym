"use client";

import { useState } from "react";
import { useProfile, useTools } from "@/components/providers/ToolsProvider";
import { hrZones, maxHeartRate } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import { HR_ZONE_COLORS } from "@/lib/fitness/ratings";
import type { MaxHrFormula } from "@/lib/fitness/types";
import { fmt } from "@/lib/fitness/units";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import SegmentedControl from "../atoms/SegmentedControl";

const FORMULA_OPTIONS: { value: MaxHrFormula; label: string }[] = [
  { value: "tanaka", label: "Tanaka" },
  { value: "gulati", label: "Gulati (women)" },
  { value: "classic", label: "Classic 220−age" },
];

const FORMULA_NOTES: Record<MaxHrFormula, string> = {
  tanaka: "Tanaka formula (208 − 0.7 × age)",
  gulati: "Gulati formula (206 − 0.88 × age)",
  classic: "classic formula (220 − age)",
};

export default function HeartRateZonesCalculator() {
  const { profile, setProfile } = useProfile();
  const { maxHrFormula, setPrefs } = useTools();
  const { age } = profile;
  const [restHr, setRestHr] = useState<number | null>(null);

  const ageError = validateField("age", age);
  const restError =
    restHr != null && (restHr < 30 || restHr > 120)
      ? "Resting heart rate should be between 30 and 120 bpm."
      : null;

  const ageValid = age != null && !ageError;
  const restValid = restHr != null && !restError;

  const max = ageValid ? maxHeartRate(maxHrFormula, age) : null;
  const zones = max != null ? hrZones(max, restValid ? restHr : null) : null;
  const karvonen = restValid && zones != null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="hrz-age"
          label="Age"
          value={age}
          onChange={(v) => setProfile({ age: v })}
          suffix="years"
          placeholder="30"
          error={ageError}
        />
        <NumberField
          id="hrz-rest-hr"
          label="Resting heart rate (optional)"
          value={restHr}
          onChange={setRestHr}
          suffix="bpm"
          placeholder="60"
          error={restError}
          hint="Measure first thing in the morning, before getting up."
        />
      </div>

      <div>
        <SegmentedControl
          label="Max HR formula"
          value={maxHrFormula}
          onChange={(v) => setPrefs({ maxHrFormula: v })}
          options={FORMULA_OPTIONS}
        />
        <p className="mt-2 text-xs text-[#6B6B6B]">
          Default: Tanaka for men, Gulati for women. This choice is shared with the VO₂ Max
          estimator.
        </p>
      </div>

      {max != null && zones != null ? (
        <ResultCard
          value={String(Math.round(max))}
          unit="bpm max HR"
          interpretation={`Estimated with the ${FORMULA_NOTES[maxHrFormula]}. Train inside the zone that matches your session's goal.`}
          note={
            karvonen
              ? "Zones use heart-rate reserve (Karvonen) because you provided a resting HR."
              : "Add your resting heart rate for more personal zones (Karvonen method)."
          }
        >
          <div className="space-y-2">
            {zones.map((z, i) => (
              <div key={z.zone} className="flex items-stretch bg-[#F5F4F2] border border-[#E5E5E5]">
                <div
                  className="w-2 self-stretch shrink-0"
                  style={{ backgroundColor: HR_ZONE_COLORS[i] }}
                  aria-hidden="true"
                />
                <div className="flex-1 px-4 py-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className="font-montserrat font-bold text-sm uppercase tracking-[0.08em] text-[#0D0D0D]"
                      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                    >
                      Z{z.zone} · {z.name}
                    </span>
                    <span className="text-sm font-semibold text-[#0D0D0D]">
                      {z.bpmLow}–{z.bpmHigh} bpm
                    </span>
                    <span className="text-xs text-[#6B6B6B]">
                      {fmt(z.pctLow, 0)}–{fmt(z.pctHigh, 0)}%{" "}
                      {karvonen ? "of reserve" : "of max"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#6B6B6B]">{z.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ResultCard>
      ) : max != null && restValid ? (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Your resting heart rate must be lower than your estimated max heart rate (
          {Math.round(max)} bpm) — lower it or clear the field to use plain %-of-max zones.
        </p>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Enter your age above — your five training zones appear instantly.
        </p>
      )}
    </div>
  );
}
