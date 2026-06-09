import {
  ACTIVITY_MULTIPLIERS,
  type ActivityLevel,
  type Lift,
  type MaxHrFormula,
  type Sex,
} from "./types";
import { kgToLb } from "./units";

/**
 * All calculator math lives here as pure functions.
 * Convention: functions return `null` when a guard trips (impossible or
 * out-of-domain input) — they never throw. UI maps `null` to a friendly
 * inline message. All inputs/outputs are metric; unit conversion happens
 * at the component edge.
 */

const finite = (...vals: number[]) => vals.every((v) => Number.isFinite(v));

// ───────────────────────── Body metrics ─────────────────────────

/** BMI = kg / m². */
export function bmi(weightKg: number, heightCm: number): number | null {
  if (!finite(weightKg, heightCm) || weightKg <= 0 || heightCm <= 0) return null;
  const m = heightCm / 100;
  return weightKg / (m * m);
}

/**
 * US Navy body-fat % (log10, centimeter inputs only).
 * Men:   495 / (1.0324 − 0.19077·log10(waist − neck) + 0.15456·log10(height)) − 450
 * Women: 495 / (1.29579 − 0.35004·log10(waist + hip − neck) + 0.22100·log10(height)) − 450
 * Guards: waist > neck (men), waist + hip > neck (women). Output clamped to 2–60%.
 */
export function navyBodyFat(args: {
  sex: Sex;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number | null;
}): number | null {
  const { sex, heightCm, neckCm, waistCm, hipCm } = args;
  if (!finite(heightCm, neckCm, waistCm) || heightCm <= 0 || neckCm <= 0 || waistCm <= 0)
    return null;
  let denom: number;
  if (sex === "male") {
    if (waistCm - neckCm <= 0) return null;
    denom =
      1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm);
  } else {
    if (hipCm == null || !finite(hipCm) || hipCm <= 0) return null;
    if (waistCm + hipCm - neckCm <= 0) return null;
    denom =
      1.29579 -
      0.35004 * Math.log10(waistCm + hipCm - neckCm) +
      0.221 * Math.log10(heightCm);
  }
  if (denom <= 0) return null;
  const bf = 495 / denom - 450;
  return Math.min(60, Math.max(2, bf));
}

/**
 * FFMI. FFM = kg·(1 − BF/100); FFMI = FFM/m²;
 * normalized = FFMI + 6.1·(1.8 − height_m).
 */
export function ffmi(
  weightKg: number,
  heightCm: number,
  bodyFatPct: number,
): { ffm: number; ffmi: number; normalized: number } | null {
  if (!finite(weightKg, heightCm, bodyFatPct)) return null;
  if (weightKg <= 0 || heightCm <= 0 || bodyFatPct < 0 || bodyFatPct >= 100) return null;
  const m = heightCm / 100;
  const ffm = weightKg * (1 - bodyFatPct / 100);
  const raw = ffm / (m * m);
  return { ffm, ffmi: raw, normalized: raw + 6.1 * (1.8 - m) };
}

/** Waist-to-hip ratio. */
export function waistToHip(waistCm: number, hipCm: number): number | null {
  if (!finite(waistCm, hipCm) || waistCm <= 0 || hipCm <= 0) return null;
  return waistCm / hipCm;
}

/**
 * Ideal weight (kg) via four sex-specific population formulas, using inches
 * over 5 ft (clamped at 0 for shorter heights), plus the BMI 18.5–24.9 range.
 */
export function idealWeight(
  sex: Sex,
  heightCm: number,
): {
  devine: number;
  robinson: number;
  miller: number;
  hamwi: number;
  min: number;
  max: number;
  bmiLow: number;
  bmiHigh: number;
} | null {
  if (!finite(heightCm) || heightCm <= 0) return null;
  const over = Math.max(0, heightCm / 2.54 - 60);
  const male = sex === "male";
  const devine = (male ? 50 : 45.5) + 2.3 * over;
  const robinson = male ? 52 + 1.9 * over : 49 + 1.7 * over;
  const miller = male ? 56.2 + 1.41 * over : 53.1 + 1.36 * over;
  const hamwi = male ? 48 + 2.7 * over : 45.5 + 2.2 * over;
  const all = [devine, robinson, miller, hamwi];
  const m = heightCm / 100;
  return {
    devine,
    robinson,
    miller,
    hamwi,
    min: Math.min(...all),
    max: Math.max(...all),
    bmiLow: 18.5 * m * m,
    bmiHigh: 24.9 * m * m,
  };
}

