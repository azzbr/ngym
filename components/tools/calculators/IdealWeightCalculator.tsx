"use client";

import { useProfile, useUnits } from "@/components/providers/ToolsProvider";
import { idealWeight } from "@/lib/fitness/formulas";
import { validateField } from "@/lib/fitness/profile";
import { fmt, kgToLb } from "@/lib/fitness/units";
import HeightField from "../atoms/HeightField";
import ResultCard from "../atoms/ResultCard";

export default function IdealWeightCalculator() {
  const { profile, setProfile } = useProfile();
  const { sex, heightCm } = profile;
  const { units } = useUnits();
  const imperial = units === "imperial";

  const heightError = validateField("heightCm", heightCm);
  const valid = sex != null && heightCm != null && !heightError;
  const result = valid ? idealWeight(sex, heightCm) : null;

  const disp = (kg: number) => (imperial ? kgToLb(kg) : kg);
  const unit = imperial ? "lb" : "kg";

  const missing: string[] = [];
  if (sex == null) missing.push("pick your sex in the profile bar above");
  if (heightCm == null) missing.push("enter your height");

  const formulas = result
    ? [
        { name: "Devine", value: result.devine },
        { name: "Robinson", value: result.robinson },
        { name: "Miller", value: result.miller },
        { name: "Hamwi", value: result.hamwi },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HeightField
          id="ideal-weight-height"
          value={heightCm}
          onChange={(v) => setProfile({ heightCm: v })}
          error={heightError}
        />
      </div>

      {result ? (
        <ResultCard
          value={`${fmt(disp(result.min), 1)} – ${fmt(disp(result.max), 1)}`}
          unit={unit}
          interpretation="These are rough population estimates from height and sex — reference points, not personal targets. Frame size, muscle mass and body composition all change what a healthy weight looks like for you."
          note="Uses male/female reference equations."
        >
          <div className="space-y-4">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">Ideal weight estimate by formula</caption>
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  <th
                    scope="col"
                    className="text-left py-2 pr-4 font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Formula
                  </th>
                  <th
                    scope="col"
                    className="text-right py-2 font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                  >
                    Estimate
                  </th>
                </tr>
              </thead>
              <tbody>
                {formulas.map((f) => (
                  <tr key={f.name} className="border-b border-[#E5E5E5]">
                    <th
                      scope="row"
                      className="text-left py-2 pr-4 font-semibold text-[#0D0D0D]"
                      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                    >
                      {f.name}
                    </th>
                    <td className="text-right py-2 text-[#0D0D0D]">
                      {fmt(disp(f.value), 1)} {unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-[#0D0D0D]">
              Healthy BMI range (18.5–24.9):{" "}
              <span className="font-semibold">
                {fmt(disp(result.bmiLow), 1)} – {fmt(disp(result.bmiHigh), 1)} {unit}
              </span>
            </p>
          </div>
        </ResultCard>
      ) : (
        <p className="text-sm text-[#6B6B6B] bg-[#F5F4F2] border border-[#E5E5E5] px-4 py-3">
          {missing.length > 0
            ? `To see your range, ${missing.join(" and ")} — the result appears instantly.`
            : "Fix the highlighted height value above — the result appears instantly."}
        </p>
      )}
    </div>
  );
}
