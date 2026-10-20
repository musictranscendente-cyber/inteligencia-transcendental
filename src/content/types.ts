/** Tipos e utilitários do banco de textos (PT, EN, ES), que funciona offline. */
import { useTranslation } from 'react-i18next';

export type Lang = 'pt' | 'en' | 'es';
export type L<T = string> = Record<Lang, T>;

/** Texto em três camadas: frase-resumo → parágrafo → aprofundamento. */
export type Entry = {
  title: string;
  summary: string;
  text: string;
  deep?: string;
  keywords?: string[];
};

export function langOf(code: string): Lang {
  if (code.startsWith('pt')) return 'pt';
  if (code.startsWith('es')) return 'es';
  return 'en';
}

export function pick<T>(value: L<T>, lang: Lang): T {
  return value[lang] ?? value.en;
}

/** Idioma atual do conteúdo (pt / en / es). */
export function useLang(): Lang {
  const { i18n } = useTranslation();
  return langOf(i18n.language);
}

/** Substitui {chave} por valores. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''));
}
