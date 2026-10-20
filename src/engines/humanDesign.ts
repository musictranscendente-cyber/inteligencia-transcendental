/**
 * Desenho Humano: Personalidade (nascimento) e Design (Sol 88° antes).
 * Portões pela mandala do Rave: o portão 41 começa a 2° de Aquário (302°) e cada portão tem 5,625°.
 */
import { SearchSunLongitude } from 'astronomy-engine';

import { longitude, norm360, type PlanetKey } from './astro/ephemeris';

/** Ordem dos portões no zodíaco, começando pelo 25 em 358,25° (28°15' de Peixes). */
export const GATE_ORDER = [
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6,
  46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36,
];
const GATE_START = 358.25;
const GATE_SIZE = 360 / 64;

export type Activation = { gate: number; line: number };

export function gateOf(lon: number): Activation {
  const offset = norm360(lon - GATE_START);
  const index = Math.floor(offset / GATE_SIZE);
  const line = Math.floor((offset - index * GATE_SIZE) / (GATE_SIZE / 6)) + 1;
  return { gate: GATE_ORDER[index], line: Math.min(6, line) };
}

export const CENTERS = ['head', 'ajna', 'throat', 'g', 'heart', 'sacral', 'solarPlexus', 'spleen', 'root'] as const;
export type CenterKey = (typeof CENTERS)[number];

export const CENTER_GATES: Record<CenterKey, number[]> = {
  head: [64, 61, 63],
  ajna: [47, 24, 4, 17, 43, 11],
  throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
  g: [7, 1, 13, 25, 46, 2, 15, 10],
  heart: [21, 40, 26, 51],
  sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
  solarPlexus: [6, 37, 22, 36, 30, 55, 49],
  spleen: [48, 57, 44, 50, 32, 28, 18],
  root: [58, 38, 54, 53, 60, 52, 19, 39, 41],
};

export const GATE_CENTER: Record<number, CenterKey> = Object.fromEntries(
  CENTERS.flatMap((c) => CENTER_GATES[c].map((g) => [g, c]))
);

export const CHANNELS: [number, number][] = [
  [1, 8], [2, 14], [3, 60], [4, 63], [5, 15], [6, 59], [7, 31], [9, 52], [10, 20], [10, 34], [10, 57], [11, 56],
  [12, 22], [13, 33], [16, 48], [17, 62], [18, 58], [19, 49], [20, 34], [20, 57], [21, 45], [23, 43], [24, 61], [25, 51],
  [26, 44], [27, 50], [28, 38], [29, 46], [30, 41], [32, 54], [34, 57], [35, 36], [37, 40], [39, 55], [42, 53], [47, 64],
];

const MOTORS: CenterKey[] = ['heart', 'solarPlexus', 'sacral', 'root'];

export type HDType = 'manifestor' | 'generator' | 'manifestingGenerator' | 'projector' | 'reflector';
export type HDAuthority = 'emotional' | 'sacral' | 'splenic' | 'egoManifested' | 'egoProjected' | 'selfProjected' | 'mental' | 'lunar';
export type HDDefinition = 'none' | 'single' | 'split' | 'tripleSplit' | 'quadrupleSplit';
export type CrossAngle = 'right' | 'juxtaposition' | 'left';

