import { useSyncExternalStore } from 'react';

import type { BirthPlace } from '@/lib/birth';
import { resolveBirth } from '@/lib/birth';
import { KEYS, kv } from './kv';
import { resetAllStores } from './store';

export type Profile = {
  fullName: string;
  /** `YYYY-MM-DD` */
  birthDate: string;
  /** `HH:mm` ou `null` se a pessoa não sabe a hora. */
  birthTime: string | null;
  place: BirthPlace;
  /** Instante do nascimento em UTC, calculado no cadastro. */
  birthUtc: string;
  utcOffsetMinutes: number;
  createdAt: string;
};

export type ProfileInput = Pick<Profile, 'fullName' | 'birthDate' | 'birthTime' | 'place'>;

type Listener = () => void;
const listeners = new Set<Listener>();
let cached: Profile | null | undefined;

function read(): Profile | null {
  if (cached === undefined) cached = kv.getJSON<Profile>(KEYS.profile);
  return cached;
}

function emit() {
  listeners.forEach((l) => l());
}

export function getProfile() {
  return read();
}

export function saveProfile(input: ProfileInput): Profile {
  const birth = resolveBirth({ date: input.birthDate, time: input.birthTime, timezone: input.place.timezone });
  const profile: Profile = {
    ...input,
    fullName: input.fullName.trim().replace(/\s+/g, ' '),
    birthUtc: birth.utc,
    utcOffsetMinutes: birth.offsetMinutes,
    createdAt: new Date().toISOString(),
  };
  kv.setJSON(KEYS.profile, profile);
  cached = profile;
  emit();
  return profile;
}

/** Apaga todos os dados do app (perfil, preferências, histórico). */
export function eraseAllData() {
  kv.clearAll();
  resetAllStores();
  cached = null;
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProfile() {
  return useSyncExternalStore(subscribe, read, read);
}
