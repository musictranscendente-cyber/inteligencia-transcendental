import { createContext, useContext, useState, type ReactNode } from 'react';

import type { BirthPlace } from '@/lib/birth';

/** Dados digitados durante o cadastro, antes de serem salvos. */
export type OnboardingDraft = {
  fullName: string;
  year: number;
  month: number; // 1–12
  day: number;
  hour: number;
  minute: number;
  timeUnknown: boolean;
  place: BirthPlace | null;
};

const initial: OnboardingDraft = {
  fullName: '',
  year: 1990,
  month: 1,
  day: 1,
  hour: 12,
  minute: 0,
  timeUnknown: false,
  place: null,
};

type Ctx = { draft: OnboardingDraft; update: (patch: Partial<OnboardingDraft>) => void };
const DraftContext = createContext<Ctx | null>(null);

export function OnboardingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(initial);
  const update = (patch: Partial<OnboardingDraft>) => setDraft((d) => ({ ...d, ...patch }));
  return <DraftContext.Provider value={{ draft, update }}>{children}</DraftContext.Provider>;
}

export function useOnboardingDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('useOnboardingDraft fora do OnboardingDraftProvider');
  return ctx;
}

/** Nome e sobrenome: pelo menos duas palavras com letras. */
export function isValidFullName(name: string) {
  const words = name.trim().split(/\s+/).filter((w) => /\p{L}/u.test(w));
  return words.length >= 2;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');

export function draftDate(d: OnboardingDraft) {
  return `${d.year}-${pad2(d.month)}-${pad2(d.day)}`;
}

export function draftTime(d: OnboardingDraft) {
  return d.timeUnknown ? null : `${pad2(d.hour)}:${pad2(d.minute)}`;
}

/** Ordem das etapas com barra de progresso. */
export const STEPS = ['language', 'name', 'birth-date', 'birth-time', 'birth-place', 'review'] as const;
