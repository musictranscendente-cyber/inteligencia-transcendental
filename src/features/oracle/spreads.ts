import { LENORMAND_DECK, RUNES, TAROT_DECK } from '@/engines/divination';

export type DeckKind = 'tarot' | 'lenormand' | 'runes';
export type SpreadKey = 'yesno' | 'three' | 'love' | 'work' | 'celtic' | 'len3' | 'len9' | 'rune1' | 'rune3' | 'ask';

export const SPREADS: Record<SpreadKey, { deck: DeckKind; count: number; free: boolean }> = {
  yesno: { deck: 'tarot', count: 1, free: true },
  three: { deck: 'tarot', count: 3, free: true },
  love: { deck: 'tarot', count: 4, free: false },
  work: { deck: 'tarot', count: 4, free: false },
  celtic: { deck: 'tarot', count: 10, free: false },
  len3: { deck: 'lenormand', count: 3, free: false },
  len9: { deck: 'lenormand', count: 9, free: false },
  rune1: { deck: 'runes', count: 1, free: false },
  rune3: { deck: 'runes', count: 3, free: false },
  ask: { deck: 'tarot', count: 3, free: false },
};

export function deckOf(kind: DeckKind): (string | number)[] {
  if (kind === 'tarot') return TAROT_DECK;
  if (kind === 'lenormand') return LENORMAND_DECK;
  return [...RUNES];
}

export const isSpread = (s: string): s is SpreadKey => s in SPREADS;
