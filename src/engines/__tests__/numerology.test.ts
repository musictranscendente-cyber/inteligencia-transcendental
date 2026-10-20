import { describe, expect, it } from '@jest/globals';

import { birthArcana, yearArcana } from '../arcana';
import { calculateNumerology, cleanName, letterValue, personalNumbers, reduce, textNumber } from '../numerology';

describe('numerologia', () => {
  it('converte letras pela tabela pitagórica', () => {
    expect(letterValue('A')).toBe(1);
    expect(letterValue('I')).toBe(9);
    expect(letterValue('J')).toBe(1);
    expect(letterValue('R')).toBe(9);
    expect(letterValue('S')).toBe(1);
    expect(letterValue('Z')).toBe(8);
  });

  it('ignora acentos e cedilha', () => {
    expect(cleanName('João Conceição')).toBe('JOAOCONCEICAO');
  });

  it('preserva os números mestres', () => {
    expect(reduce(29)).toBe(11);
    expect(reduce(22)).toBe(22);
    expect(reduce(33)).toBe(33);
    expect(reduce(38)).toBe(11);
    expect(reduce(29, false)).toBe(2);
  });

  it('calcula os números principais de um exemplo conhecido', () => {
    const n = calculateNumerology('Ana Silva', '1990-01-15');
    expect(n.destiny).toBe(8); // 6 + 1 + 1
    expect(n.expression).toBe(7); // ANA 7 + SILVA 9 = 16 → 7
    expect(n.soul).toBe(3); // A A I A
    expect(n.personality).toBe(4); // N S L V = 13 → 4
    expect(n.mission).toBe(6); // 8 + 7 = 15 → 6
    expect(n.karmicDebts).toEqual([13, 16]);
    expect(n.karmicLessons).toEqual([2, 6, 7, 8]);
  });

  it('detecta número mestre no destino', () => {
    // 29/11/1984: 11 + 11 + 22(1984→22) = 44 → 8 ; 29/02/1980: 11 + 2 + 18→9 = 22
    expect(calculateNumerology('Teste Nome', '1980-02-29').destiny).toBe(22);
  });

  it('monta pináculos, ciclos e desafios', () => {
    const n = calculateNumerology('Ana Silva', '1990-01-15');
    expect(n.pinnacles.map((p) => p.number)).toEqual([7, 7, 5, 2]);
    expect(n.pinnacles[0].toAge).toBe(28);
    expect(n.cycles.map((c) => c.number)).toEqual([1, 6, 1]);
    expect(n.challenges).toEqual([5, 5, 0, 0]);
  });

  it('calcula ano, mês e dia pessoal', () => {
    const p = personalNumbers('1990-01-15', new Date(2026, 9, 20));
    expect(p.year).toBe(8); // dia 6 + mês 1 + ano 2026→1
    expect(p.month).toBe(9); // 8 + outubro (10→1)
    expect(p.day).toBe(2); // 9 + 20→2 = 11 → 2
  });

  it('dá número a textos com dígitos (telefone, casa)', () => {
    expect(textNumber('123')).toBe(6);
    expect(textNumber('Casa 7')).toBe(reduce(3 + 1 + 1 + 1 + 7));
  });
});

describe('arcano', () => {
  it('soma os dígitos da data e reduz acima de 22', () => {
    expect(birthArcana('1990-01-15')).toBe(8); // 26 → 8
    expect(birthArcana('1999-09-29')).toBe(12); // 48 → 12
    expect(birthArcana('1960-01-04')).toBe(21);
  });

  it('22 vira o Louco (0)', () => {
    expect(birthArcana('1960-01-05')).toBe(0); // 5+1+1+9+6 = 22
  });

  it('arcano do ano usa o ano atual', () => {
    expect(yearArcana('1990-01-15', 2026)).toBe(17); // 1+5+1+2+0+2+6 = 17
  });
});
