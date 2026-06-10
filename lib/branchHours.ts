import type { Branch } from "./branches";

/**
 * Parses the branch timing day-labels (display strings like "Sat – Thu" or
 * "Friday") into machine weekdays and answers "what are today's hours / are
 * we open right now". Times compare against the device's local clock —
 * kiosks and members are physically in Bahrain.
 *
 * NOTE: when ROADMAP §12's seasonalTimings (Ramadan/Eid overrides) lands in
 * the branch schema, this module is the single place to consume it.
 */

export type Weekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

const WEEKDAYS: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const DAY_ALIASES: Record<string, Weekday> = {
  sun: "sun", sunday: "sun",
  mon: "mon", monday: "mon",
  tue: "tue", tues: "tue", tuesday: "tue",
  wed: "wed", wednesday: "wed",
  thu: "thu", thur: "thu", thurs: "thu", thursday: "thu",
  fri: "fri", friday: "fri",
  sat: "sat", saturday: "sat",
};

function parseDayToken(token: string): Weekday | null {
  const key = token.trim().toLowerCase();
  return DAY_ALIASES[key] ?? DAY_ALIASES[key.slice(0, 3)] ?? null;
}

/**
 * Expand a display label into weekdays.
 * "Friday" → [fri] · "Sat – Thu" → [sat, sun, mon, tue, wed, thu] (wrapping
 * ranges supported) · "Daily" → all seven. Returns null when unparseable.
 */
export function expandDayLabel(label: string): Weekday[] | null {
  const norm = label.trim().toLowerCase();
  if (norm === "daily" || norm === "every day" || norm === "all week") return [...WEEKDAYS];

  // Range: split on en/em dash, hyphen, or "to"
  const rangeParts = norm.split(/\s*(?:–|—|-|to)\s*/).filter(Boolean);
  if (rangeParts.length === 2) {
    const from = parseDayToken(rangeParts[0]);
    const to = parseDayToken(rangeParts[1]);
    if (!from || !to) return null;
    const out: Weekday[] = [];
    let i = WEEKDAYS.indexOf(from);
    for (let steps = 0; steps < 7; steps++) {
      out.push(WEEKDAYS[i]);
      if (WEEKDAYS[i] === to) return out;
      i = (i + 1) % 7;
    }
    return out;
  }

  const single = parseDayToken(norm);
  return single ? [single] : null;
}

/** "05:00" → minutes since midnight. Returns null when malformed. */
export function parseTime(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 24 || min > 59) return null;
  return h * 60 + min;
}

/** "05:00" → "5:00 AM" for big glanceable kiosk type. */
export function formatTime12(hhmm: string): string {
  const total = parseTime(hhmm);
  if (total == null) return hhmm;
  const h24 = Math.floor(total / 60) % 24;
  const min = total % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${suffix}`;
}

export type TodayHours = {
  /** Timing section label, e.g. "Mixed Floor" / "Ladies Floor" / "All Members". */
  sectionLabel: string;
  open: string; // "05:00"
  close: string;
  openDisplay: string; // "5:00 AM"
  closeDisplay: string;
  isOpen: boolean;
};

/**
 * Today's hours per timing section, with an open-now flag.
 * close <= open is treated as spanning midnight. Sections with no entry
 * matching today are omitted (closed today).
 */
export function getTodayHours(branch: Branch, now: Date = new Date()): TodayHours[] {
  const todayIdx = now.getDay(); // 0 = Sunday
  const today = WEEKDAYS[todayIdx];
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  const out: TodayHours[] = [];
  for (const section of branch.timings ?? []) {
    for (const entry of section.days ?? []) {
      const days = expandDayLabel(entry.day);
      if (!days || !days.includes(today)) continue;
      const open = parseTime(entry.open);
      const close = parseTime(entry.close);
      let isOpen = false;
      if (open != null && close != null) {
        isOpen =
          close <= open
            ? minutesNow >= open || minutesNow < close // spans midnight
            : minutesNow >= open && minutesNow < close;
      }
      out.push({
        sectionLabel: section.label,
        open: entry.open,
        close: entry.close,
        openDisplay: formatTime12(entry.open),
        closeDisplay: formatTime12(entry.close),
        isOpen,
      });
      break; // first matching entry per section wins
    }
  }
  return out;
}

/** True when any section is open right now. */
export function isOpenNow(branch: Branch, now: Date = new Date()): boolean {
  return getTodayHours(branch, now).some((h) => h.isOpen);
}
