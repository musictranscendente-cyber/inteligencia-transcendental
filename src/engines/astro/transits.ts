/** Trânsitos sobre o mapa natal e linha do tempo dos próximos meses. */
import { NextGlobalSolarEclipse, NextLunarEclipse, SearchGlobalSolarEclipse, SearchLunarEclipse } from 'astronomy-engine';

import { ASPECTS, type AspectKey, type NatalChart, type PointKey } from './chart';
import { angleDiff, longitude, speed, type PlanetKey } from './ephemeris';

export type Transit = { transiting: PlanetKey; natal: PointKey; type: AspectKey; orb: number; applying: boolean };

const TRANSIT_ORB: Record<AspectKey, number> = { conjunction: 3, opposition: 3, square: 3, trine: 3, sextile: 2 };

export function transitsOn(chart: NatalChart, date: Date, planets: PlanetKey[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']): Transit[] {
  const out: Transit[] = [];
  for (const t of planets) {
    const lon = longitude(t, date);
    const v = speed(t, date);
    for (const n of chart.points) {
      if (n.key === 'node') continue;
      const sep = angleDiff(lon, n.lon);
      for (const asp of ASPECTS) {
        const diff = Math.abs(Math.abs(sep) - asp.angle);
        const orb = t === 'moon' ? 5 : TRANSIT_ORB[asp.key];
        if (diff <= orb) {
          // Aplicando se a separação caminha em direção ao ângulo exato.
          const next = Math.abs(Math.abs(angleDiff(lon + v * 0.1, n.lon)) - asp.angle);
          out.push({ transiting: t, natal: n.key, type: asp.key, orb: diff, applying: next < diff });
          break;
        }
      }
    }
  }
  return out.sort((a, b) => a.orb - b.orb);
}

export type TimelineEvent =
  | { kind: 'transit'; planet: PlanetKey; natal: PointKey; type: AspectKey; start: Date; peak: Date; end: Date }
  | { kind: 'retrograde'; planet: PlanetKey; start: Date; end: Date }
  | { kind: 'eclipse'; eclipse: 'solar' | 'lunar'; date: Date; lon: number; sensitive: PointKey | null };

const SLOW: PlanetKey[] = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
const TARGETS: PointKey[] = ['sun', 'moon', 'asc', 'mc', 'venus', 'saturn', 'jupiter'];

/** Eventos importantes entre `from` e `from + days` (passo diário). */
export function timeline(chart: NatalChart, from: Date, days = 365): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const day = 86400000;
  const targets = chart.points.filter((p) => TARGETS.includes(p.key));

  // Aspectos exatos de planetas lentos (orbe de 1°) a pontos sensíveis.
  type Open = { start: Date; peak: Date; best: number };
  const open = new Map<string, Open>();
  for (let i = 0; i <= days; i++) {
    const d = new Date(from.getTime() + i * day);
    for (const planet of SLOW) {
      const lon = longitude(planet, d);
      for (const n of targets) {
        if (planet === n.key && planet !== 'saturn' && planet !== 'jupiter') continue;
        for (const asp of ASPECTS) {
          if (asp.key === 'sextile' || (asp.key === 'trine' && planet !== 'jupiter')) continue;
          const diff = Math.abs(Math.abs(angleDiff(lon, n.lon)) - asp.angle);
          const id = `${planet}|${n.key}|${asp.key}`;
          const o = open.get(id);
          if (diff <= 1) {
            if (!o) open.set(id, { start: d, peak: d, best: diff });
            else if (diff < o.best) Object.assign(o, { peak: d, best: diff });
          } else if (o) {
            events.push({ kind: 'transit', planet, natal: n.key, type: asp.key, start: o.start, peak: o.peak, end: d });
            open.delete(id);
          }
        }
      }
    }
  }
  for (const [id, o] of open) {
    const [planet, natal, type] = id.split('|');
    events.push({ kind: 'transit', planet: planet as PlanetKey, natal: natal as PointKey, type: type as AspectKey, start: o.start, peak: o.peak, end: new Date(from.getTime() + days * day) });
  }

  // Mercúrio, Vênus e Marte retrógrados.
  for (const planet of ['mercury', 'venus', 'mars'] as PlanetKey[]) {
    let start: Date | null = null;
    for (let i = 0; i <= days; i++) {
      const d = new Date(from.getTime() + i * day);
      const retro = speed(planet, d) < 0;
      if (retro && !start) start = d;
      if (!retro && start) {
        events.push({ kind: 'retrograde', planet, start, end: d });
        start = null;
      }
    }
    if (start) events.push({ kind: 'retrograde', planet, start, end: new Date(from.getTime() + days * day) });
  }

  // Eclipses e se caem perto (até 3°) de um ponto sensível.
  const end = from.getTime() + days * day;
  const sensitive = (lon: number) => {
    for (const p of chart.points) {
      if (['sun', 'moon', 'asc', 'mc'].includes(p.key) && Math.abs(angleDiff(lon, p.lon)) <= 3) return p.key;
    }
    return null;
  };
  let solar = SearchGlobalSolarEclipse(from);
  while (solar.peak.date.getTime() < end) {
    const lon = longitude('sun', solar.peak.date);
    events.push({ kind: 'eclipse', eclipse: 'solar', date: solar.peak.date, lon, sensitive: sensitive(lon) });
    solar = NextGlobalSolarEclipse(solar.peak);
  }
  let lunar = SearchLunarEclipse(from);
  while (lunar.peak.date.getTime() < end) {
    const lon = longitude('moon', lunar.peak.date);
    events.push({ kind: 'eclipse', eclipse: 'lunar', date: lunar.peak.date, lon, sensitive: sensitive(lon) });
    lunar = NextLunarEclipse(lunar.peak);
  }

  const when = (e: TimelineEvent) => (e.kind === 'eclipse' ? e.date : e.kind === 'transit' ? e.peak : e.start).getTime();
  return events.sort((a, b) => when(a) - when(b));
}
