import { describe, expect, it } from "vitest";
import {
  bmi,
  brzycki,
  calorieFloor,
  calorieTarget,
  epley,
  ffmi,
  goalTimeline,
  hrZones,
  idealWeight,
  katchMcArdle,
  macroSplit,
  maxHeartRate,
  mifflinStJeor,
  navyBodyFat,
  plateLoading,
  proteinRange,
  strengthLevel,
  tdee,
  vo2Cooper,
  vo2Resting,
  vo2Rockport,
  waistToHip,
  waterIntake,
  weeklyChangeKg,
} from "./formulas";
import { bandFor, BMI_BANDS, vo2Bands } from "./ratings";
import { cmToFtIn, ftInToCm, kgToLb, lbToKg, roundTo } from "./units";

describe("spot checks from the build guide", () => {
  it("BMI: 80 kg, 180 cm → 24.7 (Normal)", () => {
    const v = bmi(80, 180)!;
    expect(roundTo(v, 1)).toBe(24.7);
    expect(bandFor(BMI_BANDS, v).label).toBe("Normal");
  });

  it("Mifflin BMR: male, 30 y, 80 kg, 180 cm → 1,780 kcal", () => {
    expect(mifflinStJeor("male", 30, 80, 180)).toBe(1780);
  });

  it("TDEE: 1,780 × 1.55 ≈ 2,759 kcal", () => {
    expect(tdee(1780, "moderate")!).toBeCloseTo(2759, 0);
  });

  it("Mifflin BMR: female, 28 y, 62 kg, 165 cm ≈ 1,350 kcal", () => {
    expect(mifflinStJeor("female", 28, 62, 165)!).toBeCloseTo(1350.25, 2);
  });

  it("TDEE: female example × 1.375 ≈ 1,857 kcal", () => {
    const b = mifflinStJeor("female", 28, 62, 165)!;
    expect(tdee(b, "light")!).toBeCloseTo(1856.6, 0);
  });

  it("Navy BF%: male, height 180, waist 85, neck 38 ≈ 16.1%", () => {
    const v = navyBodyFat({ sex: "male", heightCm: 180, neckCm: 38, waistCm: 85 })!;
    expect(roundTo(v, 1)).toBeCloseTo(16.1, 1);
  });

  it("1RM Epley: 100 kg × 5 reps → 116.7 kg", () => {
    expect(roundTo(epley(100, 5)!, 1)).toBe(116.7);
  });

  it("1RM Brzycki: 100 kg × 5 reps → 112.5 kg", () => {
    expect(brzycki(100, 5)!).toBeCloseTo(112.5, 1);
  });

  it("Cooper VO2: 2,400 m ≈ 42.4 ml/kg/min", () => {
    expect(vo2Cooper(2400)!).toBeCloseTo(42.4, 1);
  });

  it("Rockport VO2: female, 62 kg, 28 y, 14.5 min, HR 132 ≈ 43.5", () => {
    expect(vo2Rockport("female", 62, 28, 14.5, 132)!).toBeCloseTo(43.5, 1);
  });

  it("Timeline: 80 → 72 kg at −500 kcal/day ≈ 0.45 kg/wk, ≈ 17–18 weeks", () => {
    const t = goalTimeline(80, 72, -500)!;
    expect(Math.abs(t.weeklyKg)).toBeCloseTo(0.4545, 3);
    expect(t.weeks!).toBeGreaterThan(17);
    expect(t.weeks!).toBeLessThan(18);
  });

  it("Plates: 142.5 kg target, 20 kg bar → per side 25+25+10+1.25", () => {
    const r = plateLoading(142.5, 20, [25, 20, 15, 10, 5, 2.5, 1.25])!;
    expect(r.exact).toBe(true);
    expect(r.perSide).toEqual([25, 25, 10, 1.25]);
    expect(r.total).toBe(142.5);
  });
});

