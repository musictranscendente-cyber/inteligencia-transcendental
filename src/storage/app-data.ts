/** Dados do app guardados no celular: histórico, pessoas, sequência, preferências, assinatura. */
import type { BirthPlace } from '@/lib/birth';
import type { Synthesis } from '@/content/synthesis';
import { createStore } from './store';

export type HistoryKind = 'tarot' | 'lenormand' | 'iching' | 'runes' | 'ask';

export type HistoryEntry = {
  id: string;
  kind: HistoryKind;
  date: string;
  spread: string;
  question?: string;
  cards: { id: string | number; reversed?: boolean }[];
  /** I Ching: linhas jogadas. */
  lines?: number[];
  answer?: string;
};

export const historyStore = createStore<HistoryEntry[]>('history.v1', []);

export function addHistory(entry: Omit<HistoryEntry, 'id' | 'date'>) {
  const full: HistoryEntry = { ...entry, id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`, date: new Date().toISOString() };
  historyStore.set((h) => [full, ...h].slice(0, 300));
  return full;
}

export type Person = {
  id: string;
  fullName: string;
  relation: 'partner' | 'child' | 'friend' | 'partnerBiz' | 'family' | 'other';
  birthDate: string;
  birthTime: string | null;
  place: BirthPlace;
  birthUtc: string;
};

export const peopleStore = createStore<Person[]>('people.v1', []);

/** Sequência de dias abertos. */
export const streakStore = createStore<{ last: string | null; count: number; best: number; days: string[] }>('streak.v1', { last: null, count: 0, best: 0, days: [] });

export function touchStreak(today = new Date()) {
  const day = today.toISOString().slice(0, 10);
  const s = streakStore.get();
  if (s.last === day) return s;
  const yesterday = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);
  const count = s.last === yesterday ? s.count + 1 : 1;
  const next = { last: day, count, best: Math.max(s.best, count), days: [...s.days, day].slice(-400) };
  streakStore.set(next);
  return next;
}

export type Prefs = {
  houseSystem: 'placidus' | 'whole';
  reversals: boolean;
  notifications: boolean;
  notifyHour: number;
  notifyMinute: number;
  revealedDay: string | null;
};
export const prefsStore = createStore<Prefs>('prefs.v1', { houseSystem: 'placidus', reversals: true, notifications: false, notifyHour: 8, notifyMinute: 30, revealedDay: null });

export const synthesisStore = createStore<Synthesis | null>('synthesis.v1', null);

/** Uso diário no plano grátis. */
export const usageStore = createStore<{ day: string; tarot: number; oracle: number }>('usage.v1', { day: '', tarot: 0, oracle: 0 });

export function todayUsage() {
  const day = new Date().toISOString().slice(0, 10);
  const u = usageStore.get();
  return u.day === day ? u : { day, tarot: 0, oracle: 0 };
}

export function countUsage(kind: 'tarot' | 'oracle') {
  const u = todayUsage();
  usageStore.set({ ...u, [kind]: u[kind] + 1 });
}

export const subscriptionStore = createStore<{ premium: boolean; plan: string | null; checkedAt: string | null }>('subscription.v1', { premium: false, plan: null, checkedAt: null });
