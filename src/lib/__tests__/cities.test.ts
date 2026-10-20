import { describe, expect, it } from '@jest/globals';

import { countryName, normalize, placeSubtitle, searchCities } from '../cities';

describe('busca de cidades', () => {
  it('ignora acentos e maiúsculas', () => {
    expect(normalize('São Paulo')).toBe('sao paulo');
    const [first] = searchCities('sao paulo', 0);
    expect(first.name).toBe('São Paulo');
    expect(first.countryCode).toBe('BR');
    expect(first.timezone).toBe('America/Sao_Paulo');
  });

  it('mostra primeiro as cidades maiores', () => {
    const results = searchCities('Rio', 0);
    expect(results[0].name).toBe('Rio de Janeiro');
  });

  it('filtra por sigla de estado brasileiro', () => {
    const results = searchCities('Campinas, SP', 0);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.state === 'São Paulo')).toBe(true);
  });

  it('filtra por país no idioma escolhido', () => {
    const results = searchCities('Valencia, Venezuela', 2);
    expect(results[0].countryCode).toBe('VE');
  });

  it('encontra cidades pelo nome em português (apelidos)', () => {
    expect(searchCities('Lisboa', 0)[0].name).toBe('Lisbon');
    expect(searchCities('Nova York', 0)[0].countryCode).toBe('US');
  });

  it('inclui cidades pequenas do Brasil', () => {
    expect(searchCities('Juazeiro do Norte', 0)[0].state).toBe('Ceará');
  });

  it('exige pelo menos 2 letras', () => {
    expect(searchCities('a', 0)).toEqual([]);
  });

  it('traduz o nome do país', () => {
    expect(countryName('US', 0)).toBe('Estados Unidos');
    expect(countryName('DE', 1)).toBe('Germany');
    const [sp] = searchCities('São Paulo', 1);
    expect(placeSubtitle(sp, 1)).toBe('São Paulo, Brazil');
  });
});
