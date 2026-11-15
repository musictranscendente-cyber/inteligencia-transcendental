/** Frases prontas dos aspectos do dia, usadas na aba Hoje, no detalhe e no card de compartilhar. */
import type { TFunction } from 'i18next';

import { ASPECTS_TEXT, PLANETS_TEXT } from '@/content/astrology';
import type { Lang } from '@/content/types';
import type { Transit } from '@/engines/astro/transits';

const FLOWING = new Set(['trine', 'sextile']);
const TENSE = new Set(['square', 'opposition']);

export function transitTone(tr: Transit): 'flow' | 'tense' | 'blend' {
  return FLOWING.has(tr.type) ? 'flow' : TENSE.has(tr.type) ? 'tense' : 'blend';
}

export function describeTransit(tr: Transit, lang: Lang, t: TFunction) {
  const planet = PLANETS_TEXT[tr.transiting][lang].name;
  const natal = PLANETS_TEXT[tr.natal][lang];
  const aspect = ASPECTS_TEXT[tr.type][lang];
  return {
    title: `${planet} ${aspect.symbol} ${natal.name}`,
    /** Sem símbolo, para fontes serifadas que não têm os glifos dos aspectos. */
    pair: `${planet} & ${natal.name}`,
    text: t('today.transitLine', { aspect: aspect.name, planet, natal: natal.name, meaning: aspect.meaning }),
    touches: t('today.touches', { fn: natal.function }),
    orb: tr.orb < 0.5 ? t('today.exact') : t('today.orb', { orb: tr.orb.toFixed(1) }),
  };
}
