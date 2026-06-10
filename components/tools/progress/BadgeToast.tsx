"use client";

import { useEffect } from "react";
import { useProgress } from "@/components/providers/ToolsProvider";
import { badgeById } from "@/lib/fitness/badges";

const TOAST_CSS = `
@keyframes anp-toast-in {
  from { opacity: 0; transform: translateY(24px) scale(0.95); }
  to { opacity: 1; transform: none; }
}
.anp-toast-card { animation: anp-toast-in 300ms ease-out both; }
@keyframes anp-toast-burst {
  0% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
  100% { opacity: 0; transform: translate(var(--bx), var(--by)) rotate(140deg); }
}
.anp-toast-burst span {
  position: absolute;
  top: 0;
  left: 50%;
  width: 8px;
  height: 8px;
  animation: anp-toast-burst 700ms ease-out both;
}
.anp-toast-burst span:nth-child(odd) { background: #CC1A1A; }
.anp-toast-burst span:nth-child(even) { background: #FFFFFF; }
.anp-toast-burst span:nth-child(1) { --bx: -76px; --by: -52px; }
.anp-toast-burst span:nth-child(2) { --bx: -36px; --by: -80px; }
.anp-toast-burst span:nth-child(3) { --bx: 6px; --by: -92px; }
.anp-toast-burst span:nth-child(4) { --bx: 44px; --by: -78px; }
.anp-toast-burst span:nth-child(5) { --bx: 80px; --by: -50px; }
.anp-toast-burst span:nth-child(6) { --bx: -4px; --by: -44px; }
@media (prefers-reduced-motion: reduce) {
  .anp-toast-card { animation: none; }
  .anp-toast-burst span { animation: none; opacity: 0; }
}
`;

/** Celebration host for newly earned badges (mounted once in app/tools/layout.tsx). */
export default function BadgeToast() {
  const { pendingBadges, dismissBadge } = useProgress();
  const first = pendingBadges.length > 0 ? pendingBadges[0] : null;

  // Auto-dismiss the current badge after 5s; timer resets when the badge changes.
  useEffect(() => {
    if (!first) return;
    const t = setTimeout(() => dismissBadge(), 5000);
    return () => clearTimeout(t);
  }, [first, dismissBadge]);

  if (!first) return null;
  const def = badgeById(first);
  if (!def) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]"
      role="status"
      aria-live="polite"
    >
      <style>{TOAST_CSS}</style>
      {/* key restarts the entrance + burst animations for each badge in the queue */}
      <div key={first} className="relative">
        <div className="anp-toast-burst absolute inset-0 pointer-events-none" aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
        </div>
        <button
          type="button"
          onClick={dismissBadge}
          className="anp-toast-card relative block w-72 sm:w-80 text-left cursor-pointer bg-[#0D0D0D] border-l-4 border-[#CC1A1A] px-6 py-4 text-white shadow-lg"
        >
          <span
            className="block font-montserrat font-bold text-[10px] uppercase tracking-[0.2em] text-[#CC1A1A]"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Badge Earned
          </span>
          <span
            className="mt-1 block text-3xl leading-none text-white"
            style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
          >
            {def.name}
          </span>
          <span className="mt-1 block text-sm text-white/60">{def.description}</span>
          <span className="sr-only">Tap to dismiss this notification.</span>
        </button>
      </div>
    </div>
  );
}
