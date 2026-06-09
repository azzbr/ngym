"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useProfile, useTools } from "@/components/providers/ToolsProvider";
import { maxHeartRate, vo2Cooper, vo2Resting, vo2Rockport } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import { bandFor, vo2Bands, VO2_SCALE } from "@/lib/fitness/ratings";
import type { MaxHrFormula } from "@/lib/fitness/types";
import { fmt } from "@/lib/fitness/units";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import ScaleBar from "../atoms/ScaleBar";
import SegmentedControl from "../atoms/SegmentedControl";

type Method = "resting" | "rockport" | "cooper";

const METHOD_OPTIONS: { value: Method; label: string }[] = [
  { value: "resting", label: "Resting HR" },
  { value: "rockport", label: "Rockport walk" },
  { value: "cooper", label: "Cooper run" },
];

/** Every method is a field estimate — say so up front, per tab. */
const METHOD_BLURBS: Record<Method, string> = {
  resting: "Quick estimate from your resting heart rate — the roughest of the three methods.",
  rockport: "Estimate from a timed 1-mile walk test — the best option for beginners.",
  cooper: "Estimate from a 12-minute all-out run — best suited to regular runners.",
};

const FORMULA_LABELS: Record<MaxHrFormula, string> = {
  classic: "Classic (220 − age)",
  tanaka: "Tanaka (208 − 0.7 × age)",
  gulati: "Gulati (206 − 0.88 × age)",
};

const INTERPRETATIONS: Record<string, string> = {
  Poor: "Your aerobic base has the most room to grow — consistent easy cardio improves this fastest.",
  Fair: "You're a little below the typical range for your group — steady zone-2 work will lift this quickly.",
  Good: "Solid aerobic fitness — you sit comfortably in the healthy range for your group.",
  Excellent: "A strong aerobic engine — well above the average for your age and sex.",
  Superior: "Endurance-athlete territory — among the fittest people in your age group.",
};

const rangeError = (value: number | null, min: number, max: number, msg: string): string | null =>
  value == null || (value >= min && value <= max) ? null : msg;

