"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_STORAGE,
  HANDOFF_TTL_MS,
  parseStored,
  STORAGE_KEY,
  type Profile,
  type ToolPrefs,
  type ToolsStorageV1,
} from "@/lib/fitness/profile";
import type {
  HandoffEntry,
  HandoffKey,
  MaxHrFormula,
  Sex,
  Units,
} from "@/lib/fitness/types";

type ToolsContextValue = {
  hydrated: boolean;
  profile: Profile;
  setProfile: (patch: Partial<Profile>) => void;
  units: Units;
  setUnits: (u: Units) => void;
  prefs: ToolPrefs;
  setPrefs: (patch: Partial<ToolPrefs>) => void;
  /** Effective max-HR formula: explicit pref, else Tanaka (M) / Gulati (F). */
  maxHrFormula: MaxHrFormula;
  setHandoff: (values: Partial<Record<HandoffKey, number>>, from: string) => void;
  /** Returns a fresh handoff entry or null (stale/missing). */
  getHandoff: (key: HandoffKey) => HandoffEntry | null;
  clearHandoff: (key: HandoffKey) => void;
};

const ToolsContext = createContext<ToolsContextValue | null>(null);

function defaultMaxHrFormula(sex: Sex | null): MaxHrFormula {
  return sex === "female" ? "gulati" : "tanaka";
}

export default function ToolsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToolsStorageV1>(DEFAULT_STORAGE);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage after mount (never during render → no SSR mismatch).
  useEffect(() => {
    try {
      setState(parseStored(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      // Private mode / blocked storage: stay on in-memory defaults.
    }
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setState(parseStored(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persist (debounced) — only after hydration so defaults never clobber stored data.
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* quota/private mode: degrade silently to in-memory */
      }
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, hydrated]);

  const setProfile = useCallback((patch: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }, []);

  const setUnits = useCallback((units: Units) => {
    setState((s) => ({ ...s, units }));
  }, []);

  const setPrefs = useCallback((patch: Partial<ToolPrefs>) => {
    setState((s) => ({ ...s, prefs: { ...s.prefs, ...patch } }));
  }, []);

  const setHandoff = useCallback(
    (values: Partial<Record<HandoffKey, number>>, from: string) => {
      const at = Date.now();
      setState((s) => {
        const handoff = { ...s.handoff };
        for (const [key, value] of Object.entries(values)) {
          if (typeof value === "number" && Number.isFinite(value)) {
            handoff[key as HandoffKey] = { value, from, at };
          }
        }
        return { ...s, handoff };
      });
    },
    [],
  );

  const getHandoff = useCallback(
    (key: HandoffKey): HandoffEntry | null => {
      const entry = state.handoff[key];
      if (!entry) return null;
      if (Date.now() - entry.at > HANDOFF_TTL_MS) return null;
      return entry;
    },
    [state.handoff],
  );

  const clearHandoff = useCallback((key: HandoffKey) => {
    setState((s) => {
      const handoff = { ...s.handoff };
      delete handoff[key];
      return { ...s, handoff };
    });
  }, []);

  const value = useMemo<ToolsContextValue>(
    () => ({
      hydrated,
      profile: state.profile,
      setProfile,
      units: state.units,
      setUnits,
      prefs: state.prefs,
      setPrefs,
      maxHrFormula: state.prefs.maxHrFormula ?? defaultMaxHrFormula(state.profile.sex),
      setHandoff,
      getHandoff,
      clearHandoff,
    }),
    [hydrated, state, setProfile, setUnits, setPrefs, setHandoff, getHandoff, clearHandoff],
  );

  return <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>;
}

export function useTools(): ToolsContextValue {
  const ctx = useContext(ToolsContext);
  if (!ctx) throw new Error("useTools must be used inside <ToolsProvider>");
  return ctx;
}

export function useProfile() {
  const { profile, setProfile, hydrated } = useTools();
  return { profile, setProfile, hydrated };
}

export function useUnits() {
  const { units, setUnits } = useTools();
  return { units, setUnits };
}
