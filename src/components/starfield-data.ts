export type Star = { x: number; y: number; r: number; layer: 0 | 1 | 2 };

/** Gerador pseudoaleatório com semente, para o céu ser sempre o mesmo. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeStars(width: number, height: number, density = 0.00022): Star[] {
  const rand = mulberry32(20260101);
  const count = Math.round(width * height * density);
  return Array.from({ length: count }, (_, i) => ({
    x: rand() * width,
    y: rand() * height,
    r: rand() < 0.08 ? 1.6 + rand() * 0.8 : 0.5 + rand() * 0.9,
    layer: (i % 3) as Star['layer'],
  }));
}
