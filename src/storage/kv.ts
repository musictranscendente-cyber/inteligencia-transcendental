/**
 * Armazenamento local chave/valor (síncrono).
 *
 * Hoje usa o `expo-sqlite/kv-store`, que funciona dentro do Expo Go.
 * Quando o app passar a usar build de desenvolvimento (necessário para o RevenueCat),
 * basta trocar a implementação aqui por `react-native-mmkv` — o resto do app não muda.
 */
import Storage from 'expo-sqlite/kv-store';

export const kv = {
  getString(key: string): string | null {
    return Storage.getItemSync(key);
  },
  setString(key: string, value: string) {
    Storage.setItemSync(key, value);
  },
  getJSON<T>(key: string): T | null {
    const raw = Storage.getItemSync(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setJSON(key: string, value: unknown) {
    Storage.setItemSync(key, JSON.stringify(value));
  },
  remove(key: string) {
    Storage.removeItemSync(key);
  },
  clearAll() {
    Storage.clearSync();
  },
};

export { KEYS } from './keys';
