"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import challengeJson from "@/data/kiosk/challenge.json";
import promosJson from "@/data/kiosk/promos.json";
import quotesJson from "@/data/kiosk/quotes.json";
import { getFaultReportUrl, TOOLS_QR_URL } from "@/lib/kiosk";
import type { IdleLoopProps, KioskChallenge, KioskPromo, KioskQuote } from "./contracts";
import ChallengeSlide from "./slides/ChallengeSlide";
import GallerySlide from "./slides/GallerySlide";
import HoursSlide from "./slides/HoursSlide";
import PromoSlide from "./slides/PromoSlide";
import QrSlide from "./slides/QrSlide";
import QuoteSlide from "./slides/QuoteSlide";

const ADVANCE_MS = 12000;

type Slide = { key: string; node: ReactNode };

/** Local "yyyy-mm-dd" for the challenge endsOn comparison. */
function todayISO(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
}

/**
 * The kiosk attract loop — gallery / quote / hours / QR / promo / challenge
 * slides rotating every 12s. All slides stay mounted; only opacity changes,
 * so images never re-decode mid-loop. Rotation pauses while the tab is
 * hidden. Any tap hands control to the shell via onInteract.
 */
export default function IdleLoop({ branch, ladiesMode, onInteract }: IdleLoopProps) {
  const slides = useMemo<Slide[]>(() => {
    const byAudience = (audience: "all" | "ladies") => audience === "all" || ladiesMode;
    const quotes = (quotesJson as KioskQuote[]).filter((q) => byAudience(q.audience));
    const promos = (promosJson as KioskPromo[]).filter((p) => byAudience(p.audience));
    const challenge = challengeJson as KioskChallenge;
    const galleries = branch.gallery ?? [];

    let g = 0;
    let q = 0;
    let p = 0;
    const out: Slide[] = [];

    const pushGallery = () => {
      if (g >= galleries.length) return;
      const img = galleries[g];
      out.push({ key: `gallery-${g}`, node: <GallerySlide src={img.url} alt={img.alt} /> });
      g += 1;
    };
    const pushQuote = () => {
      if (q >= quotes.length) return;
      out.push({ key: `quote-${q}`, node: <QuoteSlide quote={quotes[q]} /> });
      q += 1;
    };
    const pushPromo = () => {
      if (p >= promos.length) return;
      out.push({ key: `promo-${p}`, node: <PromoSlide promo={promos[p]} /> });
      p += 1;
    };

    // Interleave pattern: gallery0, quote0, hours, gallery1, qrFault, quote1,
    // promo0, gallery2, challenge?, qrTools, quote2, promo1, …rest.
    pushGallery();
    pushQuote();
    out.push({ key: "hours", node: <HoursSlide branch={branch} /> });
    pushGallery();
    out.push({
      key: "qr-fault",
      node: (
        <QrSlide
          heading="MACHINE BROKEN?"
          sub="Scan to report it — takes 20 seconds."
          url={getFaultReportUrl(branch)}
        />
      ),
    });
    pushQuote();
    pushPromo();
    pushGallery();
    if (challenge.active && challenge.endsOn >= todayISO() && byAudience(challenge.audience)) {
      out.push({ key: "challenge", node: <ChallengeSlide challenge={challenge} /> });
    }
    out.push({
      key: "qr-tools",
      node: (
        <QrSlide
          heading="KNOW YOUR NUMBERS"
          sub="16 free fitness calculators on your phone."
          url={TOOLS_QR_URL}
        />
      ),
    });
    pushQuote();
    pushPromo();

    // Remaining galleries / quotes / promos, interleaved.
    while (g < galleries.length || q < quotes.length || p < promos.length) {
      pushGallery();
      pushQuote();
      pushPromo();
    }

    return out;
  }, [branch, ladiesMode]);

  const [active, setActive] = useState(0);
  const count = slides.length;
  const activeIdx = count > 0 ? active % count : 0;

  useEffect(() => {
    if (count <= 1) return;

    let interval: number | undefined;
    const start = () => {
      if (interval === undefined) {
        interval = window.setInterval(() => setActive((i) => (i + 1) % count), ADVANCE_MS);
      }
    };
    const stop = () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
        interval = undefined;
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [count]);

  return (
    <div className="relative h-full w-full" onPointerDown={onInteract}>
      {slides.map((slide, i) => (
        <div
          key={slide.key}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === activeIdx ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          aria-hidden={i !== activeIdx}
        >
          {slide.node}
        </div>
      ))}

      <div
        className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2"
        aria-hidden="true"
      >
        {slides.map((slide, i) => (
          <span
            key={slide.key}
            className={`h-2 w-2 ${i === activeIdx ? "bg-[#CC1A1A]" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
