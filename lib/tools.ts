/**
 * Fitness Tools registry — DATA ONLY (no React imports).
 * Consumed by: app/tools pages (metadata, static params), sitemap.ts,
 * and client components (cards, shell). The slug → component mapping
 * lives client-side in components/tools/ToolPageClient.tsx.
 */

export type ToolCategory = "body-metrics" | "nutrition" | "strength" | "cardio";

// NOTE: never add "progress" as a ToolSlug — /tools/progress is a static
// route (My Progress dashboard) that must not collide with /tools/[slug].

export type ToolSlug =
  | "bmi"
  | "body-fat"
  | "ffmi"
  | "waist-to-hip"
  | "ideal-weight"
  | "bmr-tdee"
  | "calorie-targets"
  | "macros"
  | "protein"
  | "water"
  | "goal-timeline"
  | "one-rep-max"
  | "strength-standards"
  | "plate-calculator"
  | "heart-rate-zones"
  | "vo2-max";

export type ToolDef = {
  slug: ToolSlug;
  name: string;
  category: ToolCategory;
  /** One-line benefit for hub cards and the page hero subtitle. */
  blurb: string;
  metaTitle: string;
  metaDescription: string;
  /** lucide-react icon name, resolved client-side. */
  icon: string;
  /** Shows the "Uses male/female reference equations" note. */
  sexSpecific: boolean;
  howItWorks: { body: string; formula: string; source: string };
  related: ToolSlug[];
};

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  "body-metrics": "Body Metrics",
  nutrition: "Nutrition",
  strength: "Strength",
  cardio: "Cardio",
};

export const CATEGORY_ORDER: ToolCategory[] = [
  "body-metrics",
  "nutrition",
  "strength",
  "cardio",
];

export const DISCLAIMER_TEXT =
  "These tools provide estimates for general fitness purposes only and are not medical advice. Consult a healthcare professional before making significant changes to diet or exercise, especially if you are pregnant, nursing, under 18, or managing a medical condition.";

