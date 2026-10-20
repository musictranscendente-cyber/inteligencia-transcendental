/** Mapa natal: planetas, casas, aspectos, elementos e modalidades. */
import { MoonPhase, SearchSunLongitude } from 'astronomy-engine';

import { angleDiff, longitude, norm360, PLANETS, speed, type PlanetKey } from './ephemeris';
import { angles, houseOf, houses, type HouseSystem } from './houses';

export const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const;
export type SignKey = (typeof SIGNS)[number];
export type ElementKey = 'fire' | 'earth' | 'air' | 'water';
export type ModalityKey = 'cardinal' | 'fixed' | 'mutable';

export const SIGN_ELEMENT: ElementKey[] = ['fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water'];
export const SIGN_MODALITY: ModalityKey[] = ['cardinal', 'fixed', 'mutable', 'cardinal', 'fixed', 'mutable', 'cardinal', 'fixed', 'mutable', 'cardinal', 'fixed', 'mutable'];

export const signIndex = (lon: number) => Math.floor(norm360(lon) / 30);
export const signOf = (lon: number): SignKey => SIGNS[signIndex(lon)];
export const degreeInSign = (lon: number) => norm360(lon) % 30;

export function formatDegree(lon: number) {
  const d = degreeInSign(lon);
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  return `${deg}°${String(min).padStart(2, '0')}'`;
}

export type PointKey = PlanetKey | 'asc' | 'mc';

export type ChartPoint = {
  key: PointKey;
  lon: number;
  sign: SignKey;
  house: number | null;
  retrograde: boolean;
};

export type AspectKey = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
export const ASPECTS: { key: AspectKey; angle: number; orb: number }[] = [
  { key: 'conjunction', angle: 0, orb: 8 },
  { key: 'opposition', angle: 180, orb: 8 },
  { key: 'trine', angle: 120, orb: 7 },
  { key: 'square', angle: 90, orb: 7 },
  { key: 'sextile', angle: 60, orb: 5 },
];

export type Aspect = { a: PointKey; b: PointKey; type: AspectKey; orb: number };

export type NatalChart = {
  date: Date;
  points: ChartPoint[];
  cusps: number[] | null;
  houseSystem: HouseSystem | 'porphyry' | null;
  aspects: Aspect[];
  elements: Record<ElementKey, number>;
  modalities: Record<ModalityKey, number>;
  /** Sem hora de nascimento: ascendente e casas ficam de fora. */
  timeKnown: boolean;
};

const WEIGHT: Partial<Record<PointKey, number>> = { sun: 3, moon: 3, asc: 3, mercury: 2, venus: 2, mars: 2 };

/** Orbe extra para Sol e Lua. */
function orbFor(a: PointKey, b: PointKey, base: number) {
  return base + (a === 'sun' || a === 'moon' || b === 'sun' || b === 'moon' ? 1 : 0);
}

export function findAspects(points: { key: PointKey; lon: number }[], scale = 1): Aspect[] {
  const out: Aspect[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i];
      const b = points[j];
      if ((a.key === 'node' && b.key === 'node') || (a.key === 'asc' && b.key === 'mc')) continue;
      const sep = Math.abs(angleDiff(a.lon, b.lon));
      for (const asp of ASPECTS) {
        const orb = Math.abs(sep - asp.angle);
        if (orb <= orbFor(a.key, b.key, asp.orb) * scale) {
          out.push({ a: a.key, b: b.key, type: asp.key, orb });
          break;
        }
      }
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

export function planetPositions(date: Date) {
  return PLANETS.map((key) => ({ key, lon: longitude(key, date), retrograde: key !== 'sun' && key !== 'moon' && key !== 'node' && speed(key, date) < 0 }));
}

export function calculateChart(date: Date, lat: number, lon: number, timeKnown = true, system: HouseSystem = 'placidus'): NatalChart {
  const planets = planetPositions(date);
  let cusps: number[] | null = null;
  let houseSystem: NatalChart['houseSystem'] = null;
  const extra: { key: PointKey; lon: number }[] = [];
  if (timeKnown) {
    const a = angles(date, lat, lon);
    const h = houses(a, lat, system);
    cusps = h.cusps;
    houseSystem = h.system;
    extra.push({ key: 'asc', lon: a.asc }, { key: 'mc', lon: a.mc });
  }
  const points: ChartPoint[] = [
    ...planets.map((p) => ({ ...p, sign: signOf(p.lon), house: cusps ? houseOf(p.lon, cusps) : null })),
    ...extra.map((p) => ({ ...p, sign: signOf(p.lon), house: null, retrograde: false })),
  ];

  const elements: Record<ElementKey, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  const modalities: Record<ModalityKey, number> = { cardinal: 0, fixed: 0, mutable: 0 };
  for (const p of points) {
    if (p.key === 'node' || p.key === 'mc') continue;
    const w = WEIGHT[p.key] ?? 1;
    elements[SIGN_ELEMENT[signIndex(p.lon)]] += w;
    modalities[SIGN_MODALITY[signIndex(p.lon)]] += w;
  }

  return {
    date,
    points,
    cusps,
    houseSystem,
    aspects: findAspects(points),
    elements,
    modalities,
    timeKnown,
  };
}

export const pointOf = (chart: NatalChart, key: PointKey) => chart.points.find((p) => p.key === key);

export function dominant<T extends string>(counts: Record<T, number>): T {
  return (Object.keys(counts) as T[]).reduce((a, b) => (counts[b] > counts[a] ? b : a));
}

/** Instante exato da revolução solar no ano dado. */
export function solarReturn(natalSunLon: number, birthDate: string, year: number): Date | null {
  const [, m, d] = birthDate.split('-').map(Number);
  const start = new Date(Date.UTC(year, m - 1, d) - 4 * 86400000);
  const t = SearchSunLongitude(natalSunLon, start, 10);
  return t ? t.date : null;
}

export type MoonInfo = {
  /** Ângulo da fase: 0 = nova, 90 = crescente, 180 = cheia, 270 = minguante. */
  phase: number;
  illumination: number;
  phaseIndex: number; // 0–7
  waxing: boolean;
  sign: SignKey;
  lon: number;
};

export function moonInfo(date: Date): MoonInfo {
  const phase = MoonPhase(date);
  const lon = longitude('moon', date);
  return {
    phase,
    illumination: (1 - Math.cos(phase * (Math.PI / 180))) / 2,
    phaseIndex: Math.floor(((phase + 22.5) % 360) / 45),
    waxing: phase < 180,
    sign: signOf(lon),
    lon,
  };
}
