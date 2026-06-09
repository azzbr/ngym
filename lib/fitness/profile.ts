import type {
  ActivityLevel,
  HandoffEntry,
  HandoffKey,
  MaxHrFormula,
  Sex,
  Units,
} from "./types";

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

export type ToolsStorageV1 = {
  v: 1;
  profile: Profile;
  units: Units;
  prefs: ToolPrefs;
  handoff: Partial<Record<HandoffKey, HandoffEntry>>;
};

export const STORAGE_KEY = "anp.tools.v1";

export const DEFAULT_PROFILE: Profile = {
  sex: null,
  age: null,
  heightCm: null,
  weightKg: null,
  activity: null,
};

export const DEFAULT_STORAGE: ToolsStorageV1 = {
  v: 1,
  profile: DEFAULT_PROFILE,
  units: "metric",
  prefs: { maxHrFormula: null },
  handoff: {},
};

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

/**
 * Parse the persisted document defensively. Anything unexpected
 * (old version, corrupt JSON, wrong shapes) falls back to defaults.
 */
export function parseStored(raw: string | null): ToolsStorageV1 {
  if (!raw) return DEFAULT_STORAGE;
  try {
    const data = JSON.parse(raw) as Partial<ToolsStorageV1> | null;
    if (!data || typeof data !== "object" || data.v !== 1) return DEFAULT_STORAGE;
    const p = (data.profile ?? {}) as Partial<Profile>;
    const profile: Profile = {
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
    const prefs = (data.prefs ?? {}) as Partial<ToolPrefs>;
    return {
      v: 1,
      profile,
      units: data.units === "imperial" ? "imperial" : "metric",
      prefs: {
        maxHrFormula:
          prefs.maxHrFormula === "classic" ||
          prefs.maxHrFormula === "tanaka" ||
          prefs.maxHrFormula === "gulati"
            ? prefs.maxHrFormula
            : null,
      },
      handoff:
        data.handoff && typeof data.handoff === "object"
          ? (data.handoff as ToolsStorageV1["handoff"])
          : {},
    };
  } catch {
    return DEFAULT_STORAGE;
  }
}

/** Handoff entries older than this are ignored on consume. */
export const HANDOFF_TTL_MS = 60 * 60 * 1000;
