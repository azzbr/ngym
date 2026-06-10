"use client";

import { useProgress } from "@/components/providers/ToolsProvider";
import { currentStreak, longestStreak, toISODate } from "@/lib/fitness/progress";

/**
 * Current + longest streak stat cards, with a loss-aversion nudge when
 * today's check-in is still missing and a live streak is at stake.
 */
export default function StreakCounters() {
  const { progress } = useProgress();

  const todayISO = toISODate(new Date());
  const current = currentStreak(progress.checkIns, todayISO);
  const longest = longestStreak(progress.checkIns);
  const atRisk = current >= 2 && !progress.checkIns.includes(todayISO);

  const stats = [
    { label: "Current Streak", value: current },
    { label: "Longest Streak", value: longest },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#E5E5E5] border-l-4 border-l-[#CC1A1A] p-5 md:p-6"
          >
            <p
              className="font-montserrat font-semibold text-[11px] md:text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {s.label}
            </p>
            <p className="mt-2 flex items-end gap-2">
              <span
                className="text-6xl leading-none text-[#0D0D0D]"
                style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
              >
                {s.value}
              </span>
              <span className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wide pb-0.5">
                {s.value === 1 ? "day" : "days"}
              </span>
            </p>
          </div>
        ))}
      </div>

      {atRisk && (
        <p
          role="status"
          className="border border-[#E5E5E5] border-l-4 border-l-[#CC1A1A] bg-white px-4 py-3 text-sm text-[#0D0D0D]"
        >
          Your {current}-day streak ends at midnight.{" "}
          <span className="font-semibold">Don&rsquo;t break the chain.</span>
        </p>
      )}
    </div>
  );
}
