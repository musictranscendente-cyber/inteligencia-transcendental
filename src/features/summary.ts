/** Resumo estruturado de uma leitura para a IA (sem data, hora ou local de nascimento). */
import { pointOf } from '@/engines/astro/chart';
import type { Reading } from '@/engines/reading';
import { convergences } from '@/engines/traits';

export function readingSummary(r: Reading) {
  const sign = (k: Parameters<typeof pointOf>[1]) => pointOf(r.chart, k)?.sign ?? null;
  return {
    numerology: {
      destiny: r.numerology.destiny,
      expression: r.numerology.expression,
      soul: r.numerology.soul,
      personality: r.numerology.personality,
      mission: r.numerology.mission,
      karmicDebts: r.numerology.karmicDebts,
      karmicLessons: r.numerology.karmicLessons,
      personalYear: r.personal.year,
    },
    tarot: { birthArcana: r.arcana, yearArcana: r.yearArcana },
    astrology: {
      sun: sign('sun'), moon: sign('moon'), ascendant: sign('asc'), midheaven: sign('mc'),
      venus: sign('venus'), mars: sign('mars'), mercury: sign('mercury'), jupiter: sign('jupiter'), saturn: sign('saturn'),
      elements: r.chart.elements, modalities: r.chart.modalities,
      mainAspects: r.chart.aspects.slice(0, 8).map((a) => `${a.a} ${a.type} ${a.b}`),
      timeKnown: r.chart.timeKnown,
    },
    humanDesign: r.humanDesign
      ? { type: r.humanDesign.type, authority: r.humanDesign.authority, profile: r.humanDesign.profile.join('/'), definedCenters: r.humanDesign.defined, channels: r.humanDesign.channels.map((c) => c.join('-')) }
      : null,
    chinese: { animal: r.chinese.animal, element: r.chinese.element, yang: r.chinese.yang, dayMaster: r.bazi.dayMaster },
    angel: r.angel.name,
    convergences: convergences(r).slice(0, 4).map((c) => ({ trait: c.trait, techniques: c.techniques })),
  };
}
