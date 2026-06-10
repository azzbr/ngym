import { describe, expect, it } from "vitest";
import { evaluateBadges, RAMADAN_WINDOW } from "./badges";
import {
  clampProgress,
  DEFAULT_PROFILE,
  DEFAULT_PROGRESS,
  parseStored,
  type ProgressState,
} from "./profile";
import {
  applyCheckIn,
  applyGoalPlan,
  applyResult,
  applyWeightEntry,
  canCheckIn,
  currentStreak,
  longestStreak,
  progressTowardGoal,
  resultPolicy,
  toISODate,
} from "./progress";

const at = (iso: string, h = 12) => new Date(`${iso}T${String(h).padStart(2, "0")}:30:00`);

describe("streak math", () => {
  it("counts consecutive days ending today", () => {
    expect(currentStreak(["2026-06-08", "2026-06-09", "2026-06-10"], "2026-06-10")).toBe(3);
  });

  it("streak survives when yesterday checked but today not yet", () => {
    expect(currentStreak(["2026-06-08", "2026-06-09"], "2026-06-10")).toBe(2);
  });

  it("streak dies after a missed day", () => {
    expect(currentStreak(["2026-06-07", "2026-06-08"], "2026-06-10")).toBe(0);
  });

  it("crosses month boundaries", () => {
    expect(currentStreak(["2026-05-30", "2026-05-31", "2026-06-01"], "2026-06-01")).toBe(3);
  });

  it("longest streak finds historical runs", () => {
    expect(longestStreak(["2026-01-01", "2026-01-02", "2026-01-03", "2026-03-10", "2026-03-11"])).toBe(3);
    expect(longestStreak([])).toBe(0);
  });
});

describe("check-in", () => {
  it("4h cooldown blocks the midnight double-tap", () => {
    const first = applyCheckIn(DEFAULT_PROGRESS, at("2026-06-10", 23));
    expect(first.checkIns).toEqual(["2026-06-10"]);
    // 00:30 next day = 1.5h later → blocked
    const second = applyCheckIn(first, new Date("2026-06-11T00:30:00"));
    expect(second).toBe(first);
    expect(canCheckIn(first.lastCheckInAt, new Date("2026-06-11T03:31:00").getTime())).toBe(true);
  });

  it("dedupes same-day check-ins", () => {
    const a = applyCheckIn(DEFAULT_PROGRESS, at("2026-06-10", 6));
    const b = applyCheckIn({ ...a, lastCheckInAt: 0 }, at("2026-06-10", 20));
    expect(b.checkIns).toEqual(["2026-06-10"]);
  });
});

describe("weight log + results", () => {
  it("upserts one entry per date", () => {
    let p = applyWeightEntry(DEFAULT_PROGRESS, 80, at("2026-06-10"));
    p = applyWeightEntry(p, 79.5, at("2026-06-10"));
    expect(p.weightLog).toEqual([{ d: "2026-06-10", kg: 79.5 }]);
  });

  it("PR keys keep the max, body metrics keep the latest", () => {
    expect(resultPolicy("oneRepMax.squat")).toBe("max");
    expect(resultPolicy("bodyFat")).toBe("latest");
    let p = applyResult(DEFAULT_PROGRESS, "oneRepMax.squat", 120, 1);
    p = applyResult(p, "oneRepMax.squat", 110, 2); // lower → ignored
    expect(p.results["oneRepMax.squat"]!.value).toBe(120);
    p = applyResult(p, "bodyFat", 18, 1);
    p = applyResult(p, "bodyFat", 16, 2); // latest wins
    expect(p.results.bodyFat!.value).toBe(16);
  });

  it("progress toward goal is signed by direction", () => {
    let p = applyGoalPlan(DEFAULT_PROGRESS, {
      startDate: "2026-06-01", startKg: 100, targetKg: 80, weeklyKg: -0.75, at: 0,
    });
    p = applyWeightEntry(p, 94, at("2026-06-10"));
    expect(progressTowardGoal(p)).toBe(6); // lost 6 toward an 80 target
    p = applyWeightEntry(p, 102, at("2026-06-11"));
    expect(progressTowardGoal(p)).toBe(-2); // moved away
  });
});

