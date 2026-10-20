/**
 * Leitor local do oráculo: transforma as cartas (ou runas, ou hexagramas) num texto corrido,
 * como uma pessoa conversando com outra, ligado à pergunta que foi feita.
 * Funciona sem internet; quando a IA está disponível, a tela de pergunta usa a IA primeiro.
 */
import { ICHING } from '@/content/oracles';
import { PERSONAL_YEAR } from '@/content/numbers';
import { cardInfo, yesNo } from '@/content/tarot';
import type { Lang } from '@/content/types';
import { SYMMETRIC_RUNES, type RuneKey, type Suit } from '@/engines/divination';
import { cardMeaning, cardName, type Drawn } from './interpret';
import type { DeckKind, SpreadKey } from './spreads';

type Tri<T> = Record<Lang, T>;
type Verdict = 'yes' | 'maybe' | 'no';

// ─── Pergunta ────────────────────────────────────────────────────────────────

export type Topic = 'love' | 'work' | 'money' | 'health' | 'family' | 'study' | 'travel' | 'friends' | 'spirit' | 'general';
export type QuestionKind = 'yesno' | 'when' | 'how' | 'why' | 'choice' | 'open' | 'none';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Palavras-chave por assunto (sem acento). Termina em "." = palavra exata; tem espaço = trecho;
 * senão = começo de palavra (ex.: "trabalh" pega trabalho, trabalhar...).
 */
const TOPIC_WORDS: [Topic, string[]][] = [
  ['love', ['amor', 'amar.', 'ele.', 'ela.', 'dele.', 'dela.', 'him.', 'her.', 'he.', 'she.', 'ella.', 'voltar pra', 'voltar para', 'reconcili', 'namor', 'relacionamento', 'relacao', 'casament', 'casar', 'crush', 'paquera', 'ficante', 'marido', 'esposa', 'esposo', 'noiv', 'ex.', 'apaixon', 'beij', 'romance', 'trai', 'me ama', 'me quer', 'gosta de mim', 'sente por mim', 'volta pra mim', 'voltar comigo', 'alma gemea', 'love', 'boyfriend', 'girlfriend', 'partner', 'husband', 'wife', 'marry', 'marriage', 'dating', 'crush', 'soulmate', 'novio', 'novia', 'pareja', 'enamor', 'me quiere', 'cheat']],
  ['work', ['trabalh', 'emprego', 'carreira', 'chefe', 'entrevista', 'vaga', 'promoc', 'negocio', 'empresa', 'projeto', 'cliente', 'demiss', 'contrat', 'job', 'work', 'career', 'boss', 'interview', 'promotion', 'business', 'company', 'project', 'hired', 'fired', 'trabajo', 'empleo', 'carrera', 'jefe', 'ascenso', 'proyecto', 'despid']],
  ['money', ['dinheiro', 'grana', 'divida', 'financ', 'salario', 'pagar', 'pagamento', 'investi', 'compra', 'vender', 'venda', 'lucro', 'emprestimo', 'heranca', 'loteria', 'money', 'debt', 'salary', 'invest', 'buy', 'sell', 'profit', 'loan', 'lottery', 'dinero', 'deuda', 'invertir', 'comprar', 'ganancia', 'prestamo']],
  ['health', ['saude', 'doenc', 'doente', 'cura', 'exame', 'cirurgia', 'ansiedade', 'depress', 'tratamento', 'gravid', 'health', 'sick', 'illness', 'heal', 'surgery', 'anxiety', 'pregnan', 'salud', 'enferm', 'cirugia', 'ansiedad', 'embaraz', 'tratamiento']],
  ['family', ['familia', 'mae.', 'pai.', 'filho', 'filha', 'irma', 'avo.', 'avos.', 'parente', 'sogr', 'family', 'mother', 'father', 'mom.', 'dad.', 'son.', 'daughter', 'sister', 'brother', 'madre', 'padre', 'hijo', 'hija', 'hermana', 'hermano', 'suegr']],
  ['study', ['estud', 'prova', 'vestibular', 'enem.', 'faculdade', 'curso', 'concurso', 'escola', 'aprovad', 'passar na', 'study', 'exam', 'test.', 'college', 'university', 'school', 'course', 'estudi', 'examen', 'universidad', 'escuela', 'oposicion']],
  ['travel', ['viag', 'viaj', 'mudar de', 'mudanca', 'morar fora', 'morar em', 'intercambio', 'outro pais', 'travel', 'trip', 'move abroad', 'moving', 'relocat', 'mudanza', 'mudarme', 'vivir en']],
  ['friends', ['amig', 'amizade', 'friend', 'amistad']],
  ['spirit', ['espiritual', 'missao', 'proposito', 'alma.', 'deus', 'meditac', 'mediunidade', 'spiritual', 'purpose', 'soul', 'mission', 'god.', 'meditat', 'mision', 'dios']],
];

function hits(text: string, words: string[], entries: string[]) {
  let n = 0;
  for (const e of entries) {
    if (e.includes(' ')) n += text.includes(e) ? 1 : 0;
    else if (e.endsWith('.')) n += words.includes(e.slice(0, -1)) ? 1 : 0;
    else n += words.some((w) => w.startsWith(e)) ? 1 : 0;
  }
  return n;
}

export function analyzeQuestion(question: string, lang: Lang): { text: string; topic: Topic; kind: QuestionKind } {
  const text = question.trim();
  if (!text) return { text, topic: 'general', kind: 'none' };
  const n = norm(text);
  const words = n.split(/[^a-z0-9]+/).filter(Boolean);

  let topic: Topic = 'general';
  let best = 0;
  for (const [t, entries] of TOPIC_WORDS) {
    const score = hits(n, words, entries);
    if (score > best) [topic, best] = [t, score];
  }

  const start = n.replace(/^[^a-z]+/, '');
  const startsWith = (list: string[]) => list.some((w) => start.startsWith(`${w} `) || start === w);
  let kind: QuestionKind = 'yesno';
  if (startsWith(['quando', 'when', 'cuando']) || /\b(quando|when|cuando)\b/.test(n)) kind = 'when';
  else if (startsWith(['por que', 'porque', 'pq', 'why', 'por qual motivo'])) kind = 'why';
  else if (startsWith(['como', 'how', 'o que', 'what', 'que', 'qual', 'quais', 'which', 'cual', 'cuales', 'onde', 'where', 'donde', 'quem', 'who', 'quien'])) kind = 'how';
  else if (words.includes({ pt: 'ou', en: 'or', es: 'o' }[lang]) && words.length > 3) kind = 'choice';
  return { text, topic, kind };
}

