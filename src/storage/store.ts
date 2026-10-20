import { useSyncExternalStore } from 'react';

import { kv } from './kv';

/** Pequeno estado persistente: lê do armazenamento uma vez, grava a cada mudança e avisa quem usa. */
export function createStore<T>(key: string, initial: T) {
  const listeners = new Set<() => void>();
  let value: T | undefined;

  const get = (): T => {
    if (value === undefined) {
      const saved = kv.getJSON<T>(key);
      value = saved == null ? initial : (typeof initial === 'object' && !Array.isArray(initial) && initial ? { ...initial, ...saved } : saved);
    }
    return value as T;
  };
  const set = (next: T | ((prev: T) => T)) => {
    value = typeof next === 'function' ? (next as (p: T) => T)(get()) : next;
    kv.setJSON(key, value);
    listeners.forEach((l) => l());
  };
  const reset = () => {
    value = undefined;
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const useValue = () => useSyncExternalStore(subscribe, get, get);
  allStores.add(reset);
  return { get, set, useValue, reset };
}

const allStores = new Set<() => void>();

/** Esquece o que está em memória (depois de apagar todos os dados). */
export function resetAllStores() {
  allStores.forEach((r) => r());
}
