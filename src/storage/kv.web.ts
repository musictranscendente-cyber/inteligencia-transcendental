/** Versão web do armazenamento (usada só para pré-visualizar o app no navegador). */
export const kv = {
  getString(key: string): string | null {
    return globalThis.localStorage?.getItem(key) ?? null;
  },
  setString(key: string, value: string) {
    globalThis.localStorage?.setItem(key, value);
  },
  getJSON<T>(key: string): T | null {
    const raw = globalThis.localStorage?.getItem(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setJSON(key: string, value: unknown) {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  },
  remove(key: string) {
    globalThis.localStorage?.removeItem(key);
  },
  clearAll() {
    globalThis.localStorage?.clear();
  },
};

export { KEYS } from './keys';
