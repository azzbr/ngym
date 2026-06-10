"use client";

import Link from "next/link";
import { useProfile } from "@/components/providers/ToolsProvider";
import { bmi } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import { bandFor, BMI_BANDS, BMI_SCALE } from "@/lib/fitness/ratings";
import { fmt } from "@/lib/fitness/units";
import HeightField from "../atoms/HeightField";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import SaveResultButton from "../atoms/SaveResultButton";
import ScaleBar from "../atoms/ScaleBar";

const INTERPRETATIONS: Record<string, string> = {
  Underweight: "You're below the WHO healthy range — building habits around eating enough matters as much as training.",
  Normal: "You're inside the WHO healthy range for your height.",
  Overweight: "You're above the WHO healthy range — but BMI alone can't tell muscle from fat.",
  Obese: "You're well above the WHO healthy range — small consistent changes beat drastic ones.",
};

export default function BmiCalculator() {
  const { profile, setProfile } = useProfile();
  const { heightCm, weightKg } = profile;

  const heightError = validateField("heightCm", heightCm);
  const weightError = validateField("weightKg", weightKg);
  const valid = heightCm != null && weightKg != null && !heightError && !weightError;
  const value = valid ? bmi(weightKg, heightCm) : null;
  const band = value != null ? bandFor(BMI_BANDS, value) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HeightField
          id="bmi-height"
          value={heightCm}
          onChange={(v) => setProfile({ heightCm: v })}
          error={heightError}
        />
        <NumberField
          id="bmi-weight"
          label="Weight"
          value={weightKg}
          onChange={(v) => setProfile({ weightKg: v })}
          kind="weightKg"
          placeholder="80"
          error={weightError}
        />
      </div>

      {value != null && band ? (
        <>
          <ResultCard
            value={fmt(value, 1)}
            label={band.label}
            labelColor={band.color}
            interpretation={INTERPRETATIONS[band.label]}
            note="BMI can misclassify muscular people — it measures weight, not body composition."
            action={<SaveResultButton kind="bmi" value={value} />}
          >
            <ScaleBar bands={BMI_BANDS} value={value} min={BMI_SCALE.min} max={BMI_SCALE.max} />
          </ResultCard>
          <p className="text-sm text-[#6B6B6B]">
            Carrying muscle?{" "}
            <Link href="/tools/body-fat" className="text-[#CC1A1A] font-semibold hover:underline underline-offset-4">
              Get a more accurate picture with the Body Fat calculator →
            </Link>
          </p>
        </>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Enter your height and weight above — the result appears instantly.
        </p>
      )}
    </div>
  );
}
