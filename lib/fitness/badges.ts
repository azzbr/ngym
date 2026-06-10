import type { Profile, ProgressState } from "./profile";
import { currentStreak, progressTowardGoal, toISODate } from "./progress";
import { getAllToolSlugs } from "@/lib/tools";

/**
 * Client-side badge engine. Declarative rules over the progress state plus
 * optional event context. Pure and idempotent: evaluateBadges only returns
 * badges NOT yet earned; earned badges are never revoked.
 */

export type BadgeId =
  | "first-checkin"
  | "streak-7"
  | "streak-30"
  | "checkins-50"
  | "first-weight"
  | "weights-10"
  | "progress-5kg"
  | "first-pr"
  | "all-tools"
  | "early-bird"
  | "shared"
  | "ramadan";

export type BadgeEventCtx =
  | { type: "checkin"; hour: number; dateISO: string }
  | { type: "share" };

export type BadgeDef = {
  id: BadgeId;
  name: string;
  description: string;
  /** Shown on locked badges — how to earn it. */
  hint: string;
  /** lucide icon name (resolved by BadgeGrid). */
  icon: string;
};

/**
 * Ramadan window for the seasonal badge ("yyyy-mm-dd" inclusive bounds).
 * null = disabled. Flip the dates each year (see ROADMAP §12 time model).
 */
export const RAMADAN_WINDOW: { start: string; end: string } | null = null;

export const BADGES: BadgeDef[] = [
  { id: "first-checkin", name: "Showed Up", description: "First gym check-in.", hint: "Check in at the gym once.", icon: "MapPin" },
  { id: "streak-7", name: "One Week Strong", description: "7-day check-in streak.", hint: "Check in 7 days in a row.", icon: "Flame" },
  { id: "streak-30", name: "Iron Month", description: "30-day check-in streak.", hint: "Check in 30 days in a row.", icon: "CalendarCheck" },
  { id: "checkins-50", name: "Regular", description: "50 total check-ins.", hint: "Reach 50 total check-ins.", icon: "Repeat" },
  { id: "first-weight", name: "On Record", description: "First weight logged.", hint: "Log your weight once.", icon: "Scale" },
  { id: "weights-10", name: "Trend Spotter", description: "10 weight entries.", hint: "Log your weight 10 times.", icon: "TrendingDown" },
  { id: "progress-5kg", name: "Five Moved", description: "5 kg toward your goal.", hint: "Save a goal plan, then move 5 kg toward it.", icon: "Target" },
  { id: "first-pr", name: "PR Board Open", description: "First lift PR saved.", hint: "Save a one-rep max result.", icon: "Trophy" },
  { id: "all-tools", name: "Lab Rat", description: "Opened all 16 calculators.", hint: "Open every calculator once.", icon: "FlaskConical" },
  { id: "early-bird", name: "Before the Sun", description: "Checked in before 6 AM.", hint: "Check in before 6 AM.", icon: "Sunrise" },
  { id: "shared", name: "Spread the Word", description: "Shared your progress.", hint: "Share your progress card once.", icon: "Share2" },
  { id: "ramadan", name: "Ramadan Warrior", description: "Checked in during Ramadan.", hint: "Check in during Ramadan.", icon: "Moon" },
];

export function badgeById(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

function inRamadanWindow(dateISO: string): boolean {
  if (!RAMADAN_WINDOW) return false;
  return dateISO >= RAMADAN_WINDOW.start && dateISO <= RAMADAN_WINDOW.end;
}

/**
 * Returns badge ids newly earned by the given state (+ optional event),
 * excluding already-earned ones. Run after every progress mutation.
 */
export function evaluateBadges(
  progress: ProgressState,
  _profile: Profile,
  ctx?: BadgeEventCtx,
  now: Date = new Date(),
): BadgeId[] {
  const earned = new Set(progress.badges.map((b) => b.id));
  const award: BadgeId[] = [];
  const maybe = (id: BadgeId, condition: boolean) => {
    if (condition && !earned.has(id)) award.push(id);
  };

  const today = toISODate(now);
  const streak = currentStreak(progress.checkIns, today);
  const toward = progressTowardGoal(progress);

  // Derived rules — recomputable from stored state alone.
  maybe("first-checkin", progress.checkIns.length >= 1);
  maybe("streak-7", streak >= 7);
  maybe("streak-30", streak >= 30);
  maybe("checkins-50", progress.checkIns.length >= 50);
  maybe("first-weight", progress.weightLog.length >= 1);
  maybe("weights-10", progress.weightLog.length >= 10);
  maybe("progress-5kg", toward != null && toward >= 5);
  maybe("first-pr", Object.keys(progress.results).some((k) => k.startsWith("oneRepMax.")));
  maybe("all-tools", getAllToolSlugs().every((slug) => progress.usedTools.includes(slug)));
  maybe("shared", progress.sharedAt != null);

  // Event rules — need the moment's context.
  if (ctx?.type === "checkin") {
    maybe("early-bird", ctx.hour < 6);
    maybe("ramadan", inRamadanWindow(ctx.dateISO));
  }
  if (ctx?.type === "share") {
    maybe("shared", true);
  }

  return award;
}
