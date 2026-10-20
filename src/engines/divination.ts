/** Baralhos e sorteios: tarô (78), cigano/Lenormand (36), runas (24) e I Ching (moedas). */

export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';
export const SUITS: Suit[] = ['wands', 'cups', 'swords', 'pentacles'];

/** Ids das cartas: 'M0'…'M21' (arcanos maiores) e 'wands-1'…'pentacles-14' (menores; 11–14 = valete, cavaleiro, rainha, rei). */
export const TAROT_DECK: string[] = [
  ...Array.from({ length: 22 }, (_, i) => `M${i}`),
  ...SUITS.flatMap((s) => Array.from({ length: 14 }, (_, i) => `${s}-${i + 1}`)),
];

export const LENORMAND_DECK = Array.from({ length: 36 }, (_, i) => i + 1);

export const RUNES = [
  'fehu', 'uruz', 'thurisaz', 'ansuz', 'raidho', 'kenaz', 'gebo', 'wunjo',
  'hagalaz', 'nauthiz', 'isa', 'jera', 'eihwaz', 'perthro', 'algiz', 'sowilo',
  'tiwaz', 'berkano', 'ehwaz', 'mannaz', 'laguz', 'ingwaz', 'dagaz', 'othala',
] as const;
export type RuneKey = (typeof RUNES)[number];
/** Runas simétricas não têm posição invertida. */
export const SYMMETRIC_RUNES: RuneKey[] = ['gebo', 'hagalaz', 'nauthiz', 'isa', 'jera', 'eihwaz', 'sowilo', 'ingwaz', 'dagaz'];
export const RUNE_GLYPHS: Record<RuneKey, string> = {
  fehu: 'ᚠ', uruz: 'ᚢ', thurisaz: 'ᚦ', ansuz: 'ᚨ', raidho: 'ᚱ', kenaz: 'ᚲ', gebo: 'ᚷ', wunjo: 'ᚹ',
  hagalaz: 'ᚺ', nauthiz: 'ᚾ', isa: 'ᛁ', jera: 'ᛃ', eihwaz: 'ᛇ', perthro: 'ᛈ', algiz: 'ᛉ', sowilo: 'ᛊ',
  tiwaz: 'ᛏ', berkano: 'ᛒ', ehwaz: 'ᛖ', mannaz: 'ᛗ', laguz: 'ᛚ', ingwaz: 'ᛜ', dagaz: 'ᛞ', othala: 'ᛟ',
};

export type Rng = () => number;

/** Gerador com semente (mulberry32) — usado nas cartas "do dia", que precisam ser estáveis. */
export function seeded(seed: number): Rng {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type DrawnCard<T> = { id: T; reversed: boolean };

export function draw<T>(deck: readonly T[], count: number, opts: { reversals?: boolean; rng?: Rng } = {}): DrawnCard<T>[] {
  const rng = opts.rng ?? Math.random;
  return shuffle(deck, rng)
    .slice(0, count)
    .map((id) => ({ id, reversed: !!opts.reversals && rng() < 0.3 }));
}

// ---------- I Ching ----------

/** Linha: 6 = yin mutante, 7 = yang, 8 = yin, 9 = yang mutante. */
export type Line = 6 | 7 | 8 | 9;

/** Três moedas: cara = 3, coroa = 2. */
export function tossLine(rng: Rng = Math.random): Line {
  let sum = 0;
  for (let i = 0; i < 3; i++) sum += rng() < 0.5 ? 3 : 2;
  return sum as Line;
}

/** Trigramas por bits (linha de baixo = bit 0, 1 = yang). */
const TRIGRAM_BY_BITS: Record<number, number> = { 7: 0, 1: 1, 2: 2, 4: 3, 0: 4, 6: 5, 5: 6, 3: 7 };
export const TRIGRAMS = ['heaven', 'thunder', 'water', 'mountain', 'earth', 'wind', 'fire', 'lake'] as const;

/** Tabela do rei Wen: [trigrama de baixo][trigrama de cima] → número do hexagrama. */
const KING_WEN = [
  [1, 34, 5, 26, 11, 9, 14, 43],
  [25, 51, 3, 27, 24, 42, 21, 17],
  [6, 40, 29, 4, 7, 59, 64, 47],
  [33, 62, 39, 52, 15, 53, 56, 31],
  [12, 16, 8, 23, 2, 20, 35, 45],
  [44, 32, 48, 18, 46, 57, 50, 28],
  [13, 55, 63, 22, 36, 37, 30, 49],
  [10, 54, 60, 41, 19, 61, 38, 58],
];

const isYang = (l: Line) => l === 7 || l === 9;

export function hexagramOf(lines: Line[] | boolean[]): number {
  const yang = lines.map((l) => (typeof l === 'boolean' ? l : isYang(l)));
  const bits = (a: boolean[]) => a.reduce((acc, v, i) => acc | ((v ? 1 : 0) << i), 0);
  const lower = TRIGRAM_BY_BITS[bits(yang.slice(0, 3))];
  const upper = TRIGRAM_BY_BITS[bits(yang.slice(3, 6))];
  return KING_WEN[lower][upper];
}

export type IChingReading = { lines: Line[]; hexagram: number; changing: number[]; transformed: number | null };

export function readIChing(lines: Line[]): IChingReading {
  const changing = lines.map((l, i) => (l === 6 || l === 9 ? i + 1 : 0)).filter(Boolean);
  const transformed = changing.length ? hexagramOf(lines.map((l) => (l === 6 ? true : l === 9 ? false : isYang(l)))) : null;
  return { lines, hexagram: hexagramOf(lines), changing, transformed };
}

/** Linhas (de baixo para cima, true = yang) de um hexagrama, para desenhar. */
export function hexagramLines(n: number): boolean[] {
  for (let lo = 0; lo < 8; lo++) {
    for (let up = 0; up < 8; up++) {
      if (KING_WEN[lo][up] !== n) continue;
      const bitsOf = (t: number) => Number(Object.entries(TRIGRAM_BY_BITS).find(([, v]) => v === t)![0]);
      const b = bitsOf(lo) | (bitsOf(up) << 3);
      return Array.from({ length: 6 }, (_, i) => ((b >> i) & 1) === 1);
    }
  }
  return [];
}
