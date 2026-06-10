"use client";

import type { QrSlideProps } from "../contracts";
import QrCode from "../QrCode";

/** "https://example.com/x" → "example.com/x" for the under-panel caption. */
function shortUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "");
}

/**
 * Split layout: huge headline (last word red) on the left, scannable QR on a
 * white panel on the right with the bare URL printed beneath it.
 */
export default function QrSlide({ heading, sub, url }: QrSlideProps) {
  const words = heading.trim().split(/\s+/);
  const lastWord = words.length > 1 ? words[words.length - 1] : null;
  const leadWords = lastWord ? words.slice(0, -1).join(" ") : heading;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 p-10 md:flex-row md:justify-between md:gap-16 md:p-16">
      <div className="min-w-0 text-center md:text-left">
        <h2
          className="uppercase leading-none text-white"
          style={{
            fontFamily: "var(--font-bebas, sans-serif)",
            fontSize: "clamp(3.5rem, 12vh, 10rem)",
          }}
        >
          {leadWords}
          {lastWord && (
            <>
              {" "}
              <span className="text-[#CC1A1A]">{lastWord}</span>
            </>
          )}
        </h2>
        <p className="mt-6 max-w-2xl text-2xl text-white/60">{sub}</p>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-4">
        <div className="bg-white p-6">
          <QrCode value={url} className="h-[28vh] w-[28vh]" />
        </div>
        <p className="text-xl text-white/40">{shortUrl(url)}</p>
      </div>
    </div>
  );
}
