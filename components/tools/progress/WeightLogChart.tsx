"use client";

import Link from "next/link";
import { useProgress, useUnits } from "@/components/providers/ToolsProvider";
import { fmt, kgToLb } from "@/lib/fitness/units";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "yyyy-mm-dd" → whole days since the Unix epoch (UTC — exact integers, no DST drift). */
function epochDay(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

/** Epoch day → "10 Jun" style label. */
function dayLabel(day: number): string {
  const date = new Date(day * 86_400_000);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
}

/**
 * Dated weight-trend chart: actual entries (red), optional goal-plan
 * projection (grey dashed) and target line (green dashed). X positions are
 * time-proportional by day; Y is in the member's display units.
 */
export default function WeightLogChart() {
  const { progress, hydrated } = useProgress();
  const { units } = useUnits();
  const toDisplay = (kg: number) => (units === "imperial" ? kgToLb(kg) : kg);
  const unit = units === "imperial" ? "lb" : "kg";

  if (!hydrated) return null;

  const entries = progress.weightLog; // already ascending by date

  if (entries.length < 2) {
    return (
      <div className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
        Log your weight a few times to see your trend.{" "}
        <Link
          href="/tools/goal-timeline"
          className="text-[#CC1A1A] font-semibold hover:underline underline-offset-4"
        >
          Generate a goal timeline →
        </Link>
      </div>
    );
  }

  const W = 640;
  const H = 220;
  const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

  const days = entries.map((e) => epochDay(e.d));
  const minDay = days[0];
  const maxDay = days[days.length - 1];
  const daySpan = Math.max(maxDay - minDay, 1);

  // Goal-plan projection, clipped to the chart's day range.
  const plan = progress.goalPlan;
  let planSeg: { d0: number; kg0: number; d1: number; kg1: number } | null = null;
  if (plan) {
    const startDay = epochDay(plan.startDate);
    const kgAt = (day: number) => plan.startKg + (plan.weeklyKg * (day - startDay)) / 7;
    const d0 = Math.max(startDay, minDay);
    if (d0 <= maxDay) planSeg = { d0, kg0: kgAt(d0), d1: maxDay, kg1: kgAt(maxDay) };
  }

  const kgs = entries.map((e) => e.kg);
  if (plan) kgs.push(plan.targetKg);
  if (planSeg) kgs.push(planSeg.kg0, planSeg.kg1);
  const minKg = Math.min(...kgs);
  const maxKg = Math.max(...kgs);
  const span = Math.max(maxKg - minKg, 1);

  const x = (day: number) => PAD.left + ((day - minDay) / daySpan) * (W - PAD.left - PAD.right);
  const y = (kg: number) => PAD.top + ((maxKg - kg) / span) * (H - PAD.top - PAD.bottom);

  const path = entries
    .map((e, i) => `${i === 0 ? "M" : "L"}${x(days[i]).toFixed(1)},${y(e.kg).toFixed(1)}`)
    .join(" ");

  const labelDays = [...new Set([minDay, Math.round((minDay + maxDay) / 2), maxDay])];
  const latest = entries[entries.length - 1];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto bg-white border border-[#E5E5E5]"
        role="img"
        aria-label={`Weight log: ${entries.length} entries from ${dayLabel(minDay)} to ${dayLabel(
          maxDay,
        )}, latest ${fmt(toDisplay(latest.kg), 1)} ${unit}`}
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
        {/* goal target line */}
        {plan && (
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(plan.targetKg)}
            y2={y(plan.targetKg)}
            stroke="#1A7A3C"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}
        {/* goal plan projection */}
        {planSeg && (
          <line
            x1={x(planSeg.d0)}
            x2={x(planSeg.d1)}
            y1={y(planSeg.kg0)}
            y2={y(planSeg.kg1)}
            stroke="#6B6B6B"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
        )}
        {/* actual weights */}
        <path d={path} fill="none" stroke="#CC1A1A" strokeWidth="2.5" />
        {entries.map((e, i) => (
          <circle key={e.d} cx={x(days[i])} cy={y(e.kg)} r="3" fill="#CC1A1A" />
        ))}
        {/* date labels */}
        {labelDays.map((d) => (
          <text key={d} x={x(d)} y={H - 10} textAnchor="middle" fontSize="10" fill="#6B6B6B">
            {dayLabel(d)}
          </text>
        ))}
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#6B6B6B]">
        {plan ? (
          <>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block w-5 border-t-2 border-[#CC1A1A]" />
              Actual
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block w-5 border-t-2 border-dashed border-[#6B6B6B]" />
              Plan
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block w-5 border-t-2 border-dashed border-[#1A7A3C]" />
              Target
            </span>
          </>
        ) : (
          <span>Logged weight over time ({unit}).</span>
        )}
      </figcaption>
    </figure>
  );
}
