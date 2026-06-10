import type {
  ActivityLevel,
  HandoffEntry,
  HandoffKey,
  MaxHrFormula,
  Sex,
  Units,
} from "./types";
import type { ToolSlug } from "@/lib/tools";

/** Shared user profile — canonical values are ALWAYS metric. */
export type Profile = {
  sex: Sex | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  activity: ActivityLevel | null;
};

export type ToolPrefs = {
  maxHrFormula: MaxHrFormula | null; // null = sex-based default (Tanaka M / Gulati F)
};

// ───────────────────────── Progress (v2) ─────────────────────────

export type ProgressLift = "squat" | "bench" | "deadlift" | "ohp" | "other";

/**
 * Saved calculator results. Write policy per key:
 * oneRepMax.* and vo2max keep the MAX (personal record);
 * bodyFat / bmi / ffmi keep the LATEST.
 */
export type ResultKey =
  | `oneRepMax.${ProgressLift}`
  | "vo2max"
  | "bodyFat"
  | "bmi"
  | "ffmi";

export type SavedResult = { value: number; at: number };

export type WeightEntry = { d: string; kg: number }; // d = "yyyy-mm-dd", one per date

export type GoalPlan = {
  startDate: string; // "yyyy-mm-dd"
  startKg: number;
  targetKg: number;
  weeklyKg: number; // signed (negative = loss)
  at: number;
};

export type EarnedBadge = { id: string; earnedAt: number };

export type ProgressState = {
  /** Honor-system check-in dates ("yyyy-mm-dd"), deduped ascending, cap 730.
   *  Future merge rule (account claim, ROADMAP P3/P4): upload tagged
   *  method:'honor'; server QR check-ins win on conflict; union by date. */
  checkIns: string[];
  /** Epoch ms of the last check-in tap — enforces the 4h cooldown. */
  lastCheckInAt: number | null;
  /** One entry per date, last write wins, ascending by d, cap 1000.
   *  Merge rule: union by date, local wins for same-date (more recent intent). */
  weightLog: WeightEntry[];
  /** Merge rule: apply write policy (max/latest) across local + server. */
  results: Partial<Record<ResultKey, SavedResult>>;
  goalPlan: GoalPlan | null;
  /** Award-only, never revoked. Merge rule: union by id, earliest earnedAt. */
  badges: EarnedBadge[];
  /** Tool slugs the user has opened (for the all-16 badge). */
  usedTools: ToolSlug[];
  sharedAt: number | null;
};

export const DEFAULT_PROGRESS: ProgressState = {
  checkIns: [],
  lastCheckInAt: null,
  weightLog: [],
  results: {},
  goalPlan: null,
  badges: [],
  usedTools: [],
  sharedAt: null,
};

export const CHECKIN_CAP = 730;
export const WEIGHT_LOG_CAP = 1000;

// ───────────────────────── Storage document ─────────────────────────

export type ToolsStorage = {
  v: 2;
  /** Stable anonymous id — the future account-claim merge key. */
  deviceId: string;
  profile: Profile;
  units: Units;
  prefs: ToolPrefs;
  handoff: Partial<Record<HandoffKey, HandoffEntry>>;
  progress: ProgressState;
};

/** Key is historical — the internal `v` field is the real version. */
export const STORAGE_KEY = "anp.tools.v1";

export const DEFAULT_PROFILE: Profile = {
  sex: null,
  age: null,
  heightCm: null,
  weightKg: null,
  activity: null,
};

