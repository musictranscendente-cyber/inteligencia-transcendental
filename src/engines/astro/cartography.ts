/** Astrocartografia: linhas MC/IC/ASC/DSC de cada planeta no momento do nascimento. */
import { Body, Equator, Observer, SiderealTime } from 'astronomy-engine';

import { DEG } from './ephemeris';

export type CartoPlanet = 'sun' | 'moon' | 'venus' | 'mars' | 'jupiter';
export const CARTO_PLANETS: CartoPlanet[] = ['sun', 'moon', 'venus', 'mars', 'jupiter'];
const BODY: Record<CartoPlanet, Body> = { sun: Body.Sun, moon: Body.Moon, venus: Body.Venus, mars: Body.Mars, jupiter: Body.Jupiter };

export type LineKind = 'mc' | 'ic' | 'asc' | 'dsc';
export type CartoLine = { planet: CartoPlanet; kind: LineKind; points: [number, number][] }; // [lon, lat]

const wrap180 = (x: number) => ((((x + 180) % 360) + 360) % 360) - 180;

type Eq = { ra: number; dec: number }; // graus

function equatorial(planet: CartoPlanet, date: Date): Eq {
  const e = Equator(BODY[planet], date, new Observer(0, 0, 0), true, true);
  return { ra: e.ra * 15, dec: e.dec };
}

/** Longitude geográfica onde o planeta está no ângulo dado (ascendente/descendente) na latitude dada. */
function horizonLon(eq: Eq, gast: number, lat: number, rising: boolean): number | null {
  const x = -Math.tan(lat * DEG) * Math.tan(eq.dec * DEG);
  if (Math.abs(x) > 1) return null;
  const h0 = Math.acos(x) / DEG;
  return wrap180(eq.ra + (rising ? -h0 : h0) - gast);
}

export function cartographyLines(date: Date): CartoLine[] {
  const gast = SiderealTime(date) * 15;
  const lines: CartoLine[] = [];
  for (const planet of CARTO_PLANETS) {
    const eq = equatorial(planet, date);
    const mcLon = wrap180(eq.ra - gast);
    lines.push({ planet, kind: 'mc', points: [[mcLon, -80], [mcLon, 80]] });
    lines.push({ planet, kind: 'ic', points: [[wrap180(mcLon + 180), -80], [wrap180(mcLon + 180), 80]] });
    for (const rising of [true, false]) {
      const pts: [number, number][] = [];
      for (let lat = -75; lat <= 75; lat += 2.5) {
        const lon = horizonLon(eq, gast, lat, rising);
        if (lon != null) pts.push([lon, lat]);
      }
      lines.push({ planet, kind: rising ? 'asc' : 'dsc', points: pts });
    }
  }
  return lines;
}

export type City = { name: string; countryCode: string; lat: number; lon: number };
export type CityMatch = { city: City; planet: CartoPlanet; kind: LineKind; km: number };

/** Distância (km) entre a cidade e cada linha do planeta, medida ao longo do paralelo. */
function distances(city: City, eq: Eq, gast: number) {
  const kmPerDeg = 111.32 * Math.cos(city.lat * DEG);
  const d = (lon: number | null) => (lon == null ? Infinity : Math.abs(wrap180(city.lon - lon)) * kmPerDeg);
  const mc = wrap180(eq.ra - gast);
  return {
    mc: d(mc),
    ic: d(wrap180(mc + 180)),
    asc: d(horizonLon(eq, gast, city.lat, true)),
    dsc: d(horizonLon(eq, gast, city.lat, false)),
  } satisfies Record<LineKind, number>;
}

export const CATEGORY_PLANETS = {
  love: ['venus', 'moon'],
  money: ['jupiter'],
  career: ['sun', 'mars'],
} as const satisfies Record<string, CartoPlanet[]>;
export type CartoCategory = keyof typeof CATEGORY_PLANETS;

/** Melhores cidades por categoria: as mais próximas (até `maxKm`) das linhas dos planetas da categoria. */
export function bestCities(date: Date, cities: City[], category: CartoCategory, limit = 6, maxKm = 700): CityMatch[] {
  const gast = SiderealTime(date) * 15;
  const matches: CityMatch[] = [];
  for (const planet of CATEGORY_PLANETS[category]) {
    const eq = equatorial(planet, date);
    for (const city of cities) {
      const ds = distances(city, eq, gast);
      // Para carreira, só o Meio do Céu e o Ascendente contam.
      const kinds: LineKind[] = category === 'career' ? ['mc', 'asc'] : ['mc', 'asc', 'dsc', 'ic'];
      for (const kind of kinds) {
        if (ds[kind] <= maxKm) matches.push({ city, planet, kind, km: Math.round(ds[kind]) });
      }
    }
  }
  const seen = new Set<string>();
  return matches
    .sort((a, b) => a.km - b.km)
    .filter((m) => {
      const k = `${m.city.name}|${m.city.countryCode}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, limit);
}
