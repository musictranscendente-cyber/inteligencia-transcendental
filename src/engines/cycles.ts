/** Ciclos: calendário pessoal do mês, setênios e ciclos de 9 anos. */
import type { NatalChart } from './astro/chart';
import { speed } from './astro/ephemeris';
import { dailyEnergy } from './daily';
import { ageOn, parseDate, personalNumbers } from './numerology';

export type CalendarDay = { date: Date; love: number; work: number; decisions: number; personalDay: number };

export function monthCalendar(birthDate: string, chart: NatalChart | null, year: number, month: number): CalendarDay[] {
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(year, month, i + 1, 12);
    const e = dailyEnergy(birthDate, chart, date);
    let decisions = (e.scores.work + e.scores.energy) / 2;
    if ([1, 8].includes(e.personalDay)) decisions += 1;
    if ([7, 9].includes(e.personalDay)) decisions -= 1;
    if (speed('mercury', date) < 0) decisions -= 1;
    return {
      date,
      love: e.scores.love,
      work: e.scores.work,
      decisions: Math.max(1, Math.min(5, Math.round(decisions))),
      personalDay: e.personalDay,
    };
  });
}

export type Septenio = { index: number; fromAge: number; toAge: number };

export function septenios(maxAge = 90): Septenio[] {
  return Array.from({ length: Math.ceil(maxAge / 7) }, (_, i) => ({ index: i, fromAge: i * 7, toAge: Math.min(maxAge, i * 7 + 6) }));
}

/** Anos (civis) em que começa um novo ciclo de 9 anos (ano pessoal 1). */
export function nineYearStarts(birthDate: string, untilAge = 90): number[] {
  const { year } = parseDate(birthDate);
  const out: number[] = [];
  for (let y = year; y <= year + untilAge; y++) {
    if (personalNumbers(birthDate, new Date(y, 5, 1)).year === 1) out.push(y);
  }
  return out;
}

export function lifePosition(birthDate: string, on = new Date()) {
  const age = ageOn(birthDate, on);
  return { age, septenio: Math.floor(age / 7), yearInCycle: personalNumbers(birthDate, on).year };
}