function newDeviceId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `dev-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function defaultStorage(): ToolsStorage {
  return {
    v: 2,
    deviceId: newDeviceId(),
    profile: DEFAULT_PROFILE,
    units: "metric",
    prefs: { maxHrFormula: null },
    handoff: {},
    progress: DEFAULT_PROGRESS,
  };
}

/** Validation limits (metric). */
export const LIMITS = {
  age: { min: 13, max: 100, label: "Age", unit: "years" },
  heightCm: { min: 100, max: 250, label: "Height", unit: "cm" },
  weightKg: { min: 30, max: 300, label: "Weight", unit: "kg" },
} as const;

export type LimitKind = keyof typeof LIMITS;

/**
 * Validate a canonical metric value against the shared limits.
 * Returns a friendly message, or null when valid (or empty).
 */
export function validateField(kind: LimitKind, value: number | null): string | null {
  if (value == null) return null;
  const l = LIMITS[kind];
  if (!Number.isFinite(value)) return `Enter a valid number for ${l.label.toLowerCase()}.`;
  if (value < l.min || value > l.max) {
    return `${l.label} should be between ${l.min} and ${l.max} ${l.unit}.`;
  }
  return null;
}

const isFiniteOrNull = (v: unknown): v is number | null =>
  v === null || (typeof v === "number" && Number.isFinite(v));

const isDateStr = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

function parseProfile(raw: unknown): Profile {
  const p = (raw ?? {}) as Partial<Profile>;
  return {
    sex: p.sex === "male" || p.sex === "female" ? p.sex : null,
    age: isFiniteOrNull(p.age ?? null) ? (p.age ?? null) : null,
    heightCm: isFiniteOrNull(p.heightCm ?? null) ? (p.heightCm ?? null) : null,
    weightKg: isFiniteOrNull(p.weightKg ?? null) ? (p.weightKg ?? null) : null,
    activity:
      p.activity === "sedentary" ||
      p.activity === "light" ||
      p.activity === "moderate" ||
      p.activity === "very" ||
      p.activity === "athlete"
        ? p.activity
        : null,
  };
}

function parsePrefs(raw: unknown): ToolPrefs {
  const prefs = (raw ?? {}) as Partial<ToolPrefs>;
  return {
    maxHrFormula:
      prefs.maxHrFormula === "classic" ||
      prefs.maxHrFormula === "tanaka" ||
      prefs.maxHrFormula === "gulati"
        ? prefs.maxHrFormula
        : null,
  };
}

/** Sort/dedup/cap the progress subtree — every write funnels through this. */
export function clampProgress(p: ProgressState): ProgressState {
  const checkIns = [...new Set(p.checkIns.filter(isDateStr))].sort();
  const byDate = new Map<string, number>();
  for (const e of p.weightLog) {
    if (e && isDateStr(e.d) && Number.isFinite(e.kg) && e.kg > 0) byDate.set(e.d, e.kg);
  }
  const weightLog = [...byDate.entries()]
    .map(([d, kg]) => ({ d, kg }))
    .sort((a, b) => (a.d < b.d ? -1 : 1));
  return {
    ...p,
    checkIns: checkIns.slice(-CHECKIN_CAP),
    weightLog: weightLog.slice(-WEIGHT_LOG_CAP),
    usedTools: [...new Set(p.usedTools)],
  };
}

function parseProgress(raw: unknown): ProgressState {
  const p = (raw ?? {}) as Partial<ProgressState>;
  const results: ProgressState["results"] = {};
  if (p.results && typeof p.results === "object") {
    for (const [k, v] of Object.entries(p.results)) {
      const entry = v as SavedResult | undefined;
      if (entry && Number.isFinite(entry.value) && Number.isFinite(entry.at)) {
        results[k as ResultKey] = { value: entry.value, at: entry.at };
      }
    }
  }
  const gp = p.goalPlan as GoalPlan | null | undefined;
  const goalPlan =
    gp &&
    isDateStr(gp.startDate) &&
    Number.isFinite(gp.startKg) &&
    Number.isFinite(gp.targetKg) &&
    Number.isFinite(gp.weeklyKg)
      ? { startDate: gp.startDate, startKg: gp.startKg, targetKg: gp.targetKg, weeklyKg: gp.weeklyKg, at: gp.at ?? 0 }
      : null;
  return clampProgress({
    checkIns: Array.isArray(p.checkIns) ? p.checkIns.filter(isDateStr) : [],
    lastCheckInAt: isFiniteOrNull(p.lastCheckInAt ?? null) ? (p.lastCheckInAt ?? null) : null,
    weightLog: Array.isArray(p.weightLog) ? p.weightLog : [],
    results,
    goalPlan,
    badges: Array.isArray(p.badges)
      ? p.badges.filter((b): b is EarnedBadge => !!b && typeof b.id === "string" && Number.isFinite(b.earnedAt))
      : [],
    usedTools: Array.isArray(p.usedTools) ? (p.usedTools.filter((t) => typeof t === "string") as ToolSlug[]) : [],
    sharedAt: isFiniteOrNull(p.sharedAt ?? null) ? (p.sharedAt ?? null) : null,
  });
}

/**
 * Parse the persisted document defensively.
 *
 * MIGRATION CONTRACT (do not break):
 * - v2 docs → validated field-by-field.
 * - v1 docs → profile/units/prefs/handoff parsed exactly as v1 did, then
 *   DEFAULT_PROGRESS and a fresh deviceId are attached. A v1 doc must NEVER
 *   fall through to defaults — that would wipe existing member profiles.
 * - anything else (corrupt, unknown version) → fresh defaults.
 */
export function parseStored(raw: string | null): ToolsStorage {
  if (!raw) return defaultStorage();
  try {
    const data = JSON.parse(raw) as { v?: unknown } | null;
    if (!data || typeof data !== "object") return defaultStorage();

    if (data.v === 2) {
      const d = data as Partial<ToolsStorage>;
      return {
        v: 2,
        deviceId: typeof d.deviceId === "string" && d.deviceId ? d.deviceId : newDeviceId(),
        profile: parseProfile(d.profile),
        units: d.units === "imperial" ? "imperial" : "metric",
        prefs: parsePrefs(d.prefs),
        handoff:
          d.handoff && typeof d.handoff === "object" ? (d.handoff as ToolsStorage["handoff"]) : {},
        progress: parseProgress(d.progress),
      };
    }

    if (data.v === 1) {
      const d = data as { profile?: unknown; units?: unknown; prefs?: unknown; handoff?: unknown };
      return {
        v: 2,
        deviceId: newDeviceId(),
        profile: parseProfile(d.profile),
        units: d.units === "imperial" ? "imperial" : "metric",
        prefs: parsePrefs(d.prefs),
        handoff:
          d.handoff && typeof d.handoff === "object" ? (d.handoff as ToolsStorage["handoff"]) : {},
        progress: DEFAULT_PROGRESS,
      };
    }

    return defaultStorage();
  } catch {
    return defaultStorage();
  }
}

/** Handoff entries older than this are ignored on consume. */
export const HANDOFF_TTL_MS = 60 * 60 * 1000;
