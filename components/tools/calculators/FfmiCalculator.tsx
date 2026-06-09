"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useProfile, useUnits } from "@/components/providers/ToolsProvider";
import { ffmi } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import { bandFor, FFMI_BANDS, FFMI_SCALE } from "@/lib/fitness/ratings";
import { fmt, kgToLb, roundTo } from "@/lib/fitness/units";
import HandoffChip from "../atoms/HandoffChip";
import HeightField from "../atoms/HeightField";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import ScaleBar from "../atoms/ScaleBar";
import { useHandoffParam } from "../useHandoffParam";

const INTERPRETATIONS: Record<string, string> = {
  "Below average":
    "You carry less lean mass than typical for your height — consistent training and enough protein will move this number steadily.",
  Average: "Typical muscle mass for your height — a solid base to build from.",
  "Above average":
    "You carry noticeably more lean mass than most people your height — your training is showing.",
  Excellent: "An impressive amount of muscle for your height — the product of serious, consistent work.",
  Superior: "Near the top of what dedicated natural lifters reach — exceptional muscularity for your height.",
  "Rarely achieved naturally":
    "You're at what is essentially the natural ceiling — very few people reach this level without enhancement. It may be worth double-checking your body-fat estimate.",
};

export default function FfmiCalculator() {
  const { profile, setProfile } = useProfile();
  const { units } = useUnits();
  const { sex, heightCm, weightKg } = profile;
  const imperial = units === "imperial";

  const [bodyFatPct, setBodyFatPct] = useState<number | null>(null);

  const { entry, dismiss } = useHandoffParam("bodyFatPct");
  const seeded = useRef(false);
  useEffect(() => {
    if (entry && !seeded.current) {
      seeded.current = true;
      setBodyFatPct(roundTo(entry.value, 1));
    }
  }, [entry]);

  const heightError = validateField("heightCm", heightCm);
  const weightError = validateField("weightKg", weightKg);
  const bodyFatError =
    bodyFatPct != null && (bodyFatPct < 2 || bodyFatPct > 60)
      ? "Body fat should be between 2 and 60%."
      : null;

  const valid =
    heightCm != null &&
    weightKg != null &&
    bodyFatPct != null &&
    !heightError &&
    !weightError &&
    !bodyFatError;

  const result = sex != null && valid ? ffmi(weightKg, heightCm, bodyFatPct) : null;
  const band = sex != null && result != null ? bandFor(FFMI_BANDS[sex], result.normalized) : null;

  return (
    <div className="space-y-6">
      {entry && (
        <HandoffChip
          text={`Using body fat ${fmt(entry.value, 1)}% from the ${entry.from} calculator.`}
          onDismiss={dismiss}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="ffmi-weight"
          label="Weight"
          value={weightKg}
          onChange={(v) => setProfile({ weightKg: v })}
          kind="weightKg"
          placeholder="80"
          error={weightError}
        />
        <HeightField
          id="ffmi-height"
          value={heightCm}
          onChange={(v) => setProfile({ heightCm: v })}
          error={heightError}
        />
        <NumberField
          id="ffmi-body-fat"
          label="Body fat"
          value={bodyFatPct}
          onChange={setBodyFatPct}
          suffix="%"
          placeholder="20"
          error={bodyFatError}
          hint="From a tape estimate, smart scale, or the Body Fat calculator."
        />
      </div>

      {sex == null ? (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          FFMI ratings differ for men and women — pick a sex in the profile bar above to see your
          result.
        </p>
      ) : result != null && band != null ? (
        <ResultCard
          value={fmt(result.normalized, 1)}
          label={band.label}
          labelColor={band.color}
          interpretation={INTERPRETATIONS[band.label]}
          note="Normalized to a 1.80 m reference height so taller and shorter lifters compare fairly."
        >
          <p className="text-sm text-[#0D0D0D] mb-4">
            Fat-free mass:{" "}
            <span className="font-semibold">
              {imperial ? `${fmt(kgToLb(result.ffm), 1)} lb` : `${fmt(result.ffm, 1)} kg`}
            </span>{" "}
            · raw FFMI: <span className="font-semibold">{fmt(result.ffmi, 1)}</span>
          </p>
          <ScaleBar
            bands={FFMI_BANDS[sex]}
            value={result.normalized}
            min={FFMI_SCALE[sex].min}
            max={FFMI_SCALE[sex].max}
          />
        </ResultCard>
      ) : (
        <>
          <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
            Enter your weight, height and body fat % above — the result appears instantly.
          </p>
          {bodyFatPct == null && (
            <p className="text-sm text-[#6B6B6B]">
              Not sure of your body fat?{" "}
              <Link
                href="/tools/body-fat"
                className="text-[#CC1A1A] font-semibold hover:underline underline-offset-4"
              >
                Estimate it with the Body Fat calculator →
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
