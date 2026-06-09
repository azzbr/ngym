"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProfile, useUnits } from "@/components/providers/ToolsProvider";
import {
  calorieFloor,
  calorieTarget,
  mifflinStJeor,
  tdee,
  weeklyChangeKg,
} from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import type { GoalPreset } from "@/lib/fitness/types";
import { fmt, kgToLb, roundTo } from "@/lib/fitness/units";
import HandoffChip from "../atoms/HandoffChip";
import NextStepButton from "../atoms/NextStepButton";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import SegmentedControl from "../atoms/SegmentedControl";
import { useHandoffParam } from "../useHandoffParam";

const PRESETS: { id: GoalPreset; name: string; pct: number }[] = [
  { id: "aggressive_cut", name: "Aggressive cut", pct: -0.25 },
  { id: "standard_cut", name: "Standard cut", pct: -0.2 },
  { id: "slow_cut", name: "Slow cut", pct: -0.1 },
  { id: "maintain", name: "Maintain", pct: 0 },
  { id: "lean_bulk", name: "Lean bulk", pct: 0.1 },
  { id: "fast_bulk", name: "Fast bulk", pct: 0.2 },
];

const INTERPRETATIONS: Record<GoalPreset, string> = {
  aggressive_cut:
    "A steep 25% deficit — fast results, but hard to sustain. Best for short, focused blocks.",
  standard_cut:
    "A 20% deficit — the sweet spot between steady fat loss and a diet you can actually stick to.",
  slow_cut:
    "A gentle 10% deficit — slower on the scale, easier on adherence and muscle retention.",
  maintain:
    "Eating at maintenance — your weight holds steady while you focus on training and recovery.",
  lean_bulk: "A 10% surplus — steady muscle gain while keeping fat gain minimal.",
  fast_bulk: "A 20% surplus — faster scale weight, but expect more fat alongside the muscle.",
};

function pctLabel(pct: number): string {
  if (pct === 0) return "±0%";
  const v = Math.round(Math.abs(pct) * 100);
  return pct > 0 ? `+${v}%` : `−${v}%`;
}

