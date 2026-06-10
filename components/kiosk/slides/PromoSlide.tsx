"use client";

import type { ReactNode } from "react";
import type { PromoSlideProps } from "../contracts";

/**
 * Renders `title` with `redWord` (first case-insensitive occurrence) in brand
 * red — the digital version of the wall-art "power word" pattern.
 */
export function titleWithRedWord(title: string, redWord: string): ReactNode {
  const word = redWord.trim();
  if (!word) return title;
  const idx = title.toLowerCase().indexOf(word.toLowerCase());
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span className="text-[#CC1A1A]">{title.slice(idx, idx + word.length)}</span>
      {title.slice(idx + word.length)}
    </>
  );
}

export default function PromoSlide({ promo }: PromoSlideProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center p-10 md:p-16">
      <p
        className="font-montserrat text-xl font-bold uppercase tracking-[0.35em] text-[#CC1A1A]"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        {promo.eyebrow}
      </p>
      <h2
        className="mt-4 uppercase leading-none text-white"
        style={{
          fontFamily: "var(--font-bebas, sans-serif)",
          fontSize: "clamp(3.5rem, 12vh, 10rem)",
        }}
      >
        {titleWithRedWord(promo.title, promo.redWord)}
      </h2>
      <p className="mt-8 max-w-3xl text-2xl text-white/70">{promo.body}</p>
    </div>
  );
}
