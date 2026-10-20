import type { Suit } from '@/engines/divination';
import { MAJOR_ARCANA, MAJOR_YES_NO, type YesNo } from './tarot-major';
import { MINOR_MEANINGS, minorName, SUIT_THEME } from './tarot-minor';
import type { Lang } from './types';

export type CardInfo = {
  id: string;
  name: string;
  summary: string;
  upright: string;
  reversed: string;
  keywords: string[];
  major: number | null;
  suit: Suit | null;
  rank: number | null;
};

export function cardInfo(id: string, lang: Lang): CardInfo {
  if (id.startsWith('M')) {
    const n = Number(id.slice(1));
    const c = MAJOR_ARCANA[n][lang];
    return { id, name: c.name, summary: c.summary, upright: c.upright, reversed: c.reversed, keywords: c.keywords, major: n, suit: null, rank: null };
  }
  const [suit, r] = id.split('-') as [Suit, string];
  const rank = Number(r);
  const [up, rev] = MINOR_MEANINGS[suit][lang][rank - 1];
  return { id, name: minorName(suit, rank, lang), summary: up, upright: up, reversed: rev, keywords: [SUIT_THEME[lang][suit]], major: null, suit, rank };
}

/** Resposta Sim/Não: arcanos maiores pela tabela; menores por naipe e número. */
export function yesNo(id: string, reversed: boolean): YesNo {
  let base: YesNo;
  if (id.startsWith('M')) base = MAJOR_YES_NO[Number(id.slice(1))];
  else {
    const [suit, r] = id.split('-');
    const rank = Number(r);
    base = suit === 'swords' && [3, 5, 7, 8, 9, 10].includes(rank) ? 'no' : suit === 'cups' && rank === 5 ? 'no' : rank === 4 || rank === 7 ? 'maybe' : 'yes';
  }
  if (!reversed) return base;
  return base === 'yes' ? 'maybe' : 'no';
}
