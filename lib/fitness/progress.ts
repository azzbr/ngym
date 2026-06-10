import type { GoalPlan, ProgressLift, ProgressState, ResultKey, SavedResult } from "./profile";

/**
 * Pure progress logic: dates, streaks, check-ins, weight log, result
 * write-policies. No React, no storage — fully unit-testable.
 */

export const CHECKIN_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4h — blocks 23:59/00:01 double taps

/** Local-time "yyyy-mm-dd" (members and kiosks are physically in Bahrain). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return toISODate(date);
}

/**
 * Current streak in consecutive local calendar days ending today or yesterday.
 * (Yesterday-checked-but-not-yet-today still counts — the streak is "alive"
 * until midnight passes without a check-in.)
 */
export function currentStreak(checkIns: string[], todayISO: string): number {
  const set = new Set(checkIns);
  let anchor: string;
  if (set.has(todayISO)) anchor = todayISO;
  else if (set.has(addDays(todayISO, -1))) anchor = addDays(todayISO, -1);
  else return 0;
  let streak = 0;
  let cursor = anchor;
  while (set.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Longest run of consecutive days anywhere in the history. */
export function longestStreak(checkIns: string[]): number {
  const sorted = [...new Set(checkIns)].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of sorted) {
    run = prev !== null && addDays(prev, 1) === day ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = day;
  }
  return longest;
}

/** True when the 4h cooldown has elapsed (or never checked in). */
export function canCheckIn(lastCheckInAt: number | null, now: number): boolean {
  if (lastCheckInAt == null) return true;
  return now - lastCheckInAt >= CHECKIN_COOLDOWN_MS;
}

/** Apply a check-in. No-op (same object) when the cooldown blocks it. */
export function applyCheckIn(p: ProgressState, now: Date): ProgressState {
  if (!canCheckIn(p.lastCheckInAt, now.getTime())) return p;
  const day = toISODate(now);
  return {
    ...p,
    checkIns: p.checkIns.includes(day) ? p.checkIns : [...p.checkIns, day],
    lastCheckInAt: now.getTime(),
  };
}

/** Upsert today's weight (one entry per date, last write wins). */
export function applyWeightEntry(p: ProgressState, kg: number, now: Date): ProgressState {
  const d = toISODate(now);
  const rest = p.weightLog.filter((e) => e.d !== d);
  return { ...p, weightLog: [...rest, { d, kg }] };
}

export function removeWeightEntry(p: ProgressState, d: string): ProgressState {
  return { ...p, weightLog: p.weightLog.filter((e) => e.d !== d) };
}

/** Write policy per result key: PRs keep the best, body metrics keep the latest. */
export function resultPolicy(key: ResultKey): "max" | "latest" {
  return key.startsWith("oneRepMax.") || key === "vo2max" ? "max" : "latest";
}

/** Apply a saved result respecting the key's write policy. */
export function applyResult(
  p: ProgressState,
  key: ResultKey,
  value: number,
  at: number,
): ProgressState {
  const existing = p.results[key];
  if (existing && resultPolicy(key) === "max" && existing.value >= value) {
    return p; // not a new PR
  }
  const entry: SavedResult = { value, at };
  return { ...p, results: { ...p.results, [key]: entry } };
}

export function applyGoalPlan(p: ProgressState, plan: GoalPlan): ProgressState {
  return { ...p, goalPlan: plan };
}

export const LIFT_LABELS: Record<ProgressLift, string> = {
  squat: "Squat",
  bench: "Bench Press",
  deadlift: "Deadlift",
  ohp: "Overhead Press",
  other: "Other Lift",
};

/** Latest known weight: today's log entry, else most recent entry, else null. */
export function latestWeight(p: ProgressState): WeightPoint | null {
  if (p.weightLog.length === 0) return null;
  const last = p.weightLog[p.weightLog.length - 1];
  return { d: last.d, kg: last.kg };
}
export type WeightPoint = { d: string; kg: number };

/** Signed progress (kg moved toward the target) against a saved goal plan. */
export function progressTowardGoal(p: ProgressState): number | null {
  if (!p.goalPlan) return null;
  const latest = latestWeight(p);
  if (!latest) return null;
  const { startKg, targetKg } = p.goalPlan;
  const direction = Math.sign(targetKg - startKg) || 1;
  return (latest.kg - startKg) * direction;
}
