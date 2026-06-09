"use client";

import type { ScaleBand } from "@/lib/fitness/types";
import { fmt } from "@/lib/fitness/units";

interface Props {
  bands: ScaleBand[];
  value: number;
  /** Display window for the bar (bands clamp into it). */
  min: number;
  max: number;
  format?: (n: number) => string;
}

/** Color-coded range bar with a marker showing where the user falls. */
export default function ScaleBar({ bands, value, min, max, format = (n) => fmt(n, 1) }: Props) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const pct = ((clamp(value) - min) / (max - min)) * 100;
  const active = bands.find((b) => value >= b.min && value < b.max) ?? bands[bands.length - 1];

  const visible = bands
    .map((b) => ({ ...b, lo: clamp(b.min), hi: clamp(b.max === Infinity ? max : b.max) }))
    .filter((b) => b.hi > b.lo);

  return (
    <div>
      <div className="relative">
        <div className="flex h-3 w-full overflow-hidden" aria-hidden="true">
          {visible.map((b) => (
            <div
              key={b.label}
              style={{ width: `${((b.hi - b.lo) / (max - min)) * 100}%`, backgroundColor: b.color }}
              title={b.label}
            />
          ))}
        </div>
        <div
          aria-hidden="true"
          className="absolute -top-1.5 h-6 w-[3px] bg-[#0D0D0D]"
          style={{ left: `calc(${pct}% - 1.5px)` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-[#6B6B6B]" aria-hidden="true">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1" aria-hidden="true">
        {visible.map((b) => (
          <span key={b.label} className="flex items-center gap-1.5 text-[11px] text-[#6B6B6B]">
            <span className="inline-block h-2 w-2" style={{ backgroundColor: b.color }} />
            {b.label}
          </span>
        ))}
      </div>
      <p className="sr-only">
        Your value {format(value)} falls in the {active.label} range
        {Number.isFinite(active.max)
          ? ` (${format(active.min)} to ${format(active.max)})`
          : ` (above ${format(active.min)})`}
        .
      </p>
    </div>
  );
}
