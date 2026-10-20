/**
 * Compatibilidade consolidada: sinastria + numerologia + Desenho Humano + astrologia chinesa.
 * Nota geral de 0 a 100 e radar com 5 eixos.
 */
import { ASPECTS, type AspectKey, type NatalChart, type PointKey } from './astro/chart';
import { angleDiff } from './astro/ephemeris';
import { ANIMAL_RELATION_SCORE, animalRelation, type AnimalKey, type AnimalRelation } from './chinese';
import { compositeChannels } from './humanDesign';
import { reduce } from './numerology';

export type RadarAxis = 'love' | 'communication' | 'values' | 'energy' | 'longTerm';
export const RADAR_AXES: RadarAxis[] = ['love', 'communication', 'values', 'energy', 'longTerm'];

export type SynastryAspect = { a: PointKey; b: PointKey; type: AspectKey; orb: number };

export type PersonData = {
  chart: NatalChart | null;
  destiny: number;
  expression: number;
  soul: number;
  animal: AnimalKey;
  hdGates: number[] | null;
};

export type Compatibility = {
  overall: number;
  radar: Record<RadarAxis, number>;
  synastry: SynastryAspect[];
  numerology: number;
  chinese: { relation: AnimalRelation; score: number };
  humanDesign: { channels: [number, number][]; score: number } | null;
  /** Pontos que mais unem e que mais desafiam (para os textos). */
  strengths: SynastryAspect[];
  tensions: SynastryAspect[];
};

/** Grupos harmônicos tradicionais da numerologia. */
const NUMBER_GROUPS = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];
const single = (n: number) => reduce(n, false);

export function numberPairScore(a: number, b: number) {
  const x = single(a);
  const y = single(b);
  if (x === y) return 80;
  if (NUMBER_GROUPS.some((g) => g.includes(x) && g.includes(y))) return 90;
  const complementary = [[1, 2], [3, 5], [4, 6], [6, 9], [2, 6], [1, 3]];
  if (complementary.some(([p, q]) => (p === x && q === y) || (p === y && q === x))) return 70;
  return 50;
}

const AXIS_PAIRS: Record<RadarAxis, [PointKey, PointKey][]> = {
  love: [['venus', 'mars'], ['mars', 'venus'], ['venus', 'venus'], ['moon', 'venus'], ['venus', 'moon'], ['sun', 'venus'], ['venus', 'sun']],
  communication: [['mercury', 'mercury'], ['mercury', 'moon'], ['moon', 'mercury'], ['mercury', 'sun'], ['sun', 'mercury']],
  values: [['venus', 'jupiter'], ['jupiter', 'venus'], ['sun', 'jupiter'], ['jupiter', 'sun'], ['jupiter', 'jupiter'], ['venus', 'saturn'], ['saturn', 'venus']],
  energy: [['mars', 'mars'], ['sun', 'mars'], ['mars', 'sun'], ['sun', 'sun'], ['mars', 'moon'], ['moon', 'mars']],
  longTerm: [['sun', 'moon'], ['moon', 'sun'], ['moon', 'moon'], ['saturn', 'sun'], ['sun', 'saturn'], ['saturn', 'moon'], ['moon', 'saturn'], ['node', 'sun'], ['sun', 'node'], ['node', 'moon'], ['moon', 'node']],
};

const ASPECT_VALUE: Record<AspectKey, number> = { conjunction: 1, trine: 1, sextile: 0.7, square: -0.6, opposition: -0.3 };
const SATURN_LIKE = new Set<PointKey>(['saturn']);

export function synastry(a: NatalChart, b: NatalChart): SynastryAspect[] {
  const out: SynastryAspect[] = [];
  for (const pa of a.points) {
    for (const pb of b.points) {
      const sep = Math.abs(angleDiff(pa.lon, pb.lon));
      for (const asp of ASPECTS) {
        const orb = Math.abs(sep - asp.angle);
        if (orb <= Math.min(asp.orb, 6)) {
          out.push({ a: pa.key, b: pb.key, type: asp.key, orb });
          break;
        }
      }
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

function aspectValue(s: SynastryAspect) {
  let v = ASPECT_VALUE[s.type];
  // Conjunção com Saturno pesa, mas dá compromisso; oposição Sol–Lua atrai.
  if (s.type === 'conjunction' && (SATURN_LIKE.has(s.a) || SATURN_LIKE.has(s.b))) v = 0.3;
  if (s.type === 'opposition' && ((s.a === 'sun' && s.b === 'moon') || (s.a === 'moon' && s.b === 'sun'))) v = 0.6;
  return v * (1 - s.orb / 10);
}

export function compatibility(a: PersonData, b: PersonData): Compatibility {
  const syn = a.chart && b.chart ? synastry(a.chart, b.chart) : [];
  const numerology = Math.round(
    numberPairScore(a.destiny, b.destiny) * 0.5 + numberPairScore(a.expression, b.expression) * 0.25 + numberPairScore(a.soul, b.soul) * 0.25
  );
  const relation = animalRelation(a.animal, b.animal);
  const chineseScore = ANIMAL_RELATION_SCORE[relation];
  const hdChannels = a.hdGates && b.hdGates ? compositeChannels(a.hdGates, b.hdGates) : null;
  const hdScore = hdChannels ? Math.min(95, 50 + hdChannels.length * 9) : null;

  const radar = {} as Record<RadarAxis, number>;
  for (const axis of RADAR_AXES) {
    let sum = 0;
    for (const s of syn) {
      if (AXIS_PAIRS[axis].some(([x, y]) => x === s.a && y === s.b)) sum += aspectValue(s);
    }
    // Base vinda das outras técnicas, ajustada pela sinastria.
    const base = axis === 'communication' ? numberPairScore(a.expression, b.expression) : axis === 'values' ? numberPairScore(a.soul, b.soul) : axis === 'longTerm' ? (numerology + chineseScore) / 2 : axis === 'energy' ? (hdScore ?? chineseScore) : numerology;
    radar[axis] = Math.round(Math.max(15, Math.min(98, base * 0.55 + 45 + sum * 12 - 20)));
  }

  const axisAvg = RADAR_AXES.reduce((s, k) => s + radar[k], 0) / RADAR_AXES.length;
  const parts: [number, number][] = [[axisAvg, syn.length ? 0.45 : 0], [numerology, 0.25], [chineseScore, 0.15], [hdScore ?? 0, hdScore ? 0.15 : 0]];
  const weight = parts.reduce((s, [, w]) => s + w, 0);
  const overall = Math.round(parts.reduce((s, [v, w]) => s + v * w, 0) / weight);

  const valued = syn.filter((s) => s.a !== 'node' && s.b !== 'node').map((s) => ({ s, v: aspectValue(s) }));
  return {
    overall,
    radar,
    synastry: syn,
    numerology,
    chinese: { relation, score: chineseScore },
    humanDesign: hdChannels ? { channels: hdChannels, score: hdScore! } : null,
    strengths: valued.filter((x) => x.v > 0.4).sort((x, y) => y.v - x.v).slice(0, 4).map((x) => x.s),
    tensions: valued.filter((x) => x.v < 0).sort((x, y) => x.v - y.v).slice(0, 3).map((x) => x.s),
  };
}
