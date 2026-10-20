/** Escolhas "do dia" estáveis: mesma carta e mesma frase o dia todo, diferentes a cada dia. */
import { DAY_LINES } from '@/content/daily';
import type { Lang } from '@/content/types';
import { draw, hashString, seeded, TAROT_DECK } from '@/engines/divination';

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export function cardOfDay(name: string, reversals: boolean, d = new Date()) {
  return draw(TAROT_DECK, 1, { rng: seeded(hashString(`${name}|card|${dayKey(d)}`)), reversals })[0];
}

export function dayLine(personalDay: number, lang: Lang, seed: number) {
  const lines = DAY_LINES[personalDay]?.[lang] ?? DAY_LINES[1][lang];
  return lines[seed % lines.length];
}
