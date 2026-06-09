"use client";

import { useState } from "react";
import { useUnits } from "@/components/providers/ToolsProvider";
import { brzycki, epley, PERCENT_TABLE } from "@/lib/fitness/formulas";
import { fmt, kgToLb, roundToStep } from "@/lib/fitness/units";
import NextStepButton from "../atoms/NextStepButton";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";

export default function OneRepMaxCalculator() {
  const { units } = useUnits();
  const imperial = units === "imperial";
  const unitLabel = imperial ? "lb" : "kg";

  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [reps, setReps] = useState<number | null>(null);

  const weightError =
    weightKg != null && weightKg <= 0 ? "Enter a weight above 0." : null;
  const repsError =
    reps != null && (!Number.isInteger(reps) || reps < 1 || reps > 12)
      ? "Enter 1–12 reps."
      : null;
  const repsHint =
    reps != null && !repsError && reps > 10 ? "Accuracy drops above 10 reps." : undefined;

  const valid = weightKg != null && reps != null && !weightError && !repsError;
  const e = valid ? epley(weightKg, reps) : null;
  const b = valid ? brzycki(weightKg, reps) : null;
  const averageKg = e != null && b != null ? (e + b) / 2 : null;

  const toDisplay = (kg: number) => (imperial ? kgToLb(kg) : kg);
  const displayOneRm = averageKg != null ? toDisplay(averageKg) : null;
  const loadStep = imperial ? 5 : 2.5;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="orm-weight"
          label="Weight lifted"
          value={weightKg}
          onChange={setWeightKg}
          kind="weightKg"
          placeholder="100"
          error={weightError}
        />
        <NumberField
          id="orm-reps"
          label="Reps performed"
          value={reps}
          onChange={setReps}
          suffix="reps"
          placeholder="5"
          error={repsError}
          hint={repsHint}
        />
      </div>

      {averageKg != null && displayOneRm != null && e != null && b != null ? (
        <>
          <ResultCard
            value={fmt(displayOneRm, 1)}
            unit={unitLabel}
            label="Estimated 1RM"
            interpretation="The most you could likely lift for a single rep, averaged across two proven formulas."
            note="Estimates are most reliable in the 2–8 rep range — never test a true max without a spotter."
          >
            <p className="text-sm text-[#0D0D0D]">
              <span className="font-semibold">Epley:</span> {fmt(toDisplay(e), 1)} {unitLabel}{" "}
              <span aria-hidden="true" className="text-[#6B6B6B]">
                ·
              </span>{" "}
              <span className="font-semibold">Brzycki:</span> {fmt(toDisplay(b), 1)} {unitLabel}
            </p>
          </ResultCard>

          <div className="bg-white border border-[#E5E5E5] p-6 md:p-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption
                className="caption-top text-left font-bold text-xs uppercase tracking-[0.12em] text-[#0D0D0D] pb-4"
                style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
              >
                % of 1RM training loads
              </caption>
              <thead>
                <tr className="border-b-2 border-[#0D0D0D]">
                  <th
                    scope="col"
                    className="text-left py-2 pr-4 font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    % of 1RM
                  </th>
                  <th
                    scope="col"
                    className="text-left py-2 pr-4 font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Load
                  </th>
                  <th
                    scope="col"
                    className="text-left py-2 font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Approx. reps
                  </th>
                </tr>
              </thead>
              <tbody>
                {PERCENT_TABLE.map((row) => (
                  <tr key={row.pct} className="border-b border-[#E5E5E5] last:border-b-0">
                    <th
                      scope="row"
                      className="text-left py-2.5 pr-4 font-semibold text-[#0D0D0D]"
                      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                    >
                      {row.pct}%
                    </th>
                    <td className="py-2.5 pr-4 text-[#0D0D0D]">
                      {fmt(roundToStep((displayOneRm * row.pct) / 100, loadStep), 2)} {unitLabel}
                    </td>
                    <td className="py-2.5 text-[#6B6B6B]">{row.reps} reps</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-[#6B6B6B]">
              Loads rounded to the nearest {loadStep} {unitLabel} for plate-friendly numbers, using
              the averaged 1RM.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <NextStepButton
              label="Compare to standards"
              toSlug="strength-standards"
              currentSlug="one-rep-max"
              handoff={{ oneRepMaxKg: averageKg }}
            />
            <NextStepButton
              label="Load the bar"
              toSlug="plate-calculator"
              currentSlug="one-rep-max"
              handoff={{ oneRepMaxKg: averageKg }}
            />
          </div>
        </>
      ) : valid ? (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Check your inputs — weight must be above 0 and reps a whole number from 1 to 12.
        </p>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Enter the weight you lifted and how many reps you got — your estimated one-rep max
          appears instantly.
        </p>
      )}
    </div>
  );
}
