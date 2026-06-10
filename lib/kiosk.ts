import type { Branch } from "./branches";

/**
 * Kiosk device configuration — a SEPARATE localStorage document from the
 * member tools doc (a kiosk is a shared device; it must never read or write
 * "anp.tools.v1").
 */

export const KIOSK_KEY = "anp.kiosk.v1";

export type KioskConfig = {
  v: 1;
  branchSlug: string;
  ladiesMode: boolean;
};

export function parseKioskConfig(raw: string | null): KioskConfig | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<KioskConfig> | null;
    if (!data || data.v !== 1 || typeof data.branchSlug !== "string" || !data.branchSlug) {
      return null;
    }
    return { v: 1, branchSlug: data.branchSlug, ladiesMode: data.ladiesMode === true };
  } catch {
    return null;
  }
}

export function readKioskConfig(): KioskConfig | null {
  try {
    return parseKioskConfig(window.localStorage.getItem(KIOSK_KEY));
  } catch {
    return null;
  }
}

export function saveKioskConfig(config: KioskConfig): void {
  try {
    window.localStorage.setItem(KIOSK_KEY, JSON.stringify(config));
  } catch {
    /* storage blocked — picker will simply reappear next load */
  }
}

export function clearKioskConfig(): void {
  try {
    window.localStorage.removeItem(KIOSK_KEY);
  } catch {
    /* ignore */
  }
}

export const SITE_URL = "https://alnakheelpremium.com";

/** QR target for the "try the calculators" slide. */
export const TOOLS_QR_URL = `${SITE_URL}/tools`;

const MAIN_WHATSAPP = "97338833663";

/**
 * QR target for the equipment fault-report slide.
 * Today: a prefilled WhatsApp message to the branch line (main-line fallback
 * for unverified branches). When ROADMAP P4 ships /report/[code], swap the
 * implementation HERE only.
 */
export function getFaultReportUrl(branch: Branch): string {
  const number = (branch.pendingData ? MAIN_WHATSAPP : branch.contact.whatsapp.replace(/\D/g, "")) || MAIN_WHATSAPP;
  const text = encodeURIComponent(
    `Fault report — ${branch.shortName}: machine ____, issue: ____`,
  );
  return `https://wa.me/${number}?text=${text}`;
}
