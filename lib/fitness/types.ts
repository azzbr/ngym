export type Sex = "male" | "female";

export type Units = "metric" | "imperial";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very"
  | "athlete";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  athlete: 1.9,
};

export const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Light (1–3 d/wk)" },
  { value: "moderate", label: "Moderate (3–5 d/wk)" },
  { value: "very", label: "Very active (6–7 d/wk)" },
  { value: "athlete", label: "Athlete / physical job" },
];

export type MaxHrFormula = "classic" | "tanaka" | "gulati";

export type GoalPreset =
  | "aggressive_cut"
  | "standard_cut"
  | "slow_cut"
  | "maintain"
  | "lean_bulk"
  | "fast_bulk";

export type MacroGoal = "cut" | "maintain" | "bulk";

export type Lift = "squat" | "bench" | "deadlift" | "ohp";

export type StrengthLevel =
  | "untrained"
  | "beginner"
  | "novice"
  | "intermediate"
  | "advanced"
  | "elite";

/** One colored band on a result scale bar. min inclusive, max exclusive. */
export type ScaleBand = {
  label: string;
  min: number;
  max: number;
  color: string;
};

/** Values one calculator hands to another via the "Use this result" flow. */
export type HandoffKey =
  | "bodyFatPct"
  | "bmr"
  | "tdee"
  | "calorieTarget"
  | "oneRepMaxKg";

export type HandoffEntry = { value: number; from: string; at: number };
