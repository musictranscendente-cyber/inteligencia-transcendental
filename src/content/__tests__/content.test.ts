import { describe, expect, it } from '@jest/globals';

import { SIGNS } from '@/engines/astro/chart';
import { ANIMALS } from '@/engines/chinese';
import { RUNES, TAROT_DECK } from '@/engines/divination';
import { CENTERS } from '@/engines/humanDesign';
import { buildReading } from '@/engines/reading';
import { ANGEL_ATTRIBUTES } from '../angels';
import { SIGNS_TEXT } from '../astrology';
import { ANIMALS_TEXT } from '../chinese';
import { DAY_LINES } from '../daily';
import { HD_CENTERS, HD_GATES } from '../humanDesign';
import { NUMBERS, PERSONAL_YEAR } from '../numbers';
import { ICHING, LENORMAND, RUNES_TEXT } from '../oracles';
import { localSynthesis, SYNTHESIS_SECTIONS } from '../synthesis';
import { cardInfo } from '../tarot';
import type { Lang } from '../types';

const LANGS: Lang[] = ['pt', 'en', 'es'];

describe('banco de textos', () => {
  it('cobre todos os resultados nos 3 idiomas', () => {
    for (const lang of LANGS) {
      for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]) expect(NUMBERS[n][lang].text.length).toBeGreaterThan(20);
      for (let n = 1; n <= 9; n++) {
        expect(PERSONAL_YEAR[n][lang].title).toBeTruthy();
        expect(DAY_LINES[n][lang]).toHaveLength(3);
      }
      for (const id of TAROT_DECK) {
        const c = cardInfo(id, lang);
        expect(c.name).toBeTruthy();
        expect(c.upright).toBeTruthy();
        expect(c.reversed).toBeTruthy();
      }
      for (const s of SIGNS) expect(SIGNS_TEXT[s][lang].moon).toBeTruthy();
      for (const a of ANIMALS) expect(ANIMALS_TEXT[a][lang].text).toBeTruthy();
      for (const c of CENTERS) expect(HD_CENTERS[c][lang].open).toBeTruthy();
      expect(HD_GATES[lang]).toHaveLength(65);
      expect(ANGEL_ATTRIBUTES.every((a) => a[lang])).toBe(true);
      expect(LENORMAND.every((c) => c.name[lang] && c.meaning[lang])).toBe(true);
      expect(ICHING.every((h) => h.name[lang] && h.judgement[lang])).toBe(true);
      for (const r of RUNES) expect(RUNES_TEXT[r].upright[lang]).toBeTruthy();
    }
    expect(ANGEL_ATTRIBUTES).toHaveLength(72);
    expect(LENORMAND).toHaveLength(36);
    expect(ICHING).toHaveLength(64);
  });

  it('a Síntese local não tem lacunas', () => {
    const r = buildReading({ fullName: 'Ana Silva', birthDate: '1990-01-15', birthTime: '14:30', birthUtc: '1990-01-15T16:30:00Z', place: { lat: -22.9, lon: -47.06 } });
    for (const lang of LANGS) {
      const s = localSynthesis(r, lang, 'Ana');
      for (const k of SYNTHESIS_SECTIONS) {
        expect(s.sections[k]).not.toMatch(/undefined|NaN|\[object/);
        expect(s.sections[k].length).toBeGreaterThan(60);
      }
    }
    const noTime = buildReading({ fullName: 'Ana Silva', birthDate: '1990-01-15', birthTime: null, birthUtc: '1990-01-15T15:00:00Z', place: { lat: -22.9, lon: -47.06 } });
    expect(localSynthesis(noTime, 'pt', 'Ana').sections.work).not.toMatch(/undefined/);
  });
});
