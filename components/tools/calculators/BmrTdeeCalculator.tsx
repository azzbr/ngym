"use client";

import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/components/providers/ToolsProvider";
import { katchMcArdle, mifflinStJeor, tdee } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import { ACTIVITY_OPTIONS, type ActivityLevel, type Sex } from "@/lib/fitness/types";
import { fmt, roundTo } from "@/lib/fitness/units";
import { useHandoffParam } from "../useHandoffParam";
import HandoffChip from "../atoms/HandoffChip";
import HeightField from "../atoms/HeightField";
import NextStepButton from "../atoms/NextStepButton";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import SegmentedControl from "../atoms/SegmentedControl";
import SelectField from "../atoms/SelectField";

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function BmrTdeeCalculator() {
  const { profile, setProfile } = useProfile();
  const { sex, age, heightCm, weightKg, activity } = profile;

  const [bodyFatPct, setBodyFatPct] = useState<number | null>(null);

  // Prefill body fat % when arriving via "Use this result" from the body-fat calculator.
  const { entry, dismiss } = useHandoffParam("bodyFatPct");
  const seeded = useRef(false);
  useEffect(() => {
    if (entry && !seeded.current) {
      seeded.current = true;
      setBodyFatPct(roundTo(entry.value, 1));
    }
  }, [entry]);

  const ageError = validateField("age", age);
  const heightError = validateField("heightCm", heightCm);
  const weightError = validateField("weightKg", weightKg);
  const bodyFatError =
    bodyFatPct != null && (bodyFatPct < 2 || bodyFatPct > 60)
      ? "Body fat should be between 2 and 60% — leave it blank to use Mifflin-St Jeor."
      : null;

  const missing: string[] = [];
  if (sex == null) missing.push("sex");
  if (age == null) missing.push("age");
  if (heightCm == null) missing.push("height");
  if (weightKg == null) missing.push("weight");
  if (activity == null) missing.push("activity level");

  const profileValid =
    missing.length === 0 && !ageError && !heightError && !weightError;

  const bmrMifflin =
    profileValid && sex != null && age != null && heightCm != null && weightKg != null
      ? mifflinStJeor(sex, age, weightKg, heightCm)
      : null;
  const bmrKatch =
    profileValid && weightKg != null && bodyFatPct != null && !bodyFatError
      ? katchMcArdle(weightKg, bodyFatPct)
      : null;
  const activeBmr = bmrKatch ?? bmrMifflin;
  const tdeeVal = activeBmr != null && activity != null ? tdee(activeBmr, activity) : null;

  return (
    <div className="space-y-6">
      {entry && (
        <HandoffChip
          text={`Using body fat ${fmt(entry.value, 1)}% from the ${entry.from} calculator.`}
          onDismiss={dismiss}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SegmentedControl<Sex>
          label="Sex"
          value={sex}
          onChange={(v) => setProfile({ sex: v })}
          options={SEX_OPTIONS}
        />
        <NumberField
          id="bmrtdee-age"
          label="Age"
          value={age}
          onChange={(v) => setProfile({ age: v })}
          suffix="yrs"
          placeholder="30"
          error={ageError}
        />
        <HeightField
          id="bmrtdee-height"
          value={heightCm}
          onChange={(v) => setProfile({ heightCm: v })}
          error={heightError}
        />
        <NumberField
          id="bmrtdee-weight"
          label="Weight"
          value={weightKg}
          onChange={(v) => setProfile({ weightKg: v })}
          kind="weightKg"
          placeholder="80"
          error={weightError}
        />
        <SelectField
          id="bmrtdee-activity"
          label="Activity level"
          value={activity ?? ""}
          onChange={(v) =>
            setProfile({ activity: v === "" ? null : (v as ActivityLevel) })
          }
          options={[{ value: "", label: "Select activity level" }, ...ACTIVITY_OPTIONS]}
        />
        <NumberField
          id="bmrtdee-bodyfat"
          label="Body fat"
          value={bodyFatPct}
          onChange={setBodyFatPct}
          suffix="%"
          placeholder="20"
          hint="Optional — enables the Katch-McArdle equation"
          error={bodyFatError}
        />
      </div>

      {activeBmr != null && tdeeVal != null ? (
        <>
          {bmrKatch != null && bmrMifflin != null && (
            <p className="text-sm text-[#0D0D0D]">
              Using Katch-McArdle (body fat known) — Mifflin-St Jeor estimate:{" "}
              {Math.round(bmrMifflin)} kcal
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              value={String(Math.round(activeBmr))}
              unit="kcal"
              label="BMR"
              interpretation="What your body burns at complete rest."
            />
            <ResultCard
              value={String(Math.round(tdeeVal))}
              unit="kcal/day"
              label="TDEE"
              interpretation="Your estimated full-day burn at your activity level."
            />
          </div>
          <NextStepButton
            label="Set cut / bulk targets"
            toSlug="calorie-targets"
            currentSlug="bmr-tdee"
            handoff={{ bmr: Math.round(activeBmr), tdee: Math.round(tdeeVal) }}
          />
        </>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          {missing.length > 0
            ? `Enter your ${missing.join(", ")} above — your BMR and TDEE appear instantly.`
            : "Fix the highlighted fields above to see your BMR and TDEE."}
        </p>
      )}
    </div>
  );
}
