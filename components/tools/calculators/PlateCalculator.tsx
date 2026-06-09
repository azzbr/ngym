"use client";

import { useEffect, useRef, useState } from "react";
import { useUnits } from "@/components/providers/ToolsProvider";
import { useHandoffParam } from "@/components/tools/useHandoffParam";
import { plateLoading } from "@/lib/fitness/formulas";
import { fmt, kgToLb, roundToStep } from "@/lib/fitness/units";
import HandoffChip from "../atoms/HandoffChip";
import NumberField from "../atoms/NumberField";
import ResultCard from "../atoms/ResultCard";
import SegmentedControl from "../atoms/SegmentedControl";

/**
 * This tool works ENTIRELY in display units — kg plates and lb plates are
 * different physical sets, so values are never converted between systems.
 * Flipping the unit toggle resets the bar, plate set and target.
 */
const METRIC_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const IMPERIAL_PLATES = [45, 35, 25, 10, 5, 2.5];

const BARS = {
  metric: { main: 20, alt: 15 },
  imperial: { main: 45, alt: 35 },
} as const;

type BarChoice = "main" | "alt" | "custom";

function perSideText(perSide: number[]): string {
  return perSide.map((p) => fmt(p, 2)).join(" + ");
}

/** One side of the bar: grey sleeve + plates sized proportionally. */
function PlateDiagram({ perSide, maxDenom }: { perSide: number[]; maxDenom: number }) {
  const RACK_H = 72;
  const plateH = (p: number) => Math.round(20 + (p / maxDenom) * (RACK_H - 20));
  return (
    <div aria-hidden="true">
      <div className="flex overflow-x-auto">
        <div className="flex items-center shrink-0 w-10" style={{ height: RACK_H }}>
          <div className="h-1.5 w-full bg-[#6B6B6B]" />
        </div>
        {perSide.map((p, i) => (
          <div key={i} className="flex flex-col items-center shrink-0 w-6">
            <div className="flex items-center" style={{ height: RACK_H }}>
              <div className="bg-[#0D0D0D]" style={{ width: 10, height: plateH(p) }} />
            </div>
            <span className="mt-1 text-[10px] leading-none text-[#6B6B6B]">{fmt(p, 2)}</span>
          </div>
        ))}
        <div className="flex items-center shrink-0 w-10" style={{ height: RACK_H }}>
          <div className="h-1.5 w-full bg-[#6B6B6B]" />
        </div>
      </div>
      <p className="mt-2 text-xs text-[#6B6B6B]">Per side</p>
    </div>
  );
}

function MiniLoadCard({
  title,
  total,
  perSide,
  unit,
}: {
  title: string;
  total: number;
  perSide: number[];
  unit: string;
}) {
  return (
    <div className="bg-white border border-[#E5E5E5] p-4 sm:p-5">
      <p
        className="font-montserrat font-semibold text-[11px] uppercase tracking-[0.12em] text-[#6B6B6B]"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        {title}
      </p>
      <p className="mt-1 flex items-end gap-1.5">
        <span
          className="text-3xl leading-none text-[#0D0D0D]"
          style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
        >
          {fmt(total, 2)}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]">{unit}</span>
      </p>
      <p className="mt-2 text-xs text-[#6B6B6B]">
        Per side: {perSide.length > 0 ? perSideText(perSide) : "bar only"}
      </p>
    </div>
  );
}

