"use client";

import { useProgress } from "@/components/providers/ToolsProvider";
import { toISODate } from "@/lib/fitness/progress";

const DAY_COUNT = 84; // 12 weeks × 7 days, ending today

/**
 * GitHub-style contribution grid of the last 12 weeks of check-ins.
 * Columns are weeks (oldest left), rows are days; no weekday alignment —
 * exactly 84 days ending today.
 */
export default function CheckInHeatmap() {
  const { progress } = useProgress();

  const today = new Date();
  const todayISO = toISODate(today);
  const days: string[] = [];
  for (let i = DAY_COUNT - 1; i >= 0; i--) {
    days.push(toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)));
  }

  const checked = new Set(progress.checkIns);
  const count = days.reduce((n, d) => n + (checked.has(d) ? 1 : 0), 0);

  return (
    <div>
      <p
        className="font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B] mb-3"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        Last 12 weeks
      </p>
      <div className="grid grid-flow-col grid-rows-7 gap-1 w-max" aria-hidden="true">
        {days.map((d) => {
          const isChecked = checked.has(d);
          const isToday = d === todayISO;
          return (
            <div
              key={d}
              title={d}
              className={`w-3.5 h-3.5 ${
                isChecked ? "bg-[#CC1A1A]" : "bg-white border border-[#E5E5E5]"
              }${isToday ? " outline outline-2 outline-[#0D0D0D]" : ""}`}
            />
          );
        })}
      </div>
      <p className="sr-only">
        {count} check-in{count === 1 ? "" : "s"} in the last 12 weeks.
      </p>
    </div>
  );
}
