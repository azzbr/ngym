"use client";

import { useUnits } from "@/components/providers/ToolsProvider";
import { kgToLb, roundTo } from "@/lib/fitness/units";

interface Props {
  points: { week: number; kg: number }[];
  targetKg: number;
}

/** Minimal inline-SVG projection line from current weight to target. */
export default function TimelineChart({ points, targetKg }: Props) {
  const { units } = useUnits();
  const toDisplay = (kg: number) => (units === "imperial" ? kgToLb(kg) : kg);
  const unit = units === "imperial" ? "lb" : "kg";

  if (points.length < 2) return null;

  const W = 640;
  const H = 220;
  const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

  const weeks = points[points.length - 1].week;
  const kgs = points.map((p) => p.kg).concat(targetKg);
  const minKg = Math.min(...kgs);
  const maxKg = Math.max(...kgs);
  const span = Math.max(maxKg - minKg, 1);

  const x = (week: number) => PAD.left + (week / Math.max(weeks, 1)) * (W - PAD.left - PAD.right);
  const y = (kg: number) => PAD.top + ((maxKg - kg) / span) * (H - PAD.top - PAD.bottom);

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.week).toFixed(1)},${y(p.kg).toFixed(1)}`).join(" ");
  const gridWeeks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(weeks * f));

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto bg-white border border-[#E5E5E5]"
        role="img"
        aria-label={`Projected weight from ${roundTo(toDisplay(points[0].kg), 1)} to ${roundTo(
          toDisplay(targetKg),
          1,
        )} ${unit} over ${weeks} weeks`}
      >
        {/* horizontal gridlines */}
        {[0, 0.5, 1].map((f) => {
          const kg = maxKg - span * f;
          return (
            <g key={f}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(kg)} y2={y(kg)} stroke="#E5E5E5" strokeWidth="1" />
              <text x={PAD.left - 6} y={y(kg) + 3} textAnchor="end" fontSize="10" fill="#6B6B6B">
                {Math.round(toDisplay(kg))}
              </text>
            </g>
          );
        })}
        {/* target line */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={y(targetKg)}
          y2={y(targetKg)}
          stroke="#1A7A3C"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* projection */}
        <path d={path} fill="none" stroke="#CC1A1A" strokeWidth="2.5" />
        <circle cx={x(points[0].week)} cy={y(points[0].kg)} r="4" fill="#0D0D0D" />
        <circle cx={x(points[points.length - 1].week)} cy={y(points[points.length - 1].kg)} r="4" fill="#1A7A3C" />
        {/* week labels */}
        {[...new Set(gridWeeks)].map((w) => (
          <text key={w} x={x(w)} y={H - 10} textAnchor="middle" fontSize="10" fill="#6B6B6B">
            wk {w}
          </text>
        ))}
      </svg>
      <figcaption className="mt-2 text-xs text-[#6B6B6B]">
        Straight-line estimate — real progress varies week to week ({unit}).
      </figcaption>
    </figure>
  );
}