describe("badges", () => {
  const base: ProgressState = { ...DEFAULT_PROGRESS };

  it("derived rules award once and are idempotent", () => {
    const p = applyCheckIn(base, at("2026-06-10"));
    const first = evaluateBadges(p, DEFAULT_PROFILE, undefined, at("2026-06-10"));
    expect(first).toContain("first-checkin");
    const withBadge = { ...p, badges: first.map((id) => ({ id, earnedAt: 1 })) };
    expect(evaluateBadges(withBadge, DEFAULT_PROFILE, undefined, at("2026-06-10"))).toEqual([]);
  });

  it("streak-7 awards on a 7-day run", () => {
    const days = ["2026-06-04", "2026-06-05", "2026-06-06", "2026-06-07", "2026-06-08", "2026-06-09", "2026-06-10"];
    const p = { ...base, checkIns: days };
    expect(evaluateBadges(p, DEFAULT_PROFILE, undefined, at("2026-06-10"))).toContain("streak-7");
  });

  it("event rules: early-bird before 6am, share", () => {
    const p = applyCheckIn(base, at("2026-06-10", 5));
    const awarded = evaluateBadges(p, DEFAULT_PROFILE, { type: "checkin", hour: 5, dateISO: "2026-06-10" }, at("2026-06-10", 5));
    expect(awarded).toContain("early-bird");
    const shared = evaluateBadges({ ...base, sharedAt: 1 }, DEFAULT_PROFILE, { type: "share" }, at("2026-06-10"));
    expect(shared).toContain("shared");
  });

  it("progress-5kg needs a saved plan and 5kg moved", () => {
    let p = applyGoalPlan(base, { startDate: "2026-06-01", startKg: 100, targetKg: 80, weeklyKg: -0.75, at: 0 });
    p = applyWeightEntry(p, 95, at("2026-06-10"));
    expect(evaluateBadges(p, DEFAULT_PROFILE, undefined, at("2026-06-10"))).toContain("progress-5kg");
  });

  it("ramadan badge is disabled while the window is null", () => {
    expect(RAMADAN_WINDOW).toBeNull();
    const p = applyCheckIn(base, at("2026-06-10"));
    const awarded = evaluateBadges(p, DEFAULT_PROFILE, { type: "checkin", hour: 19, dateISO: "2026-06-10" }, at("2026-06-10"));
    expect(awarded).not.toContain("ramadan");
  });
});

describe("storage v1 → v2 migration (must never wipe v1 data)", () => {
  const realV1 = JSON.stringify({
    v: 1,
    profile: { sex: "male", age: 30, heightCm: 180, weightKg: 80, activity: "moderate" },
    units: "imperial",
    prefs: { maxHrFormula: "classic" },
    handoff: { tdee: { value: 2759, from: "bmr-tdee", at: 123 } },
  });

  it("preserves a real v1 doc's profile/units/prefs/handoff and attaches progress", () => {
    const doc = parseStored(realV1);
    expect(doc.v).toBe(2);
    expect(doc.profile).toEqual({ sex: "male", age: 30, heightCm: 180, weightKg: 80, activity: "moderate" });
    expect(doc.units).toBe("imperial");
    expect(doc.prefs.maxHrFormula).toBe("classic");
    expect(doc.handoff.tdee?.value).toBe(2759);
    expect(doc.progress).toEqual(DEFAULT_PROGRESS);
    expect(doc.deviceId).toBeTruthy();
  });

  it("round-trips a v2 doc and keeps deviceId stable", () => {
    const v2 = parseStored(realV1);
    const again = parseStored(JSON.stringify(v2));
    expect(again.deviceId).toBe(v2.deviceId);
    expect(again.profile).toEqual(v2.profile);
  });

  it("corrupt/unknown docs fall back to defaults", () => {
    expect(parseStored("not json").v).toBe(2);
    expect(parseStored(JSON.stringify({ v: 99 })).profile).toEqual(DEFAULT_PROFILE);
    expect(parseStored(null).progress).toEqual(DEFAULT_PROGRESS);
  });

  it("clampProgress prunes, dedupes, sorts and caps", () => {
    const noisy: ProgressState = {
      ...DEFAULT_PROGRESS,
      checkIns: Array.from({ length: 800 }, (_, i) => toISODate(new Date(2024, 0, 1 + i))).concat(["2024-01-01", "bad-date"]),
      weightLog: [
        { d: "2026-06-10", kg: 80 },
        { d: "2026-06-09", kg: 81 },
        { d: "2026-06-10", kg: 79 }, // later same-date wins
        { d: "junk", kg: NaN },
      ],
    };
    const clamped = clampProgress(noisy);
    expect(clamped.checkIns.length).toBe(730);
    expect(clamped.checkIns.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))).toBe(true);
    expect(clamped.weightLog).toEqual([
      { d: "2026-06-09", kg: 81 },
      { d: "2026-06-10", kg: 79 },
    ]);
  });
});
