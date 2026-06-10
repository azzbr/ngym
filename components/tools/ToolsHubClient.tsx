"use client";

import Link from "next/link";
import {
  ArrowRight,
  Beef,
  CalendarClock,
  CircleDashed,
  Disc3,
  Droplets,
  Dumbbell,
  Flame,
  HeartPulse,
  Medal,
  PieChart,
  Ruler,
  Scale,
  Target,
  TrendingDown,
  Trophy,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useProgress } from "@/components/providers/ToolsProvider";
import { currentStreak, toISODate } from "@/lib/fitness/progress";
import { CATEGORY_LABELS, CATEGORY_ORDER, getToolsByCategory } from "@/lib/tools";
import ProfileBar from "./ProfileBar";

const TOOL_ICONS: Record<string, LucideIcon> = {
  Scale,
  Ruler,
  Dumbbell,
  CircleDashed,
  Target,
  Flame,
  TrendingDown,
  PieChart,
  Beef,
  Droplets,
  CalendarClock,
  Trophy,
  Medal,
  Disc3,
  HeartPulse,
  Wind,
};

/** Pinned "My Progress" card — shows the live streak once data exists. */
function ProgressPromoCard() {
  const { progress, hydrated } = useProgress();
  const streak = hydrated ? currentStreak(progress.checkIns, toISODate(new Date())) : 0;
  return (
    <Link
      href="/tools/progress"
      className="group block bg-[#0D0D0D] border-l-4 border-[#CC1A1A] p-6 md:p-8"
    >
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <h2
            className="font-montserrat font-black text-xl md:text-2xl uppercase tracking-[0.08em] text-white"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            My <span className="text-[#CC1A1A]">Progress</span>
          </h2>
          <p className="mt-2 text-sm text-white/60 max-w-xl">
            Your gym streak, weight log, personal records and badges — saved privately on this
            device. Don&apos;t break the chain.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="text-right">
              <span
                className="block text-5xl leading-none text-white"
                style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
              >
                {streak}
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#CC1A1A] font-bold">
                day streak
              </span>
            </div>
          )}
          <ArrowRight
            size={22}
            className="text-[#CC1A1A] transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

/** Hub body: shared profile bar + one card per calculator, grouped by category. */
export default function ToolsHubClient() {
  return (
    <div className="max-w-site mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12">
      <ProfileBar />
      <ProgressPromoCard />

      {CATEGORY_ORDER.map((category) => {
        const tools = getToolsByCategory(category);
        return (
          <section key={category} aria-labelledby={`cat-${category}`}>
            <h2
              id={`cat-${category}`}
              className="font-montserrat font-black text-2xl uppercase tracking-[0.08em] text-[#0D0D0D] mb-6"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {CATEGORY_LABELS[category].split(" ")[0]}{" "}
              <span className="text-[#CC1A1A]">
                {CATEGORY_LABELS[category].split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.map((tool) => {
                const Icon = TOOL_ICONS[tool.icon] ?? Dumbbell;
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group bg-white border border-[#E5E5E5] p-6 transition-all hover:border-l-4 hover:border-l-[#CC1A1A] hover:-translate-y-1 hover:shadow-md"
                  >
                    <Icon size={22} className="text-[#CC1A1A] mb-4" aria-hidden="true" />
                    <h3
                      className="font-montserrat font-bold text-sm uppercase tracking-[0.08em] text-[#0D0D0D] mb-2"
                      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                    >
                      {tool.name}
                    </h3>
                    <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">{tool.blurb}</p>
                    <span
                      className="inline-flex items-center gap-1.5 font-montserrat font-bold text-[11px] uppercase tracking-[0.12em] text-[#CC1A1A]"
                      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                    >
                      Open
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
