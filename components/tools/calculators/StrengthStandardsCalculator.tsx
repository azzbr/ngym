"use client";

import { useEffect, useRef, useState } from "react";
import { useProfile, useUnits } from "@/components/providers/ToolsProvider";
import {
  STRENGTH_LEVEL_LABELS,
  STRENGTH_STANDARDS,
  strengthLevel,
} from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import type { Lift } from "@/lib/fitness/types";
import { fmt, kgToLb, roundTo, roundToStep } from "@/lib/fitness/units";
import HandoffChip from "../atoms/HandoffChip";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import SegmentedControl from "../atoms/SegmentedControl";
import { useHandoffParam } from "../useHandoffParam";

const LIFT_OPTIONS: { value: Lift; label: string }[] = [
  { value: "squat", label: "Squat" },
  { value: "bench", label: "Bench Press" },
  { value: "deadlift", label: "Deadlift" },
  { value: "ohp", label: "Overhead Press" },
];

const INTERPRETATIONS: Record<string, string> = {
  Untrained:
    "Below the Beginner threshold for this lift — everyone starts somewhere, and newcomer gains arrive fast.",
  Beginner: "You can handle the lift with proper form — consistent training will move you up quickly.",
  Novice: "A solid foundation — a few months of structured progression separates you from Intermediate.",
  Intermediate: "Stronger than most regular gym-goers — progress now comes from smarter programming.",
  Advanced: "Years of dedicated training show — you're stronger than the vast majority of lifters.",
  Elite: "Competitive-level strength — you sit at the very top of the standards table.",
};

export default function StrengthStandardsCalculator() {
  const { profile, setProfile } = useProfile();
  const { units } = useUnits();
  const imperial = units === "imperial";
  const unitLabel = imperial ? "lb" : "kg";
  const { sex, weightKg } = profile;

  const [lift, setLift] = useState<Lift>("squat");
  const [oneRm, setOneRm] = useState<number | null>(null);

  const { entry, dismiss } = useHandoffParam("oneRepMaxKg");
  const seeded = useRef(false);
  useEffect(() => {
    if (entry && !seeded.current) {
      seeded.current = true;
      setOneRm(roundTo(entry.value, 1));
    }
  }, [entry]);

  const weightError = validateField("weightKg", weightKg);
  const oneRmError = oneRm != null && oneRm <= 0 ? "Your 1RM must be greater than zero." : null;

  const valid =
    sex != null && weightKg != null && !weightError && oneRm != null && !oneRmError;
  const result = valid ? strengthLevel(sex, lift, weightKg, oneRm) : null;

  // Progress from the current level's threshold toward the next one.
  let progressPct = 100;
  let nextText = "You've reached the top of the table.";
  if (result && sex != null) {
    const thresholds = STRENGTH_STANDARDS[sex][lift];
    if (result.next) {
      const lower = result.levelIndex === -1 ? 0 : thresholds[result.levelIndex];
      const span = result.next.ratio - lower;
      const frac = span > 0 ? (result.ratio - lower) / span : 0;
      progressPct = Math.min(100, Math.max(0, frac * 100));
      const step = imperial ? 5 : 2.5;
      const deltaDisplay = imperial ? kgToLb(result.next.weightNeeded) : result.next.weightNeeded;
      const needed = Math.max(roundToStep(deltaDisplay, step), step);
      nextText = `${fmt(needed, 2)} ${unitLabel} to ${result.next.label}`;
    }
  }

  return (
    <div className="space-y-6">
      {entry && (
        <HandoffChip
          text={`Using 1RM ${fmt(imperial ? kgToLb(entry.value) : entry.value, 1)} ${unitLabel} from the ${entry.from} calculator.`}
          onDismiss={dismiss}
        />
      )}

      <SegmentedControl<Lift> label="Lift" value={lift} onChange={setLift} options={LIFT_OPTIONS} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="standards-bodyweight"
          label="Bodyweight"
          value={weightKg}
          onChange={(v) => setProfile({ weightKg: v })}
          kind="weightKg"
          placeholder="80"
          error={weightError}
        />
        <NumberField
          id="standards-onerm"
          label="Best 1RM"
          value={oneRm}
          onChange={setOneRm}
          kind="weightKg"
          placeholder="100"
          error={oneRmError}
          hint="Don't know it? Estimate it with the One-Rep Max calculator."
        />
      </div>

      {sex == null ? (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Pick a sex in the profile bar above — strength standards differ for men and women.
        </p>
      ) : result ? (
        <ResultCard
          value={result.levelLabel}
          label={`${fmt(result.ratio, 2)}× BW`}
          labelColor="#0D0D0D"
          interpretation={INTERPRETATIONS[result.levelLabel]}
          note="Standards are bodyweight multiples — heavier lifters need more absolute weight for the same level."
        >
          <div>
            <div className="h-3 bg-[#E5E5E5]" aria-hidden="true">
              <div
                className="h-full bg-[#CC1A1A] transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[#6B6B6B]">{nextText}</p>
          </div>
        </ResultCard>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Enter your bodyweight and best one-rep max above — your level appears instantly.
        </p>
      )}

      {sex != null && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="text-left text-xs text-[#6B6B6B] mb-3">
              Approximate community standards — bodyweight multiples.
            </caption>
            <thead>
              <tr className="border-b-2 border-[#0D0D0D]">
                <th
                  scope="col"
                  className="text-left py-2.5 px-3 font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D]"
                  style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                >
                  Lift
                </th>
                {STRENGTH_LEVEL_LABELS.map((level) => (
                  <th
                    key={level}
                    scope="col"
                    className="text-right py-2.5 px-3 font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    {level}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIFT_OPTIONS.map((o) => {
                const selected = o.value === lift;
                return (
                  <tr
                    key={o.value}
                    className={`border-b border-[#E5E5E5] ${selected ? "bg-[#F5F4F2]" : ""}`}
                  >
                    <th
                      scope="row"
                      className={`text-left py-2.5 px-3 text-xs uppercase tracking-[0.08em] ${
                        selected
                          ? "font-bold text-[#CC1A1A] border-l-4 border-l-[#CC1A1A]"
                          : "font-semibold text-[#0D0D0D]"
                      }`}
                      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                    >
                      {o.label}
                      {selected && <span className="sr-only"> (selected lift)</span>}
                    </th>
                    {STRENGTH_STANDARDS[sex][o.value].map((threshold, i) => (
                      <td
                        key={STRENGTH_LEVEL_LABELS[i]}
                        className={`text-right py-2.5 px-3 tabular-nums ${
                          selected ? "font-semibold text-[#0D0D0D]" : "text-[#6B6B6B]"
                        }`}
                      >
                        {threshold.toFixed(2)}× BW
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
