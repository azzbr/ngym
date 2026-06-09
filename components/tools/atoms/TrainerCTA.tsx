import { MessageCircle } from "lucide-react";

const WHATSAPP_MAIN = "97338833663";

/** Subtle conversion block under calculator results. */
export default function TrainerCTA({ toolName }: { toolName: string }) {
  const text = encodeURIComponent(
    `Hi! I just used the ${toolName} on your website — I'd like to talk to a trainer about a plan.`,
  );
  return (
    <div className="bg-[#0D0D0D] p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <p className="text-sm text-white/80 flex-1">
        Want a plan built around these numbers?{" "}
        <span className="text-white font-semibold">Talk to a trainer at your branch — free.</span>
      </p>
      <a
        href={`https://wa.me/${WHATSAPP_MAIN}?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 bg-[#CC1A1A] hover:bg-[#AA1414] text-white font-montserrat font-bold text-xs uppercase tracking-[0.12em] px-6 py-3 transition-colors"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        <MessageCircle size={14} aria-hidden="true" />
        WhatsApp Us
      </a>
    </div>
  );
}
