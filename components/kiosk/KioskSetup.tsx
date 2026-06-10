"use client";

import { useEffect, useState } from "react";
import { readKioskConfig, saveKioskConfig } from "@/lib/kiosk";

export type KioskBranchOption = { slug: string; shortName: string; type: "mixed" | "ladies" };

const MONTSERRAT = { fontFamily: "var(--font-montserrat, sans-serif)" } as const;
const BEBAS = { fontFamily: "var(--font-bebas, sans-serif)" } as const;

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CC1A1A] focus-visible:outline-offset-4";

/**
 * One-time device setup screen for /kiosk. If this screen was already
 * configured, immediately forwards to its branch kiosk; otherwise lets the
 * staff member pick a branch (and ladies-floor mode) and remembers it on
 * the device via localStorage — never the member tools document.
 */
export default function KioskSetup({ branches }: { branches: KioskBranchOption[] }) {
  const [checking, setChecking] = useState(true);
  const [ladiesMode, setLadiesMode] = useState(false);

  useEffect(() => {
    const config = readKioskConfig();
    if (config) {
      window.location.replace("/kiosk/" + config.branchSlug);
      return; // keep the loading state while the browser navigates
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-2xl text-white/60">Loading&hellip;</p>
      </div>
    );
  }

  const choose = (slug: string) => {
    saveKioskConfig({ v: 1, branchSlug: slug, ladiesMode });
    window.location.assign("/kiosk/" + slug);
  };

  return (
    <div className="flex h-full w-full flex-col gap-8 overflow-y-auto p-8">
      <header>
        <h1
          className="font-bebas leading-none text-white"
          style={{ ...BEBAS, fontSize: "clamp(3.5rem,10vh,8rem)" }}
        >
          KIOSK SETUP
        </h1>
        <p className="mt-2 text-2xl text-white/60">Which branch is this screen in?</p>
      </header>

      {/* Ladies-content toggle */}
      <div className="flex flex-wrap gap-4" role="group" aria-label="Content mode">
        <button
          type="button"
          aria-pressed={!ladiesMode}
          onClick={() => setLadiesMode(false)}
          className={`min-h-[80px] px-8 font-montserrat font-bold uppercase tracking-[0.1em] text-lg ${
            !ladiesMode
              ? "bg-white text-[#0D0D0D]"
              : "border border-white/30 bg-transparent text-white/70"
          } ${FOCUS}`}
          style={MONTSERRAT}
        >
          Standard Content
        </button>
        <button
          type="button"
          aria-pressed={ladiesMode}
          onClick={() => setLadiesMode(true)}
          className={`min-h-[80px] px-8 font-montserrat font-bold uppercase tracking-[0.1em] text-lg ${
            ladiesMode
              ? "bg-white text-[#0D0D0D]"
              : "border border-white/30 bg-transparent text-white/70"
          } ${FOCUS}`}
          style={MONTSERRAT}
        >
          Ladies-Floor Content
        </button>
      </div>

      {/* Branch tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {branches.map((b) => (
          <button
            key={b.slug}
            type="button"
            onClick={() => choose(b.slug)}
            className={`flex min-h-[120px] flex-col items-center justify-center gap-1 bg-white p-6 text-[#0D0D0D] ${FOCUS}`}
          >
            <span className="font-bebas text-3xl leading-none" style={BEBAS}>
              {b.shortName}
            </span>
            {b.type === "ladies" && (
              <span
                className="font-montserrat text-xs font-bold uppercase tracking-[0.15em] text-[#CC1A1A]"
                style={MONTSERRAT}
              >
                Ladies Only
              </span>
            )}
          </button>
        ))}
      </div>

      <p className="text-sm text-white/40">
        Remembered on this device. Tap the top-left corner 5&times; on the kiosk to return here.
      </p>
    </div>
  );
}
