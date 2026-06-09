"use client";

import { useState } from "react";
import { useProfile } from "@/components/providers/ToolsProvider";
import { waterIntake } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import { fmt } from "@/lib/fitness/units";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";

const IOM_REFERENCE = {
  male: { liters: 3.7, label: "men" },
  female: { liters: 2.7, label: "women" },
} as const;

function validateMinutes(value: number | null): string | null {
  if (value == null) return null;
  if (!Number.isFinite(value)) return "Enter a valid number of minutes.";
  if (value < 0 || value > 600) return "Training minutes should be between 0 and 600.";
  return null;
}

export default function WaterCalculator() {
  const { profile, setProfile } = useProfile();
  const { sex, weightKg } = profile;

  const [minutes, setMinutes] = useState<number | null>(null);

  const weightError = validateField("weightKg", weightKg);
  const minutesError = validateMinutes(minutes);
  const valid = weightKg != null && !weightError && !minutesError;
  const liters = valid ? waterIntake(weightKg, minutes ?? 0) : null;

  const glasses = liters != null ? Math.round(liters * 4) : null;

  let note =
    "For reference, IOM total-water values are ~3.7 L/day for men and ~2.7 L/day for women — about 20% of that typically comes from food.";
  if (liters != null && sex != null) {
    const ref = IOM_REFERENCE[sex];
    const diff = liters - ref.liters;
    const comparison =
      Math.abs(diff) < 0.1
        ? `Your result is right around the ~${ref.liters} L/day reference for ${ref.label}.`
        : `Your result is about ${fmt(Math.abs(diff), 1)} L ${diff > 0 ? "above" : "below"} the ~${ref.liters} L/day reference for ${ref.label}.`;
    note = `${note} ${comparison}`;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="water-weight"
          label="Weight"
          value={weightKg}
          onChange={(v) => setProfile({ weightKg: v })}
          kind="weightKg"
          placeholder="80"
          error={weightError}
        />
        <NumberField
          id="water-training-minutes"
          label="Training per day"
          value={minutes}
          onChange={setMinutes}
          suffix="min"
          placeholder="60"
          error={minutesError}
          hint="Leave blank for a rest-day baseline."
        />
      </div>

      {liters != null && glasses != null ? (
        <ResultCard
          value={fmt(liters, 1)}
          unit="L / day"
          interpretation={`≈ ${glasses} glasses (250 ml).`}
          note={note}
        />
      ) : valid ? (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          We couldn't calculate a water target from these numbers — check that your weight and
          training minutes are realistic and try again.
        </p>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Enter your weight above — the result appears instantly. Add your daily training minutes
          to account for sweat loss.
        </p>
      )}
    </div>
  );
}
