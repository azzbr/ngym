"use client";

import { X } from "lucide-react";
import { useProgress, useUnits } from "@/components/providers/ToolsProvider";
import { removeWeightEntry } from "@/lib/fitness/progress";
import { fmt, kgToLb } from "@/lib/fitness/units";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const VISIBLE_CAP = 20;

/** "yyyy-mm-dd" → "10 Jun 2026". */
function dayLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/**
 * Reverse-chronological weight history: date, weight in display units, delta
 * vs the previous entry (colored by goal direction when a plan exists) and a
 * per-row delete.
 */
export default function WeightLogList() {
  const { progress, updateProgress, hydrated } = useProgress();
  const { units } = useUnits();
  const toDisplay = (kg: number) => (units === "imperial" ? kgToLb(kg) : kg);
  const unit = units === "imperial" ? "lb" : "kg";

  if (!hydrated) return null;

  const entries = progress.weightLog; // ascending by date
  if (entries.length === 0) return null;

  const plan = progress.goalPlan;
  const direction = plan ? Math.sign(plan.targetKg - plan.startKg) || 1 : null;

  const rows = entries
    .map((e, i) => ({ entry: e, prev: i > 0 ? entries[i - 1] : null }))
    .reverse()
    .slice(0, VISIBLE_CAP);

  return (
    <div className="bg-white border border-[#E5E5E5]">
      <ul className="divide-y divide-[#E5E5E5]">
        {rows.map(({ entry, prev }) => {
          const day = dayLabel(entry.d);
          const deltaKg = prev ? entry.kg - prev.kg : null;

          let deltaColor = "#6B6B6B";
          let deltaSr = "";
          if (deltaKg != null && deltaKg !== 0) {
            if (direction != null) {
              const toward = Math.sign(deltaKg) === direction;
              deltaColor = toward ? "#1A7A3C" : "#CC1A1A";
              deltaSr = toward ? " (toward goal)" : " (away from goal)";
            } else if (deltaKg < 0) {
              deltaColor = "#1A7A3C";
            }
          }

          return (
            <li key={entry.d} className="flex items-center gap-3 sm:gap-4 px-4 py-3">
              <span className="text-sm text-[#6B6B6B] w-28 shrink-0">{day}</span>
              <span
                className="text-2xl leading-none text-[#0D0D0D]"
                style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
              >
                {fmt(toDisplay(entry.kg), 1)}
                <span className="ml-1 text-sm text-[#6B6B6B] uppercase tracking-wide">{unit}</span>
              </span>
              <span className="ml-auto text-sm font-semibold tabular-nums" style={{ color: deltaColor }}>
                {deltaKg != null ? (
                  <>
                    {deltaKg > 0 ? "+" : deltaKg < 0 ? "-" : "±"}
                    {fmt(Math.abs(toDisplay(deltaKg)), 1)} {unit}
                    {deltaSr && <span className="sr-only">{deltaSr}</span>}
                  </>
                ) : (
                  <span aria-hidden="true">—</span>
                )}
              </span>
              <button
                type="button"
                aria-label={`Delete entry ${day}`}
                onClick={() => updateProgress((p) => removeWeightEntry(p, entry.d))}
                className="shrink-0 p-1.5 text-[#6B6B6B] hover:text-[#CC1A1A] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CC1A1A] focus-visible:outline-offset-2"
              >
                <X size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      {entries.length > VISIBLE_CAP && (
        <p className="px-4 py-2 text-xs text-[#6B6B6B] border-t border-[#E5E5E5]">
          Showing last {VISIBLE_CAP} of {entries.length} entries.
        </p>
      )}
    </div>
  );
}
