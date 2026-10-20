/**
 * Síntese Transcendental offline: combina os textos de cada técnica a partir dos resultados calculados.
 * A versão com IA (backend) usa os mesmos dados estruturados e substitui estes parágrafos.
 */
import { dominant, pointOf } from '@/engines/astro/chart';
import { currentIndex, ageOn, reduce } from '@/engines/numerology';
import type { Reading } from '@/engines/reading';
import { convergences, type Convergence } from '@/engines/traits';
import { SIGN_STYLE, SIGNS_TEXT } from './astrology';
import { ANIMALS_TEXT } from './chinese';
import { HD_AUTHORITIES, HD_TYPES } from './humanDesign';
import { TRAITS_TEXT } from './misc';
import { KARMIC_LESSON_TEXT, NUMBERS, PERSONAL_YEAR } from './numbers';
import { MAJOR_ARCANA } from './tarot-major';
import type { Lang } from './types';

export const SYNTHESIS_SECTIONS = ['who', 'gifts', 'challenges', 'love', 'work', 'now'] as const;
export type SynthesisSection = (typeof SYNTHESIS_SECTIONS)[number];
export type Synthesis = { sections: Record<SynthesisSection, string>; convergences: Convergence[]; source: 'local' | 'ai'; personalYear: number; createdAt: string };

const num = (n: number) => NUMBERS[n] ?? NUMBERS[reduce(n, false)];

/** Junta frases de traços: "liderança, comunicação e cuidado". */
export function joinList(items: string[], lang: Lang) {
  const and = lang === 'en' ? 'and' : lang === 'es' ? 'y' : 'e';
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;
}

