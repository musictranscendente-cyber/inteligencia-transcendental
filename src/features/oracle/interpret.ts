import { LENORMAND, RUNES_TEXT } from '@/content/oracles';
import { cardInfo, yesNo } from '@/content/tarot';
import { SUIT_THEME } from '@/content/tarot-minor';
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

/** Tema de uma carta de tarô: palavras-chave do arcano maior ou o tema do naipe. */
function tarotTheme(card: Drawn, lang: Lang) {
  const c = cardInfo(String(card.id), lang);
  const words = c.suit ? [SUIT_THEME[lang][c.suit]] : c.keywords;
  const and = { pt: ' e ', en: ' and ', es: ' y ' }[lang];
  return words.length > 1 ? `${words.slice(0, -1).join(', ')}${and}${words[words.length - 1]}` : words[0];
}

/** Nome da carta, marcando quando saiu invertida. */
function nameWithOrientation(card: Drawn, lang: Lang) {
  const name = cardName('tarot', card.id, lang);
  return card.reversed ? `${name}, ${{ pt: 'invertida', en: 'reversed', es: 'invertida' }[lang]}` : name;
}

/** Resposta direta que une as três cartas; a última (para onde vai) pesa mais. */
function verdict(cards: Drawn[], lang: Lang) {
  const score = (c: Drawn) => ({ yes: 1, maybe: 0, no: -1 })[yesNo(String(c.id), c.reversed)];
  const total = score(cards[1]) + 2 * score(cards[2]);
  const key = total >= 2 ? 'yes' : total >= 0 ? 'maybe' : 'no';
  return {
    pt: { yes: 'O caminho está aberto e as cartas são favoráveis.', maybe: 'É possível, mas pede ajustes antes de avançar.', no: 'Por enquanto as cartas pedem cautela: talvez não agora, ou não desse jeito.' },
    en: { yes: 'The path is open and the cards are favorable.', maybe: 'It is possible, but it asks for adjustments before moving forward.', no: 'For now the cards ask for caution: maybe not now, or not this way.' },
    es: { yes: 'El camino está abierto y las cartas son favorables.', maybe: 'Es posible, pero pide ajustes antes de avanzar.', no: 'Por ahora las cartas piden cautela: quizá no ahora, o no de esta forma.' },
  }[lang][key];
}

/** Leitura local de uma pergunta: o significado de cada carta e, no fim, uma resposta que une as três. */
export function localAnswer(cards: Drawn[], positions: string[], lang: Lang, firstName: string) {
  const parts = cards.map((c, i) => `${positions[i]}: ${cardName('tarot', c.id, lang)} — ${cardMeaning('tarot', c, lang)}`);
  const intro = { pt: `${firstName}, as cartas trazem três camadas para a sua pergunta.`, en: `${firstName}, the cards bring three layers to your question.`, es: `${firstName}, las cartas traen tres capas a tu pregunta.` }[lang];
  const [t1, t2, t3] = cards.map((c) => tarotTheme(c, lang));
  const [n1, n2, n3] = cards.map((c) => nameWithOrientation(c, lang));
  const v = verdict(cards, lang);
  const answer = {
    pt: `Resposta: ${v} O que pesa está ligado a ${t1} (${n1}): reconheça isso, sem deixar que decida por você. O que ajuda vem de ${t2} (${n2}): é a sua ferramenta agora. Seguindo por aí, o caminho leva a ${t3} (${n3}). Use estas imagens como espelho: a escolha continua sendo sua.`,
    en: `Answer: ${v} What weighs on you is tied to ${t1} (${n1}): acknowledge it without letting it decide for you. Help comes from ${t2} (${n2}): that is your tool right now. Following this road, the path leads to ${t3} (${n3}). Use these images as a mirror: the choice is still yours.`,
    es: `Respuesta: ${v} Lo que pesa está ligado a ${t1} (${n1}): reconócelo sin dejar que decida por ti. Lo que ayuda viene de ${t2} (${n2}): es tu herramienta ahora. Siguiendo por ahí, el camino lleva a ${t3} (${n3}). Usa estas imágenes como espejo: la elección sigue siendo tuya.`,
  }[lang];
  return [intro, ...parts, answer].join('\n\n');
}