// ─── Cartas ──────────────────────────────────────────────────────────────────

type CardView = { start: string; mid: string; meaning: string; polarity: number; suit: Suit | null; major: boolean; reversed: boolean };

const RUNE_POLARITY: Record<RuneKey, number> = {
  fehu: 1, uruz: 1, thurisaz: 0, ansuz: 1, raidho: 1, kenaz: 1, gebo: 1, wunjo: 1, hagalaz: -1, nauthiz: -1, isa: 0, jera: 1,
  eihwaz: 0, perthro: 0, algiz: 1, sowilo: 1, tiwaz: 1, berkano: 1, ehwaz: 1, mannaz: 1, laguz: 0, ingwaz: 1, dagaz: 1, othala: 1,
};

/** Baralho cigano, cartas 1–36: 1 favorável, 0 neutra, −1 desafiadora. */
const LENORMAND_POLARITY = [1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, 0, 1, -1, 1, 1, 1, 1, 0, 1, -1, 0, -1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0];

/** I Ching, hexagramas 1–64. */
const ICHING_POLARITY = [
  1, 1, 0, 0, 0, -1, 0, 1, 0, 0, 1, -1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, -1, 1, 1, 0, 0, -1, -1, 1, 1, 1,
  -1, 1, 1, -1, 1, -1, -1, 1, 0, 1, 1, 0, 1, 1, -1, 1, 1, 1, 0, 0, 1, -1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
];

const YES_NO_SCORE = { yes: 1, maybe: 0, no: -1 } as const;
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Artigo de uma carta menor (pela posição na corte). */
function minorArticle(rank: number, lang: Lang) {
  if (lang === 'en') return 'the';
  if (lang === 'pt') return rank === 13 ? 'a' : 'o';
  return rank === 13 || rank === 11 ? 'la' : 'el';
}

function view(deck: DeckKind, card: Drawn, lang: Lang): CardView {
  const meaning = cardMeaning(deck, card, lang);
  const name = cardName(deck, card.id, lang);
  if (deck === 'tarot') {
    const c = cardInfo(String(card.id), lang);
    let mid: string;
    if (c.major === null) mid = `${minorArticle(c.rank ?? 1, lang)} ${name}`;
    // Plural ("Os Enamorados") vira "a carta dos Enamorados", para a frase concordar.
    else if (lang === 'pt' && name.startsWith('Os ')) mid = `a carta d${lower(name)}`;
    else if (lang === 'es' && name.startsWith('Los ')) mid = `la carta de ${lower(name)}`;
    else mid = lang === 'en' && !name.startsWith('The ') ? name : lower(name);
    if (card.reversed) mid += { pt: ' (carta invertida)', en: ' (reversed)', es: ' (carta invertida)' }[lang];
    return { start: upper(mid), mid, meaning, polarity: YES_NO_SCORE[yesNo(String(card.id), card.reversed)], suit: c.suit, major: c.major !== null, reversed: card.reversed };
  }
  if (deck === 'runes') {
    const key = card.id as RuneKey;
    const flipped = card.reversed && !SYMMETRIC_RUNES.includes(key);
    let mid = `${{ pt: 'a runa', en: 'the rune', es: 'la runa' }[lang]} ${name}`;
    if (flipped) mid += { pt: ' (invertida)', en: ' (reversed)', es: ' (invertida)' }[lang];
    return { start: upper(mid), mid, meaning, polarity: flipped ? -1 : RUNE_POLARITY[key], suit: null, major: false, reversed: flipped };
  }
  const mid = `${{ pt: 'a carta', en: 'the card', es: 'la carta' }[lang]} ${name}`;
  return { start: upper(mid), mid, meaning, polarity: LENORMAND_POLARITY[Number(card.id) - 1], suit: null, major: false, reversed: false };
}

// ─── Papéis das posições ─────────────────────────────────────────────────────

type Role =
  | 'answer' | 'past' | 'present' | 'future' | 'you' | 'other' | 'bond' | 'advice' | 'obstacle' | 'potential'
  | 'base' | 'goal' | 'near' | 'environment' | 'hopes' | 'outcome' | 'situation' | 'development' | 'weighs' | 'helps' | 'goes' | 'path';

const ROLES: Record<Exclude<SpreadKey, 'len9'>, Role[]> = {
  yesno: ['answer'],
  three: ['past', 'present', 'future'],
  love: ['you', 'other', 'bond', 'advice'],
  work: ['present', 'obstacle', 'potential', 'advice'],
  celtic: ['present', 'obstacle', 'base', 'past', 'goal', 'near', 'you', 'environment', 'hopes', 'outcome'],
  len3: ['situation', 'development', 'outcome'],
  rune1: ['advice'],
  rune3: ['past', 'present', 'path'],
  ask: ['weighs', 'helps', 'goes'],
};

/** Peso de cada papel na resposta final: o que vem pela frente conta mais. */
const ROLE_WEIGHT: Record<Role, number> = {
  answer: 3, future: 2, outcome: 2, goes: 2, path: 2, near: 1.5, potential: 1.5, advice: 1, helps: 1, present: 1, bond: 1.5,
  situation: 1, development: 1, goal: 1, you: 0.5, other: 1, environment: 0.5, hopes: 0.5, past: 0.3, base: 0.3, obstacle: 0.3, weighs: 0.3,
};