// ───────────────────────── Nutrition ─────────────────────────

/** Mifflin-St Jeor BMR: 10·kg + 6.25·cm − 5·age + 5 (M) / − 161 (F). */
export function mifflinStJeor(
  sex: Sex,
  ageYr: number,
  weightKg: number,
  heightCm: number,
): number | null {
  if (!finite(ageYr, weightKg, heightCm) || ageYr <= 0 || weightKg <= 0 || heightCm <= 0)
    return null;
  return 10 * weightKg + 6.25 * heightCm - 5 * ageYr + (sex === "male" ? 5 : -161);
}

/** Katch-McArdle BMR: 370 + 21.6·FFM. BF% entered as percent (e.g. 25). */
export function katchMcArdle(weightKg: number, bodyFatPct: number): number | null {
  if (!finite(weightKg, bodyFatPct) || weightKg <= 0) return null;
  if (bodyFatPct < 0 || bodyFatPct >= 100) return null;
  return 370 + 21.6 * weightKg * (1 - bodyFatPct / 100);
}

/** TDEE = BMR × activity multiplier. */
export function tdee(bmr: number, activity: ActivityLevel): number | null {
  if (!finite(bmr) || bmr <= 0) return null;
  return bmr * ACTIVITY_MULTIPLIERS[activity];
}

/** Calorie safety floor: 1,200 kcal (women) / 1,500 kcal (men). */
export function calorieFloor(sex: Sex): number {
  return sex === "male" ? 1500 : 1200;
}

/** Daily kcal target from TDEE and a signed percent (e.g. −0.20 for a 20% cut). */
export function calorieTarget(tdeeKcal: number, pct: number): number | null {
  if (!finite(tdeeKcal, pct) || tdeeKcal <= 0) return null;
  return tdeeKcal * (1 + pct);
}

/** Weekly weight change (kg, signed) from a signed daily kcal delta (7,700 kcal ≈ 1 kg). */
export function weeklyChangeKg(dailyDeltaKcal: number): number {
  return (dailyDeltaKcal * 7) / 7700;
}

/**
 * Macro split. Protein by g/kg, fat as % of calories (min 0.5 g/kg),
 * carbs = remaining ÷ 4. Energy: protein 4, carbs 4, fat 9 kcal/g.
 * Returns null when protein + fat alone exceed the calorie target.
 */
export function macroSplit(
  calories: number,
  weightKg: number,
  proteinGPerKg: number,
  fatPctOfCalories: number,
): {
  protein: { g: number; kcal: number; pct: number };
  fat: { g: number; kcal: number; pct: number };
  carbs: { g: number; kcal: number; pct: number };
} | null {
  if (!finite(calories, weightKg, proteinGPerKg, fatPctOfCalories)) return null;
  if (calories <= 0 || weightKg <= 0 || proteinGPerKg <= 0) return null;
  const proteinG = proteinGPerKg * weightKg;
  const proteinKcal = proteinG * 4;
  const fatG = Math.max((calories * fatPctOfCalories) / 9, 0.5 * weightKg);
  const fatKcal = fatG * 9;
  const carbsKcal = calories - proteinKcal - fatKcal;
  if (carbsKcal < 0) return null;
  const carbsG = carbsKcal / 4;
  const pct = (kcal: number) => (kcal / calories) * 100;
  return {
    protein: { g: proteinG, kcal: proteinKcal, pct: pct(proteinKcal) },
    fat: { g: fatG, kcal: fatKcal, pct: pct(fatKcal) },
    carbs: { g: carbsG, kcal: carbsKcal, pct: pct(carbsKcal) },
  };
}

export type ProteinGoal = "sedentary" | "general" | "muscle" | "cutting";

export const PROTEIN_RANGES: Record<ProteinGoal, { min: number; max: number }> = {
  sedentary: { min: 0.8, max: 0.8 },
  general: { min: 1.2, max: 1.6 },
  muscle: { min: 1.6, max: 2.2 },
  cutting: { min: 2.0, max: 2.7 },
};

/** Daily protein range (g) for a goal. */
export function proteinRange(
  weightKg: number,
  goal: ProteinGoal,
): { minG: number; maxG: number } | null {
  if (!finite(weightKg) || weightKg <= 0) return null;
  const r = PROTEIN_RANGES[goal];
  return { minG: r.min * weightKg, maxG: r.max * weightKg };
}

