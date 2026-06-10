"use client";

import { useEffect, useRef } from "react";

/**
 * Minimal local typings for the Screen Wake Lock API — older in-gym machine
 * browsers may not ship the DOM lib types (or the API at all), so everything
 * is optional and every call is wrapped in silent try/catch.
 */
interface ScreenWakeLockSentinel {
  release(): Promise<void>;
}

interface ScreenWakeLock {
  request(type: "screen"): Promise<ScreenWakeLockSentinel>;
}

type NavigatorWithWakeLock = Navigator & { wakeLock?: ScreenWakeLock };

/**
 * Holds a screen wake lock while `enabled`. The browser silently releases
 * the lock when the tab is hidden, so we re-request on visibilitychange when
 * the document becomes visible again. All failures are silent — a kiosk
 * without wake-lock support still works, the screen just dims.
 */
export function useWakeLock(enabled: boolean): void {
  const sentinelRef = useRef<ScreenWakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const request = async () => {
      try {
        const wakeLock = (navigator as NavigatorWithWakeLock).wakeLock;
        if (!wakeLock) return;
        const sentinel = await wakeLock.request("screen");
        if (cancelled) {
          try {
            await sentinel.release();
          } catch {
            /* ignore */
          }
          return;
        }
        sentinelRef.current = sentinel;
      } catch {
        /* unsupported or denied — screen dimming is acceptable */
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void request();
    };

    void request();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      const sentinel = sentinelRef.current;
      sentinelRef.current = null;
      if (sentinel) {
        try {
          sentinel.release().catch(() => {
            /* already released */
          });
        } catch {
          /* ignore */
        }
      }
    };
  }, [enabled]);
}
