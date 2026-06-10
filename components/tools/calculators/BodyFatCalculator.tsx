"use client";

import { useState } from "react";
import { useProfile } from "@/components/providers/ToolsProvider";
import { navyBodyFat } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import { bandFor, BODY_FAT_BANDS, BODY_FAT_SCALE } from "@/lib/fitness/ratings";
import { fmt } from "@/lib/fitness/units";
import HeightField from "../atoms/HeightField";
import NextStepButton from "../atoms/NextStepButton";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import SaveResultButton from "../atoms/SaveResultButton";
import ScaleBar from "../atoms/ScaleBar";

const INTERPRETATIONS: Record<string, string> = {
  "Essential fat":
    "You're at the minimum fat the body needs to function — this level isn't sustainable long-term, even for competitors.",
  Athletes:
    "You're in the range typical of competitive athletes — very lean, with visible muscle definition.",
  Fitness:
    "You're leaner than average — the range associated with a consistently fit, active lifestyle.",
  Average:
    "You're in the typical range for the general population — steady training and nutrition can move this where you want it.",
  Obese:
    "You're above the ACE healthy range — pairing regular training with a modest calorie deficit is the proven way down.",
};

export default function BodyFatCalculator() {
  const { profile, setProfile } = useProfile();
  const { sex, heightCm } = profile;

  const [neckCm, setNeckCm] = useState<number | null>(null);
  const [waistCm, setWaistCm] = useState<number | null>(null);
  const [hipCm, setHipCm] = useState<number | null>(null);

  const heightError = validateField("heightCm", heightCm);

  if (sex == null) {
    return (
      <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
        Select your sex in the profile bar above — the US Navy method uses different equations for
        men and women.
      </p>
    );
  }

  const female = sex === "female";
  const complete =
    heightCm != null &&
    !heightError &&
    neckCm != null &&
    neckCm > 0 &&
    waistCm != null &&
    waistCm > 0 &&
    (!female || (hipCm != null && hipCm > 0));

  const value = complete
    ? navyBodyFat({ sex, heightCm, neckCm, waistCm, hipCm: female ? hipCm : null })
    : null;
  const band = value != null ? bandFor(BODY_FAT_BANDS[sex], value) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HeightField
          id="bf-height"
          value={heightCm}
          onChange={(v) => setProfile({ heightCm: v })}
          error={heightError}
        />
        <NumberField
          id="bf-neck"
          label="Neck"
          value={neckCm}
          onChange={setNeckCm}
          kind="lengthCm"
          placeholder={female ? "33" : "38"}
          hint="Measure just below the Adam's apple."
        />
        <NumberField
          id="bf-waist"
          label="Waist"
          value={waistCm}
          onChange={setWaistCm}
          kind="lengthCm"
          placeholder={female ? "75" : "85"}
          hint={female ? "Measure at the narrowest point." : "Measure at navel level."}
        />
        {female && (
          <NumberField
            id="bf-hip"
            label="Hip"
            value={hipCm}
            onChange={setHipCm}
            kind="lengthCm"
            placeholder="95"
            hint="Measure at the widest point."
          />
        )}
      </div>

      {value != null && band ? (
        <>
          <ResultCard
            value={fmt(value, 1)}
            unit="%"
            label={band.label}
            labelColor={band.color}
            interpretation={INTERPRETATIONS[band.label]}
            note={`Uses the ${female ? "female" : "male"} US Navy equation — a tape-measure estimate, typically within a few percent of lab methods.`}
            action={<SaveResultButton kind="bodyFat" value={value} />}
          >
            <ScaleBar
              bands={BODY_FAT_BANDS[sex]}
              value={value}
              min={BODY_FAT_SCALE[sex].min}
              max={BODY_FAT_SCALE[sex].max}
            />
          </ResultCard>
          <div className="flex flex-wrap gap-3">
            <NextStepButton
              label="Use in FFMI"
              toSlug="ffmi"
              currentSlug="body-fat"
              handoff={{ bodyFatPct: value }}
            />
            <NextStepButton
              label="Use in BMR / TDEE"
              toSlug="bmr-tdee"
              currentSlug="body-fat"
              handoff={{ bodyFatPct: value }}
            />
          </div>
        </>
      ) : complete ? (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          {female
            ? "Waist plus hip must be larger than neck for the female formula — double-check your measurements."
            : "Waist must be larger than neck for the male formula — double-check your measurements."}
        </p>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          {female
            ? "Enter your height, neck, waist and hip measurements above — the result appears instantly."
            : "Enter your height, neck and waist measurements above — the result appears instantly."}
        </p>
      )}
    </div>
  );
}
