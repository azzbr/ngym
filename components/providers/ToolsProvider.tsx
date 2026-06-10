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
import { evaluateBadges, type BadgeEventCtx, type BadgeId } from "@/lib/fitness/badges";
import {
  clampProgress,
  defaultStorage,
  HANDOFF_TTL_MS,
  parseStored,
  STORAGE_KEY,
  type Profile,
  type ProgressState,
  type ToolPrefs,
  type ToolsStorage,
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
  /** Progress (streaks, weight log, PRs, badges). */
  progress: ProgressState;
  /**
   * The single write path for progress: applies the mutation, prunes caps,
   * runs the badge engine (idempotent) and queues newly earned badges for
   * the toast. Callers should gate auto-writes on `hydrated`.
   */
  updateProgress: (mutate: (p: ProgressState) => ProgressState, eventCtx?: BadgeEventCtx) => void;
  /** FIFO of badges awaiting celebration. */
  pendingBadges: BadgeId[];
  dismissBadge: () => void;
};

const ToolsContext = createContext<ToolsContextValue | null>(null);

function defaultMaxHrFormula(sex: Sex | null): MaxHrFormula {
  return sex === "female" ? "gulati" : "tanaka";
}

export default function ToolsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToolsStorage>(() => ({
    ...defaultStorage(),
    deviceId: "", // placeholder until hydration — never persisted (writes are hydration-gated)
  }));
  const [hydrated, setHydrated] = useState(false);
  const [pendingBadges, setPendingBadges] = useState<BadgeId[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage after mount (never during render → no SSR mismatch).
  useEffect(() => {
    try {
      setState(parseStored(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      setState(defaultStorage()); // private mode: in-memory defaults with a real deviceId
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

  const updateProgress = useCallback(
    (mutate: (p: ProgressState) => ProgressState, eventCtx?: BadgeEventCtx) => {
      setState((s) => {
        const mutated = mutate(s.progress);
        if (mutated === s.progress && !eventCtx) return s;
        const clamped = clampProgress(mutated);
        const newlyEarned = evaluateBadges(clamped, s.profile, eventCtx);
        if (newlyEarned.length > 0) {
          const earnedAt = Date.now();
          // Queue outside the reducer is unsafe under StrictMode double-invoke;
          // schedule after commit instead.
          queueMicrotask(() =>
            setPendingBadges((q) => [...q, ...newlyEarned.filter((id) => !q.includes(id))]),
          );
          return {
            ...s,
            progress: {
              ...clamped,
              badges: [...clamped.badges, ...newlyEarned.map((id) => ({ id, earnedAt }))],
            },
          };
        }
        return { ...s, progress: clamped };
      });
    },
    [],
  );

  const dismissBadge = useCallback(() => {
    setPendingBadges((q) => q.slice(1));
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
      progress: state.progress,
      updateProgress,
      pendingBadges,
      dismissBadge,
    }),
    [
      hydrated,
      state,
      setProfile,
      setUnits,
      setPrefs,
      setHandoff,
      getHandoff,
      clearHandoff,
      updateProgress,
      pendingBadges,
      dismissBadge,
    ],
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

export function useProgress() {
  const { progress, updateProgress, pendingBadges, dismissBadge, hydrated } = useTools();
  return { progress, updateProgress, pendingBadges, dismissBadge, hydrated };
}