export default function PlateCalculator() {
  const { units } = useUnits();
  const imperial = units === "imperial";
  const unit = imperial ? "lb" : "kg";
  const bars = imperial ? BARS.imperial : BARS.metric;
  const allPlates = imperial ? IMPERIAL_PLATES : METRIC_PLATES;

  const [barChoice, setBarChoice] = useState<BarChoice>("main");
  const [customBar, setCustomBar] = useState<number | null>(null);
  const [enabled, setEnabled] = useState<number[]>(() => [
    ...(imperial ? IMPERIAL_PLATES : METRIC_PLATES),
  ]);
  const [target, setTarget] = useState<number | null>(null);

  // kg plates ≠ lb plates: when units flip, reset everything to that system's defaults.
  const prevUnits = useRef(units);
  useEffect(() => {
    if (prevUnits.current === units) return;
    prevUnits.current = units;
    setBarChoice("main");
    setCustomBar(null);
    setEnabled(units === "imperial" ? [...IMPERIAL_PLATES] : [...METRIC_PLATES]);
    setTarget(null);
  }, [units]);

  // Prefill from the one-rep-max calculator. entry.value is ALWAYS kg —
  // convert into display units, rounded to a loadable step.
  const { entry, dismiss } = useHandoffParam("oneRepMaxKg");
  const seeded = useRef(false);
  useEffect(() => {
    if (entry && !seeded.current) {
      seeded.current = true;
      setTarget(imperial ? roundToStep(kgToLb(entry.value), 5) : roundToStep(entry.value, 2.5));
    }
  }, [entry, imperial]);

  const bar: number | null =
    barChoice === "custom" ? customBar : barChoice === "main" ? bars.main : bars.alt;
  const barValid = bar != null && bar > 0;

  const togglePlate = (p: number) =>
    setEnabled((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const result =
    target != null && bar != null && bar > 0 && enabled.length > 0
      ? plateLoading(target, bar, enabled)
      : null;

  return (
    <div className="space-y-6">
      {entry && (
        <HandoffChip
          text="Using your estimated 1RM from the one-rep-max calculator."
          onDismiss={dismiss}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField
          id="plate-target"
          label="Target weight"
          value={target}
          onChange={setTarget}
          kind="plain"
          suffix={unit}
          placeholder={imperial ? "225" : "100"}
        />
        <div>
          <SegmentedControl<BarChoice>
            label="Bar weight"
            value={barChoice}
            onChange={setBarChoice}
            options={[
              { value: "main", label: `${bars.main} ${unit}` },
              { value: "alt", label: `${bars.alt} ${unit}` },
              { value: "custom", label: "Custom" },
            ]}
          />
          {barChoice === "custom" && (
            <div className="mt-3">
              <NumberField
                id="plate-bar-custom"
                label="Custom bar weight"
                value={customBar}
                onChange={setCustomBar}
                kind="plain"
                suffix={unit}
                placeholder={imperial ? "55" : "10"}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <span
          className="block font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D] mb-2"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          Available plates ({unit})
        </span>
        <div className="flex flex-wrap gap-2">
          {allPlates.map((p) => {
            const active = enabled.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                onClick={() => togglePlate(p)}
                className={`font-montserrat font-semibold text-xs uppercase tracking-[0.08em] px-4 py-3 border transition-colors ${
                  active
                    ? "bg-[#0D0D0D] text-white border-[#0D0D0D]"
                    : "bg-white text-[#6B6B6B] border-[#E5E5E5] hover:text-[#0D0D0D] hover:border-[#6B6B6B]"
                }`}
                style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
              >
                {fmt(p, 2)}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs text-[#6B6B6B]">
          {"Tap a plate to switch it off if your gym doesn't have that size."}
        </p>
      </div>

      {result ? (
        result.exact ? (
          <ResultCard
            value={fmt(result.total, 2)}
            unit={unit}
            interpretation={
              result.perSide.length > 0
                ? `Per side: ${perSideText(result.perSide)}`
                : "Empty bar — no plates needed."
            }
            note={bar != null ? `Bar: ${fmt(bar, 2)} ${unit}` : undefined}
          >
            {result.perSide.length > 0 && (
              <PlateDiagram perSide={result.perSide} maxDenom={Math.max(...allPlates)} />
            )}
          </ResultCard>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#0D0D0D] bg-[#F5F4F2] border border-[#E5E5E5] border-l-4 border-l-[#CC1A1A] px-4 py-3">
              {"Exact load isn't possible with these plates."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.below && (
                <MiniLoadCard
                  title="Closest below"
                  total={result.below.total}
                  perSide={result.below.perSide}
                  unit={unit}
                />
              )}
              {result.above && (
                <MiniLoadCard
                  title="Closest above"
                  total={result.above.total}
                  perSide={result.above.perSide}
                  unit={unit}
                />
              )}
            </div>
          </div>
        )
      ) : target != null && bar != null && bar > 0 && enabled.length > 0 ? (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          Target must be at least the bar weight ({fmt(bar, 2)} {unit}).
        </p>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          {enabled.length === 0
            ? "Switch on at least one plate size above to build a loadout."
            : !barValid
              ? "Enter your custom bar weight to continue."
              : "Enter a target weight above — the plate-by-plate breakdown appears instantly."}
        </p>
      )}
    </div>
  );
}
