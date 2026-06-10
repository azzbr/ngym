"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/components/providers/ToolsProvider";
import { applyCheckIn, canCheckIn, toISODate } from "@/lib/fitness/progress";

/**
 * Honor-system gym check-in. One big red button when the 4h cooldown has
 * elapsed; a calm "checked in" block while it hasn't. A 30s interval
 * re-evaluates the cooldown so the button flips back without a reload.
 */
export default function CheckInButton() {
  const { progress, updateProgress, hydrated } = useProgress();
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Pre-hydration: render the disabled-style block so the real state never flashes.
  if (!hydrated) {
    return (
      <div
        aria-disabled="true"
        className="w-full min-h-[120px] flex flex-col items-center justify-center gap-2 bg-[#E5E5E5] text-[#0D0D0D] px-6 py-6 text-center"
      >
        <span
          aria-hidden="true"
          className="text-4xl md:text-5xl leading-none"
          style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
        >
          …
        </span>
        <span className="sr-only">Loading check-in status</span>
      </div>
    );
  }

  const allowed = canCheckIn(progress.lastCheckInAt, nowMs);

  if (!allowed) {
    return (
      <div
        role="status"
        aria-disabled="true"
        className="w-full min-h-[120px] flex flex-col items-center justify-center gap-2 bg-[#E5E5E5] text-[#0D0D0D] px-6 py-6 text-center"
      >
        <span
          className="text-4xl md:text-5xl leading-none"
          style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
        >
          CHECKED IN <span aria-hidden="true">✓</span>
        </span>
        <span className="text-sm text-[#6B6B6B]">See you tomorrow — streak safe.</span>
      </div>
    );
  }

  const onCheckIn = () => {
    const now = new Date();
    updateProgress((p) => applyCheckIn(p, now), {
      type: "checkin",
      hour: now.getHours(),
      dateISO: toISODate(now),
    });
    setNowMs(now.getTime()); // flip to the cooldown state immediately
  };

  return (
    <button
      type="button"
      onClick={onCheckIn}
      className="w-full min-h-[120px] flex flex-col items-center justify-center gap-2 bg-[#CC1A1A] text-white px-6 py-6 text-center transition-colors hover:bg-[#AA1414] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CC1A1A] focus-visible:outline-offset-4"
    >
      <span
        className="text-4xl md:text-5xl leading-none"
        style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
      >
        I&rsquo;M AT THE GYM
      </span>
      <span
        className="text-xs font-semibold uppercase tracking-[0.1em]"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        Tap to check in — keep the streak alive
      </span>
    </button>
  );
}
