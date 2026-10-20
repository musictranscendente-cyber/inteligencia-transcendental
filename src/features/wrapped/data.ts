/** Dados da retrospectiva: do último aniversário até hoje. */
import { chineseSign } from '@/engines/chinese';
import { personalNumbers, parseDate } from '@/engines/numerology';
import type { Reading } from '@/engines/reading';
import { convergences } from '@/engines/traits';
import type { HistoryEntry } from '@/storage/app-data';

export function wrappedData(r: Reading, history: HistoryEntry[], streak: { best: number; days: string[] }, today = new Date()) {
  const { month, day } = parseDate(r.person.birthDate);
  let start = new Date(today.getFullYear(), month - 1, day);
  if (start > today) start = new Date(today.getFullYear() - 1, month - 1, day);
  const inRange = history.filter((h) => new Date(h.date) >= start);
  const counts = new Map<string, number>();
  for (const h of inRange) if (h.kind === 'tarot' || h.kind === 'ask') for (const c of h.cards) counts.set(String(c.id), (counts.get(String(c.id)) ?? 0) + 1);
  const topCard = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const daysOpened = streak.days.filter((d) => new Date(d) >= start).length;
  const mid = new Date(start.getTime() + (today.getTime() - start.getTime()) / 2);
  return {
    start,
    end: today,
    personalYear: personalNumbers(r.person.birthDate, mid).year,
    nextPersonalYear: personalNumbers(r.person.birthDate, new Date(today.getFullYear() + 1, 5, 1)).year,
    yearArcana: r.yearArcana,
    readings: inRange.length,
    topCard,
    daysOpened,
    bestStreak: streak.best,
    trait: convergences(r)[0]?.trait ?? null,
    chinese: chineseSign(`${mid.getFullYear()}-${String(mid.getMonth() + 1).padStart(2, '0')}-15`),
  };
}

export const isBirthday = (birthDate: string, d = new Date()) => {
  const { month, day } = parseDate(birthDate);
  return d.getMonth() + 1 === month && d.getDate() === day;
};
