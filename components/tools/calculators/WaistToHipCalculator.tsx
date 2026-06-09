"use client";

import { useState } from "react";
import { useProfile } from "@/components/providers/ToolsProvider";
import { waistToHip } from "@/lib/fitness/formulas";
import { bandFor, WHR_BANDS, WHR_SCALE } from "@/lib/fitness/ratings";
import { fmt } from "@/lib/fitness/units";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import ScaleBar from "../atoms/ScaleBar";

const INTERPRETATIONS: Record<string, string> = {
  "Low risk":
    "Your fat distribution sits in the WHO low-risk range — weight around the hips carries less metabolic risk than weight around the waist.",
  "Moderate risk":
    "You're in the WHO moderate-risk range — fat stored around the waist is the kind most linked to heart and metabolic health, so it's worth keeping an eye on.",
  "High risk":
    "You're above the WHO high-risk threshold — abdominal fat is strongly linked to cardiovascular and metabolic disease. A good topic to raise with a health professional.",
};

/** Plausible tape-measure range for waist/hip circumference (cm). */
function validateGirth(label: string, value: number | null): string | null {
  if (value == null) return null;
  if (!Number.isFinite(value)) return `Enter a valid number for ${label.toLowerCase()}.`;
  if (value < 30 || value > 300) return `${label} should be between 30 and 300 cm.`;
  return null;
}

export default function WaistToHipCalculator() {
  const { profile } = useProfile();
  const { sex } = profile;

  const [waistCm, setWaistCm] = useState<number | null>(null);
  const [hipCm, setHipCm] = useState<number | null>(null);

  const waistError = validateGirth("Waist", waistCm);
  const hipError = validateGirth("Hip", hipCm);
  const inputsValid = waistCm != null && hipCm != null && !waistError && !hipError;

  const value = sex != null && inputsValid ? waistToHip(waistCm, hipCm) : null;
  const band = sex != null && value != null ? bandFor(WHR_BANDS[sex], value) : null;

  let hint: string;
  if (sex == null) {
    hint = "Pick your sex in the profile bar above — the WHO risk bands differ for men and women.";
  } else if (inputsValid && value == null) {
    hint = "Waist and hip must both be greater than zero — check your measurements.";
  } else {
    hint = "Enter your waist and hip measurements above — the result appears instantly.";
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="whr-waist"
          label="Waist circumference"
          value={waistCm}
          onChange={setWaistCm}
          kind="lengthCm"
          placeholder="85"
          error={waistError}
          hint="Measure at the narrowest point, just above the navel."
        />
        <NumberField
          id="whr-hip"
          label="Hip circumference"
          value={hipCm}
          onChange={setHipCm}
          kind="lengthCm"
          placeholder="100"
          error={hipError}
          hint="Measure at the widest point around the glutes."
        />
      </div>

      {sex != null && value != null && band ? (
        <ResultCard
          value={fmt(value, 2)}
          label={band.label}
          labelColor={band.color}
          interpretation={INTERPRETATIONS[band.label]}
          note={`Uses WHO ${sex === "male" ? "male" : "female"} thresholds — WHR tracks where you store fat, not how much you carry.`}
        >
          <ScaleBar
            bands={WHR_BANDS[sex]}
            value={value}
            min={WHR_SCALE[sex].min}
            max={WHR_SCALE[sex].max}
            format={(n) => fmt(n, 2)}
          />
        </ResultCard>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">{hint}</p>
      )}
    </div>
  );
}
