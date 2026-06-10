"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `onIdle` once after `ms` of no pointer/keyboard activity while
 * `enabled`. Any pointerdown/keydown on the window resets the countdown.
 * `onIdle` is kept in a ref so the timer never fires a stale closure.
 */
export function useIdleTimeout(enabled: boolean, ms: number, onIdle: () => void): void {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!enabled) return;

    let timer: number | undefined;

    const arm = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = undefined;
        onIdleRef.current();
      }, ms);
    };

    arm();
    window.addEventListener("pointerdown", arm);
    window.addEventListener("keydown", arm);

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, [enabled, ms]);
}