/** Daily water (liters): 35 ml × kg + 500 ml per 30 min of training. */
export function waterIntake(weightKg: number, trainingMinPerDay: number): number | null {
  if (!finite(weightKg, trainingMinPerDay) || weightKg <= 0 || trainingMinPerDay < 0)
    return null;
  return (35 * weightKg + 500 * (trainingMinPerDay / 30)) / 1000;
}

export type TimelineResult = {
  /** Signed kg per week (negative = loss). */
  weeklyKg: number;
  /** Weeks to reach target; null when unreachable at this intake. */
  weeks: number | null;
  /** True when the calorie delta moves weight AWAY from the target. */
  mismatch: boolean;
  /** |weeklyKg| as % of current bodyweight (rate-warning input). */
  ratePctPerWeek: number;
  /** Linear weekly projection current → target for the chart (≤ ~2 years). */
  points: { week: number; kg: number }[];
};

/**
 * Goal timeline: weekly_change = daily_delta × 7 / 7700; weeks = gap / weekly.
 * Handles target = current (0 weeks), zero delta (unreachable) and
 * direction mismatch explicitly.
 */
export function goalTimeline(
  currentKg: number,
  targetKg: number,
  dailyDeltaKcal: number,
): TimelineResult | null {
  if (!finite(currentKg, targetKg, dailyDeltaKcal) || currentKg <= 0 || targetKg <= 0)
    return null;
  const weeklyKg = weeklyChangeKg(dailyDeltaKcal);
  const gap = targetKg - currentKg;
  const ratePctPerWeek = (Math.abs(weeklyKg) / currentKg) * 100;
  if (gap === 0) {
    return { weeklyKg, weeks: 0, mismatch: false, ratePctPerWeek, points: [{ week: 0, kg: currentKg }] };
  }
  if (weeklyKg === 0) {
    return { weeklyKg: 0, weeks: null, mismatch: false, ratePctPerWeek: 0, points: [] };
  }
  if (Math.sign(gap) !== Math.sign(weeklyKg)) {
    return { weeklyKg, weeks: null, mismatch: true, ratePctPerWeek, points: [] };
  }
  const weeks = gap / weeklyKg;
  const points: { week: number; kg: number }[] = [];
  const capped = Math.min(Math.ceil(weeks), 104);
  for (let w = 0; w <= capped; w++) {
    const kg = w >= weeks ? targetKg : currentKg + weeklyKg * w;
    points.push({ week: w, kg });
  }
  return { weeklyKg, weeks, mismatch: false, ratePctPerWeek, points };
}

// ───────────────────────── Strength ─────────────────────────

