"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProgress, useUnits } from "@/components/providers/ToolsProvider";
import { LIFT_LABELS } from "@/lib/fitness/progress";
import type { ProgressLift, ResultKey } from "@/lib/fitness/profile";
import { fmt, kgToLb, roundTo } from "@/lib/fitness/units";
import BadgeGrid from "./BadgeGrid";
import CheckInButton from "./CheckInButton";
import CheckInHeatmap from "./CheckInHeatmap";
import LocalDataNotice from "./LocalDataNotice";
import ProgressShareCard from "./ProgressShareCard";
import StreakCounters from "./StreakCounters";
import WeightLogChart from "./WeightLogChart";
import WeightLogList from "./WeightLogList";
import WeightQuickAdd from "./WeightQuickAdd";

function SectionTitle({ title, redWord }: { title: string; redWord: string }) {
  return (
    <h2
      className="font-montserrat font-black text-2xl uppercase tracking-[0.08em] text-[#0D0D0D]"
      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
    >
      {title} <span className="text-[#CC1A1A]">{redWord}</span>
    </h2>
  );
}

/** Personal records board — saved calculator results. */
function PrBoard() {
  const { progress } = useProgress();
  const { units } = useUnits();
  const imperial = units === "imperial";
  const entries = Object.entries(progress.results) as [ResultKey, { value: number; at: number }][];
  if (entries.length === 0) {
    return (
      <p className="text-sm text-[#6B6B6B] bg-white border border-[#E5E5E5] px-4 py-3">
        No records yet — calculate your{" "}
        <Link href="/tools/one-rep-max" className="text-[#CC1A1A] font-semibold hover:underline underline-offset-4">
          one-rep max
        </Link>{" "}
        or{" "}
        <Link href="/tools/body-fat" className="text-[#CC1A1A] font-semibold hover:underline underline-offset-4">
          body fat
        </Link>{" "}
        and tap “Save to My Progress”.
      </p>
    );
  }
  const label = (key: ResultKey): { name: string; unit: string; display: (v: number) => string } => {
    if (key.startsWith("oneRepMax.")) {
      const lift = key.split(".")[1] as ProgressLift;
      return {
        name: `${LIFT_LABELS[lift]} 1RM`,
        unit: imperial ? "lb" : "kg",
        display: (v) => fmt(imperial ? kgToLb(v) : v, 1),
      };
    }
    if (key === "vo2max") return { name: "VO₂ Max", unit: "ml/kg/min", display: (v) => fmt(v, 1) };
    if (key === "bodyFat") return { name: "Body Fat", unit: "%", display: (v) => fmt(v, 1) };
    if (key === "bmi") return { name: "BMI", unit: "", display: (v) => fmt(v, 1) };
    return { name: "FFMI", unit: "", display: (v) => fmt(roundTo(v, 1), 1) };
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {entries
        .sort((a, b) => b[1].at - a[1].at)
        .map(([key, res]) => {
          const l = label(key);
          return (
            <div key={key} className="bg-white border border-[#E5E5E5] border-l-4 border-l-[#CC1A1A] p-5">
              <span
                className="block text-4xl leading-none text-[#0D0D0D]"
                style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
              >
                {l.display(res.value)}
                {l.unit && <span className="text-lg text-[#6B6B6B] ml-1">{l.unit}</span>}
              </span>
              <span
                className="mt-2 block font-montserrat font-bold text-[11px] uppercase tracking-[0.12em] text-[#6B6B6B]"
                style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
              >
                {l.name}
              </span>
            </div>
          );
        })}
    </div>
  );
}

export default function ProgressClient() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12">
      <Link
        href="/tools"
        className="inline-flex items-center gap-2 font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B] hover:text-[#CC1A1A] transition-colors"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        All Fitness Tools
      </Link>

      <section className="space-y-6" aria-labelledby="streak-heading">
        <div id="streak-heading">
          <SectionTitle title="Your" redWord="Streak" />
        </div>
        <CheckInButton />
        <StreakCounters />
        <CheckInHeatmap />
      </section>

      <section className="space-y-6" aria-labelledby="weight-heading">
        <div id="weight-heading">
          <SectionTitle title="Weight" redWord="Log" />
        </div>
        <WeightQuickAdd />
        <WeightLogChart />
        <WeightLogList />
      </section>

      <section className="space-y-6" aria-labelledby="pr-heading">
        <div id="pr-heading">
          <SectionTitle title="Personal" redWord="Records" />
        </div>
        <PrBoard />
      </section>

      <section className="space-y-6" aria-labelledby="badges-heading">
        <div id="badges-heading">
          <SectionTitle title="Your" redWord="Badges" />
        </div>
        <BadgeGrid />
      </section>

      <ProgressShareCard />
      <LocalDataNotice />
    </div>
  );
}
