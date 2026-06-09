"use client";

import { useEffect, useRef, useState } from "react";
import { useProfile, useUnits } from "@/components/providers/ToolsProvider";
import { goalTimeline, mifflinStJeor, tdee } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import { fmt, kgToLb, roundTo } from "@/lib/fitness/units";
import HandoffChip from "../atoms/HandoffChip";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import TimelineChart from "../atoms/TimelineChart";
import { useHandoffParam } from "../useHandoffParam";

export default function GoalTimelineCalculator() {
  const { profile, setProfile } = useProfile();
  const { units } = useUnits();
  const { sex, age, heightCm, weightKg, activity } = profile;
  const imperial = units === "imperial";

  const weightError = validateField("weightKg", weightKg);

  // Calculator-specific inputs (canonical metric).
  const [targetKg, setTargetKg] = useState<number | null>(null);
  const [intake, setIntake] = useState<number | null>(null);
  const [tdeeVal, setTdeeVal] = useState<number | null>(null);

  // Prefill daily intake from the calorie-targets handoff.
  const { entry: calorieEntry, dismiss: dismissCalorie } = useHandoffParam("calorieTarget");
  const intakeSeeded = useRef(false);
  useEffect(() => {
    if (calorieEntry && !intakeSeeded.current) {
      intakeSeeded.current = true;
      setIntake(roundTo(calorieEntry.value, 1));
    }
  }, [calorieEntry]);

  // Prefill maintenance from the tdee handoff…
  const { entry: tdeeEntry, dismiss: dismissTdee } = useHandoffParam("tdee");
  const tdeeSeeded = useRef(false);
  useEffect(() => {
    if (tdeeEntry && !tdeeSeeded.current) {
      tdeeSeeded.current = true;
      setTdeeVal(roundTo(tdeeEntry.value, 1));
    }
  }, [tdeeEntry]);

  // …else default it once from a complete + valid profile.
  const tdeeDefaulted = useRef(false);
  useEffect(() => {
    if (tdeeEntry || tdeeSeeded.current || tdeeDefaulted.current) return;
    if (
      sex == null ||
      age == null ||
      heightCm == null ||
      weightKg == null ||
      activity == null ||
      validateField("age", age) ||
      validateField("heightCm", heightCm) ||
      validateField("weightKg", weightKg)
    ) {
      return;
    }
    const bmr = mifflinStJeor(sex, age, weightKg, heightCm);
    const maintenance = bmr != null ? tdee(bmr, activity) : null;
    if (maintenance != null) {
      tdeeDefaulted.current = true;
      setTdeeVal(Math.round(maintenance));
    }
  }, [tdeeEntry, sex, age, heightCm, weightKg, activity]);

  const targetError = validateField("weightKg", targetKg);
  const intakeError = intake != null && intake <= 0 ? "Daily intake must be greater than zero." : null;
  const tdeeError = tdeeVal != null && tdeeVal <= 0 ? "Maintenance calories must be greater than zero." : null;

  const valid =
    weightKg != null &&
    !weightError &&
    targetKg != null &&
    !targetError &&
    intake != null &&
    !intakeError &&
    tdeeVal != null &&
    !tdeeError;

  const dailyDelta = valid ? intake - tdeeVal : null;
  const result = valid && dailyDelta != null ? goalTimeline(weightKg, targetKg, dailyDelta) : null;

  const weightUnit = imperial ? "lb" : "kg";
  const rateStr =
    result != null
      ? `${fmt(imperial ? kgToLb(Math.abs(result.weeklyKg)) : Math.abs(result.weeklyKg), 2)} ${weightUnit}`
      : "";
  const dateStr =
    result != null && result.weeks != null && result.weeks > 0
      ? new Date(Date.now() + result.weeks * 7 * 86400000).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

  return (
    <div className="space-y-6">
      {calorieEntry && (
        <HandoffChip
          text={`Using ${fmt(calorieEntry.value, 1)} kcal from the ${calorieEntry.from} calculator.`}
          onDismiss={dismissCalorie}
        />
      )}
      {tdeeEntry && (
        <HandoffChip
          text={`Using maintenance ${fmt(tdeeEntry.value, 1)} kcal from the ${tdeeEntry.from} calculator.`}
          onDismiss={dismissTdee}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="goal-current-weight"
          label="Current weight"
          value={weightKg}
          onChange={(v) => setProfile({ weightKg: v })}
          kind="weightKg"
          placeholder="80"
          error={weightError}
        />
        <NumberField
          id="goal-target-weight"
          label="Target weight"
          value={targetKg}
          onChange={setTargetKg}
          kind="weightKg"
          placeholder="75"
          error={targetError}
        />
        <NumberField
          id="goal-intake"
          label="Daily calorie intake"
          value={intake}
          onChange={setIntake}
          suffix="kcal"
          placeholder="2200"
          error={intakeError}
          hint="What you plan to eat each day."
        />
        <NumberField
          id="goal-tdee"
          label="Maintenance (TDEE)"
          value={tdeeVal}
          onChange={setTdeeVal}
          suffix="kcal"
          placeholder="2500"
          error={tdeeError}
          hint="Calories that hold your weight steady — auto-filled when your profile is complete."
        />
      </div>

      {result == null ? (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Enter your current weight, target weight and daily calories above — the projection appears
          instantly.
        </p>
      ) : result.mismatch ? (
        <p className="text-sm text-[#0D0D0D] bg-[#F5F4F2] border border-[#E5E5E5] border-l-4 border-l-[#CC1A1A] px-4 py-3">
          Your calories move you AWAY from this target — you&apos;re in a surplus but want to lose (or
          vice-versa).
        </p>
      ) : result.weeks == null ? (
        <p className="text-sm text-[#0D0D0D] bg-[#F5F4F2] border border-[#E5E5E5] border-l-4 border-l-[#CC1A1A] px-4 py-3">
          At maintenance calories your weight won&apos;t move — add a deficit or surplus.
        </p>
      ) : result.weeks === 0 ? (
        <p className="text-sm text-[#0D0D0D] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          You&apos;re already at your target.
        </p>
      ) : (
        <>
          {result.ratePctPerWeek > 1 && result.weeklyKg < 0 && (
            <p className="text-sm text-[#0D0D0D] bg-[#F5F4F2] border border-[#E5E5E5] border-l-4 border-l-[#CC1A1A] px-4 py-3">
              Faster isn&apos;t better — losing over 1% of bodyweight a week risks muscle. Consider a
              smaller deficit.
            </p>
          )}
          <ResultCard
            value={String(Math.ceil(result.weeks))}
            unit="weeks"
            interpretation={`≈ ${rateStr} per week — projected to reach your target around ${dateStr}.`}
            note={`Daily ${dailyDelta != null && dailyDelta < 0 ? "deficit" : "surplus"} of ${Math.abs(
              Math.round(dailyDelta ?? 0),
            )} kcal · straight-line estimate using 7,700 kcal ≈ 1 kg.`}
          >
            <TimelineChart points={result.points} targetKg={targetKg as number} />
          </ResultCard>
        </>
      )}
    </div>
  );
}
