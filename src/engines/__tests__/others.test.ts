import { describe, expect, it } from '@jest/globals';

import { angelForDate, angelOfBirth, regencyMinutes } from '../angels';
import { calculateChart } from '../astro/chart';
import { calculateBaZi, chineseNewYear, chineseSign, animalRelation } from '../chinese';
import { compatibility } from '../compatibility';
import { dailyEnergy } from '../daily';
import { draw, hexagramLines, readIChing, seeded, TAROT_DECK } from '../divination';
import { analyzeGates, calculateHumanDesign, gateOf } from '../humanDesign';
import { buildReading } from '../reading';
import { convergences } from '../traits';
import { monthCalendar, nineYearStarts } from '../cycles';

describe('Desenho Humano', () => {
  it('mapeia longitudes para portões e linhas', () => {
    expect(gateOf(302)).toEqual({ gate: 41, line: 1 });
    expect(gateOf(358.25)).toEqual({ gate: 25, line: 1 });
    expect(gateOf(0)).toEqual({ gate: 25, line: 2 });
    expect(gateOf(223.25 + 0.01)).toEqual({ gate: 1, line: 1 });
    expect(gateOf(301.99).gate).toBe(60);
  });

  it('classifica tipo e autoridade a partir dos canais', () => {
    expect(analyzeGates([])).toMatchObject({ type: 'reflector', authority: 'lunar', definition: 'none' });
    expect(analyzeGates([20, 34])).toMatchObject({ type: 'manifestingGenerator', authority: 'sacral' });
    expect(analyzeGates([5, 15])).toMatchObject({ type: 'generator', authority: 'sacral' });
    expect(analyzeGates([1, 8])).toMatchObject({ type: 'projector', authority: 'selfProjected' });
    expect(analyzeGates([21, 45])).toMatchObject({ type: 'manifestor', authority: 'egoManifested' });
    expect(analyzeGates([6, 59, 20, 34])).toMatchObject({ type: 'manifestingGenerator', authority: 'emotional' });
    expect(analyzeGates([4, 63, 18, 58]).definition).toBe('split');
  });

  it('reproduz o mapa de referência de Ra Uru Hu (9/4/1948, 00:14, Montreal)', () => {
    const hd = calculateHumanDesign(new Date('1948-04-09T05:14:00Z'));
    expect(hd.personality.sun).toEqual({ gate: 51, line: 5 });
    expect(hd.type).toBe('manifestor');
    expect(hd.authority).toBe('splenic');
    expect(hd.profile).toEqual([5, 1]);
    expect(hd.cross.angle).toBe('left');
    expect(hd.cross.gates).toEqual([51, 57, 61, 62]);
    const days = (Date.parse('1948-04-09T05:14:00Z') - hd.designDate.getTime()) / 86400000;
    expect(days).toBeGreaterThan(85);
    expect(days).toBeLessThan(93);
  });
});

describe('astrologia chinesa e Ba Zi', () => {
  it('calcula o Ano Novo Chinês', () => {
    expect(chineseNewYear(2024)).toBe('2024-02-10');
    expect(chineseNewYear(2023)).toBe('2023-01-22');
    expect(chineseNewYear(2020)).toBe('2020-01-25');
    expect(chineseNewYear(1990)).toBe('1990-01-27');
    expect(chineseNewYear(2025)).toBe('2025-01-29');
  });

  it('respeita o Ano Novo Chinês para o animal', () => {
    expect(chineseSign('1990-01-15')).toMatchObject({ year: 1989, animal: 'snake', element: 'earth', yang: false });
    expect(chineseSign('1990-02-01')).toMatchObject({ year: 1990, animal: 'horse', element: 'metal', yang: true });
  });

  it('calcula os quatro pilares', () => {
    const b = calculateBaZi('1990-01-15', '14:30', new Date('1990-01-15T16:30:00Z'));
    expect(b.year).toEqual({ stem: 5, branch: 5 }); // 己巳
    expect(b.month).toEqual({ stem: 3, branch: 1 }); // 丁丑
    expect(calculateBaZi('2000-01-01', null, new Date('2000-01-01T12:00:00Z')).day).toEqual({ stem: 4, branch: 6 }); // 戊午
    expect(calculateBaZi('1949-10-01', null, new Date('1949-10-01T04:00:00Z')).day).toEqual({ stem: 0, branch: 0 }); // 甲子
    expect(b.hour!.branch).toBe(7); // 13h–15h = Wei
    expect(Object.values(b.elements).reduce((a, c) => a + c, 0)).toBe(8);
  });

  it('relações entre animais', () => {
    expect(animalRelation('rat', 'dragon')).toBe('trine');
    expect(animalRelation('rat', 'ox')).toBe('secretFriend');
    expect(animalRelation('rat', 'horse')).toBe('clash');
  });
});

