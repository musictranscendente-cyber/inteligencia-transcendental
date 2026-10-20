import { LENORMAND, RUNES_TEXT } from '@/content/oracles';
import { cardInfo } from '@/content/tarot';
import type { Lang } from '@/content/types';
import { SYMMETRIC_RUNES, type RuneKey } from '@/engines/divination';
import type { DeckKind } from './spreads';

export type Drawn = { id: string | number; reversed: boolean };

export function cardName(deck: DeckKind, id: string | number, lang: Lang) {
  if (deck === 'tarot') return cardInfo(String(id), lang).name;
  if (deck === 'lenormand') return LENORMAND[Number(id) - 1].name[lang];
  return RUNES_TEXT[id as RuneKey].name[lang];
}

export function cardMeaning(deck: DeckKind, card: Drawn, lang: Lang) {
  if (deck === 'tarot') {
    const c = cardInfo(String(card.id), lang);
    return card.reversed ? c.reversed : c.upright;
  }
  if (deck === 'lenormand') return LENORMAND[Number(card.id) - 1].meaning[lang];
  const r = RUNES_TEXT[card.id as RuneKey];
  return card.reversed && !SYMMETRIC_RUNES.includes(card.id as RuneKey) && r.reversed[lang] ? r.reversed[lang] : r.upright[lang];
}