/** Epley 1RM = w·(1 + r/30). Returns w at 1 rep; valid 1–12 reps. */
export function epley(weight: number, reps: number): number | null {
  if (!finite(weight, reps) || weight <= 0) return null;
  if (!Number.isInteger(reps) || reps < 1 || reps > 12) return null;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/** Brzycki 1RM = w·36/(37 − r). Returns w at 1 rep; valid 1–12 reps. */
export function brzycki(weight: number, reps: number): number | null {
  if (!finite(weight, reps) || weight <= 0) return null;
  if (!Number.isInteger(reps) || reps < 1 || reps > 12) return null;
  if (reps === 1) return weight;
  return (weight * 36) / (37 - reps);
}

export const PERCENT_TABLE: { pct: number; reps: number }[] = [
  { pct: 95, reps: 2 },
  { pct: 90, reps: 4 },
  { pct: 85, reps: 6 },
  { pct: 80, reps: 8 },
  { pct: 75, reps: 10 },
  { pct: 70, reps: 12 },
  { pct: 65, reps: 15 },
];

export type StrengthResult = {
  ratio: number;
  /** Index into the 5 thresholds passed; −1 = below Beginner. */
  levelIndex: number;
  levelLabel: string;
  next: { label: string; ratio: number; weightNeeded: number } | null;
};

export const STRENGTH_LEVEL_LABELS = [
  "Beginner",
  "Novice",
  "Intermediate",
  "Advanced",
  "Elite",
] as const;

/** Bodyweight-multiple thresholds (approximate community standards). */
export const STRENGTH_STANDARDS: Record<Sex, Record<Lift, number[]>> = {
  male: {
    squat: [0.75, 1.0, 1.5, 2.0, 2.5],
    bench: [0.5, 0.75, 1.0, 1.5, 2.0],
    deadlift: [1.0, 1.25, 1.75, 2.25, 3.0],
    ohp: [0.35, 0.5, 0.7, 0.9, 1.1],
  },
  female: {
    squat: [0.5, 0.75, 1.0, 1.5, 2.0],
    bench: [0.25, 0.4, 0.6, 0.9, 1.2],
    deadlift: [0.5, 0.75, 1.25, 1.75, 2.5],
    ohp: [0.2, 0.3, 0.45, 0.6, 0.8],
  },
};

/** Level = highest threshold reached, as bodyweight multiples. */
export function strengthLevel(
  sex: Sex,
  lift: Lift,
  bodyweightKg: number,
  oneRmKg: number,
): StrengthResult | null {
  if (!finite(bodyweightKg, oneRmKg) || bodyweightKg <= 0 || oneRmKg <= 0) return null;
  const thresholds = STRENGTH_STANDARDS[sex][lift];
  const ratio = oneRmKg / bodyweightKg;
  let levelIndex = -1;
  for (let i = 0; i < thresholds.length; i++) {
    if (ratio >= thresholds[i]) levelIndex = i;
  }
  const levelLabel = levelIndex === -1 ? "Untrained" : STRENGTH_LEVEL_LABELS[levelIndex];
  const nextIndex = levelIndex + 1;
  const next =
    nextIndex < thresholds.length
      ? {
          label: STRENGTH_LEVEL_LABELS[nextIndex],
          ratio: thresholds[nextIndex],
          weightNeeded: thresholds[nextIndex] * bodyweightKg - oneRmKg,
        }
      : null;
  return { ratio, levelIndex, levelLabel, next };
}

export type PlateResult = {
  /** Plates on ONE side, largest first. */
  perSide: number[];
  /** Total bar weight this loadout produces. */
  total: number;
  exact: boolean;
  /** When not exact: nearest achievable below/above the target (if any). */
  below: { total: number; perSide: number[] } | null;
  above: { total: number; perSide: number[] } | null;
};

/**
 * Plate loading: per_side = (target − bar) / 2, decomposed largest-first.
 * Unit-agnostic (pass kg or lb consistently). Works in integer quarter-units
 * so 61.25 decomposes exactly. Unlimited plate counts per denomination.
 * When the target isn't exactly loadable, returns nearest achievable
 * totals below and above via reachability DP.
 */
export function plateLoading(
  target: number,
  bar: number,
  plates: number[],
): PlateResult | null {
  if (!finite(target, bar) || target <= 0 || bar <= 0) return null;
  if (target < bar) return null;
  const usable = [...new Set(plates.filter((p) => finite(p) && p > 0))].sort((a, b) => b - a);
  const q = (v: number) => Math.round(v * 4); // quarter-units
  const perSideQ = q((target - bar) / 2);
  const plateQ = usable.map(q);

  // Reachability DP with parent pointers, bounded a little past the target.
  const bound = perSideQ + (plateQ[0] ?? 0) + 1;
  const parent = new Int32Array(bound + 1).fill(-2); // -2 unreachable, -1 root
  parent[0] = -1;
  for (let s = 0; s <= bound; s++) {
    if (parent[s] === -2) continue;
    for (const p of plateQ) {
      const nxt = s + p;
      if (nxt <= bound && parent[nxt] === -2) parent[nxt] = p;
    }
  }
  const decompose = (sumQ: number): number[] => {
    const out: number[] = [];
    let s = sumQ;
    while (s > 0) {
      const p = parent[s];
      if (p <= 0) break;
      out.push(p / 4);
      s -= p;
    }
    return out.sort((a, b) => b - a);
  };
  const totalFor = (sideQ: number) => bar + (sideQ * 2) / 4;

  if (perSideQ >= 0 && parent[perSideQ] !== -2) {
    return {
      perSide: decompose(perSideQ),
      total: totalFor(perSideQ),
      exact: true,
      below: null,
      above: null,
    };
  }
  let belowQ = -1;
  for (let s = perSideQ - 1; s >= 0; s--) {
    if (parent[s] !== -2) {
      belowQ = s;
      break;
    }
  }
  let aboveQ = -1;
  for (let s = perSideQ + 1; s <= bound; s++) {
    if (parent[s] !== -2) {
      aboveQ = s;
      break;
    }
  }
  return {
    perSide: belowQ >= 0 ? decompose(belowQ) : [],
    total: belowQ >= 0 ? totalFor(belowQ) : bar,
    exact: false,
    below: belowQ >= 0 ? { total: totalFor(belowQ), perSide: decompose(belowQ) } : null,
    above: aboveQ >= 0 ? { total: totalFor(aboveQ), perSide: decompose(aboveQ) } : null,
  };
}

// ───────────────────────── Cardio ─────────────────────────

/** Max HR: Classic 220 − age · Tanaka 208 − 0.7·age · Gulati (women) 206 − 0.88·age. */
export function maxHeartRate(formula: MaxHrFormula, ageYr: number): number | null {
  if (!finite(ageYr) || ageYr <= 0) return null;
  switch (formula) {
    case "classic":
      return 220 - ageYr;
    case "tanaka":
      return 208 - 0.7 * ageYr;
    case "gulati":
      return 206 - 0.88 * ageYr;
  }
}

export type HrZone = {
  zone: number;
  name: string;
  description: string;
  pctLow: number;
  pctHigh: number;
  bpmLow: number;
  bpmHigh: number;
};

const ZONE_DEFS = [
  { zone: 1, name: "Recovery", description: "Very easy — warm-ups and active recovery.", lo: 0.5, hi: 0.6 },
  { zone: 2, name: "Fat burn / base", description: "Comfortable pace you can hold while talking.", lo: 0.6, hi: 0.7 },
  { zone: 3, name: "Aerobic", description: "Moderate effort that builds endurance.", lo: 0.7, hi: 0.8 },
  { zone: 4, name: "Threshold", description: "Hard — sustainable only for shorter stretches.", lo: 0.8, hi: 0.9 },
  { zone: 5, name: "Max effort", description: "All-out intervals; only brief bursts.", lo: 0.9, hi: 1.0 },
] as const;

/**
 * Five training zones as % of max HR, or on heart-rate reserve (Karvonen)
 * when a resting HR is supplied: target = (maxHR − restHR)·intensity + restHR.
 */
export function hrZones(maxHr: number, restHr?: number | null): HrZone[] | null {
  if (!finite(maxHr) || maxHr <= 0) return null;
  const useKarvonen = restHr != null && Number.isFinite(restHr) && restHr > 0;
  if (useKarvonen && restHr! >= maxHr) return null;
  return ZONE_DEFS.map((z) => {
    const at = (p: number) =>
      useKarvonen ? (maxHr - restHr!) * p + restHr! : maxHr * p;
    return {
      zone: z.zone,
      name: z.name,
      description: z.description,
      pctLow: z.lo * 100,
      pctHigh: z.hi * 100,
      bpmLow: Math.round(at(z.lo)),
      bpmHigh: Math.round(at(z.hi)),
    };
  });
}

/** Quick VO2max estimate: 15.3 × (maxHR / restingHR). */
export function vo2Resting(maxHr: number, restHr: number): number | null {
  if (!finite(maxHr, restHr) || maxHr <= 0 || restHr <= 0) return null;
  return 15.3 * (maxHr / restHr);
}

/**
 * Rockport 1-mile walk test.
 * VO2max = 132.853 − 0.0769·weight_lb − 0.3877·age + 6.315·sex − 3.2649·time_min − 0.1565·HR
 * (sex: male = 1, female = 0; weight converted from kg internally).
 */
export function vo2Rockport(
  sex: Sex,
  weightKg: number,
  ageYr: number,
  timeMin: number,
  hrBpm: number,
): number | null {
  if (!finite(weightKg, ageYr, timeMin, hrBpm)) return null;
  if (weightKg <= 0 || ageYr <= 0 || timeMin <= 0 || hrBpm <= 0) return null;
  return (
    132.853 -
    0.0769 * kgToLb(weightKg) -
    0.3877 * ageYr +
    6.315 * (sex === "male" ? 1 : 0) -
    3.2649 * timeMin -
    0.1565 * hrBpm
  );
}

/** Cooper 12-minute run test: VO2max = (distance_m − 504.9) / 44.73. */
export function vo2Cooper(distanceM: number): number | null {
  if (!finite(distanceM) || distanceM <= 0) return null;
  return (distanceM - 504.9) / 44.73;
}
