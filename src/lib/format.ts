import { DateTime } from 'luxon';

/** Data no idioma do app: "15 de jan. de 2026" / "Jan 15, 2026". */
export function formatDate(d: Date, language: string, withTime = false) {
  const dt = DateTime.fromJSDate(d).setLocale(language);
  return withTime ? dt.toLocaleString(DateTime.DATETIME_MED) : dt.toLocaleString(DateTime.DATE_MED);
}

export function formatMonth(d: Date, language: string) {
  return DateTime.fromJSDate(d).setLocale(language).toFormat('LLLL yyyy');
}

/** Dia da semana e data por extenso: "sábado, 15 de novembro". */
export function formatWeekday(d: Date, language: string) {
  const s = DateTime.fromJSDate(d).setLocale(language).toLocaleString({ weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Minutos desde a meia-noite em "HH:mm". */
export function formatMinutes(total: number) {
  const m = total % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