export default function CalorieTargetsCalculator() {
  const { profile, hydrated } = useProfile();
  const { units } = useUnits();
  const imperial = units === "imperial";
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");

  const [tdeeKcal, setTdeeKcal] = useState<number | null>(null);
  const [preset, setPreset] = useState<GoalPreset>("standard_cut");

  // Prefill from the BMR & TDEE calculator handoff (consent-gated by ?from=).
  const { entry, dismiss } = useHandoffParam("tdee");
  const seeded = useRef(false);
  useEffect(() => {
    if (entry && !seeded.current) {
      seeded.current = true;
      setTdeeKcal(roundTo(entry.value, 0));
    }
  }, [entry]);

  // No handoff: default once from a complete, valid profile.
  useEffect(() => {
    if (seeded.current || fromParam || !hydrated) return;
    const { sex, age, heightCm, weightKg, activity } = profile;
    if (sex == null || age == null || heightCm == null || weightKg == null || activity == null)
      return;
    if (
      validateField("age", age) ||
      validateField("heightCm", heightCm) ||
      validateField("weightKg", weightKg)
    )
      return;
    const bmr = mifflinStJeor(sex, age, weightKg, heightCm);
    const maintenance = bmr != null ? tdee(bmr, activity) : null;
    if (maintenance == null) return;
    seeded.current = true;
    setTdeeKcal(Math.round(maintenance));
  }, [hydrated, fromParam, profile]);

  const sex = profile.sex;
  const floor = sex != null ? calorieFloor(sex) : 1200;

  const tdeeError =
    tdeeKcal != null && (tdeeKcal < 800 || tdeeKcal > 10000)
      ? "TDEE should be between 800 and 10,000 kcal."
      : null;
  const tdeeVal = tdeeKcal != null && !tdeeError ? tdeeKcal : null;

  const rows =
    tdeeVal == null
      ? null
      : PRESETS.map((p) => {
          // calorieTarget only guards tdee <= 0, impossible here — fallback keeps TS strict happy.
          const raw = Math.round(calorieTarget(tdeeVal, p.pct) ?? tdeeVal);
          const clamped = raw < floor;
          const calories = clamped ? floor : raw;
          return { ...p, calories, clamped, weeklyKg: weeklyChangeKg(calories - tdeeVal) };
        });

  const selected = rows?.find((r) => r.id === preset) ?? null;
  const anyClamped = rows?.some((r) => r.clamped) ?? false;

  const unitLabel = imperial ? "lb" : "kg";
  const weeklyText = (kg: number): string => {
    const v = roundTo(imperial ? kgToLb(kg) : kg, 2);
    if (v === 0) return "0";
    return `${v > 0 ? "+" : "−"}${fmt(Math.abs(v), 2)} ${unitLabel}/week`;
  };

  return (
    <div className="space-y-6">
      {entry && (
        <HandoffChip
          text={`Using TDEE ${fmt(entry.value, 0)} kcal from the ${entry.from} calculator.`}
          onDismiss={dismiss}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="ct-tdee"
          label="Maintenance Calories (TDEE)"
          value={tdeeKcal}
          onChange={(v) => {
            seeded.current = true;
            setTdeeKcal(v);
          }}
          suffix="kcal"
          placeholder="2400"
          error={tdeeError}
          hint="Your total daily energy expenditure."
        />
      </div>

      <SegmentedControl<GoalPreset>
        label="Goal Preset"
        value={preset}
        onChange={setPreset}
        options={PRESETS.map((p) => ({ value: p.id, label: p.name }))}
      />

      {rows && selected && tdeeVal != null ? (
        <>
          <ResultCard
            value={selected.calories.toLocaleString("en-US")}
            unit="kcal/day"
            label={selected.name}
            interpretation={INTERPRETATIONS[selected.id]}
            note={
              selected.clamped
                ? `Raised to the ${floor.toLocaleString("en-US")} kcal safety floor.`
                : undefined
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white border border-[#E5E5E5] text-sm">
              <caption className="sr-only">
                Daily calorie targets and expected weekly weight change for each preset
              </caption>
              <thead>
                <tr className="border-b-2 border-[#0D0D0D]">
                  <th
                    scope="col"
                    className="text-left px-4 py-3 font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Plan
                  </th>
                  <th
                    scope="col"
                    className="text-right px-4 py-3 font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Daily Calories
                  </th>
                  <th
                    scope="col"
                    className="text-right px-4 py-3 font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Weekly Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const active = r.id === preset;
                  return (
                    <tr
                      key={r.id}
                      className={`border-t border-[#E5E5E5] ${active ? "bg-[#F5F4F2]" : ""}`}
                    >
                      <th
                        scope="row"
                        className={`text-left px-4 py-3 font-semibold text-[#0D0D0D] border-l-4 ${
                          active ? "border-l-[#CC1A1A]" : "border-l-transparent"
                        }`}
                      >
                        {r.name}
                        <span className="ml-2 font-normal text-xs text-[#6B6B6B]">
                          {pctLabel(r.pct)}
                        </span>
                        {active && <span className="sr-only"> (selected)</span>}
                      </th>
                      <td className="text-right px-4 py-3 tabular-nums whitespace-nowrap text-[#0D0D0D]">
                        {r.calories.toLocaleString("en-US")} kcal
                        {r.clamped && (
                          <span className="ml-2 text-xs font-semibold text-[#CC1A1A]">
                            raised to floor
                          </span>
                        )}
                      </td>
                      <td className="text-right px-4 py-3 tabular-nums whitespace-nowrap text-[#0D0D0D]">
                        {weeklyText(r.weeklyKg)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {anyClamped && (
            <p className="text-xs text-[#0D0D0D] bg-[#F5F4F2] border border-[#E5E5E5] border-l-4 border-l-[#CC1A1A] px-4 py-3">
              Some targets were raised to the safe minimum (1,500 kcal men / 1,200 kcal women).
              Consult a professional before eating this low.
            </p>
          )}

          {sex == null && (
            <p className="text-xs text-[#6B6B6B]">
              No sex set in the profile bar above — applying the stricter 1,200 kcal safety floor.
              Pick a sex to use the right floor (1,500 kcal for men).
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <NextStepButton
              label="Build macros from this target"
              currentSlug="calorie-targets"
              toSlug="macros"
              handoff={{ calorieTarget: selected.calories, tdee: tdeeVal }}
            />
            <NextStepButton
              label="Project my timeline"
              currentSlug="calorie-targets"
              toSlug="goal-timeline"
              handoff={{ calorieTarget: selected.calories, tdee: tdeeVal }}
            />
          </div>
        </>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Enter your maintenance calories above — every preset updates instantly. Not sure of your
          TDEE?{" "}
          <Link
            href="/tools/bmr-tdee"
            className="text-[#CC1A1A] font-semibold hover:underline underline-offset-4"
          >
            Calculate it with the BMR &amp; TDEE calculator →
          </Link>
        </p>
      )}
    </div>
  );
}
