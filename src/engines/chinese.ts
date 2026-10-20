/**
 * Astrologia chinesa (animal do ano pelo Ano Novo Chinês) e Ba Zi (quatro pilares, ano pelo Li Chun).
 */
import { SearchMoonPhase, SearchSunLongitude } from 'astronomy-engine';

import { longitude, norm360 } from './astro/ephemeris';

export const ANIMALS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'] as const;
export type AnimalKey = (typeof ANIMALS)[number];
export const FIVE_ELEMENTS = ['wood', 'fire', 'earth', 'metal', 'water'] as const;
export type FiveElement = (typeof FIVE_ELEMENTS)[number];

/** Troncos celestes (0 = Jia) e ramos terrestres (0 = Zi). */
export const STEMS = ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'];
export const STEM_HANZI = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCHES = ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'];
export const BRANCH_HANZI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const stemElement = (s: number): FiveElement => FIVE_ELEMENTS[Math.floor(s / 2)];
export const stemYang = (s: number) => s % 2 === 0;
export const BRANCH_ELEMENT: FiveElement[] = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];

const CHINA_OFFSET = 8 * 3600000;
const chinaDay = (d: Date) => new Date(d.getTime() + CHINA_OFFSET).toISOString().slice(0, 10);

const cnyCache = new Map<number, string>();
/** Data (YYYY-MM-DD, horário da China) do Ano Novo Chinês: 2ª lua nova após o solstício de inverno. */
export function chineseNewYear(year: number): string {
  const cached = cnyCache.get(year);
  if (cached) return cached;
  const solstice = SearchSunLongitude(270, new Date(Date.UTC(year - 1, 11, 15)), 20)!.date;
  const solsticeDay = chinaDay(solstice);
  let t = solstice;
  let count = 0;
  let result = '';
  while (count < 2) {
    const nm = SearchMoonPhase(0, t, 40)!.date;
    if (chinaDay(nm) > solsticeDay) count++;
    result = chinaDay(nm);
    t = new Date(nm.getTime() + 86400000);
  }
  cnyCache.set(year, result);
  return result;
}

export type ChineseSign = { year: number; animal: AnimalKey; element: FiveElement; yang: boolean };

/** Signo chinês a partir da data local de nascimento (YYYY-MM-DD). */
export function chineseSign(birthDate: string): ChineseSign {
  const y = Number(birthDate.slice(0, 4));
  const year = birthDate < chineseNewYear(y) ? y - 1 : y;
  const stem = (((year - 4) % 10) + 10) % 10;
  return { year, animal: ANIMALS[(((year - 4) % 12) + 12) % 12], element: stemElement(stem), yang: stemYang(stem) };
}

export type Pillar = { stem: number; branch: number };
export type BaZi = { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null; elements: Record<FiveElement, number>; dayMaster: FiveElement };

/** Número do dia juliano de uma data civil. */
function jdn(y: number, m: number, d: number) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

/**
 * @param birthDate data local `YYYY-MM-DD`
 * @param birthTime hora local `HH:mm` ou null
 * @param birthUtc instante do nascimento (para o Li Chun e os termos solares)
 */
export function calculateBaZi(birthDate: string, birthTime: string | null, birthUtc: Date): BaZi {
  const [y, m, d] = birthDate.split('-').map(Number);
  const liChun = SearchSunLongitude(315, new Date(Date.UTC(y, 0, 25)), 30)!.date;
  const baziYear = birthUtc < liChun ? y - 1 : y;
  const yearStem = (((baziYear - 4) % 10) + 10) % 10;
  const year: Pillar = { stem: yearStem, branch: (((baziYear - 4) % 12) + 12) % 12 };

  const sun = longitude('sun', birthUtc);
  const monthIndex = Math.floor(norm360(sun - 315) / 30); // 0 = mês do Tigre
  const month: Pillar = { stem: (((yearStem % 5) * 2 + 2 + monthIndex) % 10), branch: (monthIndex + 2) % 12 };

  const j = jdn(y, m, d);
  const day: Pillar = { stem: (j + 9) % 10, branch: (j + 1) % 12 };

  let hour: Pillar | null = null;
  if (birthTime) {
    const h = Number(birthTime.split(':')[0]);
    const branch = Math.floor(((h + 1) % 24) / 2);
    hour = { stem: ((day.stem % 5) * 2 + branch) % 10, branch };
  }

  const elements: Record<FiveElement, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const p of [year, month, day, hour]) {
    if (!p) continue;
    elements[stemElement(p.stem)]++;
    elements[BRANCH_ELEMENT[p.branch]]++;
  }
  return { year, month, day, hour, elements, dayMaster: stemElement(day.stem) };
}

const TRINES: AnimalKey[][] = [
  ['rat', 'dragon', 'monkey'],
  ['ox', 'snake', 'rooster'],
  ['tiger', 'horse', 'dog'],
  ['rabbit', 'goat', 'pig'],
];
const SECRET_FRIENDS: [AnimalKey, AnimalKey][] = [['rat', 'ox'], ['tiger', 'pig'], ['rabbit', 'dog'], ['dragon', 'rooster'], ['snake', 'monkey'], ['horse', 'goat']];

export type AnimalRelation = 'same' | 'trine' | 'secretFriend' | 'clash' | 'neutral';

export function animalRelation(a: AnimalKey, b: AnimalKey): AnimalRelation {
  if (a === b) return 'same';
  if (TRINES.some((t) => t.includes(a) && t.includes(b))) return 'trine';
  if (SECRET_FRIENDS.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) return 'secretFriend';
  if (Math.abs(ANIMALS.indexOf(a) - ANIMALS.indexOf(b)) === 6) return 'clash';
  return 'neutral';
}

export const ANIMAL_RELATION_SCORE: Record<AnimalRelation, number> = { secretFriend: 92, trine: 85, same: 70, neutral: 60, clash: 35 };
