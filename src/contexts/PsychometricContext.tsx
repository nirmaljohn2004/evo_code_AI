import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  score: number | null;
  setScore: (v: number | null) => void;
  reload: () => void;
};

const PsychometricContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "psychometric_score_v1";

export const PsychometricProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [score, setScoreState] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setScoreState(raw ? Number(raw) : null);
  }, []);

  const setScore = (v: number | null) => {
    setScoreState(v);
    if (v === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, String(v));
  };

  const value = useMemo(
    () => ({
      score,
      setScore,
      reload: () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        setScoreState(raw ? Number(raw) : null);
      },
    }),
    [score]
  );

  return <PsychometricContext.Provider value={value}>{children}</PsychometricContext.Provider>;
};

export const usePsychometric = () => {
  const ctx = useContext(PsychometricContext);
  if (!ctx) throw new Error("usePsychometric must be used within PsychometricProvider");
  return ctx;
};
