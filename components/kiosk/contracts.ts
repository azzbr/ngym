import type { Branch } from "@/lib/branches";

/**
 * Shared kiosk component contracts — imported by slides, the idle loop,
 * the shell and the interactive tools so parallel implementations agree.
 */

export type KioskQuote = {
  lines: string[];
  /** Indexes into `lines` rendered in brand red. */
  redLines: number[];
  audience: "all" | "ladies";
};

export type KioskPromo = {
  eyebrow: string;
  title: string;
  redWord: string;
  body: string;
  audience: "all" | "ladies";
};

export type KioskChallenge = {
  active: boolean;
  eyebrow: string;
  title: string;
  redWord: string;
  body: string;
  /** "yyyy-mm-dd" — countdown target. */
  endsOn: string;
  audience: "all" | "ladies";
};

export type KioskMode = "loop" | "menu" | "hr" | "water" | "hours";

export type GallerySlideProps = { src: string; alt: string };
export type QuoteSlideProps = { quote: KioskQuote };
export type HoursSlideProps = { branch: Branch };
export type PromoSlideProps = { promo: KioskPromo };
export type ChallengeSlideProps = { challenge: KioskChallenge };
export type QrSlideProps = { heading: string; sub: string; url: string };

export type IdleLoopProps = {
  branch: Branch;
  ladiesMode: boolean;
  /** Called on any tap — the shell switches to the menu. */
  onInteract: () => void;
};

export type KioskMenuProps = {
  onSelect: (mode: KioskMode) => void;
};

export type KioskToolProps = {
  onBack: () => void;
};

export type QrCodeProps = {
  value: string;
  /** Rendered size hint; the SVG scales. */
  className?: string;
};
