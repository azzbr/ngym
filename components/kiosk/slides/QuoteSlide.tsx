"use client";

import type { QuoteSlideProps } from "../contracts";

/**
 * The brand wall-art pattern: stacked Bebas lines, power lines in red.
 * Entrance is CSS-only (keyframe + nth-child stagger) so the slide stays
 * dependency-free; reduced-motion users get the lines instantly.
 */
export default function QuoteSlide({ quote }: QuoteSlideProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-10 md:p-16">
      <style>{`
        @keyframes anpQuoteFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anp-quote-line {
          opacity: 0;
          animation: anpQuoteFadeUp 0.45s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
        .anp-quote-line:nth-child(1) { animation-delay: 0ms; }
        .anp-quote-line:nth-child(2) { animation-delay: 80ms; }
        .anp-quote-line:nth-child(3) { animation-delay: 160ms; }
        .anp-quote-line:nth-child(4) { animation-delay: 240ms; }
        .anp-quote-line:nth-child(5) { animation-delay: 320ms; }
        .anp-quote-line:nth-child(6) { animation-delay: 400ms; }
        .anp-quote-line:nth-child(7) { animation-delay: 480ms; }
        .anp-quote-line:nth-child(8) { animation-delay: 560ms; }
        @media (prefers-reduced-motion: reduce) {
          .anp-quote-line { animation: none; opacity: 1; }
        }
      `}</style>

      <p className="text-center">
        {quote.lines.map((line, i) => (
          <span
            key={`${i}-${line}`}
            className={`anp-quote-line block uppercase leading-none ${
              quote.redLines.includes(i) ? "text-[#CC1A1A]" : "text-white"
            }`}
            style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "clamp(3.5rem, 12vh, 10rem)",
            }}
          >
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
