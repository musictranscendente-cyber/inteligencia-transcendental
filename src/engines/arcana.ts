/**
 * Arcano pessoal (tarô de Marselha: 8 = Justiça, 11 = Força).
 * Soma de todos os dígitos da data; acima de 22, soma os dígitos de novo; 22 vira 0 (O Louco).
 */
import { digitSum, parseDate } from './numerology';

function toArcana(sum: number) {
  while (sum > 22) sum = digitSum(sum);
  return sum === 22 ? 0 : sum;
}

function digitsOf(...values: number[]) {
  return values.reduce((acc, v) => acc + digitSum(v), 0);
}

export function birthArcana(birthDate: string) {
  const { year, month, day } = parseDate(birthDate);
  return toArcana(digitsOf(day, month, year));
}

/** Arcano do ano: dia + mês de nascimento + ano atual. */
export function yearArcana(birthDate: string, year = new Date().getFullYear()) {
  const { month, day } = parseDate(birthDate);
  return toArcana(digitsOf(day, month, year));
}

/** Arcano de qualquer data (usado na carta do dia). */
export function dateArcana(date: Date) {
  return toArcana(digitsOf(date.getDate(), date.getMonth() + 1, date.getFullYear()));
}
