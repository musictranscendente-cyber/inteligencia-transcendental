/**
 * Energia do dia: dia pessoal (numerologia) + trânsitos do dia sobre o mapa natal + Lua do dia.
 * Resultado: notas de 1 a 5 para amor, trabalho e energia.
 */
import { moonInfo, SIGN_ELEMENT, signIndex, type ElementKey, type NatalChart, type PointKey } from './astro/chart';
import type { PlanetKey } from './astro/ephemeris';
import { transitsOn, type Transit } from './astro/transits';
import { personalNumbers } from './numerology';

export type Area = 'love' | 'work' | 'energy';
export type DayScores = Record<Area, number>;

export type DailyEnergy = {
  personalDay: number;
  personalMonth: number;
  personalYear: number;
  scores: DayScores;
  /** Área mais favorecida do dia. */
  highlight: Area;
  moon: ReturnType<typeof moonInfo>;
  transits: Transit[];
  /** Combinação de dia pessoal + área, usada para escolher o texto do dia. */
  seed: number;
};

const DAY_BASE: Record<number, Partial<DayScores>> = {
  1: { energy: 1, work: 1 },
  2: { love: 1, energy: -0.5 },
  3: { love: 0.5, energy: 0.5 },
  4: { work: 1, love: -0.5 },
  5: { energy: 1, work: -0.5 },
  6: { love: 1 },
  7: { work: 0.5, energy: -0.5, love: -0.5 },
  8: { work: 1, energy: 0.5 },
  9: { love: 0.5, work: -0.5 },
};

const HARMONIOUS = new Set(['trine', 'sextile']);
const HARD = new Set(['square', 'opposition']);
const PERSONAL: PointKey[] = ['sun', 'moon', 'venus', 'mars', 'mercury', 'asc', 'mc'];

const COMPATIBLE: Record<ElementKey, ElementKey[]> = {
  fire: ['fire', 'air'],
  air: ['air', 'fire'],
  earth: ['earth', 'water'],
  water: ['water', 'earth'],
};

function effect(t: Transit): Partial<DayScores> {
  if (!PERSONAL.includes(t.natal)) return {};
  const good = HARMONIOUS.has(t.type);
  const hard = HARD.has(t.type);
  const conj = t.type === 'conjunction';
  const by: Partial<Record<PlanetKey, () => Partial<DayScores>>> = {
    venus: () => ({ love: good || conj ? 1 : hard ? -0.5 : 0 }),
    mars: () => ({ energy: good || conj ? 1 : hard ? -0.5 : 0, love: conj && t.natal === 'venus' ? 0.5 : 0 }),
    jupiter: () => ({ work: good || conj ? 1 : 0, love: good ? 0.5 : 0 }),
    saturn: () => ({ work: hard ? -1 : good ? 0.5 : -0.5, energy: hard || conj ? -0.5 : 0 }),
    mercury: () => ({ work: good || conj ? 0.5 : hard ? -0.5 : 0 }),
    sun: () => ({ energy: good || conj ? 0.5 : 0 }),
    moon: () => ({ love: (good || conj) && (t.natal === 'venus' || t.natal === 'moon') ? 0.5 : 0, energy: hard ? -0.25 : 0 }),
  };
  return by[t.transiting]?.() ?? {};
}

const clamp = (x: number) => Math.max(1, Math.min(5, Math.round(x)));

export function dailyEnergy(birthDate: string, chart: NatalChart | null, date: Date = new Date()): DailyEnergy {
  const pn = personalNumbers(birthDate, date);
  const raw: DayScores = { love: 3, work: 3, energy: 3 };
  const add = (p: Partial<DayScores>) => (Object.keys(p) as Area[]).forEach((k) => (raw[k] += p[k] ?? 0));
  add(DAY_BASE[pn.day] ?? {});

  // Meio-dia local evita que a Lua do dia dependa da hora em que o app foi aberto.
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const moon = moonInfo(noon);
  const transits = chart ? transitsOn(chart, noon, ['moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'sun']) : [];
  for (const t of transits) add(effect(t));

  if (chart) {
    const sun = chart.points.find((p) => p.key === 'sun')!;
    const sunEl = SIGN_ELEMENT[signIndex(sun.lon)];
    const moonEl = SIGN_ELEMENT[signIndex(moon.lon)];
    add({ energy: COMPATIBLE[sunEl].includes(moonEl) ? 0.5 : -0.25 });
  }
  // Lua crescente favorece começar; minguante, concluir.
  add({ energy: moon.waxing ? 0.25 : -0.25 });

  const scores: DayScores = { love: clamp(raw.love), work: clamp(raw.work), energy: clamp(raw.energy) };
  const highlight = (Object.keys(raw) as Area[]).reduce((a, b) => (raw[b] > raw[a] ? b : a));
  return {
    personalDay: pn.day,
    personalMonth: pn.month,
    personalYear: pn.year,
    scores,
    highlight,
    moon,
    transits,
    seed: date.getFullYear() * 1000 + Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000),
  };
}
