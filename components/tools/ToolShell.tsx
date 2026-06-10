"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useProgress } from "@/components/providers/ToolsProvider";
import { getToolBySlug, type ToolSlug } from "@/lib/tools";
import type { ReactNode } from "react";
import ProfileBar from "./ProfileBar";
import HowItWorks from "./atoms/HowItWorks";
import ToolDisclaimer from "./atoms/ToolDisclaimer";
import TrainerCTA from "./atoms/TrainerCTA";

/**
 * Common page chrome for every calculator: breadcrumb, profile bar,
 * the calculator itself, "How is this calculated?", related tools,
 * trainer CTA and the disclaimer.
 */
export default function ToolShell({ slug, children }: { slug: ToolSlug; children: ReactNode }) {
  const tool = getToolBySlug(slug)!;
  const { updateProgress, hydrated } = useProgress();

  // Mark the tool as opened (for the all-16 badge). Gated on hydration so the
  // mark isn't clobbered when stored state arrives (parent effects run last).
  useEffect(() => {
    if (!hydrated) return;
    updateProgress((p) =>
      p.usedTools.includes(slug) ? p : { ...p, usedTools: [...p.usedTools, slug] },
    );
  }, [hydrated, slug, updateProgress]);
  const related = tool.related
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-8">
      <Link
        href="/tools"
        className="inline-flex items-center gap-2 font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#6B6B6B] hover:text-[#CC1A1A] transition-colors"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        All Fitness Tools
      </Link>

      <ProfileBar />

      {tool.sexSpecific && (
        <p className="text-xs text-[#6B6B6B] -mt-4">Uses male/female reference equations.</p>
      )}

      {children}

      <HowItWorks {...tool.howItWorks} />

      {related.length > 0 && (
        <nav aria-label="Related tools" className="flex flex-wrap items-center gap-3">
          <span
            className="font-montserrat font-bold text-xs uppercase tracking-[0.12em] text-[#0D0D0D]"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Next:
          </span>
          {related.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="font-montserrat font-semibold text-xs uppercase tracking-[0.1em] text-[#CC1A1A] hover:underline underline-offset-4"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              {t.name}
            </Link>
          ))}
        </nav>
      )}

      <TrainerCTA toolName={tool.name} />

      <ToolDisclaimer />
    </div>
  );
}
