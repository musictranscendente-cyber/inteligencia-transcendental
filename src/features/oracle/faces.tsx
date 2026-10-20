import { CardBack } from '@/components/card-back';
import { LenormandFace, RuneStone } from '@/components/oracle-faces';
import { TarotFace } from '@/components/tarot-face';
import { LENORMAND } from '@/content/oracles';
import type { Lang } from '@/content/types';
import { SYMMETRIC_RUNES, type RuneKey } from '@/engines/divination';
import type { Drawn } from './interpret';
import type { DeckKind } from './spreads';

/** Altura relativa de cada tipo de carta. */
export const ASPECT: Record<DeckKind, number> = { tarot: 1.6, lenormand: 1.6, runes: 1.2 };

export function Face({ deck, card, width, lang, color }: { deck: DeckKind; card: Drawn; width: number; lang: Lang; color: string }) {
  if (deck === 'tarot') return <TarotFace id={String(card.id)} width={width} color={color} reversed={card.reversed} />;
  if (deck === 'lenormand') return <LenormandFace number={Number(card.id)} name={LENORMAND[Number(card.id) - 1].name[lang]} width={width} color={color} />;
  const rune = card.id as RuneKey;
  return <RuneStone rune={rune} size={width} color={color} reversed={card.reversed && !SYMMETRIC_RUNES.includes(rune)} />;
}

export function Back({ deck, width, color }: { deck: DeckKind; width: number; color: string }) {
  if (deck === 'runes') return <RuneStone size={width} color={color} />;
  return <CardBack width={width} accent={color} />;
}
