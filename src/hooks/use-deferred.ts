import { useEffect, useState } from 'react';

const cache = new Map<string, unknown>();

/**
 * Calcula algo pesado depois que a tela já apareceu, guardando o resultado em memória por `key`.
 * O resultado vive em estado (e não só no cache do módulo) para o React Compiler perceber a mudança.
 */
export function useDeferred<T>(key: string | null, compute: () => T): T | null {
  const [state, setState] = useState<{ key: string; value: T } | null>(null);
  useEffect(() => {
    if (!key) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        const value = cache.has(key) ? (cache.get(key) as T) : compute();
        cache.set(key, value);
        setState({ key, value });
      }, cache.has(key) ? 0 : 30);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return state && state.key === key ? state.value : null;
}
