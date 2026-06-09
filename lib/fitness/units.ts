export const KG_PER_LB = 1 / 2.20462;
export const LB_PER_KG = 2.20462;
export const CM_PER_IN = 2.54;
export const M_PER_MILE = 1609.34;

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function cmToIn(cm: number): number {
  return cm / CM_PER_IN;
}

export function inToCm(inches: number): number {
  return inches * CM_PER_IN;
}

/** 178 cm → { ft: 5, in: 10 } (inches rounded to nearest whole). */
export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalIn = Math.round(cmToIn(cm));
  const ft = Math.floor(totalIn / 12);
  return { ft, in: totalIn - ft * 12 };
}

export function ftInToCm(ft: number, inches: number): number {
  return inToCm(ft * 12 + inches);
}

/** Round to `dp` decimal places, avoiding 24.700000000000003-style output. */
export function roundTo(value: number, dp = 1): number {
  const f = 10 ** dp;
  return Math.round((value + Number.EPSILON) * f) / f;
}

/** Round to an arbitrary increment, e.g. nearest 2.5 kg plate-friendly load. */
export function roundToStep(value: number, step: number): number {
  return roundTo(Math.round(value / step) * step, 2);
}

/** Format a number for display: trims trailing zeros after rounding. */
export function fmt(value: number, dp = 1): string {
  return String(roundTo(value, dp));
}