export function localSynthesis(r: Reading, lang: Lang, firstName: string): Synthesis {
  const conv = convergences(r);
  const top = conv.slice(0, 3);
  const n = r.numerology;
  const destiny = num(n.destiny)[lang];
  const expression = num(n.expression)[lang];
  const soul = num(n.soul)[lang];
  const mission = num(n.mission)[lang];
  const arcana = MAJOR_ARCANA[r.arcana][lang];
  const yearArcana = MAJOR_ARCANA[r.yearArcana][lang];
  const sun = pointOf(r.chart, 'sun')!;
  const moon = pointOf(r.chart, 'moon')!;
  const venus = pointOf(r.chart, 'venus')!;
  const mc = pointOf(r.chart, 'mc');
  const sunText = SIGNS_TEXT[sun.sign][lang];
  const moonText = SIGNS_TEXT[moon.sign][lang];
  const animal = ANIMALS_TEXT[r.chinese.animal][lang];
  const labels = top.map((c) => TRAITS_TEXT[c.trait][lang].label);
  const hdType = r.humanDesign ? HD_TYPES[r.humanDesign.type][lang] : null;


  const py = r.personal.year;
  const age = ageOn(r.person.birthDate);
  const pinnacle = n.pinnacles[currentIndex(n.pinnacles, age)];
  const pin = num(pinnacle.number)[lang];
  const pyText = PERSONAL_YEAR[py][lang];
  const authority = r.humanDesign ? HD_AUTHORITIES[r.humanDesign.authority][lang] : null;
  const el = dominant(r.chart.elements);

  const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
  const T: Record<Lang, Record<SynthesisSection, string>> = {
    pt: {
      who: `${firstName}, ${lower(destiny.summary)} Com Destino ${n.destiny} (${destiny.title}), Sol em ${sunText.name} e o arcano ${arcana.name}, sua essência combina ${joinList(labels, lang)}. ${sunText.sun}`,
      gifts: `${top.map((c) => TRAITS_TEXT[c.trait][lang].gift).join(' ')} Pela numerologia, seus talentos naturais são: ${lower(expression.gifts)}`,
      challenges: `${top.slice(0, 2).map((c) => TRAITS_TEXT[c.trait][lang].shadow).join(' ')} ${destiny.challenges}${n.karmicLessons.length ? ` Lição a desenvolver: ${lower(KARMIC_LESSON_TEXT[n.karmicLessons[0]][lang])}` : ''}`,
      love: `${soul.love} Com Vênus em ${SIGNS_TEXT[venus.sign][lang].name}, você ama ${SIGN_STYLE[venus.sign][lang]}. ${moonText.moon}`,
      work: `${mission.work}${mc ? ` Seu Meio do Céu em ${SIGNS_TEXT[mc.sign][lang].name} aponta uma vocação vivida ${SIGN_STYLE[mc.sign][lang]}.` : ''}${hdType ? ` Como ${hdType.name}, sua estratégia é: ${hdType.strategy.toLowerCase()}.` : ''}${authority ? ` Para decidir, use sua autoridade ${authority.name}: ${lower(authority.text)}` : ''}`,
      now: `${pyText.title} (Ano Pessoal ${py}): ${lower(pyText.text)} O arcano do ano é ${yearArcana.name}: ${lower(yearArcana.summary)} Você atravessa um pináculo ${pinnacle.number} (${pin.title}), e o elemento ${el === 'fire' ? 'fogo' : el === 'earth' ? 'terra' : el === 'air' ? 'ar' : 'água'} predomina no seu mapa. No zodíaco chinês, o ${animal.name} lembra: ${lower(animal.summary)}`,
    },
    en: {
      who: `${firstName}, ${lower(destiny.summary)} With Destiny ${n.destiny} (${destiny.title}), Sun in ${sunText.name} and the ${arcana.name} as your arcana, your essence blends ${joinList(labels, lang)}. ${sunText.sun}`,
      gifts: `${top.map((c) => TRAITS_TEXT[c.trait][lang].gift).join(' ')} Through numerology, your natural talents are: ${lower(expression.gifts)}`,
      challenges: `${top.slice(0, 2).map((c) => TRAITS_TEXT[c.trait][lang].shadow).join(' ')} ${destiny.challenges}${n.karmicLessons.length ? ` A lesson to develop: ${lower(KARMIC_LESSON_TEXT[n.karmicLessons[0]][lang])}` : ''}`,
      love: `${soul.love} With Venus in ${SIGNS_TEXT[venus.sign][lang].name}, you love ${SIGN_STYLE[venus.sign][lang]}. ${moonText.moon}`,
      work: `${mission.work}${mc ? ` Your Midheaven in ${SIGNS_TEXT[mc.sign][lang].name} points to a calling lived ${SIGN_STYLE[mc.sign][lang]}.` : ''}${hdType ? ` As a ${hdType.name}, your strategy is: ${hdType.strategy.toLowerCase()}.` : ''}${authority ? ` To decide, use your ${authority.name} authority: ${lower(authority.text)}` : ''}`,
      now: `${pyText.title} (Personal Year ${py}): ${lower(pyText.text)} Your arcana of the year is ${yearArcana.name}: ${lower(yearArcana.summary)} You are in a pinnacle ${pinnacle.number} (${pin.title}), and ${el} dominates your chart. In the Chinese zodiac, the ${animal.name} reminds you: ${lower(animal.summary)}`,
    },
    es: {
      who: `${firstName}, ${lower(destiny.summary)} Con Destino ${n.destiny} (${destiny.title}), Sol en ${sunText.name} y el arcano ${arcana.name}, tu esencia combina ${joinList(labels, lang)}. ${sunText.sun}`,
      gifts: `${top.map((c) => TRAITS_TEXT[c.trait][lang].gift).join(' ')} Por la numerología, tus talentos naturales son: ${lower(expression.gifts)}`,
      challenges: `${top.slice(0, 2).map((c) => TRAITS_TEXT[c.trait][lang].shadow).join(' ')} ${destiny.challenges}${n.karmicLessons.length ? ` Lección a desarrollar: ${lower(KARMIC_LESSON_TEXT[n.karmicLessons[0]][lang])}` : ''}`,
      love: `${soul.love} Con Venus en ${SIGNS_TEXT[venus.sign][lang].name}, amas ${SIGN_STYLE[venus.sign][lang]}. ${moonText.moon}`,
      work: `${mission.work}${mc ? ` Tu Medio Cielo en ${SIGNS_TEXT[mc.sign][lang].name} apunta a una vocación vivida ${SIGN_STYLE[mc.sign][lang]}.` : ''}${hdType ? ` Como ${hdType.name}, tu estrategia es: ${hdType.strategy.toLowerCase()}.` : ''}${authority ? ` Para decidir, usa tu autoridad ${authority.name}: ${lower(authority.text)}` : ''}`,
      now: `${pyText.title} (Año Personal ${py}): ${lower(pyText.text)} Tu arcano del año es ${yearArcana.name}: ${lower(yearArcana.summary)} Atraviesas un pináculo ${pinnacle.number} (${pin.title}), y el elemento ${el === 'fire' ? 'fuego' : el === 'earth' ? 'tierra' : el === 'air' ? 'aire' : 'agua'} predomina en tu carta. En el zodíaco chino, el ${animal.name} recuerda: ${lower(animal.summary)}`,
    },
  };

  return { sections: T[lang], convergences: conv, source: 'local', personalYear: py, createdAt: new Date().toISOString() };
}
