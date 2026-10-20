/**
 * Posições planetárias (longitude eclíptica verdadeira da data, geocêntrica) via astronomy-engine.
 */
import {
  Body,
  Ecliptic,
  EclipticGeoMoon,
  e_tilt,
  GeoVector,
  MakeTime,
  SiderealTime,
  SunPosition,
} from 'astronomy-engine';

export const PLANETS = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'node',
] as const;
export type PlanetKey = (typeof PLANETS)[number];

const BODIES: Partial<Record<PlanetKey, Body>> = {
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
  pluto: Body.Pluto,
};

export const DEG = Math.PI / 180;
export const norm360 = (x: number) => ((x % 360) + 360) % 360;
/** Diferença angular com sinal em (-180, 180]. */
export const angleDiff = (a: number, b: number) => {
  const d = norm360(a - b);
  return d > 180 ? d - 360 : d;
};

export function julianDay(date: Date) {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Nodo Norte verdadeiro (Meeus, cap. 47). */
export function trueNode(date: Date) {
  const T = (julianDay(date) - 2451545) / 36525;
  const omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T;
  const F = 93.272095 + 483202.0175233 * T;
  const s = (x: number) => Math.sin(x * DEG);
  return norm360(
    omega - 1.4979 * s(2 * (D - F)) - 0.15 * s(M) - 0.1226 * s(2 * D) + 0.1176 * s(2 * F) - 0.0801 * s(2 * (Mp - F))
  );
}

export function longitude(planet: PlanetKey, date: Date): number {
  switch (planet) {
    case 'sun':
      return SunPosition(date).elon;
    case 'moon':
      return norm360(EclipticGeoMoon(date).lon);
    case 'node':
      return trueNode(date);
    default:
      return Ecliptic(GeoVector(BODIES[planet]!, date, true)).elon;
  }
}

/** Velocidade em graus por dia (negativa = retrógrado). */
export function speed(planet: PlanetKey, date: Date) {
  const half = 12 * 3600 * 1000;
  return angleDiff(longitude(planet, new Date(date.getTime() + half)), longitude(planet, new Date(date.getTime() - half)));
}

export function obliquity(date: Date) {
  return e_tilt(MakeTime(date)).tobl;
}

/** Tempo sideral local em graus (RAMC). */
export function ramc(date: Date, lon: number) {
  return norm360(SiderealTime(date) * 15 + lon);
}
