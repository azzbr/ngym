"use client";

import { useState } from "react";
import { useProfile } from "@/components/providers/ToolsProvider";
import { proteinRange, type ProteinGoal } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import SelectField from "../atoms/SelectField";

const GOAL_OPTIONS: { value: ProteinGoal; label: string }[] = [
  { value: "sedentary", label: "Mostly sedentary (0.8 g/kg)" },
  { value: "general", label: "General fitness (1.2–1.6)" },
  { value: "muscle", label: "Building muscle (1.6–2.2)" },
  { value: "cutting", label: "Cutting — preserve muscle (2.0–2.7)" },
];

/** ~25 g of protein per palm-sized portion of meat, fish or tofu. */
const GRAMS_PER_PALM = 25;

export default function ProteinCalculator() {
  const { profile, setProfile } = useProfile();
  const { weightKg } = profile;
  const [goal, setGoal] = useState<ProteinGoal>("general");

  const weightError = validateField("weightKg", weightKg);
  const valid = weightKg != null && !weightError;
  const range = valid ? proteinRange(weightKg, goal) : null;

  let headline: string | null = null;
  let interpretation: string | null = null;
  if (range) {
    const minG = Math.round(range.minG);
    const maxG = Math.round(range.maxG);
    headline = minG === maxG ? String(minG) : `${minG} – ${maxG}`;
    const minPortions = Math.round(range.minG / GRAMS_PER_PALM);
    const maxPortions = Math.round(range.maxG / GRAMS_PER_PALM);
    interpretation =
      minPortions === maxPortions
        ? `That's roughly ${minPortions} palm-sized portions of meat, fish or tofu a day.`
        : `That's roughly ${minPortions}–${maxPortions} palm-sized portions of meat, fish or tofu a day.`;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="protein-weight"
          label="Weight"
          value={weightKg}
          onChange={(v) => setProfile({ weightKg: v })}
          kind="weightKg"
          placeholder="80"
          error={weightError}
        />
        <SelectField
          id="protein-goal"
          label="Goal"
          value={goal}
          onChange={(v) => setGoal(v as ProteinGoal)}
          options={GOAL_OPTIONS}
        />
      </div>

      {range && headline && interpretation ? (
        <ResultCard value={headline} unit="g / day" interpretation={interpretation} />
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Enter your weight above and pick a goal — your daily protein range appears instantly.
        </p>
      )}
    </div>
  );
}
