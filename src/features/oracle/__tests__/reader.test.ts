import { describe, expect, it } from '@jest/globals';

import { draw } from '@/engines/divination';
import { analyzeQuestion, readIChingText, readSpread } from '@/features/oracle/reader';
import { deckOf, SPREADS, type SpreadKey } from '@/features/oracle/spreads';

describe('analyzeQuestion', () => {
  it('reconhece assunto e tipo de pergunta', () => {
    expect(analyzeQuestion('Vou conseguir o emprego novo?', 'pt')).toMatchObject({ topic: 'work', kind: 'yesno' });
    expect(analyzeQuestion('Ele ainda gosta de mim?', 'pt')).toMatchObject({ topic: 'love', kind: 'yesno' });
    expect(analyzeQuestion('Quando vou sair das dívidas?', 'pt')).toMatchObject({ topic: 'money', kind: 'when' });
    expect(analyzeQuestion('Como resolver a briga com minha mãe?', 'pt')).toMatchObject({ topic: 'family', kind: 'how' });
    expect(analyzeQuestion('Devo me mudar para Portugal ou ficar aqui?', 'pt')).toMatchObject({ kind: 'choice' });
    expect(analyzeQuestion('Devo aceitar o emprego?', 'pt').kind).toBe('yesno');
    expect(analyzeQuestion('', 'pt').kind).toBe('none');
  });
});

describe('readSpread', () => {
  const spreads = Object.keys(SPREADS) as SpreadKey[];
  it.each(['pt', 'en', 'es'] as const)('gera leitura completa em %s para todas as tiragens', (lang) => {
    for (const spread of spreads) {
      const cfg = SPREADS[spread];
      const cards = draw(deckOf(cfg.deck), cfg.count, { reversals: cfg.deck !== 'lenormand' });
      for (const question of ['', 'Vou conseguir o emprego?']) {
        const text = readSpread({ deck: cfg.deck, spread, cards, question, lang, firstName: 'Ana', personalYear: 3 }).join('\n');
        expect(text).not.toMatch(/\{[a-zA-Z]\}|undefined|null/);
        if (question) expect(text).toContain(question);
      }
    }
  });

  it('funciona sem nome', () => {
    const [first] = readSpread({ deck: 'tarot', spread: 'three', cards: draw(deckOf('tarot'), 3), question: 'Vai dar certo?', lang: 'pt', firstName: '' });
    expect(first.startsWith('Você me perguntou')).toBe(true);
  });
});

describe('readIChingText', () => {
  it('fala do hexagrama e da transformação', () => {
    const text = readIChingText({ hexagram: 5, transformed: 11, changing: [2], question: 'Devo esperar?', lang: 'pt', firstName: 'Ana' }).join('\n');
    expect(text).toContain('A Espera');
    expect(text).toContain('A Paz');
  });
});
