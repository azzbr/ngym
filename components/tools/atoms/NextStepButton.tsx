"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTools } from "@/components/providers/ToolsProvider";
import type { HandoffKey } from "@/lib/fitness/types";
import type { ToolSlug } from "@/lib/tools";

interface Props {
  label: string;
  toSlug: ToolSlug;
  currentSlug: ToolSlug;
  /** Values to hand to the target calculator. */
  handoff?: Partial<Record<HandoffKey, number>>;
  disabled?: boolean;
}

/**
 * "Use this result" / "next step" — writes handoff values, then navigates
 * with ?from=<currentSlug> as the consent token for prefill.
 */
export default function NextStepButton({ label, toSlug, currentSlug, handoff, disabled }: Props) {
  const router = useRouter();
  const { setHandoff } = useTools();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (handoff) setHandoff(handoff, currentSlug);
        router.push(`/tools/${toSlug}?from=${currentSlug}`);
      }}
      className={`inline-flex items-center gap-2 font-montserrat font-bold text-xs uppercase tracking-[0.12em] px-5 py-3 border-2 transition-colors ${
        disabled
          ? "border-[#E5E5E5] text-[#9A9A9A]"
          : "border-[#CC1A1A] text-[#CC1A1A] hover:bg-[#CC1A1A] hover:text-white"
      }`}
      style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
    >
      {label}
      <ArrowRight size={14} aria-hidden="true" />
    </button>
  );
}
