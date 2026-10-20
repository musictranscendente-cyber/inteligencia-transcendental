import { DateTime } from 'luxon';

/** Data no idioma do app: "15 de jan. de 2026" / "Jan 15, 2026". */
export function formatDate(d: Date, language: string, withTime = false) {
  const dt = DateTime.fromJSDate(d).setLocale(language);
  return withTime ? dt.toLocaleString(DateTime.DATETIME_MED) : dt.toLocaleString(DateTime.DATE_MED);
}

export function formatMonth(d: Date, language: string) {
  return DateTime.fromJSDate(d).setLocale(language).toFormat('LLLL yyyy');
}
