"use client";

import { useId } from "react";

interface Props<T extends string> {
  label?: string;
  value: T | null;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  /** Compact = smaller pills (used inline in result areas). */
  compact?: boolean;
}

/**
 * Brand-styled toggle group (sex, units, presets, tabs).
 * Radiogroup semantics with arrow-key navigation.
 */
export default function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
  compact = false,
}: Props<T>) {
  const groupId = useId();
  const idx = options.findIndex((o) => o.value === value);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = options[(idx + dir + options.length) % options.length];
    onChange(next.value);
    const el = document.getElementById(`${groupId}-${next.value}`);
    el?.focus();
  };

  return (
    <div>
      {label && (
        <span
          id={`${groupId}-label`}
          className="block font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#0D0D0D] mb-2"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        className="flex flex-wrap"
        onKeyDown={onKeyDown}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              id={`${groupId}-${o.value}`}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active || (value == null && o === options[0]) ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={`font-montserrat font-semibold uppercase tracking-[0.08em] border transition-colors -ml-px first:ml-0 ${
                compact ? "text-[11px] px-3 py-2" : "text-xs px-4 py-3"
              } ${
                active
                  ? "bg-[#0D0D0D] text-white border-[#0D0D0D]"
                  : "bg-white text-[#6B6B6B] border-[#E5E5E5] hover:text-[#0D0D0D] hover:border-[#6B6B6B]"
              }`}
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
