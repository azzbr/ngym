import { describe, expect, it } from "vitest";
import { getAllBranches } from "./branches";
import { expandDayLabel, formatTime12, getTodayHours, isOpenNow, parseTime } from "./branchHours";

describe("expandDayLabel", () => {
  it("parses single days", () => {
    expect(expandDayLabel("Friday")).toEqual(["fri"]);
    expect(expandDayLabel("sat")).toEqual(["sat"]);
  });

  it("parses ranges including the Sat – Thu wrap", () => {
    expect(expandDayLabel("Sat – Thu")).toEqual(["sat", "sun", "mon", "tue", "wed", "thu"]);
    expect(expandDayLabel("Mon-Wed")).toEqual(["mon", "tue", "wed"]);
    expect(expandDayLabel("Fri to Sat")).toEqual(["fri", "sat"]);
  });

  it("parses Daily and rejects junk", () => {
    expect(expandDayLabel("Daily")!.length).toBe(7);
    expect(expandDayLabel("whenever")).toBeNull();
  });

  it("EVERY day label in EVERY real branch JSON parses", () => {
    for (const branch of getAllBranches()) {
      for (const section of branch.timings) {
        for (const entry of section.days) {
          expect(expandDayLabel(entry.day), `${branch.slug}: "${entry.day}"`).not.toBeNull();
        }
      }
    }
  });
});

describe("time parsing and open-now", () => {
  it("parses and formats times", () => {
    expect(parseTime("05:00")).toBe(300);
    expect(parseTime("23:59")).toBe(1439);
    expect(parseTime("junk")).toBeNull();
    expect(formatTime12("05:00")).toBe("5:00 AM");
    expect(formatTime12("23:00")).toBe("11:00 PM");
    expect(formatTime12("12:00")).toBe("12:00 PM");
    expect(formatTime12("00:30")).toBe("12:30 AM");
  });

  it("getTodayHours flags open/closed on a verified branch", () => {
    const alLiwan = getAllBranches().find((b) => b.slug === "al-liwan")!;
    // Wednesday 2026-06-10 10:00 → mixed floor 05:00–23:00 open
    const open = getTodayHours(alLiwan, new Date("2026-06-10T10:00:00"));
    expect(open.length).toBeGreaterThan(0);
    expect(open[0].isOpen).toBe(true);
    expect(open[0].openDisplay).toBe("5:00 AM");
    // 23:30 → closed
    const closed = getTodayHours(alLiwan, new Date("2026-06-10T23:30:00"));
    expect(closed[0].isOpen).toBe(false);
    expect(isOpenNow(alLiwan, new Date("2026-06-10T23:30:00"))).toBe(false);
    // Friday hours differ (08:00–20:00) — 2026-06-12 is a Friday
    const friday = getTodayHours(alLiwan, new Date("2026-06-12T09:00:00"));
    expect(friday[0].open).toBe("08:00");
    expect(friday[0].isOpen).toBe(true);
  });

  it("close <= open spans midnight", () => {
    const fake = {
      timings: [{ section: "mix", label: "All", days: [{ day: "Daily", open: "22:00", close: "02:00" }] }],
    } as Parameters<typeof getTodayHours>[0];
    expect(getTodayHours(fake, new Date("2026-06-10T23:00:00"))[0].isOpen).toBe(true);
    expect(getTodayHours(fake, new Date("2026-06-10T01:00:00"))[0].isOpen).toBe(true);
    expect(getTodayHours(fake, new Date("2026-06-10T12:00:00"))[0].isOpen).toBe(false);
  });

  it("pendingData branches with empty timings return no hours", () => {
    const pending = getAllBranches().find((b) => b.timings.length === 0);
    if (pending) {
      expect(getTodayHours(pending, new Date())).toEqual([]);
      expect(isOpenNow(pending)).toBe(false);
    }
  });
});