// {c} = carta no meio da frase, {C} = no começo, {m} = significado.
const ROLE_LINES: Tri<Record<Role, string[]>> = {
  pt: {
    answer: ['A carta que veio responder foi {c}. {M}'],
    past: ['Olhando para trás, saiu {c}: {m} É daí que essa história vem, e ainda ecoa em você.', 'A raiz de tudo isso é {c}: {m} Isso ficou para trás, mas ajudou a te trazer até aqui.'],
    present: ['Agora, no seu momento, quem fala é {c}: {m}', 'O retrato de hoje é {c}: {m} É assim que as coisas estão, sem enfeite.'],
    future: ['Para frente, a tendência vem com {c}: {m}', 'O que vem por aí é {c}: {m} Se você mantiver o rumo, é para lá que isso caminha.'],
    you: ['Sobre você nessa história, saiu {c}: {m} É assim que você está chegando nessa relação.'],
    other: ['A outra pessoa aparece como {c}: {m} Tente olhar com os olhos dela por um instante.'],
    bond: ['E a relação de vocês, hoje, é {c}: {m}'],
    advice: ['O conselho vem com {c}: {m} Guarde isso com carinho.', 'E o que fazer? {C} responde: {m}'],
    obstacle: ['O que atravessa o seu caminho é {c}: {m} Não é para te parar, é para você ficar atento.', 'O desafio aqui tem nome: {c}. {M}'],
    potential: ['O que pode florescer aparece como {c}: {m} Isso já existe em você, só precisa de espaço.'],
    base: ['Lá no fundo, sustentando tudo, está {c}: {m}'],
    goal: ['O que você busca, mesmo sem dizer, é {c}: {m}'],
    near: ['Para as próximas semanas, chega {c}: {m}'],
    environment: ['As pessoas e o ambiente ao seu redor aparecem como {c}: {m}'],
    hopes: ['Entre o que você espera e o que você teme, surge {c}: {m} Às vezes o medo e o desejo são a mesma coisa vista de lados diferentes.'],
    outcome: ['E o desfecho, se nada mudar, é {c}: {m}'],
    situation: ['A situação, como ela está, veio com {c}: {m}'],
    development: ['No meio do caminho, aparece {c}: {m}'],
    weighs: ['O que está pesando agora é {c}: {m} Não precisa fingir que não sente isso.'],
    helps: ['O que te ajuda é {c}: {m} É essa a ferramenta que você tem na mão.'],
    goes: ['E para onde isso vai? Saiu {c}: {m}'],
    path: ['O caminho que se abre vem com {c}: {m}'],
  },
  en: {
    answer: ['The card that came to answer was {c}. {M}'],
    past: ['Looking back, {c} came up: {m} That’s where this story comes from, and it still echoes in you.', 'The root of all this is {c}: {m} It’s behind you now, but it helped bring you here.'],
    present: ['Right now, in your moment, {c} is speaking: {m}', 'Today’s picture is {c}: {m} That’s how things are, plain and simple.'],
    future: ['Looking ahead, the trend comes with {c}: {m}', 'What’s coming is {c}: {m} If you keep your course, that’s where this goes.'],
    you: ['About you in this story, {c} came up: {m} That’s how you’re showing up in this relationship.'],
    other: ['The other person shows up as {c}: {m} Try to look through their eyes for a moment.'],
    bond: ['And your relationship, today, is {c}: {m}'],
    advice: ['The advice comes with {c}: {m} Hold on to that.', 'So what should you do? {C} answers: {m}'],
    obstacle: ['What’s crossing your path is {c}: {m} It’s not there to stop you, just to keep you alert.', 'The challenge here has a name: {c}. {M}'],
    potential: ['What can bloom shows up as {c}: {m} It already exists in you; it just needs room.'],
    base: ['Deep down, holding everything up, is {c}: {m}'],
    goal: ['What you’re really after, even unsaid, is {c}: {m}'],
    near: ['For the coming weeks, {c} arrives: {m}'],
    environment: ['The people and the environment around you show up as {c}: {m}'],
    hopes: ['Between what you hope for and what you fear, {c} appears: {m} Sometimes fear and desire are the same thing seen from different sides.'],
    outcome: ['And the outcome, if nothing changes, is {c}: {m}'],
    situation: ['The situation, as it stands, came with {c}: {m}'],
    development: ['Halfway along, {c} appears: {m}'],
    weighs: ['What’s weighing on you now is {c}: {m} You don’t have to pretend you don’t feel it.'],
    helps: ['What helps you is {c}: {m} That’s the tool in your hands.'],
    goes: ['And where is this going? {C} came up: {m}'],
    path: ['The path opening up comes with {c}: {m}'],
  },
  es: {
    answer: ['La carta que vino a responder fue {c}. {M}'],
    past: ['Mirando atrás, salió {c}: {m} De ahí viene esta historia, y todavía resuena en ti.', 'La raíz de todo esto es {c}: {m} Quedó atrás, pero te ayudó a llegar hasta aquí.'],
    present: ['Ahora, en tu momento, quien habla es {c}: {m}', 'El retrato de hoy es {c}: {m} Así están las cosas, sin adornos.'],
    future: ['Hacia adelante, la tendencia viene con {c}: {m}', 'Lo que viene es {c}: {m} Si mantienes el rumbo, hacia allí va esto.'],
    you: ['Sobre ti en esta historia, salió {c}: {m} Así estás llegando a esta relación.'],
    other: ['La otra persona aparece como {c}: {m} Intenta mirar con sus ojos por un instante.'],
    bond: ['Y la relación de ustedes, hoy, es {c}: {m}'],
    advice: ['El consejo viene con {c}: {m} Guárdalo con cariño.', '¿Y qué hacer? {C} responde: {m}'],
    obstacle: ['Lo que se cruza en tu camino es {c}: {m} No está para frenarte, sino para que estés atento.', 'El desafío aquí tiene nombre: {c}. {M}'],
    potential: ['Lo que puede florecer aparece como {c}: {m} Ya existe en ti, solo necesita espacio.'],
    base: ['En el fondo, sosteniendo todo, está {c}: {m}'],
    goal: ['Lo que buscas, aunque no lo digas, es {c}: {m}'],
    near: ['Para las próximas semanas, llega {c}: {m}'],
    environment: ['Las personas y el ambiente a tu alrededor aparecen como {c}: {m}'],
    hopes: ['Entre lo que esperas y lo que temes, surge {c}: {m} A veces el miedo y el deseo son lo mismo visto desde lados distintos.'],
    outcome: ['Y el desenlace, si nada cambia, es {c}: {m}'],
    situation: ['La situación, tal como está, vino con {c}: {m}'],
    development: ['A mitad de camino, aparece {c}: {m}'],
    weighs: ['Lo que te pesa ahora es {c}: {m} No hace falta fingir que no lo sientes.'],
    helps: ['Lo que te ayuda es {c}: {m} Esa es la herramienta que tienes en la mano.'],
    goes: ['¿Y hacia dónde va esto? Salió {c}: {m}'],
    path: ['El camino que se abre viene con {c}: {m}'],
  },
};

// ─── Textos de abertura, padrões e resposta ──────────────────────────────────

const end = (q: string) => (/[?!.…]$/.test(q) ? '' : '.');
const OPEN_WITH_Q: Tri<(name: string, q: string) => string> = {
  pt: (n, q) => `${n}, você me perguntou: “${q}”${end(q)}`,
  en: (n, q) => `${n}, you asked me: “${q}”${end(q)}`,
  es: (n, q) => `${n}, me preguntaste: “${q}”${end(q)}`,
};

