"use client";

import {
  CalendarCheck,
  Flame,
  FlaskConical,
  MapPin,
  Moon,
  Repeat,
  Scale,
  Share2,
  Sunrise,
  Target,
  TrendingDown,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useProgress } from "@/components/providers/ToolsProvider";
import { BADGES } from "@/lib/fitness/badges";

const ICONS: Record<string, LucideIcon> = {
  MapPin,
  Flame,
  CalendarCheck,
  Repeat,
  Scale,
  TrendingDown,
  Target,
  Trophy,
  FlaskConical,
  Sunrise,
  Share2,
  Moon,
};

function formatDay(epochMs: number): string {
  return new Date(epochMs).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** All badges — earned ones in full brand color, locked ones greyed with an earn hint. */
export default function BadgeGrid() {
  const { progress } = useProgress();
  const earnedAt = new Map(progress.badges.map((b) => [b.id, b.earnedAt]));

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 list-none p-0 m-0">
      {BADGES.map((def) => {
        const at = earnedAt.get(def.id);
        const earned = at != null;
        const Icon = ICONS[def.icon] ?? Trophy;
        return (
          <li
            key={def.id}
            aria-label={
              earned
                ? `${def.name} — earned ${formatDay(at)}. ${def.description}`
                : `${def.name} — locked. How to earn: ${def.hint}`
            }
            className={`bg-white border border-[#E5E5E5] p-4 h-full ${
              earned ? "border-l-4 border-l-[#CC1A1A]" : "opacity-40 grayscale"
            }`}
          >
            <Icon
              size={22}
              strokeWidth={1.5}
              aria-hidden="true"
              className={earned ? "text-[#CC1A1A]" : "text-[#6B6B6B]"}
            />
            <span
              className="mt-3 block font-montserrat font-bold text-xs uppercase tracking-[0.08em] text-[#0D0D0D]"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {def.name}
            </span>
            {earned ? (
              <>
                <p className="mt-1 text-xs text-[#6B6B6B] leading-relaxed">{def.description}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B]">
                  Earned {formatDay(at)}
                </p>
              </>
            ) : (
              <p className="mt-1 text-xs text-[#6B6B6B] leading-relaxed">How: {def.hint}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
