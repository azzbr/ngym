"use client";

import { useEffect, useRef, useState } from "react";
import { useProfile, useProgress } from "@/components/providers/ToolsProvider";
import { validateField } from "@/lib/fitness/profile";
import { applyWeightEntry } from "@/lib/fitness/progress";
import NumberField from "../atoms/NumberField";

/**
 * One-tap daily weight logger. Seeds from the shared profile weight, writes
 * to both the weight log (via applyWeightEntry) and the profile — the profile
 * stays the single source of current weight for all calculators.
 */
export default function WeightQuickAdd() {
  const { profile, setProfile, hydrated } = useProfile();
  const { updateProgress } = useProgress();

  const [value, setValue] = useState<number | null>(null);
  const [logged, setLogged] = useState(false);
  const seededRef = useRef(false);

  // Seed once from the profile after hydration — only if the user hasn't typed.
  useEffect(() => {
    if (!hydrated || seededRef.current) return;
    seededRef.current = true;
    if (profile.weightKg != null) {
      setValue((v) => (v == null ? profile.weightKg : v));
    }
  }, [hydrated, profile.weightKg]);

  const error = validateField("weightKg", value);
  const valid = value != null && !error;

  const logToday = () => {
    if (!valid || value == null) return;
    const now = new Date();
    updateProgress((p) => applyWeightEntry(p, value, now));
    setProfile({ weightKg: value });
    setLogged(true);
  };

  return (
    <div className="space-y-4">
      <NumberField
        id="progress-weight-add"
        label="Today's weight"
        value={value}
        onChange={(v) => {
          setValue(v);
          setLogged(false);
        }}
        kind="weightKg"
        placeholder="80"
        error={error}
      />
      <button
        type="button"
        onClick={logToday}
        disabled={!valid}
        className="w-full sm:w-auto bg-[#CC1A1A] text-white font-montserrat font-bold text-xs uppercase tracking-[0.1em] px-8 py-3 transition-colors hover:bg-[#AA1414] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#CC1A1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CC1A1A] focus-visible:outline-offset-4"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        Log Today&apos;s Weight
      </button>
      <p role="status" className="text-sm font-semibold text-[#1A7A3C] min-h-5">
        {logged ? "Logged ✓" : ""}
      </p>
    </div>
  );
}
