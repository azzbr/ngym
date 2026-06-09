import type { ScaleBand, Sex } from "./types";

/**
 * All rating tables as data constants (easy to tweak), plus the band lookup.
 * Band semantics: min inclusive, max exclusive. Colors stay within the brand
 * palette: greys for neutral, green (#1A7A3C family) for favorable,
 * red (#CC1A1A family) for caution/risk.
 */

export const BAND_COLORS = {
  greyLight: "#9A9A9A",
  grey: "#6B6B6B",
  dark: "#2A2A2A",
  green: "#1A7A3C",
  greenLight: "#5FA777",
  redDark: "#8E1212",
  red: "#CC1A1A",
} as const;

const C = BAND_COLORS;

/** Find the band containing `value` (min inclusive, max exclusive). */
export function bandFor(bands: ScaleBand[], value: number): ScaleBand {
  for (const b of bands) {
    if (value >= b.min && value < b.max) return b;
  }
  return value < bands[0].min ? bands[0] : bands[bands.length - 1];
}

// ───────────────────────── BMI (WHO — same for both sexes) ─────────────────────────

export const BMI_BANDS: ScaleBand[] = [
  { label: "Underweight", min: 0, max: 18.5, color: C.greyLight },
  { label: "Normal", min: 18.5, max: 25, color: C.green },
  { label: "Overweight", min: 25, max: 30, color: C.grey },
  { label: "Obese", min: 30, max: Infinity, color: C.red },
];
/** Display window for the BMI scale bar. */
export const BMI_SCALE = { min: 14, max: 42 };

// ───────────────────────── Body fat % (ACE) ─────────────────────────

export const BODY_FAT_BANDS: Record<Sex, ScaleBand[]> = {
  male: [
    { label: "Essential fat", min: 2, max: 6, color: C.greyLight },
    { label: "Athletes", min: 6, max: 14, color: C.green },
    { label: "Fitness", min: 14, max: 18, color: C.greenLight },
    { label: "Average", min: 18, max: 25, color: C.grey },
    { label: "Obese", min: 25, max: Infinity, color: C.red },
  ],
  female: [
    { label: "Essential fat", min: 10, max: 14, color: C.greyLight },
    { label: "Athletes", min: 14, max: 21, color: C.green },
    { label: "Fitness", min: 21, max: 25, color: C.greenLight },
    { label: "Average", min: 25, max: 32, color: C.grey },
    { label: "Obese", min: 32, max: Infinity, color: C.red },
  ],
};
export const BODY_FAT_SCALE: Record<Sex, { min: number; max: number }> = {
  male: { min: 2, max: 40 },
  female: { min: 10, max: 48 },
};

// ───────────────────────── FFMI (normalized) ─────────────────────────

export const FFMI_BANDS: Record<Sex, ScaleBand[]> = {
  male: [
    { label: "Below average", min: 0, max: 18, color: C.greyLight },
    { label: "Average", min: 18, max: 20, color: C.grey },
    { label: "Above average", min: 20, max: 22, color: C.greenLight },
    { label: "Excellent", min: 22, max: 23, color: C.green },
    { label: "Superior", min: 23, max: 25, color: C.dark },
    { label: "Rarely achieved naturally", min: 25, max: Infinity, color: C.red },
  ],
  female: [
    { label: "Below average", min: 0, max: 14, color: C.greyLight },
    { label: "Average", min: 14, max: 16, color: C.grey },
    { label: "Above average", min: 16, max: 18, color: C.greenLight },
    { label: "Excellent", min: 18, max: 19, color: C.green },
    { label: "Superior", min: 19, max: 21.5, color: C.dark },
    { label: "Rarely achieved naturally", min: 21.5, max: Infinity, color: C.red },
  ],
};
export const FFMI_SCALE: Record<Sex, { min: number; max: number }> = {
  male: { min: 14, max: 28 },
  female: { min: 10, max: 24 },
};

// ───────────────────────── Waist-to-hip ratio (WHO) ─────────────────────────

export const WHR_BANDS: Record<Sex, ScaleBand[]> = {
  male: [
    { label: "Low risk", min: 0, max: 0.9, color: C.green },
    { label: "Moderate risk", min: 0.9, max: 1.0, color: C.grey },
    { label: "High risk", min: 1.0, max: Infinity, color: C.red },
  ],
  female: [
    { label: "Low risk", min: 0, max: 0.8, color: C.green },
    { label: "Moderate risk", min: 0.8, max: 0.85, color: C.grey },
    { label: "High risk", min: 0.85, max: Infinity, color: C.red },
  ],
};
export const WHR_SCALE: Record<Sex, { min: number; max: number }> = {
  male: { min: 0.7, max: 1.2 },
  female: { min: 0.6, max: 1.1 },
};

// ───────────────────────── HR zone colors ─────────────────────────

export const HR_ZONE_COLORS: string[] = [C.greyLight, C.green, C.greenLight, C.redDark, C.red];

// ───────────────────────── VO2 max norms (ml/kg/min, approximate) ─────────────────────────

export type Vo2Row = {
  ageMin: number;
  ageMax: number;
  /** Thresholds: [fairFrom, goodFrom, excellentFrom, superiorFrom]. Below fairFrom = Poor. */
  thresholds: [number, number, number, number];
};

export const VO2_TABLES: Record<Sex, Vo2Row[]> = {
  male: [
    { ageMin: 0, ageMax: 29, thresholds: [36, 42, 51, 56] },
    { ageMin: 30, ageMax: 39, thresholds: [34, 40, 48, 54] },
    { ageMin: 40, ageMax: 49, thresholds: [31, 37, 45, 53] },
    { ageMin: 50, ageMax: 59, thresholds: [28, 34, 42, 49] },
    { ageMin: 60, ageMax: 200, thresholds: [25, 30, 39, 45] },
  ],
  female: [
    { ageMin: 0, ageMax: 29, thresholds: [31, 36, 44, 50] },
    { ageMin: 30, ageMax: 39, thresholds: [29, 34, 41, 47] },
    { ageMin: 40, ageMax: 49, thresholds: [26, 31, 38, 45] },
    { ageMin: 50, ageMax: 59, thresholds: [23, 28, 35, 41] },
    { ageMin: 60, ageMax: 200, thresholds: [21, 25, 32, 38] },
  ],
};

export const VO2_LEVEL_LABELS = ["Poor", "Fair", "Good", "Excellent", "Superior"] as const;

/** Build sex+age-specific VO2 ScaleBands from the norm table. */
export function vo2Bands(sex: Sex, ageYr: number): ScaleBand[] {
  const rows = VO2_TABLES[sex];
  const row = rows.find((r) => ageYr >= r.ageMin && ageYr <= r.ageMax) ?? rows[0];
  const [fair, good, excellent, superior] = row.thresholds;
  return [
    { label: "Poor", min: 0, max: fair, color: C.red },
    { label: "Fair", min: fair, max: good, color: C.grey },
    { label: "Good", min: good, max: excellent, color: C.greenLight },
    { label: "Excellent", min: excellent, max: superior, color: C.green },
    { label: "Superior", min: superior, max: Infinity, color: C.dark },
  ];
}
export const VO2_SCALE = { min: 15, max: 65 };