describe("guards and edge cases", () => {
  it("Navy BF%: waist ≤ neck (men) → null", () => {
    expect(navyBodyFat({ sex: "male", heightCm: 180, neckCm: 40, waistCm: 40 })).toBeNull();
  });

  it("Navy BF%: women require hip; waist + hip > neck", () => {
    expect(navyBodyFat({ sex: "female", heightCm: 165, neckCm: 32, waistCm: 70 })).toBeNull();
    expect(
      navyBodyFat({ sex: "female", heightCm: 165, neckCm: 32, waistCm: 70, hipCm: 95 }),
    ).not.toBeNull();
  });

  it("Navy BF%: output clamps to 2–60%", () => {
    const lean = navyBodyFat({ sex: "male", heightCm: 200, neckCm: 44, waistCm: 45 })!;
    expect(lean).toBeGreaterThanOrEqual(2);
    const high = navyBodyFat({ sex: "male", heightCm: 150, neckCm: 30, waistCm: 200 })!;
    expect(high).toBeLessThanOrEqual(60);
  });

  it("1RM: reps must be 1–12; reps = 1 returns the weight itself", () => {
    expect(epley(100, 13)).toBeNull();
    expect(brzycki(100, 0)).toBeNull();
    expect(epley(100, 1)).toBe(100);
    expect(brzycki(100, 1)).toBe(100);
  });

  it("Plates: target below bar → null; non-exact targets give below/above", () => {
    expect(plateLoading(15, 20, [25, 1.25])).toBeNull();
    const r = plateLoading(143, 20, [25, 20, 15, 10, 5, 2.5])!; // 61.5/side unreachable (min 2.5 step)
    expect(r.exact).toBe(false);
    expect(r.below!.total).toBe(140);
    expect(r.above!.total).toBe(145);
  });

  it("Calorie floors: 1,500 men / 1,200 women", () => {
    expect(calorieFloor("male")).toBe(1500);
    expect(calorieFloor("female")).toBe(1200);
  });

  it("Calorie targets: −20% of 2,759 ≈ 2,207 kcal and weekly change ≈ −0.50 kg", () => {
    const target = calorieTarget(2759, -0.2)!;
    expect(target).toBeCloseTo(2207.2, 1);
    expect(weeklyChangeKg(target - 2759)).toBeCloseTo(-0.5017, 3);
  });

  it("Timeline: target = current → 0 weeks; direction mismatch flagged", () => {
    expect(goalTimeline(80, 80, -500)!.weeks).toBe(0);
    const t = goalTimeline(80, 72, 300)!; // surplus while wanting loss
    expect(t.mismatch).toBe(true);
    expect(t.weeks).toBeNull();
    expect(goalTimeline(80, 72, 0)!.weeks).toBeNull();
  });

  it("Macro split: protein-first; fat min 0.5 g/kg; carbs from remainder", () => {
    const m = macroSplit(2200, 80, 2.2, 0.25)!;
    expect(m.protein.g).toBeCloseTo(176, 1);
    expect(m.fat.g).toBeCloseTo((2200 * 0.25) / 9, 1);
    expect(m.protein.kcal + m.fat.kcal + m.carbs.kcal).toBeCloseTo(2200, 6);
    // fat floor engages on very low-fat selections
    const floor = macroSplit(2500, 100, 1.8, 0.1)!;
    expect(floor.fat.g).toBeCloseTo(50, 5); // 0.5 g/kg × 100 kg > 10% kcal
    // impossible: protein+fat exceed calories
    expect(macroSplit(900, 100, 2.7, 0.35)).toBeNull();
  });

  it("Katch-McArdle: 80 kg at 16.1% BF ≈ 1,820 kcal", () => {
    expect(katchMcArdle(80, 16.1)!).toBeCloseTo(370 + 21.6 * 80 * 0.839, 1);
  });

  it("FFMI: 80 kg, 180 cm, 16.1% → normalized ≈ 20.7", () => {
    const f = ffmi(80, 180, 16.1)!;
    expect(f.ffm).toBeCloseTo(67.12, 2);
    expect(roundTo(f.normalized, 1)).toBeCloseTo(20.7, 1);
  });

  it("WHR: 85/100 → 0.85; zero hip → null", () => {
    expect(waistToHip(85, 100)).toBeCloseTo(0.85, 6);
    expect(waistToHip(85, 0)).toBeNull();
  });

  it("Ideal weight: male 180 cm — Devine ≈ 68.1 kg; range sane; BMI range 59.9–80.7", () => {
    const r = idealWeight("male", 180)!;
    expect(r.devine).toBeCloseTo(50 + 2.3 * (180 / 2.54 - 60), 2);
    expect(r.min).toBeLessThanOrEqual(r.max);
    expect(r.bmiLow).toBeCloseTo(18.5 * 1.8 * 1.8, 2);
    expect(r.bmiHigh).toBeCloseTo(24.9 * 1.8 * 1.8, 2);
  });

  it("Protein: cutting 2.0–2.7 g/kg at 80 kg → 160–216 g", () => {
    const p = proteinRange(80, "cutting")!;
    expect(p.minG).toBe(160);
    expect(p.maxG).toBeCloseTo(216, 6);
  });

  it("Water: 80 kg + 60 min training → 3.8 L", () => {
    expect(waterIntake(80, 60)!).toBeCloseTo((35 * 80 + 1000) / 1000, 6);
  });

  it("Max HR: Tanaka 30 y → 187; Gulati 30 y → 179.6; Classic → 190", () => {
    expect(maxHeartRate("tanaka", 30)).toBeCloseTo(187, 6);
    expect(maxHeartRate("gulati", 30)).toBeCloseTo(179.6, 6);
    expect(maxHeartRate("classic", 30)).toBe(190);
  });

  it("HR zones: % of max by default; Karvonen with resting HR; rest ≥ max → null", () => {
    const plain = hrZones(190)!;
    expect(plain[1].bpmLow).toBe(114); // 60% of 190
    const karvonen = hrZones(190, 60)!;
    expect(karvonen[1].bpmLow).toBe(Math.round((190 - 60) * 0.6 + 60)); // 138
    expect(hrZones(190, 200)).toBeNull();
  });

  it("VO2 resting estimate: max 187 / rest 60 ≈ 47.7", () => {
    expect(vo2Resting(187, 60)!).toBeCloseTo(15.3 * (187 / 60), 4);
  });

  it("VO2 bands are sex- and age-specific", () => {
    expect(bandFor(vo2Bands("male", 25), 43).label).toBe("Good");
    expect(bandFor(vo2Bands("female", 25), 43).label).toBe("Good");
    expect(bandFor(vo2Bands("female", 25), 45).label).toBe("Excellent");
    expect(bandFor(vo2Bands("male", 62), 45).label).toBe("Superior");
  });

  it("Strength standards: male 80 kg BW, 120 kg squat (1.5×) → Intermediate, next Advanced at 160 kg", () => {
    const s = strengthLevel("male", "squat", 80, 120)!;
    expect(s.levelLabel).toBe("Intermediate");
    expect(s.next!.label).toBe("Advanced");
    expect(s.next!.weightNeeded).toBeCloseTo(40, 6);
    const f = strengthLevel("female", "squat", 80, 120)!;
    expect(f.levelLabel).toBe("Advanced"); // 1.5× is the female Advanced threshold
  });

  it("Units: round-trips and rounding", () => {
    expect(kgToLb(lbToKg(135))).toBeCloseTo(135, 9);
    expect(ftInToCm(5, 11)).toBeCloseTo(180.34, 2);
    expect(cmToFtIn(180)).toEqual({ ft: 5, in: 11 });
    expect(roundTo(24.700000000000003, 1)).toBe(24.7);
  });
});
