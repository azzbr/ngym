"use client";

import { ArrowLeft, Clock, Droplets, HeartPulse } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { KioskMenuProps, KioskMode } from "./contracts";

type Tile = {
  mode: KioskMode;
  label: string;
  Icon: LucideIcon;
  back?: boolean;
};

const TILES: Tile[] = [
  { mode: "hr", label: "HR ZONES", Icon: HeartPulse },
  { mode: "water", label: "WATER", Icon: Droplets },
  { mode: "hours", label: "TODAY'S HOURS", Icon: Clock },
  { mode: "loop", label: "BACK", Icon: ArrowLeft, back: true },
];

/** Full-screen 2×2 kiosk menu — giant sweaty-finger tiles. */
export default function KioskMenu({ onSelect }: KioskMenuProps) {
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-6 p-10">
      {TILES.map(({ mode, label, Icon, back }) => (
        <button
          key={mode}
          type="button"
          onClick={() => onSelect(mode)}
          className={`flex min-h-[200px] flex-col items-center justify-center gap-6 p-8 transition-colors ${
            back
              ? "bg-[#2A2A2A] text-white active:bg-[#1F1F1F]"
              : "bg-white text-[#0D0D0D] active:bg-[#F5F4F2]"
          }`}
        >
          <Icon size={48} className="text-[#CC1A1A]" aria-hidden="true" />
          <span
            className="text-5xl tracking-wide"
            style={{ fontFamily: "var(--font-bebas, sans-serif)" }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
