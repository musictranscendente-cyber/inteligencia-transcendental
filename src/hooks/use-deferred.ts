import { useEffect, useState } from 'react';

const cache = new Map<string, unknown>();

/** Calcula algo pesado depois que a tela já apareceu, guardando o resultado em memória por `key`. */
export function useDeferred<T>(key: string | null, compute: () => T): T | null {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!key || cache.has(key)) return;
    // Espera a tela ser desenhada (um quadro + uma folga) antes do cálculo pesado.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        const v = compute();
        cache.set(key, v);
        setTick((n) => n + 1);
      }, 30);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return key && cache.has(key) ? (cache.get(key) as T) : null;
}
