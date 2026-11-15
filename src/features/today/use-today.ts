/** Tudo o que a aba Hoje mostra, calculado num só lugar (tela, detalhes e cards de compartilhar). */
import { useMemo } from 'react';

import { useLang, type Lang } from '@/content/types';
import { angelForDate, angelOfMoment, regencyMinutes } from '@/engines/angels';
import { dailyEnergy } from '@/engines/daily';
import type { Reading } from '@/engines/reading';
import { useReading } from '@/hooks/use-reading';
import { prefsStore } from '@/storage/app-data';
import { cardOfDay, dayKey, dayLine } from './daily-picks';

export type TodayTopic = 'energy' | 'card' | 'angel' | 'moon' | 'numbers' | 'sky';
export const TODAY_TOPICS: TodayTopic[] = ['energy', 'card', 'angel', 'moon', 'numbers', 'sky'];

export function buildToday(r: Reading, reversals: boolean, lang: Lang, date = new Date()) {
  const energy = dailyEnergy(r.person.birthDate, r.chart, date);
  const hourAngel = angelOfMoment(date);
  return {
    date,
    key: dayKey(date),
    energy,
    line: dayLine(energy.personalDay, lang, energy.seed),
    card: cardOfDay(r.person.fullName, reversals, date),
    angel: angelForDate(date.getMonth() + 1, date.getDate()),
    hourAngel,
    hourAngelRange: regencyMinutes(hourAngel),
    /** Aspectos do dia ao mapa natal, do mais exato ao mais largo. */
    sky: [...energy.transits].sort((a, b) => a.orb - b.orb),
    southern: r.person.place.lat < 0,
  };
}

export type Today = ReturnType<typeof buildToday>;

export function useToday(): { reading: Reading; today: Today } | null {
  const reading = useReading();
  const { reversals } = prefsStore.useValue();
  const lang = useLang();
  const now = new Date();
  const day = dayKey(now);
  // O anjo da hora muda a cada 20 minutos.
  const slot = Math.floor((now.getHours() * 60 + now.getMinutes()) / 20);
  const today = useMemo(
    () => (reading ? buildToday(reading, reversals, lang) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reading, reversals, lang, day, slot]
  );
  return reading && today ? { reading, today } : null;
}
