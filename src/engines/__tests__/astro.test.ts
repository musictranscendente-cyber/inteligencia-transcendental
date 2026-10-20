import { describe, expect, it } from '@jest/globals';

import { calculateChart, moonInfo, signOf, solarReturn } from '../astro/chart';
import { angleDiff, longitude, speed, trueNode } from '../astro/ephemeris';
import { angles, houseOf, houses } from '../astro/houses';

describe('efemérides', () => {
  it('Sol a 0° de Áries no equinócio de março de 2024', () => {
    const lon = longitude('sun', new Date('2024-03-20T03:06:00Z'));
    expect(Math.abs(angleDiff(lon, 0))).toBeLessThan(0.02);
  });

  it('grande conjunção Júpiter–Saturno em 21/12/2020 perto de 0°20\' de Aquário', () => {
    const d = new Date('2020-12-21T18:00:00Z');
    const j = longitude('jupiter', d);
    const s = longitude('saturn', d);
    expect(Math.abs(angleDiff(j, s))).toBeLessThan(0.15);
    expect(Math.abs(angleDiff(j, 300.3))).toBeLessThan(0.2);
  });

  it('Mercúrio retrógrado em abril de 2024', () => {
    expect(speed('mercury', new Date('2024-04-10T00:00:00Z'))).toBeLessThan(0);
    expect(speed('mercury', new Date('2024-05-20T00:00:00Z'))).toBeGreaterThan(0);
  });

  it('nodo norte verdadeiro oscila até ~1,7° em torno do nodo médio (20,9° Áries em 1/1/2024)', () => {
    const n = trueNode(new Date('2024-01-01T00:00:00Z'));
    expect(signOf(n)).toBe('aries');
    expect(Math.abs(angleDiff(n, 20.86))).toBeLessThan(1.8);
    // No J2000 o nodo médio está em 125,04° (Leão)
    expect(Math.abs(angleDiff(trueNode(new Date('2000-01-01T12:00:00Z')), 125.04))).toBeLessThan(1.8);
  });

  it('Lua cheia em 25/03/2024 (fase ≈ 180°)', () => {
    const m = moonInfo(new Date('2024-03-25T07:00:00Z'));
    expect(Math.abs(m.phase - 180)).toBeLessThan(2);
    expect(m.illumination).toBeGreaterThan(0.99);
    expect(m.phaseIndex).toBe(4);
  });
});

describe('ângulos e casas', () => {
  it('no equador, com MC a 0° de Áries, o ascendente fica a 0° de Câncer', () => {
    // Procura um instante com RAMC ≈ 0 em Greenwich
    const base = new Date('2024-03-20T12:00:00Z');
    let best = base;
    let bestRamc = 999;
    for (let m = 0; m < 24 * 60; m += 1) {
      const d = new Date(base.getTime() + m * 60000);
      const r = angles(d, 0, 0).ramc;
      const dist = Math.min(r, 360 - r);
      if (dist < bestRamc) [bestRamc, best] = [dist, d];
    }
    const a = angles(best, 0, 0);
    expect(Math.abs(angleDiff(a.mc, 0))).toBeLessThan(0.3);
    expect(Math.abs(angleDiff(a.asc, 90))).toBeLessThan(0.3);
  });

  it('casas Placidus: cúspides em ordem e opostas', () => {
    const a = angles(new Date('1990-01-15T17:30:00Z'), -22.9, -47.06);
    const h = houses(a, -22.9, 'placidus');
    expect(h.system).toBe('placidus');
    expect(h.cusps[0]).toBeCloseTo(a.asc, 6);
    expect(h.cusps[9]).toBeCloseTo(a.mc, 6);
    for (let i = 0; i < 6; i++) expect(Math.abs(angleDiff(h.cusps[i + 6], h.cusps[i] + 180))).toBeLessThan(1e-6);
    // Cada casa avança no sentido do zodíaco
    for (let i = 0; i < 12; i++) {
      const span = (h.cusps[(i + 1) % 12] - h.cusps[i] + 360) % 360;
      expect(span).toBeGreaterThan(5);
      expect(span).toBeLessThan(60);
    }
  });

  it('no equador, Placidus divide a ascensão reta em partes iguais', () => {
    const a = angles(new Date('2000-06-01T00:00:00Z'), 0, 0);
    const h = houses(a, 0, 'placidus');
    const e = (a.obliquity * Math.PI) / 180;
    const ra = (lon: number) => ((Math.atan2(Math.sin((lon * Math.PI) / 180) * Math.cos(e), Math.cos((lon * Math.PI) / 180)) * 180) / Math.PI + 360) % 360;
    expect(Math.abs(angleDiff(ra(h.cusps[10]), a.ramc + 30))).toBeLessThan(1e-4);
    expect(Math.abs(angleDiff(ra(h.cusps[11]), a.ramc + 60))).toBeLessThan(1e-4);
  });

  it('signos inteiros começam no signo do ascendente', () => {
    const a = angles(new Date('1990-01-15T17:30:00Z'), -22.9, -47.06);
    const h = houses(a, -22.9, 'whole');
    expect(h.cusps[0] % 30).toBe(0);
    expect(houseOf(a.asc, h.cusps)).toBe(1);
  });

  it('usa Porfírio perto dos polos', () => {
    const a = angles(new Date('2000-06-01T00:00:00Z'), 70, 20);
    expect(houses(a, 70, 'placidus').system).toBe('porphyry');
  });
});

describe('mapa natal', () => {
  it('monta o mapa com casas, aspectos e elementos', () => {
    const c = calculateChart(new Date('1990-01-15T17:30:00Z'), -22.9, -47.06);
    expect(c.points.find((p) => p.key === 'sun')!.sign).toBe('capricorn');
    expect(c.points.find((p) => p.key === 'asc')).toBeDefined();
    expect(c.aspects.length).toBeGreaterThan(3);
    // Em jan/1990, Sol, Saturno, Urano e Netuno estavam em Capricórnio
    expect(c.points.filter((p) => p.sign === 'capricorn').length).toBeGreaterThanOrEqual(4);
    expect(c.elements.earth).toBeGreaterThan(c.elements.air);
  });

  it('sem hora: sem ascendente nem casas', () => {
    const c = calculateChart(new Date('1990-01-15T15:00:00Z'), -22.9, -47.06, false);
    expect(c.cusps).toBeNull();
    expect(c.points.find((p) => p.key === 'asc')).toBeUndefined();
  });

  it('revolução solar acontece perto do aniversário', () => {
    const sun = longitude('sun', new Date('1990-01-15T17:30:00Z'));
    const r = solarReturn(sun, '1990-01-15', 2026)!;
    expect(r.getUTCFullYear()).toBe(2026);
    expect(Math.abs(r.getTime() - Date.UTC(2026, 0, 15))).toBeLessThan(2 * 86400000);
    expect(Math.abs(angleDiff(longitude('sun', r), sun))).toBeLessThan(0.001);
  });
});
