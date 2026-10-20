/**
 * Convergência: cada técnica aponta traços; quando várias apontam o mesmo, ele ganha destaque
 * ("3 técnicas apontam liderança").
 */
import { dominant, pointOf, type SignKey } from './astro/chart';
import type { AnimalKey } from './chinese';
import type { HDType } from './humanDesign';
import { reduce } from './numerology';
import type { Reading } from './reading';

export const TRAITS = [
  'leadership', 'sensitivity', 'communication', 'stability', 'freedom', 'care',
  'introspection', 'ambition', 'compassion', 'creativity', 'intuition', 'harmony',
] as const;
export type Trait = (typeof TRAITS)[number];

export type Technique = 'numerology' | 'tarot' | 'astrology' | 'humanDesign' | 'chinese';

const NUMBER_TRAITS: Record<number, Trait[]> = {
  1: ['leadership'], 2: ['harmony', 'sensitivity'], 3: ['communication', 'creativity'], 4: ['stability'], 5: ['freedom'],
  6: ['care'], 7: ['introspection'], 8: ['ambition'], 9: ['compassion'], 11: ['intuition', 'sensitivity'],
  22: ['ambition', 'stability'], 33: ['care', 'compassion'],
};

const ARCANA_TRAITS: Trait[][] = [
  ['freedom'], ['creativity', 'communication'], ['intuition'], ['creativity', 'care'], ['leadership', 'stability'],
  ['introspection'], ['harmony'], ['ambition', 'leadership'], ['harmony', 'stability'], ['introspection'],
  ['freedom'], ['leadership'], ['compassion', 'sensitivity'], ['freedom'], ['harmony'],
  ['ambition'], ['freedom'], ['intuition', 'creativity'], ['intuition', 'sensitivity'], ['creativity', 'leadership'],
  ['introspection'], ['harmony', 'freedom'],
];

const SIGN_TRAITS: Record<SignKey, Trait[]> = {
  aries: ['leadership'], taurus: ['stability'], gemini: ['communication'], cancer: ['care', 'sensitivity'],
  leo: ['leadership', 'creativity'], virgo: ['stability'], libra: ['harmony'], scorpio: ['intuition'],
  sagittarius: ['freedom'], capricorn: ['ambition'], aquarius: ['freedom', 'creativity'], pisces: ['compassion', 'intuition'],
};

const ELEMENT_TRAITS = { fire: ['leadership'], earth: ['stability'], air: ['communication'], water: ['sensitivity'] } as const;

const HD_TRAITS: Record<HDType, Trait[]> = {
  manifestor: ['leadership', 'freedom'], generator: ['stability', 'creativity'], manifestingGenerator: ['freedom', 'creativity'],
  projector: ['introspection', 'intuition'], reflector: ['sensitivity', 'harmony'],
};

const ANIMAL_TRAITS: Record<AnimalKey, Trait[]> = {
  rat: ['communication'], ox: ['stability'], tiger: ['leadership'], rabbit: ['harmony'], dragon: ['ambition'],
  snake: ['intuition'], horse: ['freedom'], goat: ['creativity', 'care'], monkey: ['creativity'], rooster: ['stability'],
  dog: ['care'], pig: ['compassion'],
};

export type Convergence = { trait: Trait; techniques: Technique[]; score: number };

export function convergences(r: Reading): Convergence[] {
  const votes = new Map<Trait, { techniques: Set<Technique>; score: number }>();
  const vote = (traits: readonly Trait[], technique: Technique, weight = 1) => {
    for (const t of traits) {
      const v = votes.get(t) ?? { techniques: new Set(), score: 0 };
      v.techniques.add(technique);
      v.score += weight;
      votes.set(t, v);
    }
  };
  const n = r.numerology;
  vote(NUMBER_TRAITS[n.destiny] ?? NUMBER_TRAITS[reduce(n.destiny, false)], 'numerology', 2);
  vote(NUMBER_TRAITS[n.expression] ?? [], 'numerology', 1.5);
  vote(NUMBER_TRAITS[n.soul] ?? [], 'numerology', 1);
  vote(ARCANA_TRAITS[r.arcana], 'tarot', 2);
  const sun = pointOf(r.chart, 'sun')!;
  const moon = pointOf(r.chart, 'moon')!;
  const asc = pointOf(r.chart, 'asc');
  vote(SIGN_TRAITS[sun.sign], 'astrology', 2);
  vote(SIGN_TRAITS[moon.sign], 'astrology', 1);
  if (asc) vote(SIGN_TRAITS[asc.sign], 'astrology', 1);
  vote(ELEMENT_TRAITS[dominant(r.chart.elements)], 'astrology', 1);
  if (r.humanDesign) vote(HD_TRAITS[r.humanDesign.type], 'humanDesign', 2);
  vote(ANIMAL_TRAITS[r.chinese.animal], 'chinese', 1.5);

  return [...votes.entries()]
    .map(([trait, v]) => ({ trait, techniques: [...v.techniques], score: v.score + v.techniques.size * 2 }))
    .sort((a, b) => b.score - a.score);
}

