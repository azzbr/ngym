"use client";

import type { ChallengeSlideProps } from "../contracts";
import { titleWithRedWord } from "./PromoSlide";

const MS_PER_DAY = 86_400_000;

/**
 * Promo layout plus a countdown to `endsOn`. Once the date has passed
 * (days < 0) the body renders without the countdown — the loop keeps
 * showing the challenge until its config is rotated.
 */
export default function ChallengeSlide({ challenge }: ChallengeSlideProps) {
  const daysLeft = Math.ceil(
    (new Date(challenge.endsOn).getTime() - Date.now()) / MS_PER_DAY,
  );
  const showCountdown = daysLeft >= 0;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center p-10 md:p-16">
      <p
        className="font-montserrat text-xl font-bold uppercase tracking-[0.35em] text-[#CC1A1A]"
        style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
      >
        {challenge.eyebrow}
      </p>
      <h2
        className="mt-4 uppercase leading-none text-white"
        style={{
          fontFamily: "var(--font-bebas, sans-serif)",
          fontSize: "clamp(3.5rem, 12vh, 10rem)",
        }}
      >
        {titleWithRedWord(challenge.title, challenge.redWord)}
      </h2>
      <p className="mt-8 max-w-3xl text-2xl text-white/70">{challenge.body}</p>

      {showCountdown && (
        <p className="mt-10">
          <span
            className="block leading-none text-white"
            style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "clamp(5rem, 18vh, 14rem)",
            }}
          >
            {daysLeft}
          </span>
          <span
            className="mt-2 block font-montserrat text-2xl font-bold uppercase tracking-[0.3em] text-[#CC1A1A]"
            style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
          >
            Days Left
          </span>
        </p>
      )}
    </div>
  );
}
