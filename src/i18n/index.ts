import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getSettings, type Language } from '@/storage/settings';
import en from './locales/en.json';
import es from './locales/es.json';
import ptBR from './locales/pt-BR.json';

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'pt-BR', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

/** Idioma do celular, reduzido aos três que o app suporta. */
export function deviceLanguage(): Language {
  for (const locale of getLocales()) {
    if (locale.languageCode === 'pt') return 'pt-BR';
    if (locale.languageCode === 'es') return 'es';
    if (locale.languageCode === 'en') return 'en';
  }
  return 'en';
}

/** Índice usado pelas tabelas compactas (países): 0 = pt, 1 = en, 2 = es. */
export function languageIndex(lang: string): 0 | 1 | 2 {
  if (lang.startsWith('pt')) return 0;
  if (lang.startsWith('es')) return 2;
  return 1;
}

// eslint-disable-next-line import/no-named-as-default-member -- padrão da documentação do i18next
i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    en: { translation: en },
    es: { translation: es },
  },
  lng: getSettings().language ?? deviceLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
