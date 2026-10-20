import { describe, expect, it } from '@jest/globals';

import { bestCities, cartographyLines } from '../astro/cartography';
import { timeline } from '../astro/transits';
import { calculateChart } from '../astro/chart';

describe('astrocartografia', () => {
  const birth = new Date('1990-01-15T16:30:00Z');

  it('gera linhas MC/IC verticais e ASC/DSC curvas para 5 planetas', () => {
    const lines = cartographyLines(birth);
    expect(lines).toHaveLength(20);
    const sunMc = lines.find((l) => l.planet === 'sun' && l.kind === 'mc')!;
    expect(sunMc.points[0][0]).toBe(sunMc.points[1][0]);
    // Sol no MC ⇔ meio-dia solar: às 16:30 UTC isso acontece perto de 60° oeste (±5° pela equação do tempo)
    expect(Math.abs(sunMc.points[0][0] - -64)).toBeLessThan(6);
    expect(lines.find((l) => l.planet === 'venus' && l.kind === 'asc')!.points.length).toBeGreaterThan(10);
  });

  it('lista cidades próximas das linhas', () => {
    const cities = [
      { name: 'Caracas', countryCode: 'VE', lat: 10.5, lon: -66.9 },
      { name: 'Tokyo', countryCode: 'JP', lat: 35.7, lon: 139.7 },
    ];
    const career = bestCities(birth, cities, 'career');
    expect(career[0].city.name).toBe('Caracas');
  });
});

describe('linha do tempo', () => {
  it('encontra retrogradações e eclipses em 12 meses', () => {
    const chart = calculateChart(new Date('1990-01-15T16:30:00Z'), -22.9, -47.06);
    const events = timeline(chart, new Date('2026-01-01T00:00:00Z'), 365);
    expect(events.filter((e) => e.kind === 'retrograde' && e.planet === 'mercury').length).toBeGreaterThanOrEqual(3);
    expect(events.filter((e) => e.kind === 'eclipse').length).toBeGreaterThanOrEqual(3);
  });
});
