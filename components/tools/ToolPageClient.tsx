"use client";

import type { ComponentType } from "react";
import type { ToolSlug } from "@/lib/tools";
import ToolShell from "./ToolShell";
import BmiCalculator from "./calculators/BmiCalculator";
import BodyFatCalculator from "./calculators/BodyFatCalculator";
import BmrTdeeCalculator from "./calculators/BmrTdeeCalculator";
import CalorieTargetsCalculator from "./calculators/CalorieTargetsCalculator";
import FfmiCalculator from "./calculators/FfmiCalculator";
import GoalTimelineCalculator from "./calculators/GoalTimelineCalculator";
import HeartRateZonesCalculator from "./calculators/HeartRateZonesCalculator";
import IdealWeightCalculator from "./calculators/IdealWeightCalculator";
import MacrosCalculator from "./calculators/MacrosCalculator";
import OneRepMaxCalculator from "./calculators/OneRepMaxCalculator";
import PlateCalculator from "./calculators/PlateCalculator";
import ProteinCalculator from "./calculators/ProteinCalculator";
import StrengthStandardsCalculator from "./calculators/StrengthStandardsCalculator";
import Vo2MaxCalculator from "./calculators/Vo2MaxCalculator";
import WaistToHipCalculator from "./calculators/WaistToHipCalculator";
import WaterCalculator from "./calculators/WaterCalculator";

const TOOL_COMPONENTS: Record<ToolSlug, ComponentType> = {
  bmi: BmiCalculator,
  "body-fat": BodyFatCalculator,
  ffmi: FfmiCalculator,
  "waist-to-hip": WaistToHipCalculator,
  "ideal-weight": IdealWeightCalculator,
  "bmr-tdee": BmrTdeeCalculator,
  "calorie-targets": CalorieTargetsCalculator,
  macros: MacrosCalculator,
  protein: ProteinCalculator,
  water: WaterCalculator,
  "goal-timeline": GoalTimelineCalculator,
  "one-rep-max": OneRepMaxCalculator,
  "strength-standards": StrengthStandardsCalculator,
  "plate-calculator": PlateCalculator,
  "heart-rate-zones": HeartRateZonesCalculator,
  "vo2-max": Vo2MaxCalculator,
};

export default function ToolPageClient({ slug }: { slug: ToolSlug }) {
  const Calculator = TOOL_COMPONENTS[slug];
  return (
    <ToolShell slug={slug}>
      <Calculator />
    </ToolShell>
  );
}
