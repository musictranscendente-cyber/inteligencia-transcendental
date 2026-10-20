import type { TFunction } from 'i18next';

/** Data por extenso no idioma atual: "15 de janeiro de 1990" / "January 15, 1990". */
export function formatLongDate(t: TFunction, language: string, year: number, month: number, day: number) {
  const months = t('months', { returnObjects: true }) as string[];
  const name = language.startsWith('en') ? months[month - 1] : months[month - 1].toLocaleLowerCase(language);
  return t('common.dateLong', { day, month: name, year });
}
