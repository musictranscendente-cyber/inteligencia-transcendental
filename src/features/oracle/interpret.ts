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

/** Leitura offline de uma pergunta: costura os significados das cartas em um parágrafo. */
export function localAnswer(cards: Drawn[], positions: string[], lang: Lang, firstName: string) {
  const parts = cards.map((c, i) => `${positions[i]}: ${cardName('tarot', c.id, lang)} — ${cardMeaning('tarot', c, lang)}`);
  const intro = { pt: `${firstName}, as cartas trazem três camadas para a sua pergunta.`, en: `${firstName}, the cards bring three layers to your question.`, es: `${firstName}, las cartas traen tres capas a tu pregunta.` }[lang];
  const outro = { pt: 'Use estas imagens como espelho: a escolha continua sendo sua.', en: 'Use these images as a mirror: the choice is still yours.', es: 'Usa estas imágenes como espejo: la elección sigue siendo tuya.' }[lang];
  return [intro, ...parts, outro].join('\n\n');
}
