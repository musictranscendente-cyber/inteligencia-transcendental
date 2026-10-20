/**
 * Numerologia pitagórica.
 *
 * Tabela: A=1 … I=9, J=1 … R=9, S=1 … Z=9. Acentos são ignorados (Ç = C, Ñ = N).
 * Números mestres (11, 22, 33) não são reduzidos. Y é tratado como vogal.
 */

export const MASTER_NUMBERS = [11, 22, 33] as const;
export const KARMIC_DEBTS = [13, 14, 16, 19] as const;
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

export type Pinnacle = { number: number; fromAge: number; toAge: number | null };
export type LifeCycle = { number: number; fromAge: number; toAge: number | null };

export type NumerologyProfile = {
  destiny: number;
  expression: number;
  soul: number;
  personality: number;
  mission: number;
  birthday: number;
  karmicDebts: number[];
  karmicLessons: number[];
  /** Quantas letras do nome valem cada número (índice 1–9). */
  nameGrid: number[];
  /** Quantas vezes cada dígito 1–9 aparece na data de nascimento. */
  dateGrid: number[];
  cycles: LifeCycle[];
  pinnacles: Pinnacle[];
  challenges: number[];
};

export type PersonalNumbers = { year: number; month: number; day: number };

export function letterValue(ch: string): number {
  const code = ch.charCodeAt(0) - 64; // A = 1
  if (code < 1 || code > 26) return 0;
  return ((code - 1) % 9) + 1;
}

/** Remove acentos e tudo que não for letra: "João Ç." → "JOAOC". */
export function cleanName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

export function digitSum(n: number): number {
  let s = 0;
  for (const d of String(Math.abs(n))) s += Number(d);
  return s;
}

export const isMaster = (n: number) => (MASTER_NUMBERS as readonly number[]).includes(n);

/** Reduz até 1 dígito, preservando os números mestres. */
export function reduce(n: number, keepMasters = true): number {
  while (n > 9 && !(keepMasters && isMaster(n))) n = digitSum(n);
  return n;
}

/** Reduz registrando as somas compostas no caminho (para achar dívidas cármicas). */
function reduceTracking(n: number, seen: Set<number>): number {
  seen.add(n);
  while (n > 9 && !isMaster(n)) {
    n = digitSum(n);
    seen.add(n);
  }
  return n;
}

function debtsIn(seen: Set<number>) {
  return KARMIC_DEBTS.filter((d) => seen.has(d));
}

function sumLetters(name: string, filter: (ch: string) => boolean) {
  let total = 0;
  for (const ch of cleanName(name)) if (filter(ch)) total += letterValue(ch);
  return total;
}

/** Soma por palavra (cada nome reduzido) e depois o total, método tradicional brasileiro. */
function nameNumber(name: string, filter: (ch: string) => boolean, seen: Set<number>) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  let total = 0;
  for (const w of words) {
    const s = sumLetters(w, filter);
    if (s > 0) total += reduce(s);
  }
  return reduceTracking(total, seen);
}

export function parseDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

export function destinyNumber(date: string, seen = new Set<number>()) {
  const { year, month, day } = parseDate(date);
  // Componentes reduzidos sem registrar; só a soma final conta para as dívidas cármicas.
  const total = reduce(day) + reduce(month) + reduce(year);
  return reduceTracking(total, seen);
}

export function calculateNumerology(fullName: string, birthDate: string): NumerologyProfile {
  const { year, month, day } = parseDate(birthDate);
  const debts = new Set<number>();

  const destinySeen = new Set<number>();
  const destiny = destinyNumber(birthDate, destinySeen);
  const expressionSeen = new Set<number>();
  const expression = nameNumber(fullName, () => true, expressionSeen);
  const soulSeen = new Set<number>();
  const soul = nameNumber(fullName, (c) => VOWELS.has(c), soulSeen);
  const personalitySeen = new Set<number>();
  const personality = nameNumber(fullName, (c) => !VOWELS.has(c), personalitySeen);
  for (const s of [destinySeen, expressionSeen, soulSeen, personalitySeen]) debtsIn(s).forEach((d) => debts.add(d));
  if ((KARMIC_DEBTS as readonly number[]).includes(day)) debts.add(day);

  const mission = reduce(destiny + expression);
  const birthday = reduce(day);

  const nameGrid = Array(10).fill(0);
  for (const ch of cleanName(fullName)) nameGrid[letterValue(ch)]++;
  const karmicLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => nameGrid[n] === 0);

  const dateGrid = Array(10).fill(0);
  for (const d of `${day}${month}${year}`) if (d !== '0') dateGrid[Number(d)]++;

  // Ciclos, pináculos e desafios usam os componentes da data reduzidos a 1 dígito.
  const m = reduce(month, false);
  const d = reduce(day, false);
  const y = reduce(year, false);
  const lp = reduce(destiny, false);
  const firstEnd = 36 - lp;

  const pinnacles: Pinnacle[] = [
    { number: reduce(m + d), fromAge: 0, toAge: firstEnd },
    { number: reduce(d + y), fromAge: firstEnd + 1, toAge: firstEnd + 9 },
    { number: reduce(reduce(m + d) + reduce(d + y)), fromAge: firstEnd + 10, toAge: firstEnd + 18 },
    { number: reduce(m + y), fromAge: firstEnd + 19, toAge: null },
  ];
  const cycles: LifeCycle[] = [
    { number: reduce(month), fromAge: 0, toAge: firstEnd },
    { number: reduce(day), fromAge: firstEnd + 1, toAge: firstEnd + 27 },
    { number: reduce(year), fromAge: firstEnd + 28, toAge: null },
  ];
  const c1 = Math.abs(m - d);
  const c2 = Math.abs(d - y);
  const challenges = [c1, c2, Math.abs(c1 - c2), Math.abs(m - y)];

  return {
    destiny,
    expression,
    soul,
    personality,
    mission,
    birthday,
    karmicDebts: [...debts].sort((a, b) => a - b),
    karmicLessons,
    nameGrid,
    dateGrid,
    cycles,
    pinnacles,
    challenges,
  };
}

/** Ano, mês e dia pessoal (convenção do ano civil). */
export function personalNumbers(birthDate: string, on: Date = new Date()): PersonalNumbers {
  const { month, day } = parseDate(birthDate);
  const year = reduce(reduce(day) + reduce(month) + reduce(on.getFullYear()), false);
  const pm = reduce(year + reduce(on.getMonth() + 1), false);
  const pd = reduce(pm + reduce(on.getDate()), false);
  return { year, month: pm, day: pd };
}

/** Idade completa numa data. */
export function ageOn(birthDate: string, on: Date = new Date()) {
  const { year, month, day } = parseDate(birthDate);
  let age = on.getFullYear() - year;
  if (on.getMonth() + 1 < month || (on.getMonth() + 1 === month && on.getDate() < day)) age--;
  return age;
}

export function currentIndex<T extends { fromAge: number; toAge: number | null }>(items: T[], age: number) {
  const i = items.findIndex((p) => age >= p.fromAge && (p.toAge == null || age <= p.toAge));
  return i < 0 ? items.length - 1 : i;
}

/** Valor numerológico de qualquer texto (nomes de bebê, empresa, casa, telefone). */
export function textNumber(text: string): number {
  const letters = cleanName(text);
  let total = 0;
  for (const ch of letters) total += letterValue(ch);
  for (const ch of text) if (/[0-9]/.test(ch)) total += Number(ch);
  return total === 0 ? 0 : reduce(total);
}
