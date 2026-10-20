/** Ascendente, Meio do Céu e casas (Placidus, Signos Inteiros e Porfírio). */
import { DEG, norm360, obliquity, ramc } from './ephemeris';

export type HouseSystem = 'placidus' | 'whole';

export type Angles = { asc: number; mc: number; ramc: number; obliquity: number };

export function angles(date: Date, lat: number, lon: number): Angles {
  const r = ramc(date, lon);
  const e = obliquity(date);
  const mc = norm360(Math.atan2(Math.sin(r * DEG), Math.cos(r * DEG) * Math.cos(e * DEG)) / DEG);
  const asc = norm360(
    Math.atan2(Math.cos(r * DEG), -(Math.sin(r * DEG) * Math.cos(e * DEG) + Math.tan(lat * DEG) * Math.sin(e * DEG))) / DEG
  );
  return { asc, mc, ramc: r, obliquity: e };
}

/** Longitude eclíptica do ponto da eclíptica com essa ascensão reta. */
function raToLon(ra: number, e: number) {
  return norm360(Math.atan2(Math.sin(ra * DEG), Math.cos(ra * DEG) * Math.cos(e * DEG)) / DEG);
}

function declination(lon: number, e: number) {
  return Math.asin(Math.sin(e * DEG) * Math.sin(lon * DEG)) / DEG;
}

/** Semiarco diurno de um ponto da eclíptica, em graus. */
function semiDiurnal(lon: number, lat: number, e: number) {
  const x = -Math.tan(lat * DEG) * Math.tan(declination(lon, e) * DEG);
  return Math.acos(Math.max(-1, Math.min(1, x))) / DEG;
}

/** Cúspide Placidus: a posição em que a fração do semiarco bate com a ascensão reta (iterativo). */
function placidusCusp(a: Angles, lat: number, fraction: number, below: boolean) {
  let lon = norm360(a.mc + (below ? 90 + fraction * 90 : fraction * 90));
  for (let i = 0; i < 50; i++) {
    const sda = semiDiurnal(lon, lat, a.obliquity);
    const ra = below ? a.ramc + sda + fraction * (180 - sda) : a.ramc + fraction * sda;
    const next = raToLon(ra, a.obliquity);
    if (Math.abs(next - lon) < 1e-7) return next;
    lon = next;
  }
  return lon;
}

function porphyry(a: Angles) {
  const cusps = Array<number>(12);
  const q1 = norm360(a.asc - a.mc); // MC → ASC
  const q2 = norm360(a.mc + 180 - a.asc); // ASC → IC
  cusps[9] = a.mc;
  cusps[10] = norm360(a.mc + q1 / 3);
  cusps[11] = norm360(a.mc + (2 * q1) / 3);
  cusps[0] = a.asc;
  cusps[1] = norm360(a.asc + q2 / 3);
  cusps[2] = norm360(a.asc + (2 * q2) / 3);
  for (let i = 0; i < 6; i++) cusps[(i + 3) % 12] = norm360(cusps[(i + 9) % 12] + 180);
  return cusps;
}

export type Houses = { cusps: number[]; system: HouseSystem | 'porphyry' };

export function houses(a: Angles, lat: number, system: HouseSystem): Houses {
  if (system === 'whole') {
    const first = Math.floor(a.asc / 30) * 30;
    return { cusps: Array.from({ length: 12 }, (_, i) => norm360(first + i * 30)), system };
  }
  // Placidus não existe perto dos polos: usa Porfírio.
  if (Math.abs(lat) > 66) return { cusps: porphyry(a), system: 'porphyry' };
  const c = Array<number>(12);
  c[0] = a.asc;
  c[9] = a.mc;
  c[10] = placidusCusp(a, lat, 1 / 3, false);
  c[11] = placidusCusp(a, lat, 2 / 3, false);
  c[1] = placidusCusp(a, lat, 1 / 3, true);
  c[2] = placidusCusp(a, lat, 2 / 3, true);
  for (const i of [0, 1, 2, 9, 10, 11]) c[(i + 6) % 12] = norm360(c[i] + 180);
  return { cusps: c, system: 'placidus' };
}

/** Em qual casa (1–12) cai uma longitude. */
export function houseOf(lon: number, cusps: number[]) {
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    const span = norm360(end - start);
    if (norm360(lon - start) < span) return i + 1;
  }
  return 1;
}
