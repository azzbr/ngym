"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/components/providers/ToolsProvider";
import type { GoalPlan, ProgressLift, ResultKey } from "@/lib/fitness/profile";
import { applyGoalPlan, applyResult, LIFT_LABELS } from "@/lib/fitness/progress";
import SegmentedControl from "./SegmentedControl";

type SaveKind = "oneRepMax" | "vo2max" | "bodyFat" | "bmi" | "ffmi" | "goalPlan";

interface Props {
  kind: SaveKind;
  /** Canonical value (kg for lifts, raw number otherwise). */
  value: number;
  /** Required when kind === "goalPlan". */
  plan?: GoalPlan;
}

const LIFT_OPTIONS: { value: ProgressLift; label: string }[] = (
  ["squat", "bench", "deadlift", "ohp", "other"] as ProgressLift[]
).map((lift) => ({ value: lift, label: LIFT_LABELS[lift] }));

const GHOST_CLASSES =
  "font-montserrat font-bold text-[11px] uppercase tracking-[0.12em] border border-[#E5E5E5] text-[#6B6B6B] hover:border-[#CC1A1A] hover:text-[#CC1A1A] transition-colors px-4 py-2";

const MONTSERRAT = { fontFamily: "var(--font-montserrat, sans-serif)" } as const;

/**
 * Ghost "save to my progress" action for ResultCard's `action` slot.
 * 1RM saves expand an inline lift picker first; everything else saves
 * in one tap. All writes go through updateProgress + the pure helpers.
 */
export default function SaveResultButton({ kind, value, plan }: Props) {
  const { updateProgress } = useProgress();
  const [saved, setSaved] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [lift, setLift] = useState<ProgressLift | null>(null);

  // A new result invalidates the previous "saved" confirmation.
  useEffect(() => {
    setSaved(false);
  }, [value]);

  if (kind === "goalPlan" && !plan) return null;

  const save = (resolvedLift?: ProgressLift) => {
    if (kind === "oneRepMax") {
      if (!resolvedLift) return;
      updateProgress((p) =>
        applyResult(p, ("oneRepMax." + resolvedLift) as ResultKey, value, Date.now()),
      );
    } else if (kind === "goalPlan") {
      if (!plan) return;
      updateProgress((p) => applyGoalPlan(p, plan));
    } else {
      updateProgress((p) => applyResult(p, kind, value, Date.now()));
    }
    setPickerOpen(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <p
        className="font-montserrat font-bold text-[11px] uppercase tracking-[0.12em] text-[#1A7A3C]"
        style={MONTSERRAT}
        role="status"
      >
        <span aria-hidden="true">✓ </span>
        Saved
        <span aria-hidden="true" className="text-[#6B6B6B]">
          {" · "}
        </span>
        <Link
          href="/tools/progress"
          className="text-[#CC1A1A] hover:underline underline-offset-4"
        >
          View progress
        </Link>
      </p>
    );
  }

  if (kind === "oneRepMax" && pickerOpen) {
    return (
      <div className="flex flex-col items-end gap-3">
        <SegmentedControl<ProgressLift>
          label="Save as"
          value={lift}
          onChange={setLift}
          options={LIFT_OPTIONS}
          compact
        />
        <div className="flex gap-2">
          <button type="button" onClick={() => setPickerOpen(false)} className={GHOST_CLASSES} style={MONTSERRAT}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => lift && save(lift)}
            disabled={lift == null}
            className="font-montserrat font-bold text-[11px] uppercase tracking-[0.12em] text-white bg-[#CC1A1A] hover:bg-[#AA1414] transition-colors px-4 py-2 disabled:bg-[#E5E5E5] disabled:text-[#6B6B6B] disabled:cursor-not-allowed"
            style={MONTSERRAT}
          >
            Save
            <span className="sr-only">
              {lift == null ? " — pick a lift first" : ` as ${LIFT_LABELS[lift]}`}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => (kind === "oneRepMax" ? setPickerOpen(true) : save())}
      aria-expanded={kind === "oneRepMax" ? pickerOpen : undefined}
      className={GHOST_CLASSES}
      style={MONTSERRAT}
    >
      Save to my progress
    </button>
  );
}
