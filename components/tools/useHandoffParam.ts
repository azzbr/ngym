"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTools } from "@/components/providers/ToolsProvider";
import type { HandoffEntry, HandoffKey } from "@/lib/fitness/types";

/**
 * Consume a handed-off value. Prefill happens ONLY when the page was reached
 * via a "Use this result" navigation (?from=<slug> present) AND a fresh entry
 * exists — never silently on a later visit. Returns the entry once (sticky
 * for this mount) plus a dismiss().
 */
export function useHandoffParam(key: HandoffKey): {
  entry: HandoffEntry | null;
  dismissed: boolean;
  dismiss: () => void;
} {
  const searchParams = useSearchParams();
  const { getHandoff } = useTools();
  const from = searchParams.get("from");
  const [dismissed, setDismissed] = useState(false);
  const captured = useRef<HandoffEntry | null | undefined>(undefined);

  // Capture once per mount so the chip doesn't vanish when storage updates.
  if (captured.current === undefined) {
    captured.current = from ? getHandoff(key) : null;
  }

  // Late hydration: storage may not be loaded at first render — re-check once.
  const { hydrated } = useTools();
  const [, force] = useState(0);
  const rechecked = useRef(false);
  useEffect(() => {
    if (hydrated && !rechecked.current) {
      rechecked.current = true;
      if (captured.current === null && from) {
        const entry = getHandoff(key);
        if (entry) {
          captured.current = entry;
          force((n) => n + 1);
        }
      }
    }
  }, [hydrated, from, getHandoff, key]);

  return {
    entry: dismissed ? null : (captured.current ?? null),
    dismissed,
    dismiss: () => setDismissed(true),
  };
}
