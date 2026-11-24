/**
 * Tipos e utilitários do banco de textos, que funciona offline.
 * Os textos são escritos em PT, EN e ES nos arquivos de conteúdo; FR, DE e IT vêm dos dicionários em
 * `./locales/*.json` e são encaixados por `localized()` (sem tradução, o texto cai para o inglês).
 */
import { useTranslation } from 'react-i18next';

import de from './locales/de.json';
import fr from './locales/fr.json';
import it from './locales/it.json';

export type BaseLang = 'pt' | 'en' | 'es';
export type ExtraLang = 'fr' | 'de' | 'it';
export type Lang = BaseLang | ExtraLang;
export const EXTRA_LANGS: ExtraLang[] = ['fr', 'de', 'it'];
export type L<T = string> = Record<Lang, T>;

/** Como o conteúdo é escrito nos arquivos: só PT, EN e ES em cada ponto traduzível. */
export type Authored<T> = T extends string | number | boolean | null | undefined | ((...args: never[]) => unknown)
  ? T
  : T extends readonly (infer E)[]
    ? Authored<E>[]
    : string extends keyof T
      ? { [k: string]: Authored<T[keyof T]> }
      : number extends keyof T
        ? { [k: number]: Authored<T[keyof T]> }
        : T extends Record<Lang, infer U>
          ? Record<BaseLang, Authored<U>>
          : { [K in keyof T]: Authored<T[K]> };

const DICTS: Record<ExtraLang, Record<string, unknown>> = { fr, de, it };

const isL = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v) && 'pt' in v && 'en' in v && 'es' in v;

/** Percorre o conteúdo e chama `visit` em cada ponto traduzível, com um caminho estável (`id.chave.índice`). */
export function walkL(node: unknown, path: string, visit: (l: Record<string, unknown>, path: string) => void) {
  if (Array.isArray(node)) node.forEach((x, i) => walkL(x, `${path}.${i}`, visit));
  else if (isL(node)) visit(node, path);
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walkL(v, `${path}.${k}`, visit);
}

/** Encaixa FR, DE e IT no conteúdo escrito em PT/EN/ES. */
export function localized<T>(id: string, value: Authored<T>): T {
  walkL(value, id, (l, path) => {
    for (const lang of EXTRA_LANGS) l[lang] ??= DICTS[lang][path] ?? l.en;
  });
  return value as T;
}

/** Texto em três camadas: frase-resumo → parágrafo → aprofundamento. */
export type Entry = {
  title: string;
  summary: string;
  text: string;
  deep?: string;
  keywords?: string[];
};

export function langOf(code: string): Lang {
  for (const l of ['pt', 'es', 'fr', 'de', 'it'] as const) if (code.startsWith(l)) return l;
  return 'en';
}

export function pick<T>(value: L<T>, lang: Lang): T {
  return value[lang] ?? value.en;
}

/** Idioma atual do conteúdo (pt, en, es, fr, de ou it). */
export function useLang(): Lang {
  const { i18n } = useTranslation();
  return langOf(i18n.language);
}

/** Substitui {chave} por valores. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''));
}
