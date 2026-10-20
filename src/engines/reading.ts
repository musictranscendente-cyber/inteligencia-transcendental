/** Junta todas as técnicas de uma pessoa num só objeto. */
import { angelOfBirth, type AngelInfo } from './angels';
import { birthArcana, yearArcana } from './arcana';
import { calculateChart, type NatalChart } from './astro/chart';
import type { HouseSystem } from './astro/houses';
import { calculateBaZi, chineseSign, type BaZi, type ChineseSign } from './chinese';
import { calculateHumanDesign, type HumanDesignChart } from './humanDesign';
import { calculateNumerology, personalNumbers, type NumerologyProfile, type PersonalNumbers } from './numerology';

export type PersonInput = {
  fullName: string;
  birthDate: string;
  birthTime: string | null;
  birthUtc: string;
  place: { lat: number; lon: number };
};

export type Reading = {
  person: PersonInput;
  numerology: NumerologyProfile;
  personal: PersonalNumbers;
  arcana: number;
  yearArcana: number;
  chart: NatalChart;
  humanDesign: HumanDesignChart | null;
  chinese: ChineseSign;
  bazi: BaZi;
  angel: AngelInfo;
};

const cache = new Map<string, Reading>();

export function buildReading(p: PersonInput, houseSystem: HouseSystem = 'placidus', today = new Date()): Reading {
  const key = `${p.fullName}|${p.birthDate}|${p.birthTime}|${p.birthUtc}|${p.place.lat}|${p.place.lon}|${houseSystem}|${today.toDateString()}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const birth = new Date(p.birthUtc);
  const timeKnown = p.birthTime != null;
  const reading: Reading = {
    person: p,
    numerology: calculateNumerology(p.fullName, p.birthDate),
    personal: personalNumbers(p.birthDate, today),
    arcana: birthArcana(p.birthDate),
    yearArcana: yearArcana(p.birthDate, today.getFullYear()),
    chart: calculateChart(birth, p.place.lat, p.place.lon, timeKnown, houseSystem),
    // Sem a hora, o Desenho Humano exato não é possível (a Lua muda de portão em poucas horas).
    humanDesign: timeKnown ? calculateHumanDesign(birth) : null,
    chinese: chineseSign(p.birthDate),
    bazi: calculateBaZi(p.birthDate, p.birthTime, birth),
    angel: angelOfBirth(p.birthDate),
  };
  cache.set(key, reading);
  return reading;
}

export const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? '';
