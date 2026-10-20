import { DateTime } from 'luxon';

export type BirthPlace = {
  name: string;
  state: string;
  countryCode: string;
  lat: number;
  lon: number;
  timezone: string;
};

export type BirthMoment = {
  /** Data local de nascimento, `YYYY-MM-DD`. */
  date: string;
  /** Hora local `HH:mm`, ou `null` quando a pessoa não sabe. */
  time: string | null;
  timezone: string;
};

export type ResolvedBirth = {
  /** Instante do nascimento em UTC (ISO 8601). */
  utc: string;
  /** Diferença para UTC naquele dia e hora, em minutos (já inclui horário de verão). */
  offsetMinutes: number;
  /** A hora era desconhecida e foi assumido meio-dia. */
  timeAssumed: boolean;
  /** A hora informada caiu num "buraco" de horário de verão e foi ajustada. */
  shiftedByDst: boolean;
  /** Hora local efetivamente usada, `HH:mm`. */
  localTime: string;
};

/** Hora usada quando a pessoa não sabe a hora de nascimento (padrão astrológico). */
export const UNKNOWN_TIME_FALLBACK = '12:00';

/**
 * Converte data/hora local de nascimento para UTC usando o banco de fusos IANA,
 * que inclui o horário de verão histórico de cada lugar.
 */
export function resolveBirth({ date, time, timezone }: BirthMoment): ResolvedBirth {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = (time ?? UNKNOWN_TIME_FALLBACK).split(':').map(Number);
  const local = DateTime.fromObject({ year, month, day, hour, minute }, { zone: timezone });
  if (!local.isValid) {
    throw new Error(`Data/hora inválida: ${date} ${time} (${timezone}): ${local.invalidExplanation}`);
  }
  return {
    utc: local.toUTC().toISO({ suppressMilliseconds: true })!,
    offsetMinutes: local.offset,
    timeAssumed: time == null,
    shiftedByDst: local.hour !== hour || local.minute !== minute,
    localTime: local.toFormat('HH:mm'),
  };
}

export function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function formatOffset(minutes: number) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const h = String(Math.floor(abs / 60)).padStart(2, '0');
  const m = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${h}:${m}`;
}