const OPEN_NO_Q: Tri<(name: string) => string> = {
  pt: (n) => `${n}, você não escreveu uma pergunta, então as cartas falaram do seu momento como um todo. Leia como um retrato de agora.`,
  en: (n) => `${n}, you didn’t write a question, so the cards spoke about your moment as a whole. Read this as a snapshot of right now.`,
  es: (n) => `${n}, no escribiste una pregunta, así que las cartas hablaron de tu momento en general. Léelo como un retrato de ahora.`,
};

const TOPIC_INTRO: Tri<Record<Topic, string>> = {
  pt: {
    love: 'É assunto do coração, então vou ler com cuidado.',
    work: 'É uma questão de trabalho, e as cartas foram bem diretas.',
    money: 'Dinheiro é tema concreto, e as cartas responderam no mesmo tom.',
    health: 'Antes de tudo: sobre saúde, as cartas mostram o lado emocional e de energia, e não substituem um médico.',
    family: 'Família mexe com raízes, e as cartas falaram disso.',
    study: 'Estudo pede foco, e as cartas mostraram onde ele está.',
    travel: 'Mudança e viagem pedem coragem, e as cartas viram isso.',
    friends: 'Amizade é espelho, e as cartas mostraram o reflexo.',
    spirit: 'É uma pergunta da alma, e as cartas responderam nesse nível.',
    general: 'Vamos ver juntos o que saiu.',
  },
  en: {
    love: 'It’s a matter of the heart, so I’ll read it with care.',
    work: 'It’s a work question, and the cards were quite direct.',
    money: 'Money is a concrete subject, and the cards answered in the same tone.',
    health: 'First of all: about health, the cards show the emotional and energetic side, and they don’t replace a doctor.',
    family: 'Family touches our roots, and the cards spoke about that.',
    study: 'Studying takes focus, and the cards showed where yours is.',
    travel: 'Moving and travel take courage, and the cards saw that.',
    friends: 'Friendship is a mirror, and the cards showed the reflection.',
    spirit: 'It’s a question of the soul, and the cards answered on that level.',
    general: 'Let’s look together at what came up.',
  },
  es: {
    love: 'Es un asunto del corazón, así que lo voy a leer con cuidado.',
    work: 'Es una cuestión de trabajo, y las cartas fueron muy directas.',
    money: 'El dinero es un tema concreto, y las cartas respondieron en el mismo tono.',
    health: 'Antes que nada: sobre salud, las cartas muestran el lado emocional y energético, y no reemplazan a un médico.',
    family: 'La familia toca nuestras raíces, y las cartas hablaron de eso.',
    study: 'Estudiar pide enfoque, y las cartas mostraron dónde está el tuyo.',
    travel: 'Mudarse y viajar piden coraje, y las cartas lo vieron.',
    friends: 'La amistad es un espejo, y las cartas mostraron el reflejo.',
    spirit: 'Es una pregunta del alma, y las cartas respondieron en ese nivel.',
    general: 'Veamos juntos lo que salió.',
  },
};

const SUIT_PATTERN: Tri<Record<Suit, (n: number) => string>> = {
  pt: {
    cups: (n) => `Repare que vieram ${n} cartas de Copas: essa questão é, antes de tudo, emocional.`,
    wands: (n) => `Vieram ${n} cartas de Paus: tem muita energia de ação aqui, e o momento pede movimento.`,
    swords: (n) => `Vieram ${n} cartas de Espadas: sua cabeça está trabalhando muito. Cuidado para não sofrer por antecipação.`,
    pentacles: (n) => `Vieram ${n} cartas de Ouros: o lado prático (dinheiro, rotina, corpo) está no centro disso.`,
  },
  en: {
    cups: (n) => `Notice that ${n} Cups came up: this is, above all, an emotional matter.`,
    wands: (n) => `${n} Wands came up: there’s a lot of action energy here, and the moment asks for movement.`,
    swords: (n) => `${n} Swords came up: your mind is working overtime. Be careful not to suffer in advance.`,
    pentacles: (n) => `${n} Pentacles came up: the practical side (money, routine, body) is at the center of this.`,
  },
  es: {
    cups: (n) => `Fíjate que salieron ${n} cartas de Copas: esta cuestión es, antes que nada, emocional.`,
    wands: (n) => `Salieron ${n} cartas de Bastos: hay mucha energía de acción aquí, y el momento pide movimiento.`,
    swords: (n) => `Salieron ${n} cartas de Espadas: tu cabeza está trabajando mucho. Cuidado con sufrir por adelantado.`,
    pentacles: (n) => `Salieron ${n} cartas de Oros: el lado práctico (dinero, rutina, cuerpo) está en el centro de esto.`,
  },
};

const MAJORS_PATTERN: Tri<(n: number) => string> = {
  pt: (n) => `Saíram ${n} Arcanos Maiores: não é coisa pequena, é um capítulo importante da sua vida.`,
  en: (n) => `${n} Major Arcana came up: this isn’t a small thing, it’s an important chapter of your life.`,
  es: (n) => `Salieron ${n} Arcanos Mayores: no es algo pequeño, es un capítulo importante de tu vida.`,
};

const REVERSED_PATTERN: Tri<string> = {
  pt: 'Várias cartas saíram invertidas: tem energia travada. Antes de agir lá fora, vale olhar para dentro.',
  en: 'Several cards came up reversed: there’s blocked energy. Before acting outside, it’s worth looking inside.',
  es: 'Varias cartas salieron invertidas: hay energía trabada. Antes de actuar afuera, conviene mirar hacia adentro.',
};

const ANSWER: Tri<Record<Verdict, string>> = {
  pt: {
    yes: 'Respondendo direto: eu diria que sim. As cartas abrem caminho, mas esse sim depende de você agir, não só esperar.',
    maybe: 'Respondendo direto: ainda não é um sim fechado. Existe chance real, mas tem algo para ajustar antes, e esse ajuste está nas suas mãos.',
    no: 'Respondendo direto: do jeito que as coisas estão, as cartas dizem não, ou pelo menos não agora. Não é castigo: é um aviso para mudar a rota antes de insistir.',
  },
  en: {
    yes: 'Answering directly: I’d say yes. The cards open the way, but this yes depends on you acting, not just waiting.',
    maybe: 'Answering directly: it’s not a firm yes yet. There’s a real chance, but something needs adjusting first, and that’s in your hands.',
    no: 'Answering directly: the way things are now, the cards say no, or at least not now. It’s not a punishment: it’s a sign to change course before insisting.',
  },
  es: {
    yes: 'Respondiendo directo: yo diría que sí. Las cartas abren camino, pero ese sí depende de que actúes, no solo de esperar.',
    maybe: 'Respondiendo directo: todavía no es un sí cerrado. Hay una posibilidad real, pero algo necesita ajustarse antes, y eso está en tus manos.',
    no: 'Respondiendo directo: tal como están las cosas, las cartas dicen que no, o al menos no ahora. No es un castigo: es un aviso para cambiar el rumbo antes de insistir.',
  },
};

