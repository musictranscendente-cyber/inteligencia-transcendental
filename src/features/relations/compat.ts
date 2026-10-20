import { COMPAT_ADVICE, SYNASTRY_PAIRS } from '@/content/misc';
import { PLANETS_TEXT } from '@/content/astrology';
import { RELATION_TEXT } from '@/content/chinese';
import { fill, type Lang } from '@/content/types';
import { compatibility, type Compatibility, type PersonData, type SynastryAspect } from '@/engines/compatibility';
import type { Reading } from '@/engines/reading';

export function personData(r: Reading): PersonData {
  return {
    chart: r.chart,
    destiny: r.numerology.destiny,
    expression: r.numerology.expression,
    soul: r.numerology.soul,
    animal: r.chinese.animal,
    hdGates: r.humanDesign?.gates ?? null,
  };
}

export function compareReadings(a: Reading, b: Reading) {
  return compatibility(personData(a), personData(b));
}

function pairText(s: SynastryAspect, lang: Lang) {
  const t = SYNASTRY_PAIRS[lang];
  const key = [s.a, s.b].sort().join('-');
  if (t[key]) return t[key];
  if (s.a === 'saturn' || s.b === 'saturn') return t.saturn;
  if (s.a === 'jupiter' || s.b === 'jupiter') return t.jupiter;
  if (s.a === 'node' || s.b === 'node') return t.node;
  return fill(t.default, { a: PLANETS_TEXT[s.a][lang].function, b: PLANETS_TEXT[s.b][lang].function });
}

/** Textos locais de "o que une", "onde podem se desentender" e "como se entender". */
export function compatTexts(c: Compatibility, lang: Lang) {
  const unique = (arr: string[]) => [...new Set(arr)];
  const unites = unique(c.strengths.map((s) => pairText(s, lang)));
  if (c.chinese.relation === 'secretFriend' || c.chinese.relation === 'trine') unites.push(RELATION_TEXT[c.chinese.relation][lang]);
  const clashes = unique(c.tensions.map((s) => pairText(s, lang)));
  if (c.chinese.relation === 'clash') clashes.push(RELATION_TEXT.clash[lang]);
  const level = c.overall >= 75 ? 'high' : c.overall >= 55 ? 'mid' : 'low';
  return { unites: unites.join(' '), clashes: clashes.join(' ') || COMPAT_ADVICE[lang].mid, tips: COMPAT_ADVICE[lang][level] };
}