export const HD_PLANETS = ['sun', 'earth', 'moon', 'northNode', 'southNode', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;
export type HDPlanet = (typeof HD_PLANETS)[number];

export type HumanDesignChart = {
  personality: Record<HDPlanet, Activation>;
  design: Record<HDPlanet, Activation>;
  designDate: Date;
  gates: number[];
  channels: [number, number][];
  defined: CenterKey[];
  type: HDType;
  authority: HDAuthority;
  definition: HDDefinition;
  profile: [number, number];
  cross: { angle: CrossAngle; gates: [number, number, number, number] };
};

function activations(date: Date): Record<HDPlanet, Activation> {
  const lon = (k: PlanetKey) => longitude(k, date);
  const sun = lon('sun');
  const node = lon('node');
  return {
    sun: gateOf(sun),
    earth: gateOf(sun + 180),
    moon: gateOf(lon('moon')),
    northNode: gateOf(node),
    southNode: gateOf(node + 180),
    mercury: gateOf(lon('mercury')),
    venus: gateOf(lon('venus')),
    mars: gateOf(lon('mars')),
    jupiter: gateOf(lon('jupiter')),
    saturn: gateOf(lon('saturn')),
    uranus: gateOf(lon('uranus')),
    neptune: gateOf(lon('neptune')),
    pluto: gateOf(lon('pluto')),
  };
}

/** Instante em que o Sol estava 88° antes da posição natal. */
export function designDate(birth: Date): Date {
  const target = norm360(longitude('sun', birth) - 88);
  const t = SearchSunLongitude(target, new Date(birth.getTime() - 100 * 86400000), 30);
  if (!t) throw new Error('Data do Design não encontrada');
  return t.date;
}

/** Classifica a partir de uma lista de portões ativos (útil para testes e para compatibilidade). */
export function analyzeGates(gates: Iterable<number>) {
  const set = new Set(gates);
  const channels = CHANNELS.filter(([a, b]) => set.has(a) && set.has(b));
  const definedSet = new Set<CenterKey>();
  const adj = new Map<CenterKey, Set<CenterKey>>();
  for (const [a, b] of channels) {
    const ca = GATE_CENTER[a];
    const cb = GATE_CENTER[b];
    definedSet.add(ca);
    definedSet.add(cb);
    if (!adj.has(ca)) adj.set(ca, new Set());
    if (!adj.has(cb)) adj.set(cb, new Set());
    adj.get(ca)!.add(cb);
    adj.get(cb)!.add(ca);
  }
  const defined = CENTERS.filter((c) => definedSet.has(c));

  const reach = (from: CenterKey) => {
    const seen = new Set<CenterKey>([from]);
    const stack = [from];
    while (stack.length) {
      for (const n of adj.get(stack.pop()!) ?? []) {
        if (!seen.has(n)) {
          seen.add(n);
          stack.push(n);
        }
      }
    }
    return seen;
  };
  const throatReach = definedSet.has('throat') ? reach('throat') : new Set<CenterKey>();
  const motorToThroat = MOTORS.some((m) => throatReach.has(m));

  let type: HDType;
  if (defined.length === 0) type = 'reflector';
  else if (definedSet.has('sacral')) type = motorToThroat ? 'manifestingGenerator' : 'generator';
  else if (motorToThroat) type = 'manifestor';
  else type = 'projector';

  let authority: HDAuthority;
  if (type === 'reflector') authority = 'lunar';
  else if (definedSet.has('solarPlexus')) authority = 'emotional';
  else if (definedSet.has('sacral')) authority = 'sacral';
  else if (definedSet.has('spleen')) authority = 'splenic';
  else if (definedSet.has('heart')) authority = adj.get('heart')?.has('throat') ? 'egoManifested' : 'egoProjected';
  else if (definedSet.has('g') && throatReach.has('g')) authority = 'selfProjected';
  else authority = 'mental';

  // Quantos grupos separados de centros definidos existem.
  const left = new Set(defined);
  let groups = 0;
  while (left.size) {
    const first = left.values().next().value as CenterKey;
    for (const c of reach(first)) left.delete(c);
    groups++;
  }
  const definition: HDDefinition = (['none', 'single', 'split', 'tripleSplit', 'quadrupleSplit'] as const)[Math.min(groups, 4)];

  return { channels, defined, type, authority, definition };
}

export function crossAngle(profile: [number, number]): CrossAngle {
  const p = `${profile[0]}/${profile[1]}`;
  if (p === '4/1') return 'juxtaposition';
  if (['5/1', '5/2', '6/2', '6/3'].includes(p)) return 'left';
  return 'right';
}

export function calculateHumanDesign(birth: Date): HumanDesignChart {
  const dd = designDate(birth);
  const personality = activations(birth);
  const design = activations(dd);
  const gates = [...new Set([...Object.values(personality), ...Object.values(design)].map((a) => a.gate))].sort((a, b) => a - b);
  const analysis = analyzeGates(gates);
  const profile: [number, number] = [personality.sun.line, design.sun.line];
  return {
    personality,
    design,
    designDate: dd,
    gates,
    ...analysis,
    profile,
    cross: { angle: crossAngle(profile), gates: [personality.sun.gate, personality.earth.gate, design.sun.gate, design.earth.gate] },
  };
}

/** Canais formados só quando as duas pessoas se juntam (compatibilidade). */
export function compositeChannels(a: number[], b: number[]) {
  const sa = new Set(a);
  const sb = new Set(b);
  return CHANNELS.filter(([x, y]) => !(sa.has(x) && sa.has(y)) && !(sb.has(x) && sb.has(y)) && (sa.has(x) || sb.has(x)) && (sa.has(y) || sb.has(y)));
}