const SUMMARY: Tri<Record<Verdict, string>> = {
  pt: {
    yes: 'Juntando tudo: o momento está a seu favor. Aproveite essa energia boa e dê o próximo passo.',
    maybe: 'Juntando tudo: é uma fase de ajuste. Tem coisa boa vindo, mas ela pede atenção e paciência.',
    no: 'Juntando tudo: é hora de cuidar de você e rever o caminho antes de seguir.',
  },
  en: {
    yes: 'Putting it all together: the moment is on your side. Use this good energy and take the next step.',
    maybe: 'Putting it all together: it’s a phase of adjustment. Good things are coming, but they ask for attention and patience.',
    no: 'Putting it all together: it’s time to take care of yourself and rethink the path before moving on.',
  },
  es: {
    yes: 'Juntando todo: el momento está a tu favor. Aprovecha esta buena energía y da el siguiente paso.',
    maybe: 'Juntando todo: es una etapa de ajuste. Viene algo bueno, pero pide atención y paciencia.',
    no: 'Juntando todo: es momento de cuidarte y revisar el camino antes de seguir.',
  },
};

const CHOICE: Tri<Record<Verdict, string>> = {
  pt: {
    yes: 'Entre as opções que você colocou, as cartas favorecem a que te leva para frente, mesmo que ela dê um pouco de medo.',
    maybe: 'Entre as opções que você colocou, nenhuma é errada. Escolha a que você consegue sustentar com calma, não a que parece mais bonita.',
    no: 'Entre as opções que você colocou, as cartas pedem para não decidir no impulso. Espere mais um pouco e observe.',
  },
  en: {
    yes: 'Between the options you laid out, the cards favor the one that moves you forward, even if it scares you a little.',
    maybe: 'Between the options you laid out, none is wrong. Choose the one you can sustain calmly, not the one that looks prettier.',
    no: 'Between the options you laid out, the cards ask you not to decide on impulse. Wait a little longer and observe.',
  },
  es: {
    yes: 'Entre las opciones que planteaste, las cartas favorecen la que te lleva hacia adelante, aunque te dé un poco de miedo.',
    maybe: 'Entre las opciones que planteaste, ninguna es incorrecta. Elige la que puedas sostener con calma, no la que parece más bonita.',
    no: 'Entre las opciones que planteaste, las cartas piden no decidir por impulso. Espera un poco más y observa.',
  },
};

const TIMING_SUIT: Tri<Record<Suit | 'major', string>> = {
  pt: {
    wands: 'Sobre o tempo: isso tende a andar rápido, em questão de dias ou poucas semanas.',
    swords: 'Sobre o tempo: deve se definir em algumas semanas, logo depois de uma conversa ou decisão importante.',
    cups: 'Sobre o tempo: vai no tempo do coração. Pense em alguns meses, sem pressa.',
    pentacles: 'Sobre o tempo: é coisa de construção. Leva meses e vem aos poucos, mas vem sólido.',
    major: 'Sobre o tempo: não depende só do calendário. Acontece quando você fizer a virada interna que essa carta pede.',
  },
  en: {
    wands: 'About timing: this tends to move fast, within days or a few weeks.',
    swords: 'About timing: it should be settled within a few weeks, right after an important conversation or decision.',
    cups: 'About timing: it moves at the heart’s pace. Think a few months, no rush.',
    pentacles: 'About timing: this is something being built. It takes months and comes little by little, but it comes solid.',
    major: 'About timing: it doesn’t depend only on the calendar. It happens when you make the inner shift this card asks for.',
  },
  es: {
    wands: 'Sobre el tiempo: esto tiende a avanzar rápido, en cuestión de días o pocas semanas.',
    swords: 'Sobre el tiempo: debería definirse en algunas semanas, justo después de una conversación o decisión importante.',
    cups: 'Sobre el tiempo: va al ritmo del corazón. Piensa en algunos meses, sin prisa.',
    pentacles: 'Sobre el tiempo: es algo que se construye. Lleva meses y llega poco a poco, pero llega sólido.',
    major: 'Sobre el tiempo: no depende solo del calendario. Sucede cuando hagas el giro interno que esta carta pide.',
  },
};

const TIMING_VERDICT: Tri<Record<Verdict, string>> = {
  pt: {
    yes: 'Sobre o tempo: parece mais perto do que você imagina.',
    maybe: 'Sobre o tempo: não é imediato. Dê tempo ao tempo e siga fazendo a sua parte.',
    no: 'Sobre o tempo: ainda vai demorar um pouco, e talvez seja melhor assim.',
  },
  en: {
    yes: 'About timing: it seems closer than you think.',
    maybe: 'About timing: it’s not immediate. Give it time and keep doing your part.',
    no: 'About timing: it will still take a while, and maybe that’s for the best.',
  },
  es: {
    yes: 'Sobre el tiempo: parece más cerca de lo que imaginas.',
    maybe: 'Sobre el tiempo: no es inmediato. Dale tiempo al tiempo y sigue haciendo tu parte.',
    no: 'Sobre el tiempo: todavía va a tardar un poco, y quizá sea mejor así.',
  },
};

const HOW: Tri<(c: string) => string> = {
  pt: (c) => `E o que fazer com isso? O conselho mais forte é o que veio com ${c}: comece por aí, com um passo pequeno e concreto ainda esta semana.`,
  en: (c) => `So what do you do with this? The strongest advice is the one that came with ${c}: start there, with a small, concrete step this very week.`,
  es: (c) => `¿Y qué hacer con esto? El consejo más fuerte es el que vino con ${c}: empieza por ahí, con un paso pequeño y concreto esta misma semana.`,
};

const WHY: Tri<(c: string) => string> = {
  pt: (c) => `E por que isso está acontecendo? A raiz aparece com ${c}. Olhar para isso com honestidade, sem se culpar, já muda muita coisa.`,
  en: (c) => `And why is this happening? The root shows up with ${c}. Looking at it honestly, without blaming yourself, already changes a lot.`,
  es: (c) => `¿Y por qué está pasando esto? La raíz aparece con ${c}. Mirarlo con honestidad, sin culparte, ya cambia mucho.`,
};

