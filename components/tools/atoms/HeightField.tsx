"use client";

import { useEffect, useRef, useState } from "react";
import { useUnits } from "@/components/providers/ToolsProvider";
import { cmToFtIn, ftInToCm, roundTo } from "@/lib/fitness/units";

interface Props {
  id: string;
  label?: string;
  /** Canonical height in cm. */
  value: number | null;
  onChange: (value: number | null) => void;
  error?: string | null;
}

/** Height input: single cm field in metric, ft + in pair in imperial. */
export default function HeightField({ id, label = "Height", value, onChange, error }: Props) {
  const { units } = useUnits();
  const imperial = units === "imperial";

  const [cmText, setCmText] = useState(value == null ? "" : String(roundTo(value, 1)));
  const [ftText, setFtText] = useState("");
  const [inText, setInText] = useState("");
  const editing = useRef(false);

  useEffect(() => {
    if (editing.current) return;
    if (value == null) {
      setCmText("");
      setFtText("");
      setInText("");
      return;
    }
    setCmText(String(roundTo(value, 1)));
    const { ft, in: inches } = cmToFtIn(value);
    setFtText(String(ft));
    setInText(String(inches));
  }, [value, units]);

  const parse = (s: string): number | null => {
    const t = s.trim().replace(",", ".");
    if (t === "") return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  };

  const commitImperial = (ftRaw: string, inRaw: string) => {
    const ft = parse(ftRaw);
    const inches = parse(inRaw);
    if (ft == null && inches == null) {
      onChange(null);
      return;
    }
    onChange(ftInToCm(ft ?? 0, inches ?? 0));
  };

  const errId = `${id}-error`;
  const inputClass = `w-full border bg-white px-4 py-3 text-[#0D0D0D] text-sm focus:outline-none transition-colors ${
    error ? "border-[#CC1A1A]" : "border-[#E5E5E5] focus:border-[#CC1A1A]"
  }`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D] mb-2"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        {label}
      </label>
      {imperial ? (
        <div className="grid grid-cols-2 gap-3" role="group" aria-label={`${label} (feet and inches)`}>
          <div className="relative">
            <input
              id={id}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={ftText}
              placeholder="5"
              onFocus={() => (editing.current = true)}
              onBlur={() => (editing.current = false)}
              onChange={(e) => {
                setFtText(e.target.value);
                commitImperial(e.target.value, inText);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errId : undefined}
              aria-label={`${label} — feet`}
              className={`${inputClass} pr-10`}
            />
            <span aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-[#6B6B6B]">
              ft
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={inText}
              placeholder="11"
              onFocus={() => (editing.current = true)}
              onBlur={() => (editing.current = false)}
              onChange={(e) => {
                setInText(e.target.value);
                commitImperial(ftText, e.target.value);
              }}
              aria-invalid={error ? true : undefined}
              aria-label={`${label} — inches`}
              className={`${inputClass} pr-10`}
            />
            <span aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-[#6B6B6B]">
              in
            </span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            id={id}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={cmText}
            placeholder="175"
            onFocus={() => (editing.current = true)}
            onBlur={() => (editing.current = false)}
            onChange={(e) => {
              setCmText(e.target.value);
              onChange(parse(e.target.value));
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            className={`${inputClass} pr-12`}
          />
          <span aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-[#6B6B6B]">
            cm
          </span>
        </div>
      )}
      {error && (
        <p id={errId} className="mt-1.5 text-xs text-[#CC1A1A]">
          {error}
        </p>
      )}
    </div>
  );
}
