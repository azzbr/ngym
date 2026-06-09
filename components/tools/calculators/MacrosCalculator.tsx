"use client";

import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/components/providers/ToolsProvider";
import { macroSplit } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import type { MacroGoal } from "@/lib/fitness/types";
import { fmt, roundTo } from "@/lib/fitness/units";
import HandoffChip from "../atoms/HandoffChip";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import SegmentedControl from "../atoms/SegmentedControl";
import { useHandoffParam } from "../useHandoffParam";

type Preset = "balanced" | "high-protein" | "low-carb";

const GOAL_OPTIONS: { value: MacroGoal; label: string }[] = [
  { value: "cut", label: "Cut" },
  { value: "maintain", label: "Maintain" },
  { value: "bulk", label: "Bulk" },
];

const PRESET_OPTIONS: { value: Preset; label: string }[] = [
  { value: "balanced", label: "Balanced" },
  { value: "high-protein", label: "High protein" },
  { value: "low-carb", label: "Low carb" },
];

const MACRO_COLORS = {
  protein: "#CC1A1A",
  fat: "#2A2A2A",
  carbs: "#9A9A9A",
} as const;

export default function MacrosCalculator() {
  const { profile, setProfile } = useProfile();
  const { weightKg } = profile;

  const [calories, setCalories] = useState<number | null>(null);
  const [goal, setGoal] = useState<MacroGoal>("maintain");
  const [preset, setPreset] = useState<Preset>("balanced");
  const [proteinOverride, setProteinOverride] = useState<number | null>(null);

  const { entry, dismiss } = useHandoffParam("calorieTarget");
  const seeded = useRef(false);
  useEffect(() => {
    if (entry && !seeded.current) {
      seeded.current = true;
      setCalories(roundTo(entry.value, 1));
    }
  }, [entry]);

  const calorieError =
    calories != null && calories <= 0 ? "Calorie target must be above zero." : null;
  const weightError = validateField("weightKg", weightKg);
  const proteinError =
    proteinOverride != null && (proteinOverride < 1.6 || proteinOverride > 2.7)
      ? "Protein should be between 1.6 and 2.7 g/kg."
      : null;

  const goalProtein = goal === "cut" ? 2.2 : 1.8;
  const derivedProtein =
    preset === "high-protein" ? Math.min(goalProtein + 0.5, 2.7) : goalProtein;
  const proteinGPerKg = proteinOverride ?? derivedProtein;
  const fatPct = preset === "low-carb" ? 0.35 : 0.25;

  const valid =
    calories != null && weightKg != null && !calorieError && !weightError && !proteinError;
  const result = valid ? macroSplit(calories, weightKg, proteinGPerKg, fatPct) : null;

  const rows = result
    ? ([
        { key: "protein", name: "Protein", color: MACRO_COLORS.protein, ...result.protein },
        { key: "fat", name: "Fat", color: MACRO_COLORS.fat, ...result.fat },
        { key: "carbs", name: "Carbs", color: MACRO_COLORS.carbs, ...result.carbs },
      ] as const)
    : null;

  return (
    <div className="space-y-6">
      {entry && (
        <HandoffChip
          text={`Using ${fmt(entry.value, 0)} kcal from the ${entry.from} calculator.`}
          onDismiss={dismiss}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="macros-calories"
          label="Daily calorie target"
          value={calories}
          onChange={setCalories}
          suffix="kcal"
          placeholder="2200"
          error={calorieError}
        />
        <NumberField
          id="macros-weight"
          label="Weight"
          value={weightKg}
          onChange={(v) => setProfile({ weightKg: v })}
          kind="weightKg"
          placeholder="80"
          error={weightError}
        />
        <SegmentedControl<MacroGoal>
          label="Goal"
          value={goal}
          onChange={setGoal}
          options={GOAL_OPTIONS}
        />
        <SegmentedControl<Preset>
          label="Preset"
          value={preset}
          onChange={setPreset}
          options={PRESET_OPTIONS}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="macros-protein-override"
          label="Advanced: protein g/kg"
          value={proteinOverride}
          onChange={setProteinOverride}
          suffix="g/kg"
          placeholder={fmt(derivedProtein, 1)}
          error={proteinError}
          hint={`Leave blank to use ${fmt(derivedProtein, 1)} g/kg from your goal and preset.`}
        />
      </div>

      {result && rows ? (
        <ResultCard
          value={fmt(calories!, 0)}
          unit="kcal"
          interpretation={`${Math.round(result.protein.g)} g protein · ${Math.round(result.fat.g)} g fat · ${Math.round(result.carbs.g)} g carbs per day.`}
          note="Protein 4 · carbs 4 · fat 9 kcal per gram. Fat floor: 0.5 g/kg."
        >
          <div className="space-y-6">
            <div>
              <div aria-hidden="true" className="flex h-4 w-full overflow-hidden">
                {rows.map((r) => (
                  <div
                    key={r.key}
                    style={{ width: `${r.pct}%`, backgroundColor: r.color }}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {rows.map((r) => (
                  <span key={r.key} className="flex items-center gap-1.5 text-xs text-[#0D0D0D]">
                    <span
                      aria-hidden="true"
                      className="inline-block w-3 h-3"
                      style={{ backgroundColor: r.color }}
                    />
                    {r.name} {fmt(r.pct, 0)}%
                  </span>
                ))}
              </div>
            </div>

            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">Daily macro targets in grams, calories and percent</caption>
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  <th
                    scope="col"
                    className="py-2 text-left font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Macro
                  </th>
                  <th
                    scope="col"
                    className="py-2 text-right font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Grams
                  </th>
                  <th
                    scope="col"
                    className="py-2 text-right font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    kcal
                  </th>
                  <th
                    scope="col"
                    className="py-2 text-right font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-b border-[#E5E5E5] last:border-b-0">
                    <th
                      scope="row"
                      className="py-2 text-left font-montserrat font-semibold text-xs uppercase tracking-[0.08em] text-[#0D0D0D]"
                      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                    >
                      {r.name}
                    </th>
                    <td className="py-2 text-right text-[#0D0D0D] font-semibold">
                      {Math.round(r.g)} g
                    </td>
                    <td className="py-2 text-right text-[#6B6B6B]">{Math.round(r.kcal)}</td>
                    <td className="py-2 text-right text-[#6B6B6B]">{fmt(r.pct, 0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ResultCard>
      ) : valid ? (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Protein and fat alone exceed this calorie target — raise calories or lower protein.
        </p>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Enter your daily calorie target and weight above — the split appears instantly.
        </p>
      )}
    </div>
  );
}
