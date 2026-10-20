import { useSyncExternalStore } from 'react';

import { KEYS, kv } from './kv';

export type ThemePreference = 'dark' | 'light' | 'system';
export type Language = 'pt-BR' | 'en' | 'es';

type Settings = {
  language: Language | null;
  theme: ThemePreference;
};

const listeners = new Set<() => void>();
let snapshot: Settings | null = null;

function read(): Settings {
  snapshot ??= {
    language: (kv.getString(KEYS.language) as Language | null) ?? null,
    theme: (kv.getString(KEYS.themePreference) as ThemePreference | null) ?? 'dark',
  };
  return snapshot;
}

function update(patch: Partial<Settings>) {
  snapshot = { ...read(), ...patch };
  listeners.forEach((l) => l());
}

export function getSettings() {
  return read();
}

export function setLanguagePreference(language: Language) {
  kv.setString(KEYS.language, language);
  update({ language });
}

export function setThemePreference(theme: ThemePreference) {
  kv.setString(KEYS.themePreference, theme);
  update({ theme });
}

/** Recarrega do armazenamento (usado depois de "apagar todos os dados"). */
export function reloadSettings() {
  snapshot = null;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSettings() {
  return useSyncExternalStore(subscribe, read, read);
}