/** Frase que costura as cartas: de onde parte, com o que conta, para onde vai. */
const WEAVE: Tri<(a: string, h: string | null, e: string, ask: boolean) => string> = {
  pt: (a, h, e, ask) => (ask && h ? `Ou seja: mesmo com ${a} pesando, se você usar ${h} a seu favor, isso caminha para ${e}.` : h ? `Ou seja: isso começa com ${a}, conta com ${h} e caminha para ${e}.` : `Ou seja: isso começa com ${a} e caminha para ${e}.`),
  en: (a, h, e, ask) => (ask && h ? `In other words: even with ${a} weighing on you, if you use ${h} in your favor, this heads toward ${e}.` : h ? `In other words: this starts with ${a}, counts on ${h} and heads toward ${e}.` : `In other words: this starts with ${a} and heads toward ${e}.`),
  es: (a, h, e, ask) => (ask && h ? `Es decir: aunque ${a} pese, si usas ${h} a tu favor, esto camina hacia ${e}.` : h ? `Es decir: esto empieza con ${a}, cuenta con ${h} y camina hacia ${e}.` : `Es decir: esto empieza con ${a} y camina hacia ${e}.`),
};

const TOPIC_ADVICE: Tri<Record<Topic, Record<Verdict, string>>> = {
  pt: {
    love: { yes: 'No amor, seja verdadeiro sobre o que sente e deixe a outra pessoa te encontrar no meio do caminho.', maybe: 'No amor, uma conversa sincera vale mais que mil suposições.', no: 'No amor, não force: quem é para ficar não precisa ser convencido.' },
    work: { yes: 'No trabalho, mostre o que você sabe fazer: é hora de se posicionar.', maybe: 'No trabalho, organize o próximo passo e procure um aliado.', no: 'No trabalho, segure a ansiedade e se prepare melhor antes do movimento grande.' },
    money: { yes: 'Com dinheiro, é um bom momento para plantar, mas com planejamento.', maybe: 'Com dinheiro, revise as contas antes de qualquer decisão grande.', no: 'Com dinheiro, evite riscos agora e proteja o que você já tem.' },
    health: { yes: 'Na saúde, sua energia tende a melhorar. Mantenha os cuidados.', maybe: 'Na saúde, escute os sinais do corpo e não adie aquele cuidado.', no: 'Na saúde, procure orientação profissional e pegue leve com você.' },
    family: { yes: 'Na família, é hora de se aproximar e reconhecer quem está do seu lado.', maybe: 'Na família, coloque limites com carinho: nem tudo é responsabilidade sua.', no: 'Na família, não carregue o peso sozinho. Peça ajuda.' },
    study: { yes: 'Nos estudos, seu esforço tende a ser reconhecido. Mantenha o ritmo.', maybe: 'Nos estudos, troque quantidade por constância.', no: 'Nos estudos, reveja o método antes de duvidar da sua capacidade.' },
    travel: { yes: 'Sobre mudar ou viajar, as portas estão se abrindo. Planeje e vá.', maybe: 'Sobre mudar ou viajar, ainda falta acertar detalhes práticos.', no: 'Sobre mudar ou viajar, espere o momento certo: agora é tempo de preparo.' },
    friends: { yes: 'Nas amizades, invista em quem te faz bem.', maybe: 'Nas amizades, diga o que sente antes que vire mágoa.', no: 'Nas amizades, observe quem está presente de verdade.' },
    spirit: { yes: 'No caminho espiritual, confie na sua intuição: ela está afinada.', maybe: 'No caminho espiritual, silêncio e prática diária vão trazer a resposta.', no: 'No caminho espiritual, volte ao básico: descanso, presença e respiração.' },
    general: { yes: 'Siga com confiança, um passo de cada vez.', maybe: 'Vá com calma e ajuste o que precisar pelo caminho.', no: 'Recolha-se um pouco, cuide de você e só depois avance.' },
  },
  en: {
    love: { yes: 'In love, be honest about what you feel and let the other person meet you halfway.', maybe: 'In love, one sincere conversation is worth more than a thousand assumptions.', no: 'In love, don’t force it: whoever is meant to stay doesn’t need convincing.' },
    work: { yes: 'At work, show what you can do: it’s time to take a stand.', maybe: 'At work, plan the next step and find an ally.', no: 'At work, hold back the anxiety and prepare better before the big move.' },
    money: { yes: 'With money, it’s a good time to plant, but with a plan.', maybe: 'With money, review your accounts before any big decision.', no: 'With money, avoid risks now and protect what you already have.' },
    health: { yes: 'With health, your energy tends to improve. Keep taking care of yourself.', maybe: 'With health, listen to your body’s signals and don’t postpone that check-up.', no: 'With health, seek professional guidance and go easy on yourself.' },
    family: { yes: 'In the family, it’s time to come closer and recognize who’s by your side.', maybe: 'In the family, set boundaries with love: not everything is your responsibility.', no: 'In the family, don’t carry the weight alone. Ask for help.' },
    study: { yes: 'In your studies, your effort tends to be recognized. Keep the pace.', maybe: 'In your studies, trade quantity for consistency.', no: 'In your studies, review your method before doubting your ability.' },
    travel: { yes: 'About moving or traveling, doors are opening. Plan and go.', maybe: 'About moving or traveling, some practical details still need sorting.', no: 'About moving or traveling, wait for the right moment: now is time to prepare.' },
    friends: { yes: 'In friendships, invest in those who do you good.', maybe: 'In friendships, say what you feel before it turns into resentment.', no: 'In friendships, notice who is truly there.' },
    spirit: { yes: 'On your spiritual path, trust your intuition: it’s well tuned.', maybe: 'On your spiritual path, silence and daily practice will bring the answer.', no: 'On your spiritual path, go back to basics: rest, presence and breath.' },
    general: { yes: 'Move forward with confidence, one step at a time.', maybe: 'Go calmly and adjust what you need along the way.', no: 'Pull back a little, take care of yourself, and only then move forward.' },
  },
  es: {
    love: { yes: 'En el amor, sé sincero con lo que sientes y deja que la otra persona te encuentre a mitad de camino.', maybe: 'En el amor, una conversación sincera vale más que mil suposiciones.', no: 'En el amor, no fuerces: quien debe quedarse no necesita ser convencido.' },
    work: { yes: 'En el trabajo, muestra lo que sabes hacer: es momento de posicionarte.', maybe: 'En el trabajo, organiza el próximo paso y busca un aliado.', no: 'En el trabajo, frena la ansiedad y prepárate mejor antes del gran movimiento.' },
    money: { yes: 'Con el dinero, es buen momento para sembrar, pero con planificación.', maybe: 'Con el dinero, revisa las cuentas antes de cualquier decisión grande.', no: 'Con el dinero, evita riesgos ahora y protege lo que ya tienes.' },
    health: { yes: 'En la salud, tu energía tiende a mejorar. Mantén los cuidados.', maybe: 'En la salud, escucha las señales del cuerpo y no postergues ese cuidado.', no: 'En la salud, busca orientación profesional y sé amable contigo.' },
    family: { yes: 'En la familia, es momento de acercarte y reconocer a quien está a tu lado.', maybe: 'En la familia, pon límites con cariño: no todo es tu responsabilidad.', no: 'En la familia, no cargues el peso solo. Pide ayuda.' },
    study: { yes: 'En los estudios, tu esfuerzo tiende a ser reconocido. Mantén el ritmo.', maybe: 'En los estudios, cambia cantidad por constancia.', no: 'En los estudios, revisa el método antes de dudar de tu capacidad.' },
    travel: { yes: 'Sobre mudarte o viajar, las puertas se están abriendo. Planifica y ve.', maybe: 'Sobre mudarte o viajar, todavía faltan detalles prácticos.', no: 'Sobre mudarte o viajar, espera el momento justo: ahora es tiempo de prepararse.' },
    friends: { yes: 'En las amistades, invierte en quien te hace bien.', maybe: 'En las amistades, di lo que sientes antes de que se vuelva resentimiento.', no: 'En las amistades, observa quién está presente de verdad.' },
    spirit: { yes: 'En el camino espiritual, confía en tu intuición: está afinada.', maybe: 'En el camino espiritual, el silencio y la práctica diaria traerán la respuesta.', no: 'En el camino espiritual, vuelve a lo básico: descanso, presencia y respiración.' },
    general: { yes: 'Sigue con confianza, un paso a la vez.', maybe: 'Ve con calma y ajusta lo que haga falta en el camino.', no: 'Recógete un poco, cuídate y solo después avanza.' },
  },
};

