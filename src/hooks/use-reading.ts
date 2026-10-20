import { useMemo } from 'react';

import { buildReading, type PersonInput, type Reading } from '@/engines/reading';
import { prefsStore } from '@/storage/app-data';
import { useProfile } from '@/storage/profile';

export function toPersonInput(p: { fullName: string; birthDate: string; birthTime: string | null; birthUtc: string; place: { lat: number; lon: number } }): PersonInput {
  return { fullName: p.fullName, birthDate: p.birthDate, birthTime: p.birthTime, birthUtc: p.birthUtc, place: { lat: p.place.lat, lon: p.place.lon } };
}

/** Leitura completa da pessoa cadastrada (calculada uma vez por dia e por perfil). */
export function useReading(): Reading | null {
  const profile = useProfile();
  const { houseSystem } = prefsStore.useValue();
  const day = new Date().toDateString();
  return useMemo(
    () => (profile ? buildReading(toPersonInput(profile), houseSystem) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, houseSystem, day]
  );
}

export function useReadingOf(p: Parameters<typeof toPersonInput>[0] | null | undefined): Reading | null {
  const { houseSystem } = prefsStore.useValue();
  return useMemo(() => (p ? buildReading(toPersonInput(p), houseSystem) : null), [p, houseSystem]);
}
