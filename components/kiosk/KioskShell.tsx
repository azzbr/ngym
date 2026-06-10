"use client";

import { useEffect, useRef, useState } from "react";
import type { Branch } from "@/lib/branches";
import { clearKioskConfig, readKioskConfig } from "@/lib/kiosk";
import type { KioskMode } from "./contracts";
import IdleLoop from "./IdleLoop";
import KioskHrZones from "./KioskHrZones";
import KioskMenu from "./KioskMenu";
import KioskWater from "./KioskWater";
import HoursSlide from "./slides/HoursSlide";
import { useIdleTimeout } from "./useIdleTimeout";
import { useWakeLock } from "./useWakeLock";

type Mode = "splash" | KioskMode;

const SECRET_TAPS = 5;
const SECRET_WINDOW_MS = 3000;
const IDLE_RETURN_MS = 60000;

/**
 * Kiosk state machine: splash → loop ⇄ menu → hr/water/hours.
 * The wake lock holds the screen on after the first tap (a user gesture is
 * required for fullscreen anyway), and any 60s of inactivity outside the
 * loop returns to the attract loop.
 */
export default function KioskShell({ branch }: { branch: Branch }) {
  const [mode, setMode] = useState<Mode>("splash");
  const [ladiesMode, setLadiesMode] = useState(false);

  // URL stays authoritative for the branch; only adopt the stored ladiesMode
  // when the saved config belongs to this same branch.
  useEffect(() => {
    const config = readKioskConfig();
    if (config && config.branchSlug === branch.slug) {
      setLadiesMode(config.ladiesMode);
    }
  }, [branch.slug]);

  useWakeLock(mode !== "splash");
  useIdleTimeout(mode !== "loop" && mode !== "splash", IDLE_RETURN_MS, () => setMode("loop"));

  // Hidden reconfigure: 5 taps on the top-left corner within 3s.
  const tapTimesRef = useRef<number[]>([]);
  const handleSecretTap = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const now = Date.now();
    const taps = tapTimesRef.current.filter((t) => now - t < SECRET_WINDOW_MS);
    taps.push(now);
    tapTimesRef.current = taps;
    if (taps.length >= SECRET_TAPS) {
      tapTimesRef.current = [];
      clearKioskConfig();
      window.location.assign("/kiosk");
    }
  };

  const startKiosk = () => {
    try {
      document.documentElement.requestFullscreen().catch(() => {
        /* fullscreen denied — kiosk still runs */
      });
    } catch {
      /* API missing on old machine browsers */
    }
    setMode("loop");
  };

  return (
    <div className="relative h-full w-full">
      {mode === "splash" && (
        <button
          type="button"
          onPointerDown={startKiosk}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-8 text-white"
        >
          <span className="text-center">
            <span
              className="block font-montserrat font-black text-2xl tracking-[0.3em]"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              ALNAKHEEL
            </span>
            <span
              className="block font-montserrat font-light text-sm tracking-[0.5em] text-white/70 mt-1"
              style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
            >
              PREMIUM
            </span>
          </span>
          <span
            className="text-4xl text-[#CC1A1A]"
            style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
          >
            {branch.shortName}
          </span>
          <span
            className="leading-none"
            style={{ fontFamily: "var(--font-bebas, sans-serif)", fontSize: "clamp(3rem,10vh,8rem)" }}
          >
            TAP TO START
          </span>
        </button>
      )}

      {mode === "loop" && (
        <IdleLoop branch={branch} ladiesMode={ladiesMode} onInteract={() => setMode("menu")} />
      )}

      {mode === "menu" && <KioskMenu onSelect={setMode} />}

      {mode === "hr" && <KioskHrZones onBack={() => setMode("menu")} />}

      {mode === "water" && <KioskWater onBack={() => setMode("menu")} />}

      {mode === "hours" && (
        <div className="relative h-full w-full">
          <HoursSlide branch={branch} />
          <button
            type="button"
            onClick={() => setMode("menu")}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 min-h-[80px] bg-[#CC1A1A] px-12 text-3xl text-white tracking-wide active:bg-[#AA1414]"
            style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
          >
            BACK
          </button>
        </div>
      )}

      <button
        type="button"
        aria-label="Kiosk settings"
        onPointerDown={handleSecretTap}
        className="fixed top-0 left-0 z-50 h-20 w-20 bg-transparent"
      />
    </div>
  );
}