const YEAR_LINE: Tri<(n: number, title: string) => string> = {
  pt: (n, t) => `E isso conversa com o seu momento: você está no Ano Pessoal ${n} (${lower(t)}).`,
  en: (n, t) => `And this speaks to your moment: you’re in Personal Year ${n} (${lower(t)}).`,
  es: (n, t) => `Y esto conversa con tu momento: estás en el Año Personal ${n} (${lower(t)}).`,
};

const CLOSING: Tri<string[]> = {
  pt: ['Leve isso como um conselho de amigo: as cartas mostram o caminho, mas quem anda é você.', 'Use isso como um espelho, não como sentença. A escolha continua sendo sua.'],
  en: ['Take this as a friend’s advice: the cards show the way, but you’re the one who walks it.', 'Use this as a mirror, not a sentence. The choice is still yours.'],
  es: ['Tómalo como un consejo de amigo: las cartas muestran el camino, pero quien camina eres tú.', 'Úsalo como un espejo, no como una sentencia. La elección sigue siendo tuya.'],
};

// ─── Montagem ────────────────────────────────────────────────────────────────

/** Escolha estável de variação: a mesma tiragem sempre gera o mesmo texto. */
function seedOf(parts: (string | number)[]) {
  let h = 7;
  for (const ch of parts.join('|')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}
const pick = <T,>(list: T[], seed: number) => list[seed % list.length];

function fill(tpl: string, c: CardView) {
  return tpl.replace('{c}', c.mid).replace('{C}', c.start).replace('{m}', lower(c.meaning)).replace('{M}', upper(c.meaning));
}

function verdictOf(score: number): Verdict {
  return score >= 0.4 ? 'yes' : score >= -0.25 ? 'maybe' : 'no';
}

export type ReadingInput = {
  deck: DeckKind;
  spread: SpreadKey;
  cards: Drawn[];
  question: string;
  lang: Lang;
  firstName: string;
  personalYear?: number | null;
};

/** Leitura completa em parágrafos. */
export function readSpread({ deck, spread, cards, question, lang, firstName, personalYear }: ReadingInput): string[] {
  const q = analyzeQuestion(question, lang);
  if (q.topic === 'general' && (spread === 'love' || spread === 'work')) q.topic = spread;
  const views = cards.map((c) => view(deck, c, lang));
  const seed = seedOf(cards.map((c) => `${c.id}${c.reversed ? 'r' : ''}`));
  const out: string[] = [];

  out.push(q.kind === 'none' ? OPEN_NO_Q[lang](firstName) : `${OPEN_WITH_Q[lang](firstName, q.text)} ${TOPIC_INTRO[lang][q.topic]}`);
  if (!firstName) out[0] = upper(out[0].replace(/^, /, ''));

  // Cartas, uma por parágrafo (no cigano de 9, o centro e depois as colunas).
  let roles: Role[];
  if (spread === 'len9') {
    roles = ['past', 'present', 'future', 'past', 'situation', 'future', 'past', 'present', 'future'];
    out.push(fill(ROLE_LINES[lang].present[0], views[4]));
    const cols: [Role, number[]][] = [['past', [0, 3, 6]], ['development', [1, 7]], ['future', [2, 5, 8]]];
    const head = { pt: { past: 'No que ficou para trás', development: 'Em volta do agora', future: 'No que vem' }, en: { past: 'In what’s behind you', development: 'Around the present', future: 'In what’s coming' }, es: { past: 'En lo que quedó atrás', development: 'Alrededor del ahora', future: 'En lo que viene' } }[lang] as Record<string, string>;
    for (const [role, idx] of cols) {
      const names = idx.map((i) => views[i].mid).join(', ');
      out.push(`${head[role]} (${names}): ${idx.map((i) => views[i].meaning).join(' ')}`);
    }
  } else {
    roles = ROLES[spread];
    views.forEach((v, i) => out.push(fill(pick(ROLE_LINES[lang][roles[i]], seed + i), v)));
  }

  // Padrões que uma pessoa notaria olhando a mesa.
  if (deck === 'tarot' && views.length >= 3) {
    const notes: string[] = [];
    const min = Math.max(2, Math.ceil(views.length / 3));
    const majors = views.filter((v) => v.major).length;
    if (majors >= min) notes.push(MAJORS_PATTERN[lang](majors));
    const counts = new Map<Suit, number>();
    views.forEach((v) => v.suit && counts.set(v.suit, (counts.get(v.suit) ?? 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= min) notes.push(SUIT_PATTERN[lang][top[0]](top[1]));
    if (views.filter((v) => v.reversed).length >= min) notes.push(REVERSED_PATTERN[lang]);
    if (notes.length) out.push(notes.join(' '));
  }

  // Resposta: média ponderada pelo peso de cada posição.
  let sum = 0;
  let weight = 0;
  views.forEach((v, i) => {
    const w = ROLE_WEIGHT[roles[i]];
    sum += v.polarity * w;
    weight += w;
  });
  const verdict = spread === 'yesno' ? verdictOf(views[0].polarity) : verdictOf(weight ? sum / weight : 0);
  const keyIndex = (list: Role[]) => {
    for (const r of list) {
      const i = roles.indexOf(r);
      if (i >= 0) return i;
    }
    return views.length - 1;
  };

  const answer: string[] = [];
  if (spread !== 'len9' && views.length >= 3) {
    const endI = keyIndex(['outcome', 'goes', 'path', 'future', 'potential']);
    const helpI = keyIndex(['advice', 'helps', 'potential', 'present', 'bond', 'development']);
    answer.push(WEAVE[lang](views[0].mid, helpI !== endI && helpI !== 0 ? views[helpI].mid : null, views[endI].mid, spread === 'ask'));
  }
  if (q.kind === 'yesno' || (spread === 'yesno' && q.kind === 'none')) answer.push(ANSWER[lang][verdict]);
  else if (q.kind === 'when') {
    const k = views[keyIndex(['near', 'future', 'outcome', 'goes', 'path', 'answer', 'development'])];
    answer.push(deck === 'tarot' ? TIMING_SUIT[lang][k.suit ?? 'major'] : TIMING_VERDICT[lang][verdict]);
  } else if (q.kind === 'how') {
    answer.push(HOW[lang](views[keyIndex(['advice', 'helps', 'potential', 'path', 'answer', 'future'])].mid));
  } else if (q.kind === 'why') {
    answer.push(WHY[lang](views[keyIndex(['weighs', 'obstacle', 'base', 'past', 'situation'])].mid));
  } else if (q.kind === 'choice') answer.push(CHOICE[lang][verdict]);
  else answer.push(SUMMARY[lang][verdict]);
  answer.push(TOPIC_ADVICE[lang][q.topic][verdict]);
  out.push(answer.join(' '));

  const tail: string[] = [];
  const year = personalYear ? PERSONAL_YEAR[personalYear]?.[lang] : null;
  if (year && personalYear) tail.push(YEAR_LINE[lang](personalYear, year.title));
  tail.push(pick(CLOSING[lang], seed));
  out.push(tail.join(' '));
  return out;
}

/** Leitura do I Ching (hexagrama e, se houver linhas mutáveis, o hexagrama em que ele se transforma). */
export function readIChingText({ hexagram, transformed, changing, question, lang, firstName, personalYear }: {
  hexagram: number; transformed: number | null; changing: number[]; question: string; lang: Lang; firstName: string; personalYear?: number | null;
}): string[] {
  const q = analyzeQuestion(question, lang);
  const h = ICHING[hexagram - 1];
  const out: string[] = [];
  out.push(q.kind === 'none'
    ? { pt: `${firstName}, você jogou as moedas sem uma pergunta, então o I Ching falou do seu momento como um todo.`, en: `${firstName}, you tossed the coins without a question, so the I Ching spoke about your moment as a whole.`, es: `${firstName}, lanzaste las monedas sin una pregunta, así que el I Ching habló de tu momento en general.` }[lang]
    : `${OPEN_WITH_Q[lang](firstName, q.text)} ${TOPIC_INTRO[lang][q.topic]}`);
  if (!firstName) out[0] = upper(out[0].replace(/^, /, ''));
  out.push({
    pt: `O hexagrama que se formou foi o ${hexagram}, ${h.name.pt}. A mensagem dele é: ${lower(h.judgement.pt)}`,
    en: `The hexagram that formed was number ${hexagram}, ${h.name.en}. Its message is: ${lower(h.judgement.en)}`,
    es: `El hexagrama que se formó fue el ${hexagram}, ${h.name.es}. Su mensaje es: ${lower(h.judgement.es)}`,
  }[lang]);
  if (transformed && changing.length) {
    const t = ICHING[transformed - 1];
    out.push({
      pt: `Como saíram linhas mutáveis, a situação não está parada: ela está se transformando no hexagrama ${transformed}, ${t.name.pt}. Ou seja, o caminho leva para isto: ${lower(t.judgement.pt)}`,
      en: `Since there were changing lines, the situation isn’t standing still: it’s turning into hexagram ${transformed}, ${t.name.en}. In other words, the path leads here: ${lower(t.judgement.en)}`,
      es: `Como salieron líneas mutables, la situación no está quieta: se está transformando en el hexagrama ${transformed}, ${t.name.es}. Es decir, el camino lleva a esto: ${lower(t.judgement.es)}`,
    }[lang]);
  } else {
    out.push({
      pt: 'Não saíram linhas mutáveis: a situação está estável, e o conselho vale por inteiro, do jeito que está.',
      en: 'There were no changing lines: the situation is stable, and the advice applies fully, as it is.',
      es: 'No salieron líneas mutables: la situación está estable, y el consejo vale por completo, tal como está.',
    }[lang]);
  }
  const pol = (n: number) => ICHING_POLARITY[n - 1] ?? 0;
  const verdict = verdictOf(transformed ? (pol(hexagram) + 2 * pol(transformed)) / 3 : pol(hexagram));
  const answer: string[] = [];
  if (q.kind === 'yesno') answer.push(ANSWER[lang][verdict]);
  else if (q.kind === 'when') answer.push(TIMING_VERDICT[lang][verdict]);
  else if (q.kind === 'choice') answer.push(CHOICE[lang][verdict]);
  else answer.push(SUMMARY[lang][verdict]);
  answer.push(TOPIC_ADVICE[lang][q.topic][verdict]);
  out.push(answer.join(' '));
  const year = personalYear ? PERSONAL_YEAR[personalYear]?.[lang] : null;
  out.push([year && personalYear ? YEAR_LINE[lang](personalYear, year.title) : '', pick(CLOSING[lang], hexagram)].filter(Boolean).join(' '));
  return out;
}
