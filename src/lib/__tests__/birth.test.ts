import { describe, expect, it } from '@jest/globals';

import { daysInMonth, formatOffset, resolveBirth } from '../birth';

describe('resolveBirth', () => {
  it('aplica o horário de verão histórico do Brasil (São Paulo, dez/1990 = UTC-2)', () => {
    const r = resolveBirth({ date: '1990-12-25', time: '12:00', timezone: 'America/Sao_Paulo' });
    expect(r.utc).toBe('1990-12-25T14:00:00Z');
    expect(r.offsetMinutes).toBe(-120);
  });

  it('não aplica horário de verão no Brasil depois de 2019 (jan/2020 = UTC-3)', () => {
    const r = resolveBirth({ date: '2020-01-15', time: '08:30', timezone: 'America/Sao_Paulo' });
    expect(r.utc).toBe('2020-01-15T11:30:00Z');
    expect(r.offsetMinutes).toBe(-180);
  });

  it('usa o fuso de cada lugar (Lisboa no verão = UTC+1)', () => {
    const r = resolveBirth({ date: '1985-07-10', time: '23:45', timezone: 'Europe/Lisbon' });
    expect(r.utc).toBe('1985-07-10T22:45:00Z');
  });

  it('atravessa a data quando o UTC cai no dia seguinte', () => {
    const r = resolveBirth({ date: '1978-03-01', time: '22:10', timezone: 'America/Mexico_City' });
    expect(r.utc).toBe('1978-03-02T04:10:00Z');
  });

  it('ajusta horas que não existiram por causa do horário de verão', () => {
    const r = resolveBirth({ date: '2021-03-14', time: '02:30', timezone: 'America/New_York' });
    expect(r.shiftedByDst).toBe(true);
    expect(r.localTime).toBe('03:30');
    expect(r.utc).toBe('2021-03-14T07:30:00Z');
  });

  it('assume meio-dia quando a hora é desconhecida', () => {
    const r = resolveBirth({ date: '2000-06-01', time: null, timezone: 'Asia/Tokyo' });
    expect(r.timeAssumed).toBe(true);
    expect(r.utc).toBe('2000-06-01T03:00:00Z');
  });
});

describe('utilitários de data', () => {
  it('conta os dias do mês, inclusive em anos bissextos', () => {
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2024, 4)).toBe(30);
    expect(daysInMonth(2024, 12)).toBe(31);
  });

  it('formata a diferença para UTC', () => {
    expect(formatOffset(-180)).toBe('UTC-03:00');
    expect(formatOffset(330)).toBe('UTC+05:30');
    expect(formatOffset(0)).toBe('UTC+00:00');
  });
});