function TestProtocol({ steps, footnote }: { steps: string[]; footnote?: string }) {
  return (
    <details className="group border border-[#E5E5E5] bg-white">
      <summary
        className="flex items-center justify-between gap-3 px-5 py-4 select-none cursor-pointer font-montserrat font-bold text-xs uppercase tracking-[0.12em] text-[#0D0D0D]"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        Test protocol
        <ChevronDown
          size={16}
          className="text-[#CC1A1A] transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="px-5 pb-5 border-t border-[#E5E5E5] pt-4">
        <ol className="list-decimal pl-5 space-y-2 text-sm text-[#0D0D0D] leading-relaxed">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {footnote && <p className="mt-3 text-xs font-semibold text-[#0D0D0D]">{footnote}</p>}
      </div>
    </details>
  );
}

export default function Vo2MaxCalculator() {
  const { profile } = useProfile();
  const { maxHrFormula } = useTools();
  const { sex, age, weightKg } = profile;

  const [method, setMethod] = useState<Method>("resting");
  const [restHr, setRestHr] = useState<number | null>(null);
  const [walkTimeMin, setWalkTimeMin] = useState<number | null>(null);
  const [walkFinishHr, setWalkFinishHr] = useState<number | null>(null);
  const [runDistanceM, setRunDistanceM] = useState<number | null>(null);

  const ageError = validateField("age", age);
  const weightError = validateField("weightKg", weightKg);

  const restHrError = rangeError(restHr, 30, 120, "Resting heart rate should be between 30 and 120 bpm.");
  const walkTimeError = rangeError(walkTimeMin, 5, 60, "Walk time should be between 5 and 60 minutes.");
  const walkHrError = rangeError(walkFinishHr, 60, 220, "Finish heart rate should be between 60 and 220 bpm.");
  const distanceError = rangeError(runDistanceM, 500, 5000, "Distance should be between 500 and 5,000 m.");

  if (sex == null || age == null || ageError) {
    return (
      <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
        Pick your sex and enter your age in the profile bar above — VO₂ max ratings are sex- and
        age-specific.
      </p>
    );
  }

  const maxHr = maxHeartRate(maxHrFormula, age);
  const bands = vo2Bands(sex, age);

  let vo2: number | null = null;
  let hint: string | null = null;
  let guard: string | null = null;

  if (method === "resting") {
    if (restHr == null || restHrError || maxHr == null) {
      hint = "Enter your resting heart rate above — the estimate appears instantly.";
    } else {
      vo2 = vo2Resting(maxHr, restHr);
      if (vo2 == null) hint = "Enter your resting heart rate above — the estimate appears instantly.";
    }
  } else if (method === "rockport") {
    if (weightKg == null || weightError) {
      hint = "Enter a valid weight in the profile bar above — the Rockport formula uses body weight.";
    } else if (walkTimeMin == null || walkFinishHr == null || walkTimeError || walkHrError) {
      hint = "Enter your 1-mile walk time and finish heart rate above — the estimate appears instantly.";
    } else {
      vo2 = vo2Rockport(sex, weightKg, age, walkTimeMin, walkFinishHr);
      if (vo2 == null || vo2 <= 0) {
        vo2 = null;
        guard =
          "These inputs give an estimate below the measurable range — double-check the walk time (in minutes) and your finish heart rate.";
      }
    }
  } else {
    if (runDistanceM == null || distanceError) {
      hint = "Enter the distance you covered in 12 minutes above — the estimate appears instantly.";
    } else {
      vo2 = vo2Cooper(runDistanceM);
      if (vo2 == null || vo2 <= 0) {
        vo2 = null;
        guard =
          "That distance is too short to produce a valid estimate — the Cooper formula needs more than about 505 m.";
      }
    }
  }

  const band = vo2 != null ? bandFor(bands, vo2) : null;

  return (
    <div className="space-y-6">
      <SegmentedControl<Method>
        label="Estimate method"
        value={method}
        onChange={setMethod}
        options={METHOD_OPTIONS}
      />
      <p className="text-sm text-[#6B6B6B]">{METHOD_BLURBS[method]}</p>

      {method === "resting" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              id="vo2-rest-hr"
              label="Resting heart rate"
              value={restHr}
              onChange={setRestHr}
              suffix="bpm"
              placeholder="60"
              hint="Measure first thing in the morning, before getting up."
              error={restHrError}
            />
          </div>
          <p className="text-xs text-[#6B6B6B]">
            Max HR {maxHr != null ? `≈ ${fmt(maxHr, 0)} bpm ` : ""}via {FORMULA_LABELS[maxHrFormula]} —
            change it in the{" "}
            <Link
              href="/tools/heart-rate-zones"
              className="text-[#CC1A1A] font-semibold hover:underline underline-offset-4"
            >
              Heart Rate Zones tool
            </Link>
            .
          </p>
        </>
      )}

      {method === "rockport" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              id="vo2-walk-time"
              label="Walk time"
              value={walkTimeMin}
              onChange={setWalkTimeMin}
              suffix="min"
              placeholder="14.5"
              hint="1-mile walk time, e.g. 14.5"
              error={walkTimeError}
            />
            <NumberField
              id="vo2-walk-hr"
              label="Finish heart rate"
              value={walkFinishHr}
              onChange={setWalkFinishHr}
              suffix="bpm"
              placeholder="120"
              hint="Taken immediately as you finish."
              error={walkHrError}
            />
          </div>
          <TestProtocol
            steps={[
              "Walk exactly 1 mile (1.61 km — about 4 laps of a 400 m track) as fast as you can walk, without jogging.",
              "Record your time in minutes the moment you cross the finish.",
              "Record your heart rate immediately at the finish.",
            ]}
            footnote="Best option for beginners."
          />
        </>
      )}

      {method === "cooper" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              id="vo2-run-distance"
              label="Distance"
              value={runDistanceM}
              onChange={setRunDistanceM}
              suffix="m"
              placeholder="2400"
              hint="Distance covered in 12 minutes"
              error={distanceError}
            />
          </div>
          <TestProtocol
            steps={[
              "Warm up, then run or jog as far as possible in exactly 12 minutes on a track or treadmill.",
              "Hold an even, hard pace you can sustain for the full 12 minutes.",
              "Enter the total distance covered in meters.",
            ]}
          />
        </>
      )}

      {vo2 != null && band ? (
        <ResultCard
          value={fmt(vo2, 1)}
          unit="ml/kg/min"
          label={band.label}
          labelColor={band.color}
          interpretation={INTERPRETATIONS[band.label]}
          note={`Field estimate — not a lab measurement. Rated against ${sex} norms for age ${age}.`}
        >
          <ScaleBar bands={bands} value={vo2} min={VO2_SCALE.min} max={VO2_SCALE.max} />
        </ResultCard>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          {guard ?? hint ?? "Fill in the inputs above — the estimate appears instantly."}
        </p>
      )}
    </div>
  );
}