describe('anjos', () => {
  it('encontra o anjo pelo período', () => {
    expect(angelForDate(3, 21).name).toBe('Vehuiah');
    expect(angelForDate(3, 20).name).toBe('Mumiah');
    expect(angelForDate(1, 15).name).toBe('Harahel');
    expect(angelForDate(12, 31).name).toBe('Poiel');
    expect(angelForDate(2, 29).name).toBe('Habuhiah');
    expect(angelOfBirth('1990-07-25').name).toBe('Nith-Haiah');
    expect(regencyMinutes(angelForDate(3, 21))).toEqual([0, 20]);
  });
});

describe('oráculos', () => {
  it('I Ching: hexagramas e mutação', () => {
    expect(readIChing([7, 7, 7, 7, 7, 7]).hexagram).toBe(1);
    expect(readIChing([8, 8, 8, 8, 8, 8]).hexagram).toBe(2);
    const r = readIChing([9, 7, 7, 7, 7, 7]);
    expect(r.changing).toEqual([1]);
    expect(r.transformed).toBe(44);
    expect(hexagramLines(63)).toEqual([true, false, true, false, true, false]);
    for (let n = 1; n <= 64; n++) expect(readIChing(hexagramLines(n).map((y) => (y ? 7 : 8))).hexagram).toBe(n);
  });

  it('sorteio sem repetição e reprodutível com semente', () => {
    const a = draw(TAROT_DECK, 10, { rng: seeded(42), reversals: true });
    const b = draw(TAROT_DECK, 10, { rng: seeded(42), reversals: true });
    expect(a).toEqual(b);
    expect(new Set(a.map((c) => c.id)).size).toBe(10);
    expect(TAROT_DECK).toHaveLength(78);
  });
});

describe('leitura completa, dia e compatibilidade', () => {
  const person = { fullName: 'Ana Silva', birthDate: '1990-01-15', birthTime: '14:30', birthUtc: '1990-01-15T16:30:00Z', place: { lat: -22.9, lon: -47.06 } };
  const other = { fullName: 'Bruno Costa', birthDate: '1988-07-03', birthTime: '08:10', birthUtc: '1988-07-03T11:10:00Z', place: { lat: -23.55, lon: -46.63 } };

  it('monta todas as técnicas', () => {
    const r = buildReading(person, 'placidus', new Date(2026, 9, 20));
    expect(r.arcana).toBe(8);
    expect(r.humanDesign).not.toBeNull();
    expect(r.chinese.animal).toBe('snake');
    expect(convergences(r)[0].techniques.length).toBeGreaterThanOrEqual(1);
    const noTime = buildReading({ ...person, birthTime: null });
    expect(noTime.humanDesign).toBeNull();
  });

  it('energia do dia fica entre 1 e 5', () => {
    const chart = calculateChart(new Date(person.birthUtc), -22.9, -47.06);
    const e = dailyEnergy(person.birthDate, chart, new Date(2026, 9, 20));
    for (const v of Object.values(e.scores)) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(5);
    }
    expect(e.personalDay).toBe(2);
  });

  it('calendário do mês e ciclos de 9 anos', () => {
    const chart = calculateChart(new Date(person.birthUtc), -22.9, -47.06);
    const cal = monthCalendar(person.birthDate, chart, 2026, 9);
    expect(cal).toHaveLength(31);
    const starts = nineYearStarts(person.birthDate);
    expect(starts[1] - starts[0]).toBe(9);
  });

  it('compatibilidade entre 0 e 100 com radar', () => {
    const a = buildReading(person);
    const b = buildReading(other);
    const c = compatibility(
      { chart: a.chart, destiny: a.numerology.destiny, expression: a.numerology.expression, soul: a.numerology.soul, animal: a.chinese.animal, hdGates: a.humanDesign!.gates },
      { chart: b.chart, destiny: b.numerology.destiny, expression: b.numerology.expression, soul: b.numerology.soul, animal: b.chinese.animal, hdGates: b.humanDesign!.gates }
    );
    expect(c.overall).toBeGreaterThan(0);
    expect(c.overall).toBeLessThanOrEqual(100);
    expect(Object.keys(c.radar)).toHaveLength(5);
    expect(c.synastry.length).toBeGreaterThan(0);
  });
});
