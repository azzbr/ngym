"use client";

import { useState } from "react";
import { useProgress, useUnits } from "@/components/providers/ToolsProvider";
import { currentStreak, latestWeight, toISODate } from "@/lib/fitness/progress";
import { fmt, kgToLb } from "@/lib/fitness/units";

/** Dark share block: streak / check-ins / weight delta / badges + share buttons. */
export default function ProgressShareCard() {
  const { progress, updateProgress } = useProgress();
  const { units } = useUnits();
  const [copied, setCopied] = useState(false);

  const streak = currentStreak(progress.checkIns, toISODate(new Date()));
  const checkIns = progress.checkIns.length;
  const badgesEarned = progress.badges.length;

  // Weight delta since the FIRST log entry (weightLog is kept ascending by date).
  const firstEntry = progress.weightLog.length >= 2 ? progress.weightLog[0] : null;
  const last = latestWeight(progress);
  const deltaKg = firstEntry && last ? last.kg - firstEntry.kg : null;
  const imperial = units === "imperial";
  const unitLabel = imperial ? "lb" : "kg";
  const deltaDisplay = deltaKg != null ? (imperial ? kgToLb(deltaKg) : deltaKg) : null;
  const deltaStr =
    deltaDisplay != null
      ? `${deltaDisplay > 0 ? "+" : deltaDisplay < 0 ? "−" : ""}${fmt(Math.abs(deltaDisplay), 1)} ${unitLabel}`
      : null;

  const parts: string[] = [];
  if (streak > 0) parts.push(`\u{1F525} ${streak}-day streak at Al Nakheel Premium`);
  if (checkIns > 0) parts.push(`${checkIns} check-in${checkIns === 1 ? "" : "s"}`);
  if (deltaStr) parts.push(deltaStr);
  const summary = `${
    parts.length > 0 ? parts.join(" · ") : "Training at Al Nakheel Premium"
  } — alnakheelpremium.com/tools/progress`;

  const recordShare = () => {
    // User-action write — post-hydration by nature.
    updateProgress((p) => ({ ...p, sharedAt: Date.now() }), { type: "share" });
  };

  const onShare = async () => {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ text: summary });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        return;
      }
      recordShare();
    } catch {
      /* user cancelled the share sheet — don't record */
    }
  };

  const stats: { value: string; label: string }[] = [
    { value: String(streak), label: "Day streak" },
    { value: String(checkIns), label: "Check-ins" },
  ];
  if (deltaStr) stats.push({ value: deltaStr, label: "Since first log" });
  stats.push({ value: String(badgesEarned), label: "Badges" });

  return (
    <div className="bg-[#0D0D0D] p-6 md:p-8">
      <h2
        className="font-montserrat font-black text-2xl uppercase tracking-[0.08em] text-white"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        Share your <span className="text-[#CC1A1A]">grind</span>
      </h2>

      <div className="mt-6 flex flex-wrap gap-x-10 gap-y-6">
        {stats.map((s) => (
          <div key={s.label}>
            <span
              className="block text-5xl leading-none text-white"
              style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
            >
              {s.value}
            </span>
            <span
              className="mt-2 block font-montserrat font-semibold text-[10px] uppercase tracking-[0.15em] text-white/60"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center justify-center bg-[#CC1A1A] hover:bg-[#AA1414] text-white font-montserrat font-bold text-xs uppercase tracking-[0.12em] px-6 py-3 transition-colors"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          Share
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(summary)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={recordShare}
          className="inline-flex items-center justify-center border-2 border-[#CC1A1A] text-white hover:bg-[#CC1A1A] font-montserrat font-bold text-xs uppercase tracking-[0.12em] px-6 py-3 transition-colors"
          style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
        >
          WhatsApp
        </a>
        <span aria-live="polite" className="text-xs text-white/60">
          {copied ? "Copied to clipboard." : ""}
        </span>
      </div>
    </div>
  );
}