export const TOOLS: ToolDef[] = [
  // ───────── Body Metrics ─────────
  {
    slug: "bmi",
    name: "BMI Calculator",
    category: "body-metrics",
    blurb: "Your body mass index and where it falls on the healthy range.",
    metaTitle: "BMI Calculator",
    metaDescription:
      "Free BMI calculator — check your body mass index against WHO categories in metric or imperial units. Built by Al Nakheel Premium, Bahrain's leading gym.",
    icon: "Scale",
    sexSpecific: false,
    howItWorks: {
      body: "BMI divides your weight by the square of your height. It's a quick population-level screen — it can't tell muscle from fat, so athletic people often read 'overweight' while lean.",
      formula: "BMI = weight (kg) ÷ height (m)²",
      source: "World Health Organization classification",
    },
    related: ["body-fat", "ideal-weight"],
  },
  {
    slug: "body-fat",
    name: "Body Fat Calculator",
    category: "body-metrics",
    blurb: "Estimate body fat % from tape measurements — no calipers needed.",
    metaTitle: "Body Fat Percentage Calculator (US Navy Method)",
    metaDescription:
      "Estimate your body fat percentage with the US Navy tape method, rated against ACE categories for men and women. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Ruler",
    sexSpecific: true,
    howItWorks: {
      body: "The US Navy method estimates body fat from circumference measurements (neck, waist, and hip for women) plus height. Measurements must be in centimeters; the result is rated against ACE body-fat categories.",
      formula:
        "Men: 495 ÷ (1.0324 − 0.19077·log₁₀(waist − neck) + 0.15456·log₁₀(height)) − 450 · Women: 495 ÷ (1.29579 − 0.35004·log₁₀(waist + hip − neck) + 0.22100·log₁₀(height)) − 450",
      source: "US Navy circumference method; ACE body-fat categories",
    },
    related: ["ffmi", "bmr-tdee"],
  },
  {
    slug: "ffmi",
    name: "FFMI Calculator",
    category: "body-metrics",
    blurb: "Fat-free mass index — how much muscle you carry for your height.",
    metaTitle: "FFMI Calculator (Fat-Free Mass Index)",
    metaDescription:
      "Calculate your normalized FFMI from weight, height and body fat % — see how your muscle mass rates for men or women. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Dumbbell",
    sexSpecific: true,
    howItWorks: {
      body: "FFMI measures lean mass relative to height — a far better muscularity gauge than BMI. The normalized score adjusts to a 1.80 m reference height so taller and shorter lifters compare fairly.",
      formula:
        "FFM = weight × (1 − BF%/100) · FFMI = FFM ÷ height (m)² · normalized = FFMI + 6.1 × (1.8 − height in m)",
      source: "Kouri et al. normalized FFMI",
    },
    related: ["body-fat", "strength-standards"],
  },
  {
    slug: "waist-to-hip",
    name: "Waist-to-Hip Ratio",
    category: "body-metrics",
    blurb: "A simple tape-measure check of metabolic health risk.",
    metaTitle: "Waist-to-Hip Ratio Calculator",
    metaDescription:
      "Calculate your waist-to-hip ratio and compare it with WHO health-risk thresholds for men and women. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "CircleDashed",
    sexSpecific: true,
    howItWorks: {
      body: "Where you carry weight matters: abdominal fat correlates with cardiovascular and metabolic risk. WHR divides your waist circumference by your hip circumference and compares it with WHO risk bands, which differ for men and women.",
      formula: "WHR = waist circumference ÷ hip circumference",
      source: "World Health Organization risk thresholds",
    },
    related: ["bmi", "body-fat"],
  },
  {
    slug: "ideal-weight",
    name: "Ideal Weight Range",
    category: "body-metrics",
    blurb: "What four classic formulas — and the BMI range — suggest for your height.",
    metaTitle: "Ideal Weight Calculator",
    metaDescription:
      "Estimate your ideal weight range using the Devine, Robinson, Miller and Hamwi formulas plus the healthy BMI range. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Target",
    sexSpecific: true,
    howItWorks: {
      body: "Four widely used clinical formulas estimate a reference weight from height and sex; we show the spread across all four plus the weight range that keeps BMI between 18.5 and 24.9. These are rough population estimates, not personal targets.",
      formula:
        "Devine: M 50 kg + 2.3/inch over 5 ft, F 45.5 + 2.3 · Robinson: M 52 + 1.9, F 49 + 1.7 · Miller: M 56.2 + 1.41, F 53.1 + 1.36 · Hamwi: M 48 + 2.7, F 45.5 + 2.2",
      source: "Devine, Robinson, Miller and Hamwi formulas; WHO BMI range",
    },
    related: ["bmi", "goal-timeline"],
  },
  // ───────── Nutrition ─────────
  {
    slug: "bmr-tdee",
    name: "BMR & TDEE Calculator",
    category: "nutrition",
    blurb: "How many calories you burn at rest — and across a full day.",
    metaTitle: "BMR & TDEE Calculator",
    metaDescription:
      "Calculate your basal metabolic rate (Mifflin-St Jeor or Katch-McArdle) and total daily energy expenditure. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Flame",
    sexSpecific: true,
    howItWorks: {
      body: "BMR is the energy your body burns at complete rest; TDEE multiplies it by an activity factor to estimate your full daily burn. If you know your body fat %, the Katch-McArdle equation uses lean mass for a sharper estimate.",
      formula:
        "Mifflin-St Jeor: 10·kg + 6.25·cm − 5·age + 5 (men) / − 161 (women) · Katch-McArdle: 370 + 21.6 × lean mass (kg) · TDEE = BMR × 1.2–1.9",
      source: "Mifflin-St Jeor (1990); Katch-McArdle",
    },
    related: ["calorie-targets", "body-fat"],
  },
  {
    slug: "calorie-targets",
    name: "Cut / Bulk Calories",
    category: "nutrition",
    blurb: "Daily calorie targets for cutting, maintaining or bulking — with the expected weekly change.",
    metaTitle: "Cut & Bulk Calorie Calculator",
    metaDescription:
      "Turn your TDEE into cutting, maintenance or bulking calorie targets with estimated weekly weight change and safety floors. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "TrendingDown",
    sexSpecific: true,
    howItWorks: {
      body: "Each preset adjusts your maintenance calories by a percentage. Since roughly 7,700 kcal corresponds to 1 kg of body weight, the daily surplus or deficit converts into an expected weekly change. Targets below 1,500 kcal (men) or 1,200 kcal (women) are flagged.",
      formula:
        "target = TDEE × (1 ± preset%) · weekly change (kg) ≈ daily difference × 7 ÷ 7,700",
      source: "7,700 kcal/kg energy-balance convention",
    },
    related: ["macros", "goal-timeline"],
  },
  {
    slug: "macros",
    name: "Macro Split Calculator",
    category: "nutrition",
    blurb: "Protein, fat and carbs in grams for your calorie target.",
    metaTitle: "Macro Calculator — Protein, Carbs & Fat Split",
    metaDescription:
      "Split your daily calories into protein, fat and carbohydrate targets in grams, tuned for cutting, maintaining or bulking. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "PieChart",
    sexSpecific: false,
    howItWorks: {
      body: "Protein is set first by bodyweight (higher when cutting to protect muscle), fat gets a percentage of calories with a 0.5 g/kg minimum, and carbohydrates fill the remainder. Energy density: protein 4, carbs 4, fat 9 kcal per gram.",
      formula:
        "protein = g/kg × weight · fat = max(25% kcal ÷ 9, 0.5 g/kg) · carbs = remaining kcal ÷ 4",
      source: "Protein ranges per ISSN position stand",
    },
    related: ["calorie-targets", "protein"],
  },
  {
    slug: "protein",
    name: "Protein Intake Calculator",
    category: "nutrition",
    blurb: "Your daily protein range, sized to your goal.",
    metaTitle: "Protein Intake Calculator",
    metaDescription:
      "How much protein per day? Get a range in grams based on your weight and goal — general fitness, muscle building or cutting. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Beef",
    sexSpecific: false,
    howItWorks: {
      body: "Protein needs scale with bodyweight and training goal: sedentary adults need around 0.8 g/kg, while lifters preserving muscle in a calorie deficit benefit from 2.0–2.7 g/kg.",
      formula:
        "sedentary 0.8 · general fitness 1.2–1.6 · building muscle 1.6–2.2 · cutting 2.0–2.7 g per kg per day",
      source: "ISSN position stand on protein and exercise",
    },
    related: ["macros", "bmr-tdee"],
  },
  {
    slug: "water",
    name: "Water Intake Calculator",
    category: "nutrition",
    blurb: "Daily hydration target including your training time.",
    metaTitle: "Water Intake Calculator",
    metaDescription:
      "Estimate your daily water needs from body weight and training minutes, with IOM reference baselines. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Droplets",
    sexSpecific: true,
    howItWorks: {
      body: "A practical baseline is 35 ml per kg of bodyweight, plus about 500 ml for every 30 minutes of training. For reference, IOM total-water values are ~3.7 L/day for men and ~2.7 L/day for women — roughly 20% of which typically comes from food.",
      formula: "water (L) = (35 ml × kg + 500 ml × training minutes ÷ 30) ÷ 1,000",
      source: "IOM dietary reference intakes for water",
    },
    related: ["bmr-tdee", "protein"],
  },
  {
    slug: "goal-timeline",
    name: "Goal Timeline",
    category: "nutrition",
    blurb: "How long to reach your target weight at your calorie plan.",
    metaTitle: "Weight Goal Timeline Calculator",
    metaDescription:
      "Project how many weeks it takes to reach your target weight at your calorie deficit or surplus, with a week-by-week chart. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "CalendarClock",
    sexSpecific: false,
    howItWorks: {
      body: "Your daily calorie surplus or deficit converts into a weekly weight change (7,700 kcal ≈ 1 kg), which projects a straight line from your current weight to your target. Real progress wobbles around this line — water, sleep and adherence all move the scale.",
      formula:
        "weekly change (kg) = daily difference × 7 ÷ 7,700 · weeks = weight gap ÷ weekly change",
      source: "7,700 kcal/kg energy-balance convention",
    },
    related: ["calorie-targets", "macros"],
  },
  // ───────── Strength ─────────
  {
    slug: "one-rep-max",
    name: "One-Rep Max Calculator",
    category: "strength",
    blurb: "Estimate your 1RM from any set — plus a %1RM training table.",
    metaTitle: "One-Rep Max (1RM) Calculator",
    metaDescription:
      "Estimate your one-rep max with the Epley and Brzycki formulas and get percentage-based training loads. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Trophy",
    sexSpecific: false,
    howItWorks: {
      body: "Both formulas estimate the most you could lift once from a sub-maximal set. We show their average as the headline and each individually. Accuracy drops above ~10 reps; the estimates are most reliable in the 2–8 rep range.",
      formula: "Epley: w × (1 + reps ÷ 30) · Brzycki: w × 36 ÷ (37 − reps)",
      source: "Epley (1985); Brzycki (1993)",
    },
    related: ["strength-standards", "plate-calculator"],
  },
  {
    slug: "strength-standards",
    name: "Strength Standards",
    category: "strength",
    blurb: "Beginner to elite — where your lifts rank for your bodyweight.",
    metaTitle: "Strength Standards — Squat, Bench, Deadlift & OHP",
    metaDescription:
      "Compare your squat, bench press, deadlift and overhead press to bodyweight-multiple strength standards for men and women. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Medal",
    sexSpecific: true,
    howItWorks: {
      body: "Your one-rep max divided by bodyweight places you on a ladder from Beginner to Elite, with separate thresholds per lift and sex. These are approximate community standards — useful waypoints, not official rankings.",
      formula: "level = highest bodyweight-multiple threshold your 1RM reaches",
      source: "Approximate community strength standards",
    },
    related: ["one-rep-max", "ffmi"],
  },
  {
    slug: "plate-calculator",
    name: "Plate Loading Calculator",
    category: "strength",
    blurb: "Exactly which plates to load per side for any target weight.",
    metaTitle: "Barbell Plate Loading Calculator",
    metaDescription:
      "Work out which plates to load on each side of the bar for your target weight, in kg or lb, with any plate set. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Disc3",
    sexSpecific: false,
    howItWorks: {
      body: "Subtract the bar, halve the remainder, then load the largest plates first. If your plate set can't hit the target exactly, we show the closest loadable weights above and below.",
      formula: "per side = (target − bar) ÷ 2, decomposed largest plate first",
      source: "Standard gym loading practice",
    },
    related: ["one-rep-max", "strength-standards"],
  },
  // ───────── Cardio ─────────
  {
    slug: "heart-rate-zones",
    name: "Heart Rate Zones",
    category: "cardio",
    blurb: "Your five training zones in bpm — recovery to max effort.",
    metaTitle: "Heart Rate Zone Calculator",
    metaDescription:
      "Calculate your five heart-rate training zones from age — Tanaka, Gulati or classic max-HR formulas, with Karvonen support. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "HeartPulse",
    sexSpecific: true,
    howItWorks: {
      body: "Zones are percentage bands of your estimated maximum heart rate. Tanaka is the better-validated default for men, Gulati for women; the classic 220 − age remains for familiarity. Adding a resting HR switches to the Karvonen method, which scales zones on your heart-rate reserve.",
      formula:
        "Tanaka: 208 − 0.7×age · Gulati: 206 − 0.88×age · Classic: 220 − age · Karvonen: (max − rest) × intensity + rest",
      source: "Tanaka (2001); Gulati (2010); Karvonen method",
    },
    related: ["vo2-max"],
  },
  {
    slug: "vo2-max",
    name: "VO₂ Max Estimator",
    category: "cardio",
    blurb: "Estimate your aerobic fitness three ways — no lab required.",
    metaTitle: "VO₂ Max Calculator — Resting HR, Rockport & Cooper Tests",
    metaDescription:
      "Estimate VO₂ max from resting heart rate, the Rockport 1-mile walk or the Cooper 12-minute run, rated against age and sex norms. Free tool by Al Nakheel Premium, Bahrain.",
    icon: "Wind",
    sexSpecific: true,
    howItWorks: {
      body: "VO₂ max is the ceiling on the oxygen your body can use per minute — the standard measure of aerobic fitness. Three field estimates: a quick resting-HR ratio, the Rockport 1-mile walk test (best for beginners) and the Cooper 12-minute run test. Results rate against sex- and age-specific norms.",
      formula:
        "Resting: 15.3 × (maxHR ÷ restHR) · Rockport: 132.853 − 0.0769×lb − 0.3877×age + 6.315×sex − 3.2649×min − 0.1565×HR · Cooper: (metres − 504.9) ÷ 44.73",
      source: "Uth et al. (2004); Kline et al. (1987); Cooper (1968)",
    },
    related: ["heart-rate-zones"],
  },
];

export function getAllTools(): ToolDef[] {
  return TOOLS;
}

export function getToolBySlug(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getAllToolSlugs(): ToolSlug[] {
  return TOOLS.map((t) => t.slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDef[] {
  return TOOLS.filter((t) => t.category === category);
}
