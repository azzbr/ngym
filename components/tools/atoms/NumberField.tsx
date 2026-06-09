"use client";

import { useEffect, useRef, useState } from "react";
import { useUnits } from "@/components/providers/ToolsProvider";
import { cmToIn, inToCm, kgToLb, lbToKg, roundTo } from "@/lib/fitness/units";

type Kind = "weightKg" | "lengthCm" | "plain";

interface Props {
  id: string;
  label: string;
  /** Canonical value — metric for weightKg/lengthCm kinds. */
  value: number | null;
  onChange: (value: number | null) => void;
  kind?: Kind;
  /** Suffix override; weightKg/lengthCm derive kg/lb · cm/in automatically. */
  suffix?: string;
  placeholder?: string;
  error?: string | null;
  hint?: string;
}

/**
 * Unit-aware numeric input. Canonical value stays metric; display converts
 * per the shared unit toggle. Uses a local string buffer while focused so
 * partial input ("72.") survives re-renders. type="text" + inputMode="decimal"
 * deliberately (no scroll-wheel changes, no "e"/"-" quirks).
 */
export default function NumberField({
  id,
  label,
  value,
  onChange,
  kind = "plain",
  suffix,
  placeholder,
  error,
  hint,
}: Props) {
  const { units } = useUnits();
  const imperial = units === "imperial";

  const toDisplay = (v: number): number => {
    if (kind === "weightKg" && imperial) return roundTo(kgToLb(v), 1);
    if (kind === "lengthCm" && imperial) return roundTo(cmToIn(v), 1);
    return roundTo(v, 1);
  };
  const toCanonical = (v: number): number => {
    if (kind === "weightKg" && imperial) return lbToKg(v);
    if (kind === "lengthCm" && imperial) return inToCm(v);
    return v;
  };

  const [text, setText] = useState(value == null ? "" : String(toDisplay(value)));
  const focused = useRef(false);

  // Re-derive the display string when the canonical value or units change
  // while the field is not being edited.
  useEffect(() => {
    if (focused.current) return;
    setText(value == null ? "" : String(toDisplay(value)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, units]);

  const unitSuffix =
    suffix ??
    (kind === "weightKg" ? (imperial ? "lb" : "kg") : kind === "lengthCm" ? (imperial ? "in" : "cm") : undefined);

  const commit = (raw: string) => {
    setText(raw);
    const trimmed = raw.trim().replace(",", ".");
    if (trimmed === "" || trimmed === "-" || trimmed === ".") {
      onChange(null);
      return;
    }
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) onChange(toCanonical(parsed));
  };

  const errId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D] mb-2"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          placeholder={placeholder}
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={() => {
            focused.current = false;
            setText(value == null ? "" : String(toDisplay(value)));
          }}
          onChange={(e) => commit(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : hint ? hintId : undefined}
          className={`w-full border bg-white px-4 py-3 text-[#0D0D0D] text-sm focus:outline-none transition-colors ${
            error ? "border-[#CC1A1A]" : "border-[#E5E5E5] focus:border-[#CC1A1A]"
          } ${unitSuffix ? "pr-12" : ""}`}
        />
        {unitSuffix && (
          <span
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wide text-[#6B6B6B]"
          >
            {unitSuffix}
          </span>
        )}
      </div>
      {error ? (
        <p id={errId} className="mt-1.5 text-xs text-[#CC1A1A]">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-[#6B6B6B]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
