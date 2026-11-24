import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getSettings, type Language } from '@/storage/settings';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import ptBR from './locales/pt-BR.json';

/** Idiomas do app: nome no próprio idioma e, embaixo, em inglês. */
export const LANGUAGES: { code: Language; label: string; english: string }[] = [
  { code: 'pt-BR', label: 'Português', english: 'Portuguese' },
  { code: 'en', label: 'English', english: 'English' },
  { code: 'es', label: 'Español', english: 'Spanish' },
  { code: 'fr', label: 'Français', english: 'French' },
  { code: 'de', label: 'Deutsch', english: 'German' },
  { code: 'it', label: 'Italiano', english: 'Italian' },
];

/** Idioma do celular, reduzido aos que o app suporta (inglês quando não houver). */
export function deviceLanguage(): Language {
  for (const locale of getLocales()) {
    if (locale.languageCode === 'pt') return 'pt-BR';
    const found = LANGUAGES.find((l) => l.code === locale.languageCode);
    if (found) return found.code;
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
    fr: { translation: fr },
    de: { translation: de },
    it: { translation: it },
  },
  lng: getSettings().language ?? deviceLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
